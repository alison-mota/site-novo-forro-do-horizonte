import { useEffect, useState } from "react";
import ActionButtons from "../components/actionbuttons/ActionButtons";
import HamburgerMenu from "../components/hamburgermenu/HamburgerMenu";
import HeroBanner from "../components/herobanner/HeroBanner";
import MerchLoader from "../components/merchloader/MerchLoader";
import "../styles/lojinha.css";
// @ts-ignore
import styles from "../styles/MerchPage.module.css";

const LOADER_DURATION = 2000;
const LOADER_EXIT_DURATION = 600;
const MERCH_FIRST_OPENED_KEY = "fdh:merch:first-opened";
const SLIDE_INTERVAL_MS = 5000;

// @ts-ignore
const bannerModules = import.meta.glob(
  "../images/banner/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" },
) as Record<string, string>;

const BANNER_IMAGES = Object.entries(bannerModules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([, imageUrl]) => imageUrl);

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
    isFirstOpen = true;
  }

  return {
    shouldShowLoader: isFirstOpen || pageStillLoading,
    minVisibleDurationMs: isFirstOpen ? LOADER_DURATION : 0,
  };
}

export default function MerchPage() {
  const [loaderSetup] = useState<LoaderSetup>(() => getLoaderSetup());
  const [isLoading, setIsLoading] = useState(loaderSetup.shouldShowLoader);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!loaderSetup.shouldShowLoader) return;

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

    if (document.readyState === "complete") {
      finishLoader();
    } else {
      window.addEventListener("load", finishLoader, { once: true });
    }

    return () => {
      window.removeEventListener("load", finishLoader);
      if (startExitTimer !== null) window.clearTimeout(startExitTimer);
      if (unmountTimer !== null) window.clearTimeout(unmountTimer);
    };
  }, [loaderSetup]);

  useEffect(() => {
    if (BANNER_IMAGES.length < 2) return;
    const intervalId = window.setInterval(() => {
      setCurrentSlide((previousSlide) => (previousSlide + 1) % BANNER_IMAGES.length);
    }, SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={`lojinhaTheme ${styles.page}`}>
      {isLoading ? (
        <MerchLoader durationMs={Math.max(loaderSetup.minVisibleDurationMs, LOADER_DURATION)} isExiting={isLoaderExiting} />
      ) : null}
      <main className={styles.main}>
        <HamburgerMenu />
        <HeroBanner images={BANNER_IMAGES} currentSlide={currentSlide} />
        <ActionButtons />
      </main>
    </div>
  );
}
