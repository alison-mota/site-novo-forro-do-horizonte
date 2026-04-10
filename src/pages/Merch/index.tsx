import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MerchLoader from "../../components/sections/merch/MerchLoader/MerchLoader";
// @ts-ignore
import styles from "./Merch.module.css";

const LOADER_DURATION = 7000;
const LOADER_EXIT_DURATION = 6000;
const MERCH_FIRST_OPENED_KEY = "fdh:merch:first-opened";
const SLIDE_INTERVAL_MS = 7000;

const bannerModules = import.meta.glob(
  "../../../public/images/merch/banner/*.{png,jpg,jpeg,webp}",
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
    // Fallback seguro: se o storage falhar, mantem comportamento da primeira abertura.
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

  useEffect(() => {
    if (BANNER_IMAGES.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentSlide((previousSlide) => (previousSlide + 1) % BANNER_IMAGES.length);
    }, SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // @ts-ignore
  return (
    <div className={styles.page}>
      {isLoading ? (
        <MerchLoader
          durationMs={Math.max(loaderSetup.minVisibleDurationMs, LOADER_DURATION)}
          isExiting={isLoaderExiting}
        />
      ) : null}
      <main className={styles.main}>
        <button
          type="button"
          className={styles.hamburger}
          aria-label="Abrir menu"
        >
          <span aria-hidden="true">☰</span>
        </button>
        <section className={styles.heroSection}>
          <div className={styles.bannerWrapper}>
            {BANNER_IMAGES.length > 0 ? (
              BANNER_IMAGES.map((imageUrl, index) => (
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt="Banner da lojinha Forró do Horizonte"
                  className={styles.slide}
                  style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                />
              ))
            ) : (
              <div className={styles.slideFallback} aria-hidden="true" />
            )}

            <div className={styles.textOverlay}>
              <p className={styles.overlayLineTop}>LOJINHA DO</p>
              <p className={styles.overlayLineAccent}>HORIZONTE</p>
              <p className={styles.overlayLineBottom}>FORRÓ DO HORIZONTE</p>
            </div>
          </div>

          <div className={styles.actions}>
            <a
              className={`${styles.actionBtn} ${styles.actionBtnGradient}`}
              href={`${import.meta.env.BASE_URL}loja-mostruario.html`}
            >
              <span>COMPRAR CAMISETAS</span>
              <span aria-hidden="true">→</span>
            </a>
            <Link className={styles.actionBtn} to="/">
              <span>SITE DA BANDA</span>
              <span aria-hidden="true">←</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
