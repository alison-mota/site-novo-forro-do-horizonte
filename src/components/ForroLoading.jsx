import { useEffect, useMemo, useState } from "react";

const DEFAULT_MESSAGES = [
  "Ajustando a sanfona",
  "Afinando o triângulo",
  "Aquecendo a zabumba",
  "Esquentando o salão pro arrasta-pé",
  "Chamando o povo pro xote",
  "Quase na hora do forró...",
];

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function ForroLoading({
  messages,
  variant = "inline",
  showBackButton = false,
  onBackClick,
  footerText = "FORRÓ DO HORIZONTE",
  progress: progressProp = null,
}) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const phrases = useMemo(() => {
    const base = Array.isArray(messages) && messages.length ? messages : DEFAULT_MESSAGES;
    return shuffleArray(base);
  }, [messages]);

  const useExternalProgress = progressProp != null && typeof progressProp === "number";
  const progress = useExternalProgress ? Math.min(100, Math.max(0, progressProp)) : internalProgress;

  useEffect(() => {
    if (useExternalProgress) return;

    let isActive = true;
    let tickTimeoutId = null;

    const tick = () => {
      if (!isActive) return;

      setInternalProgress((current) => {
        if (current >= 99) return current;
        const increment = 3 + Math.random() * 6;
        const next = Math.min(99, current + increment);
        tickTimeoutId = window.setTimeout(tick, 650 + Math.random() * 400);
        return next;
      });
    };

    const initialTimeout = window.setTimeout(tick, 500);

    return () => {
      isActive = false;
      window.clearTimeout(initialTimeout);
      if (tickTimeoutId) window.clearTimeout(tickTimeoutId);
    };
  }, [phrases, useExternalProgress]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatusIndex((i) => (i + 1) % Math.max(1, phrases.length));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [phrases.length]);

  const rootClassName =
    variant === "full"
      ? "forro-loading forro-loading--full"
      : "forro-loading forro-loading--inline";

  const statusText = phrases[statusIndex] ?? phrases[phrases.length - 1];

  return (
    <div className={rootClassName}>
      <div className="forro-loading__background">
        <div className="forro-loading__blob" aria-hidden="true"></div>
      </div>

      <div className="forro-loading__content">
        <div className="forro-loading__indicator">
          <div className="wheel-and-hamster" aria-hidden="true">
            <div className="wheel">
              <div className="spoke"></div>
            </div>
            <div className="hamster">
              <div className="hamster__body">
                <div className="hamster__head">
                  <div className="hamster__ear"></div>
                  <div className="hamster__eye"></div>
                  <div className="hamster__nose"></div>
                </div>
                <div className="hamster__limb hamster__limb--fr"></div>
                <div className="hamster__limb hamster__limb--fl"></div>
                <div className="hamster__limb hamster__limb--br"></div>
                <div className="hamster__limb hamster__limb--bl"></div>
                <div className="hamster__tail"></div>
              </div>
            </div>
          </div>

          <div className="forro-loading__status">
            <div className="forro-loading__progress">
              <div className="forro-loading__progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="forro-loading__status-sub">{statusText}</p>
          </div>
        </div>
      </div>

      {variant === "full" && (showBackButton || footerText) ? (
        <div className="forro-loading__footer">
          {showBackButton ? (
            <button
              type="button"
              className="forro-loading__back-button"
              onClick={onBackClick}
            >
              <span aria-hidden="true">←</span>
              VOLTAR
            </button>
          ) : (
            <span />
          )}

          {footerText ? <div className="forro-loading__footer-text">© {footerText}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

