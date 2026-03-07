import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { generateEventSlug } from "../data/events.js";
import { getGroupMotion } from "../lib/motion.js";
import { useEvents } from "../hooks/useEvents.js";

const IMAGES_PER_PAGE = 10;

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-event__floating-icon">
      <path
        d="M10 6 4 12l6 6M5 12h15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-event__floating-icon">
      <path
        d="M12 19V5M6 11l6-6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GaleriaEventoPage({ direction = 1 }) {
  const { eventSlug } = useParams();
  const navigate = useNavigate();
  const { events, isLoading, error } = useEvents();
  const observerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleImages, setVisibleImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(IMAGES_PER_PAGE);
  const [validImages, setValidImages] = useState([]);
  const [imageToFileIdMap, setImageToFileIdMap] = useState({});
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState({ current: 0, total: 0 });
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [pageShellElement, setPageShellElement] = useState(null);

  const headlineMotion = getGroupMotion("headline", direction);
  const contentMotion = getGroupMotion("content", direction);
  const metaMotion = getGroupMotion("meta", direction);

  const event = events.find((entry) => generateEventSlug(entry.title) === eventSlug);

  useEffect(() => {
    let active = true;

    async function preloadEventImages() {
      if (!event?.images?.length) {
        if (!active) {
          return;
        }

        setValidImages([]);
        setVisibleImages([]);
        setLoadedCount(0);
        setImageToFileIdMap({});
        setIsPreloading(false);
        return;
      }

      const filteredImages = event.images
        .map((url, originalIndex) => ({ url, originalIndex }))
        .filter(({ url }) => Boolean(url && url.trim()));

      if (!filteredImages.length) {
        if (!active) {
          return;
        }

        setValidImages([]);
        setVisibleImages([]);
        setLoadedCount(0);
        setImageToFileIdMap({});
        setIsPreloading(false);
        return;
      }

      setIsPreloading(true);
      setPreloadProgress({ current: 0, total: filteredImages.length });

      const imageUrls = filteredImages.map((item) => item.url);
      const indexMap = filteredImages.map((item) => item.originalIndex);
      const batchSize = 10;
      const allValidUrls = [];
      const urlToFileId = {};

      const validateBatch = async (startIndex) => {
        const batch = imageUrls.slice(startIndex, startIndex + batchSize);

        const results = await Promise.all(
          batch.map(
            (url, batchIndex) =>
              new Promise((resolve) => {
                const originalIndex = indexMap[startIndex + batchIndex];
                const fileId = event.driveImageIds?.[originalIndex];
                const img = new Image();

                img.onload = () => resolve({ url, fileId });
                img.onerror = () => {
                  if (!fileId) {
                    resolve({ url: null });
                    return;
                  }

                  const fallbacks = [
                    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
                    `https://drive.google.com/uc?export=download&id=${fileId}`,
                  ];

                  let fallbackIndex = 0;
                  const tryFallback = () => {
                    if (fallbackIndex >= fallbacks.length) {
                      resolve({ url: null });
                      return;
                    }

                    const fallbackImage = new Image();
                    fallbackImage.onload = () => resolve({ url: fallbacks[fallbackIndex], fileId });
                    fallbackImage.onerror = () => {
                      fallbackIndex += 1;
                      tryFallback();
                    };
                    fallbackImage.src = fallbacks[fallbackIndex];
                  };

                  tryFallback();
                };

                img.src = url;
              }),
          ),
        );

        return results.filter((result) => result.url);
      };

      const firstBatch = await validateBatch(0);
      if (!active) {
        return;
      }

      firstBatch.forEach((result) => {
        allValidUrls.push(result.url);
        if (result.fileId) {
          urlToFileId[result.url] = result.fileId;
        }
      });

      setValidImages([...allValidUrls]);
      setVisibleImages(allValidUrls.slice(0, IMAGES_PER_PAGE));
      setLoadedCount(Math.min(IMAGES_PER_PAGE, allValidUrls.length));
      setImageToFileIdMap({ ...urlToFileId });
      setPreloadProgress({ current: Math.min(batchSize, imageUrls.length), total: imageUrls.length });
      setIsPreloading(false);

      for (let index = batchSize; index < imageUrls.length; index += batchSize) {
        const validBatch = await validateBatch(index);
        if (!active) {
          return;
        }

        validBatch.forEach((result) => {
          allValidUrls.push(result.url);
          if (result.fileId) {
            urlToFileId[result.url] = result.fileId;
          }
        });

        setValidImages([...allValidUrls]);
        setImageToFileIdMap({ ...urlToFileId });
        setPreloadProgress({ current: Math.min(index + batchSize, imageUrls.length), total: imageUrls.length });

        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }
    }

    preloadEventImages();

    return () => {
      active = false;
    };
  }, [event]);

  useEffect(() => {
    if (!observerRef.current || loadedCount >= validImages.length || isPreloading) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        const nextBatch = validImages.slice(loadedCount, loadedCount + IMAGES_PER_PAGE);
        setVisibleImages((current) => [...new Set([...current, ...nextBatch])]);
        setLoadedCount((current) => Math.min(current + IMAGES_PER_PAGE, validImages.length));
      },
      { threshold: 0.1 },
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadedCount, validImages, isPreloading]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return undefined;
    }

    setPageShellElement(scrollContainer.closest(".page-shell"));

    const handleScroll = () => {
      setShowScrollTopButton(scrollContainer.scrollTop > 80);
    };

    handleScroll();
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function openImage(imageUrl) {
    const realIndex = validImages.indexOf(imageUrl);
    setSelectedImage(imageUrl);
    setCurrentImageIndex(realIndex >= 0 ? realIndex : 0);
  }

  function closeImage() {
    setSelectedImage(null);
  }

  function handleBackNavigation() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/galeria");
  }

  function scrollToTop() {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showNextImage() {
    if (!validImages.length) {
      return;
    }

    const nextIndex = (currentImageIndex + 1) % validImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(validImages[nextIndex]);
  }

  function showPreviousImage() {
    if (!validImages.length) {
      return;
    }

    const prevIndex = (currentImageIndex - 1 + validImages.length) % validImages.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(validImages[prevIndex]);
  }

  async function handleDownload(imageUrl) {
    const fileId = imageToFileIdMap[imageUrl];

    if (fileId) {
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      try {
        const response = await fetch(downloadUrl, {
          method: "GET",
          mode: "cors",
          credentials: "omit",
          redirect: "follow",
        });

        if (!response.ok) {
          throw new Error("Resposta não OK");
        }

        const blob = await response.blob();
        if (blob.type.startsWith("text/html")) {
          throw new Error("Google Drive retornou HTML ao invés da imagem");
        }

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `foto-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();

        window.setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        }, 100);
        return;
      } catch {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `foto-${Date.now()}.jpg`;
        link.target = "_self";
        document.body.appendChild(link);
        link.click();

        window.setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 1000);
        return;
      }
    }

    try {
      const response = await fetch(imageUrl, {
        mode: "cors",
        credentials: "omit",
        referrerPolicy: "no-referrer",
      });

      if (!response.ok) {
        throw new Error("Erro ao baixar imagem");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `foto-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (downloadError) {
      console.error("Erro ao baixar imagem:", downloadError);
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    }
  }

  if (isLoading) {
    return (
      <div className="content-scroll page-content page-content--centered">
        <p className="gallery-state">Carregando evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-scroll page-content page-content--centered">
        <p className="gallery-state">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="content-scroll page-content page-content--centered">
        <p className="gallery-state">Evento não encontrado.</p>
        <Link to="/galeria" className="gallery-event__back-link">
          VOLTAR PARA GALERIA
        </Link>
      </div>
    );
  }

  return (
    <>
      <div ref={scrollContainerRef} className="content-scroll page-content">
        <motion.div className="gallery-event__header" {...headlineMotion}>
          <h1 className="gallery-event__title">{event.title}</h1>
        </motion.div>

        <motion.div className="gallery-event__meta" {...metaMotion}>
          <span>{event.date}</span>
          <span>{event.location}</span>
          <span>{validImages.length} fotos válidas</span>
        </motion.div>

        {isPreloading ? (
          <motion.div className="gallery-state" {...contentMotion}>
            Carregando e validando imagens... {preloadProgress.current}/{preloadProgress.total || 0}
          </motion.div>
        ) : (
          <motion.div className="gallery-event__grid" {...contentMotion}>
            {visibleImages.map((image) => {
              const realIndex = validImages.indexOf(image);
              const label = String(realIndex + 1).padStart(2, "0");

              return (
                <button
                  key={`${label}-${image}`}
                  type="button"
                  className="gallery-event__thumb"
                  onClick={(e) => {
                    e.preventDefault();
                    openImage(image);
                  }}
                >
                  <img
                    src={image}
                    alt={`${event.title} - Foto ${realIndex + 1}`}
                    className="gallery-event__thumb-image"
                    loading="lazy"
                  />
                  <span className="gallery-event__thumb-label">Foto {label}</span>
                </button>
              );
            })}
          </motion.div>
        )}

        {!isPreloading && !validImages.length ? (
          <p className="gallery-state">Nenhuma foto válida foi encontrada para este evento.</p>
        ) : null}

        {!isPreloading && loadedCount < validImages.length ? <div ref={observerRef} className="gallery-event__load-more">Carregando mais fotos...</div> : null}
      </div>

      {pageShellElement
        ? createPortal(
            <>
              <div className="gallery-event__floating-actions gallery-event__floating-actions--left">
                <button type="button" className="gallery-event__floating-button" onClick={handleBackNavigation}>
                  <BackIcon />
                  <span>Voltar</span>
                </button>
              </div>

              {showScrollTopButton ? (
                <div className="gallery-event__floating-actions gallery-event__floating-actions--right">
                  <button type="button" className="gallery-event__floating-button gallery-event__floating-button--secondary" onClick={scrollToTop}>
                    <ArrowUpIcon />
                    <span>Voltar ao topo</span>
                  </button>
                </div>
              ) : null}
            </>,
            pageShellElement,
          )
        : null}

      {createPortal(
        <AnimatePresence>
          {selectedImage ? (
            <motion.div
              key="gallery-lightbox"
              className="gallery-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeImage}
            >
              <motion.div
                className="gallery-lightbox__dialog"
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.96 }}
                onClick={(eventClick) => eventClick.stopPropagation()}
              >
                <button type="button" className="gallery-lightbox__close" onClick={closeImage}>
                  FECHAR
                </button>

                {validImages.length > 1 ? (
                  <button
                    type="button"
                    className="gallery-lightbox__nav gallery-lightbox__nav--prev"
                    onClick={showPreviousImage}
                  >
                    ANTERIOR
                  </button>
                ) : null}

                {validImages.length > 1 ? (
                  <button
                    type="button"
                    className="gallery-lightbox__nav gallery-lightbox__nav--next"
                    onClick={showNextImage}
                  >
                    PRÓXIMA
                  </button>
                ) : null}

                <img src={selectedImage} alt={`${event.title} - Foto ampliada`} className="gallery-lightbox__image" />

                <div className="gallery-lightbox__footer">
                  <button
                    type="button"
                    className="gallery-lightbox__download"
                    onClick={() => handleDownload(selectedImage)}
                  >
                    BAIXAR FOTO
                  </button>
                  <span className="gallery-lightbox__counter">
                    {currentImageIndex + 1} / {validImages.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
