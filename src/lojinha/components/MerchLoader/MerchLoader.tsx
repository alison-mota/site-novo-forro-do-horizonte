import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./MerchLoader.module.css";

export const PHRASE_DURATION = 2000;
const PHRASE_EXIT_DURATION = 300;

const PHRASES = [
  "Sintonizando o Ritmo...",
  "Forró no Horizonte",
  "Sol no Compasso",
  "Ritmo de Lampião",
  "Forró em Chamas",
  "Batida do Sertão",
  "Horizonte em Festa",
];

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
      <div className={styles.content}>
        <p className={`${styles.phrase} ${isPhraseExiting ? styles.phraseExit : styles.phraseEnter}`}>
          {PHRASES[phraseIndex]}
        </p>
        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressFill} style={progressStyle} />
        </div>
      </div>
    </div>
  );
}
