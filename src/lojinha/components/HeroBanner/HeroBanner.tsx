import styles from "./HeroBanner.module.css";

type HeroBannerProps = {
  images: string[];
  currentSlide: number;
};

export default function HeroBanner({ images, currentSlide }: HeroBannerProps) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.bannerWrapper}>
        {images.length > 0 ? (
          images.map((imageUrl, index) => (
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
    </section>
  );
}
