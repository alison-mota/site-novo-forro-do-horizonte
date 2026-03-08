const FACE_API_MODEL_URI = "/models/face-api";
const SELFIE_MAX_SIDE = 1024;
const EVENT_PHOTO_MAX_SIDE = 960;
const SELFIE_INPUT_SIZE = 416;
const EVENT_INPUT_SIZE = 416;
const MATCH_THRESHOLD = 0.6;

const descriptorCache = new Map();

let faceApiPromise = null;
let modelLoadPromise = null;

export class FaceSearchError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "FaceSearchError";
    this.code = code;
  }
}

function assertNotAborted(signal) {
  if (signal?.aborted) {
    throw new DOMException("Busca facial cancelada.", "AbortError");
  }
}

function getMediaDimensions(media) {
  if ("naturalWidth" in media && "naturalHeight" in media) {
    return {
      width: media.naturalWidth,
      height: media.naturalHeight,
    };
  }

  return {
    width: media.width,
    height: media.height,
  };
}

function resizeMedia(media, maxSide) {
  const { width, height } = getMediaDimensions(media);
  const largestSide = Math.max(width, height);

  if (!largestSide || largestSide <= maxSide) {
    return media;
  }

  const scale = maxSide / largestSide;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const context = canvas.getContext("2d", { alpha: false });
  context.drawImage(media, 0, 0, canvas.width, canvas.height);

  return canvas;
}

async function yieldToBrowser() {
  await new Promise((resolve) => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(() => resolve(), { timeout: 120 });
      return;
    }

    window.setTimeout(resolve, 0);
  });
}

async function getFaceApi() {
  if (!faceApiPromise) {
    faceApiPromise = Promise.all([import("@tensorflow/tfjs"), import("face-api.js")]).then(async ([tf, faceapi]) => {
      await tf.ready();

      const availableBackends = ["webgl", "cpu"];
      for (const backend of availableBackends) {
        try {
          await tf.setBackend(backend);
          break;
        } catch {
          // Tenta o proximo backend disponivel.
        }
      }

      await tf.ready();
      return faceapi;
    });
  }

  return faceApiPromise;
}

export async function ensureFaceApiModels() {
  const faceapi = await getFaceApi();

  if (!modelLoadPromise) {
    modelLoadPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODEL_URI),
      faceapi.nets.faceLandmark68Net.loadFromUri(FACE_API_MODEL_URI),
      faceapi.nets.faceRecognitionNet.loadFromUri(FACE_API_MODEL_URI),
    ]).catch((error) => {
      modelLoadPromise = null;
      throw error;
    });
  }

  await modelLoadPromise;
  return faceapi;
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new FaceSearchError("IMAGE_LOAD_FAILED", "Nao foi possivel carregar uma imagem para analise."));
    image.src = src;
  });
}

async function fileToImage(file) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImageElement(objectUrl);
    return resizeMedia(image, SELFIE_MAX_SIDE);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function fetchEventPhotoImage(url, signal) {
  const response = await fetch(url, {
    mode: "cors",
    credentials: "omit",
    referrerPolicy: "no-referrer",
    signal,
  });

  if (!response.ok) {
    throw new FaceSearchError("IMAGE_FETCH_FAILED", "Nao foi possivel baixar uma das fotos do evento para analise.");
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new FaceSearchError("IMAGE_CONTENT_INVALID", "A origem retornou um conteudo invalido para analise facial.");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = await loadImageElement(objectUrl);
    return resizeMedia(image, EVENT_PHOTO_MAX_SIDE);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function getAnalysisUrls(photo) {
  const candidateUrls = [];

  if (photo?.url) {
    candidateUrls.push(photo.url);
  }

  if (photo?.fileId) {
    candidateUrls.push(
      `https://drive.google.com/thumbnail?id=${photo.fileId}&sz=w1600`,
      `https://drive.google.com/thumbnail?id=${photo.fileId}&sz=w1200`,
      `https://drive.google.com/uc?export=view&id=${photo.fileId}`,
    );
  }

  return [...new Set(candidateUrls.filter(Boolean))];
}

async function loadEventPhotoForAnalysis(photo, signal) {
  const candidateUrls = getAnalysisUrls(photo);
  let lastError = null;

  for (const candidateUrl of candidateUrls) {
    assertNotAborted(signal);

    try {
      const image = await loadImageElement(candidateUrl);
      return resizeMedia(image, EVENT_PHOTO_MAX_SIDE);
    } catch (error) {
      lastError = error;
    }

    try {
      return await fetchEventPhotoImage(candidateUrl, signal);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new FaceSearchError("IMAGE_ACCESS_FAILED", "Nao foi possivel preparar a foto do evento para analise.");
}

function getDetectorOptions(faceapi, inputSize) {
  return new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold: 0.35,
  });
}

export async function extractSelfieDescriptor(file, { signal } = {}) {
  assertNotAborted(signal);

  if (!(file instanceof File) && !(file instanceof Blob)) {
    throw new FaceSearchError("INVALID_FILE", "Envie uma imagem valida para iniciar a busca.");
  }

  const faceapi = await ensureFaceApiModels();
  const imageInput = await fileToImage(file);
  assertNotAborted(signal);

  const detections = await faceapi
    .detectAllFaces(imageInput, getDetectorOptions(faceapi, SELFIE_INPUT_SIZE))
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (!detections.length) {
    throw new FaceSearchError("NO_FACE", "Nao encontramos nenhum rosto detectavel na foto enviada.");
  }

  if (detections.length > 1) {
    throw new FaceSearchError("MULTIPLE_FACES", "A selfie precisa conter apenas um rosto visivel.");
  }

  return detections[0].descriptor;
}

async function getPhotoDescriptors(photo, faceapi, signal) {
  const cacheKey = photo.fileId || photo.id || photo.url;
  if (descriptorCache.has(cacheKey)) {
    return descriptorCache.get(cacheKey);
  }

  const imageInput = await loadEventPhotoForAnalysis(photo, signal);
  assertNotAborted(signal);

  const detections = await faceapi
    .detectAllFaces(imageInput, getDetectorOptions(faceapi, EVENT_INPUT_SIZE))
    .withFaceLandmarks()
    .withFaceDescriptors();

  const descriptors = detections.map((detection) => detection.descriptor);
  descriptorCache.set(cacheKey, descriptors);
  return descriptors;
}

export async function searchEventPhotosByFace({
  queryDescriptor,
  photos,
  signal,
  onProgress,
}) {
  assertNotAborted(signal);

  if (!Array.isArray(photos) || !photos.length) {
    throw new FaceSearchError("NO_EVENT_PHOTOS", "Este evento ainda nao possui fotos suficientes para a busca facial.");
  }

  const faceapi = await ensureFaceApiModels();
  const matches = [];
  let failedCount = 0;

  for (let index = 0; index < photos.length; index += 1) {
    const photo = photos[index];
    assertNotAborted(signal);

    try {
      const descriptors = await getPhotoDescriptors(photo, faceapi, signal);
      const isMatch = descriptors.some(
        (descriptor) => faceapi.euclideanDistance(queryDescriptor, descriptor) <= MATCH_THRESHOLD,
      );

      if (isMatch) {
        matches.push(photo);
      }
    } catch (error) {
      if (error?.name === "AbortError") {
        throw error;
      }

      failedCount += 1;
    }

    onProgress?.({
      processed: index + 1,
      total: photos.length,
      matchCount: matches.length,
      failedCount,
    });

    await yieldToBrowser();
  }

  if (failedCount === photos.length) {
    throw new FaceSearchError(
      "EVENT_PHOTO_ACCESS_FAILED",
      "Nao conseguimos analisar as fotos deste evento agora. Tente novamente em alguns instantes.",
    );
  }

  return {
    matches,
    failedCount,
    total: photos.length,
  };
}

