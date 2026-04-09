import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./MerchLoader.module.css";

export const PHRASE_DURATION = 2000;
const PHRASE_EXIT_DURATION = 300;

const PHRASES = [
  "Sintonizando o Ritmo...",
  "Forro no Horizonte",
  "Sol no Compasso",
  "Ritmo de Lampiao",
  "Forro em Chamas",
  "Batida do Sertao",
  "Horizonte em Festa",
];

const PARTICLES = Array.from({ length: 12 }, (_, index) => index + 1);
const PHRASE_BURST_PARTICLES = Array.from({ length: 14 }, (_, index) => index + 1);

type MerchLoaderProps = {
  durationMs: number;
  isExiting: boolean;
};

export default function MerchLoader({ durationMs, isExiting }: MerchLoaderProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isPhraseExiting, setIsPhraseExiting] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsPhraseExiting(true);
      timeoutRef.current = window.setTimeout(() => {
        setPhraseIndex((prevIndex) => (prevIndex + 1) % PHRASES.length);
        setIsPhraseExiting(false);
      }, PHRASE_EXIT_DURATION);
    }, PHRASE_DURATION);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const progressStyle = useMemo(
    () =>
      ({
        "--fdh-merch-loader-duration": `${durationMs}ms`,
      }) as CSSProperties,
    [durationMs],
  );

  return (
    <div
      className={`${styles.loader} ${isExiting ? styles.exiting : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Carregando loja"
    >
      <div className={styles.sun} aria-hidden="true" />

      <div className={styles.particles} aria-hidden="true">
        {PARTICLES.map((particle) => (
          <span
            key={particle}
            className={`${styles.particle} ${styles[`particle${particle}`]}`}
          />
        ))}
      </div>

      <div className={styles.content}>
        <div
          key={phraseIndex}
          className={`${styles.phraseStage} ${isPhraseExiting ? styles.phraseStageExiting : ""}`}
        >
          <p className={`${styles.phrase} ${isPhraseExiting ? styles.phraseExit : styles.phraseEnter}`}>
            {PHRASES[phraseIndex]}
          </p>

          <div className={styles.phraseBurst} aria-hidden="true">
            {PHRASE_BURST_PARTICLES.map((particle) => (
              <span
                key={particle}
                className={`${styles.burstParticle} ${styles[`burstParticle${particle}`]}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressFill} style={progressStyle} />
        </div>
      </div>
    </div>
  );
}
