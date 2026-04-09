import { useEffect, useMemo, useRef, useState } from "react";
import MerchFaq from "../../components/sections/merch/MerchFaq";
import MerchFooter from "../../components/sections/merch/MerchFooter";
import MerchHero from "../../components/sections/merch/MerchHero";
import MerchLoader from "../../components/sections/merch/MerchLoader/MerchLoader";
import MerchNav from "../../components/sections/merch/MerchNav";
import ProductDetail from "../../components/sections/merch/ProductDetail";
import PurposeSection from "../../components/sections/merch/PurposeSection";
import StyleCarousel from "../../components/sections/merch/StyleCarousel";
import styles from "./Merch.module.css";
import { useMerchScroll } from "./useMerchScroll";

const LOADER_DURATION = 4000;
const LOADER_EXIT_DURATION = 600;

export default function MerchPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const styleRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const purposeRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);
  const sectionRefs = useMemo(
    () => [heroRef, styleRef, detailRef, purposeRef, faqRef],
    [],
  );
  const wrapperRef = useMerchScroll(sectionRefs);

  useEffect(() => {
    setIsLoading(true);
    setIsLoaderExiting(false);

    const startExitTimer = window.setTimeout(() => {
      setIsLoaderExiting(true);
    }, LOADER_DURATION);

    const unmountTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, LOADER_DURATION + LOADER_EXIT_DURATION);

    return () => {
      window.clearTimeout(startExitTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`${styles.merchRoot} ${styles.snapRoot}`}>
      {isLoading ? (
        <MerchLoader durationMs={LOADER_DURATION} isExiting={isLoaderExiting} />
      ) : null}
      <MerchNav />
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
    </div>
  );
}
