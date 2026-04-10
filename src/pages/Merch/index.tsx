import { useEffect, useMemo, useRef, useState } from "react";
import MerchFaq from "../../components/sections/merch/MerchFaq";
import MerchFooter from "../../components/sections/merch/MerchFooter";
import MerchHero from "../../components/sections/merch/MerchHero";
import MerchLoader from "../../components/sections/merch/MerchLoader/MerchLoader";
import MerchNav, { type MerchCategory } from "../../components/sections/merch/MerchNav";
import MerchUnderConstruction from "../../components/sections/merch/MerchUnderConstruction";
import ProductDetail from "../../components/sections/merch/ProductDetail";
import PurposeSection from "../../components/sections/merch/PurposeSection";
import StyleCarousel from "../../components/sections/merch/StyleCarousel";
import styles from "./Merch.module.css";
import { useMerchScroll } from "./useMerchScroll";

const LOADER_DURATION = 4000;
const LOADER_EXIT_DURATION = 600;
const MERCH_FIRST_OPENED_KEY = "fdh:merch:first-opened";

type LoaderSetup = {
  shouldShowLoader: boolean;
  minVisibleDurationMs: number;
};

function getLoaderSetup(): LoaderSetup {
  if (typeof window === "undefined") {
    return {
      shouldShowLoader: true,
      minVisibleDurationMs: LOADER_DURATION,
    };
  }

  const pageStillLoading = document.readyState !== "complete";
  let isFirstOpen = true;

  try {
    isFirstOpen = window.sessionStorage.getItem(MERCH_FIRST_OPENED_KEY) !== "1";
    if (isFirstOpen) {
      window.sessionStorage.setItem(MERCH_FIRST_OPENED_KEY, "1");
    }
  } catch {
    // Fallback seguro: se o storage falhar, mantem comportamento da primeira abertura.
    isFirstOpen = true;
  }

  return {
    shouldShowLoader: isFirstOpen || pageStillLoading,
    minVisibleDurationMs: isFirstOpen ? LOADER_DURATION : 0,
  };
}

export default function MerchPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const styleRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const purposeRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  const [loaderSetup] = useState<LoaderSetup>(() => getLoaderSetup());
  const [isLoading, setIsLoading] = useState(loaderSetup.shouldShowLoader);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MerchCategory>("camisetas");
  const isMainMerchCatalog = activeCategory === "camisetas";
  const sectionRefs = useMemo(
    () => [heroRef, styleRef, detailRef, purposeRef, faqRef],
    [],
  );
  const wrapperRef = useMerchScroll(sectionRefs);

  useEffect(() => {
    if (!loaderSetup.shouldShowLoader) {
      return;
    }

    setIsLoading(true);
    setIsLoaderExiting(false);

    const startedAt = Date.now();
    let startExitTimer: number | null = null;
    let unmountTimer: number | null = null;

    const finishLoader = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(loaderSetup.minVisibleDurationMs - elapsed, 0);

      startExitTimer = window.setTimeout(() => {
        setIsLoaderExiting(true);
        unmountTimer = window.setTimeout(() => {
          setIsLoading(false);
        }, LOADER_EXIT_DURATION);
      }, remaining);
    };

    let hasFinished = false;
    const onWindowLoad = () => {
      if (hasFinished) return;
      hasFinished = true;
      finishLoader();
    };

    if (document.readyState === "complete") {
      onWindowLoad();
    } else {
      window.addEventListener("load", onWindowLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onWindowLoad);
      if (startExitTimer !== null) {
        window.clearTimeout(startExitTimer);
      }
      if (unmountTimer !== null) {
        window.clearTimeout(unmountTimer);
      }
    };
  }, [loaderSetup]);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.merchRoot} ${isMainMerchCatalog ? styles.snapRoot : ""}`}
    >
      {isLoading ? (
        <MerchLoader
          durationMs={Math.max(loaderSetup.minVisibleDurationMs, LOADER_DURATION)}
          isExiting={isLoaderExiting}
        />
      ) : null}
      <MerchNav activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
      {isMainMerchCatalog ? (
        <>
          <main className={styles.main}>
            <div ref={heroRef}>
              <MerchHero />
            </div>
            <div ref={styleRef}>
              <StyleCarousel />
            </div>
            <div ref={detailRef}>
              <ProductDetail />
            </div>
            <div ref={purposeRef}>
              <PurposeSection />
            </div>
            <div ref={faqRef}>
              <MerchFaq />
            </div>
          </main>
          <MerchFooter />
        </>
      ) : (
        <main>
          <MerchUnderConstruction category={activeCategory} />
        </main>
      )}
    </div>
  );
}
