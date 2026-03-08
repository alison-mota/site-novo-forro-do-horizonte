import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FaceSearchAccordionLoader from "./FaceSearchAccordionLoader.jsx";
import { useFaceSearch } from "../hooks/useFaceSearch.js";

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-find-modal__action-icon">
      <path
        d="M7 7.25h2.15l1.3-1.75h3.1l1.3 1.75H17A2.75 2.75 0 0 1 19.75 10v6A2.75 2.75 0 0 1 17 18.75H7A2.75 2.75 0 0 1 4.25 16v-6A2.75 2.75 0 0 1 7 7.25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-find-modal__action-icon">
      <path
        d="M12 15.5V5.25M8 9.25l4-4 4 4M5.75 18.75h12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-find-modal__close-icon">
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function isImageFile(file) {
  return Boolean(file?.type?.startsWith("image/"));
}

export default function GalleryFindPhotosModal({
  isOpen,
  onClose,
  eventSlug,
  eventTitle,
  photos,
  onApplyResults,
}) {
  const uploadInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [step, setStep] = useState("entry");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [localError, setLocalError] = useState("");

  const {
    status,
    progress,
    matches,
    errorMessage,
    isPreparingModels,
    warmupModels,
    runFaceSearch,
    resetSearch,
    cancelSearch,
  } = useFaceSearch({ eventSlug, photos });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    warmupModels();
  }, [isOpen, warmupModels]);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!previewUrl) {
      return undefined;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      cancelSearch();
    },
    [cancelSearch],
  );

  useEffect(() => {
    if (!isOpen) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStep("entry");
      setSelectedFile(null);
      setPreviewUrl("");
      setLocalError("");
      resetSearch();
    }
  }, [isOpen, resetSearch]);

  useEffect(() => {
    if (step !== "camera" || !videoRef.current || !streamRef.current) {
      return;
    }

    videoRef.current.srcObject = streamRef.current;
    videoRef.current.play().catch(() => {
      setLocalError("Nao foi possivel abrir a camera agora.");
    });
  }, [step]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  function cleanupPreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  }

  function cleanupCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function handleModalClose() {
    cancelSearch();
    cleanupCamera();
    cleanupPreview();
    setSelectedFile(null);
    setLocalError("");
    setStep("entry");
    resetSearch();
    onClose();
  }

  function applySelectedFile(file) {
    if (!file || !isImageFile(file)) {
      setLocalError("Escolha uma imagem valida para procurar suas fotos.");
      return;
    }

    cleanupPreview();
    setLocalError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStep("preview");
  }

  function handleUploadChange(event) {
    const file = event.target.files?.[0];
    applySelectedFile(file);
    event.target.value = "";
  }

  async function openCamera() {
    cleanupCamera();
    cleanupPreview();
    setSelectedFile(null);
    setLocalError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setLocalError("Seu navegador nao oferece suporte ao uso da camera nesta pagina.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setStep("camera");
    } catch {
      setLocalError("Nao conseguimos acessar sua camera. Tente enviar uma foto.");
    }
  }

  function captureCameraPhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setLocalError("A camera ainda nao ficou pronta. Tente novamente em alguns segundos.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setLocalError("Nao foi possivel capturar a foto agora.");
          return;
        }

        cleanupCamera();
        applySelectedFile(new File([blob], "selfie-camera.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  }

  async function handleSearch() {
    if (!selectedFile) {
      setLocalError("Envie uma foto ou tire uma selfie para continuar.");
      return;
    }

    setLocalError("");
    const result = await runFaceSearch({ file: selectedFile });

    if (!result) {
      return;
    }

    if (result.matches.length) {
      setStep("result");
      return;
    }

    setStep("empty");
  }

  function handleTryAgain() {
    cancelSearch();
    cleanupCamera();
    cleanupPreview();
    setSelectedFile(null);
    setLocalError("");
    setStep("entry");
    resetSearch();
  }

  function handleApplyResults() {
    onApplyResults(matches);
    handleModalClose();
  }

  const modalBody = (
    <div className="gallery-find-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-find-modal-title">
      <div className="gallery-find-modal__backdrop" onClick={handleModalClose}></div>

      <div className="gallery-find-modal__panel">
        <div className="gallery-find-modal__header">
          <div>
            <p className="gallery-find-modal__eyebrow">Encontre suas fotos</p>
            <h2 id="gallery-find-modal-title" className="gallery-find-modal__title">
              {eventTitle}
            </h2>
          </div>

          <button type="button" className="gallery-find-modal__close" onClick={handleModalClose} aria-label="Fechar busca facial">
            <CloseIcon />
          </button>
        </div>

        <p className="gallery-find-modal__hint">
          A busca acontece no seu navegador. Sua selfie nao e enviada para o servidor.
        </p>

        {step === "entry" ? (
          <div className="gallery-find-modal__actions">
            <button type="button" className="gallery-find-modal__action-card gallery-find-modal__action-card--upload" onClick={() => uploadInputRef.current?.click()}>
              <UploadIcon />
              <strong>Enviar uma foto</strong>
              <span>Escolha uma selfie com o rosto bem iluminado e visivel.</span>
            </button>

            <button type="button" className="gallery-find-modal__action-card gallery-find-modal__action-card--camera" onClick={openCamera}>
              <CameraIcon />
              <strong>Tirar uma foto</strong>
              <span>Abra a camera e capture uma imagem so sua, de frente.</span>
            </button>

            <input ref={uploadInputRef} type="file" accept="image/*" className="gallery-find-modal__hidden-input" onChange={handleUploadChange} />
          </div>
        ) : null}

        {step === "camera" ? (
          <div className="gallery-find-modal__camera">
            <video ref={videoRef} className="gallery-find-modal__camera-video" autoPlay playsInline muted></video>
            <div className="gallery-find-modal__footer">
              <button type="button" className="gallery-find-modal__secondary-button" onClick={handleTryAgain}>
                Cancelar
              </button>
              <button type="button" className="gallery-find-modal__primary-button" onClick={captureCameraPhoto}>
                Capturar foto
              </button>
            </div>
          </div>
        ) : null}

        {step === "preview" && status !== "processing" ? (
          <div className="gallery-find-modal__preview">
            <div className="gallery-find-modal__preview-frame">
              <img src={previewUrl} alt="Selfie para busca facial" className="gallery-find-modal__preview-image" />
            </div>

            <div className="gallery-find-modal__footer">
              <button type="button" className="gallery-find-modal__secondary-button" onClick={handleTryAgain}>
                Escolher outra foto
              </button>
              <button type="button" className="gallery-find-modal__primary-button" onClick={handleSearch}>
                Buscar nas fotos do evento
              </button>
            </div>
          </div>
        ) : null}

        {status === "processing" ? <FaceSearchAccordionLoader progress={progress} /> : null}

        {step === "result" && status === "success" ? (
          <div className="gallery-find-modal__state gallery-find-modal__state--result">
            <h3>Encontramos {matches.length} fotos suas neste evento.</h3>
            <p>Agora vamos mostrar so os cliques compatíveis, mantendo o mesmo visual da galeria.</p>
            <div className="gallery-find-modal__footer">
              <button type="button" className="gallery-find-modal__secondary-button" onClick={handleTryAgain}>
                Buscar com outra foto
              </button>
              <button type="button" className="gallery-find-modal__primary-button" onClick={handleApplyResults}>
                Ver minhas fotos
              </button>
            </div>
          </div>
        ) : null}

        {step === "empty" && status === "empty" ? (
          <div className="gallery-find-modal__state gallery-find-modal__state--empty">
            <h3>Nao encontramos fotos compatíveis desta vez.</h3>
            <p>
              Tente enviar outra selfie com o rosto mais visivel, centralizado e bem iluminado.
              {progress.failedCount
                ? ` Algumas fotos do evento nao puderam ser analisadas nesta tentativa (${progress.failedCount}).`
                : ""}
            </p>
            <div className="gallery-find-modal__footer">
              <button type="button" className="gallery-find-modal__secondary-button" onClick={handleModalClose}>
                Fechar
              </button>
              <button type="button" className="gallery-find-modal__primary-button" onClick={handleTryAgain}>
                Tentar outra foto
              </button>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="gallery-find-modal__state gallery-find-modal__state--error">
            <h3>A busca nao conseguiu terminar.</h3>
            <p>{errorMessage}</p>
            <div className="gallery-find-modal__footer">
              <button type="button" className="gallery-find-modal__secondary-button" onClick={handleModalClose}>
                Fechar
              </button>
              <button type="button" className="gallery-find-modal__primary-button" onClick={handleTryAgain}>
                Tentar novamente
              </button>
            </div>
          </div>
        ) : null}

        {localError ? <p className="gallery-find-modal__inline-error">{localError}</p> : null}
        {isPreparingModels && step === "entry" ? <p className="gallery-find-modal__model-status">Preparando o motor da busca facial...</p> : null}
      </div>
    </div>
  );

  return createPortal(modalBody, document.body);
}

