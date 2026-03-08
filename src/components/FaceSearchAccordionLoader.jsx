import { useEffect, useMemo, useRef, useState } from "react";

const phrases = [
  "Afinando a sanfona para achar seus cliques...",
  "Procurando voce no meio do arrasta-pe...",
  "Varrendo o salao atras dos melhores registros...",
  "Separando os retratos mais bonitos da noite...",
  "Conferindo foto por foto no compasso do forró...",
];

const PHRASE_DURATION_MS = 3500;

function shufflePhrases(items, lastPhrase = "") {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  if (shuffled.length > 1 && lastPhrase && shuffled[0] === lastPhrase) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  return shuffled;
}

export default function FaceSearchAccordionLoader({ progress }) {
  const queueRef = useRef([]);
  const timeoutRef = useRef(null);
  const [currentPhrase, setCurrentPhrase] = useState("");

  useEffect(() => {
    function getNextPhrase(previousPhrase = "") {
      if (!queueRef.current.length) {
        queueRef.current = shufflePhrases(phrases, previousPhrase);
      }

      return queueRef.current.shift() || phrases[0];
    }

    function scheduleNextPhrase(previousPhrase = "") {
      timeoutRef.current = window.setTimeout(() => {
        const nextPhrase = getNextPhrase(previousPhrase);
        setCurrentPhrase(nextPhrase);
        scheduleNextPhrase(nextPhrase);
      }, PHRASE_DURATION_MS);
    }

    const firstPhrase = getNextPhrase();
    setCurrentPhrase(firstPhrase);
    scheduleNextPhrase(firstPhrase);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const progressLabel = useMemo(() => {
    if (!progress.total) {
      return "Preparando a busca...";
    }

    return `${progress.processed}/${progress.total} fotos analisadas`;
  }, [progress.processed, progress.total]);

  return (
    <div className="gallery-find-modal__loader">
      <div className="gallery-find-modal__loader-accordion" aria-hidden="true">
        <span className="gallery-find-modal__loader-fold"></span>
        <span className="gallery-find-modal__loader-fold"></span>
        <span className="gallery-find-modal__loader-fold"></span>
        <span className="gallery-find-modal__loader-fold"></span>
        <span className="gallery-find-modal__loader-fold"></span>
      </div>

      <p className="gallery-find-modal__loader-kicker">Encontre suas fotos</p>
      <p className="gallery-find-modal__loader-phrase">{currentPhrase}</p>
      <p className="gallery-find-modal__loader-progress">{progressLabel}</p>
    </div>
  );
}

