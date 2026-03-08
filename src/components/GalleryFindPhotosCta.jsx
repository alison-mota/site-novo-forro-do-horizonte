import { createPortal } from "react-dom";

function FindPhotosIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-find__cta-icon">
      <path
        d="M10.25 4.75a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm0 0c2.31 0 4.32 1.42 5.15 3.44m.6 7.16 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GalleryFindPhotosCta({ portalRoot, onOpen, isDisabled = false, helperText = "" }) {
  if (!portalRoot) {
    return null;
  }

  return createPortal(
    <>
      <aside className="gallery-event__find-banner">
        <p className="gallery-event__find-banner-eyebrow">Encontre suas fotos</p>
        <h2 className="gallery-event__find-banner-title">Apareceu no forró?</h2>
        <p className="gallery-event__find-banner-copy">
          Envie uma foto sua e encontre rapidinho os cliques em que voce aparece neste evento.
        </p>
        {helperText ? <p className="gallery-event__find-banner-helper">{helperText}</p> : null}
        <button
          type="button"
          className="gallery-event__find-banner-cta"
          onClick={onOpen}
          disabled={isDisabled}
        >
          <FindPhotosIcon />
          <span>{isDisabled ? "Preparando a busca" : "Encontrar minhas fotos"}</span>
        </button>
      </aside>

      <div className="gallery-event__floating-actions gallery-event__floating-actions--center">
        <button
          type="button"
          className="gallery-event__floating-button gallery-event__floating-button--find"
          onClick={onOpen}
          disabled={isDisabled}
        >
          <FindPhotosIcon />
          <span>{isDisabled ? "Preparando a busca" : "Encontrar minhas fotos"}</span>
        </button>
      </div>
    </>,
    portalRoot,
  );
}

