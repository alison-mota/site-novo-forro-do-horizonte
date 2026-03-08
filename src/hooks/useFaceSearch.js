import { useCallback, useEffect, useRef, useState } from "react";
import {
  ensureFaceApiModels,
  extractSelfieDescriptor,
  searchEventPhotosByFace,
} from "../lib/faceSearch.js";

const initialProgress = {
  processed: 0,
  total: 0,
  matchCount: 0,
  failedCount: 0,
};

function getErrorMessage(error) {
  if (error?.name === "AbortError") {
    return "";
  }

  if (error?.message) {
    return error.message;
  }

  return "Nao foi possivel concluir a busca facial agora.";
}

export function useFaceSearch({ eventSlug, photos }) {
  const abortControllerRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(initialProgress);
  const [matches, setMatches] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModelReady, setIsModelReady] = useState(false);
  const [isPreparingModels, setIsPreparingModels] = useState(false);

  const resetSearch = useCallback(() => {
    setStatus("idle");
    setProgress(initialProgress);
    setMatches([]);
    setErrorMessage("");
  }, []);

  const cancelSearch = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  const warmupModels = useCallback(async () => {
    if (isModelReady || isPreparingModels) {
      return;
    }

    setIsPreparingModels(true);
    setErrorMessage("");

    try {
      await ensureFaceApiModels();
      setIsModelReady(true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error) || "Nao foi possivel carregar os modelos faciais.");
    } finally {
      setIsPreparingModels(false);
    }
  }, [isModelReady, isPreparingModels]);

  const runFaceSearch = useCallback(
    async ({ file }) => {
      cancelSearch();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStatus("processing");
      setProgress({
        processed: 0,
        total: photos.length,
        matchCount: 0,
        failedCount: 0,
      });
      setMatches([]);
      setErrorMessage("");

      try {
        await ensureFaceApiModels();
        setIsModelReady(true);

        const queryDescriptor = await extractSelfieDescriptor(file, {
          signal: controller.signal,
        });

        const result = await searchEventPhotosByFace({
          queryDescriptor,
          photos,
          signal: controller.signal,
          onProgress: setProgress,
        });

        setMatches(result.matches);
        setStatus(result.matches.length ? "success" : "empty");
        return result;
      } catch (error) {
        if (error?.name === "AbortError") {
          return null;
        }

        setStatus("error");
        setErrorMessage(getErrorMessage(error));
        return null;
      } finally {
        abortControllerRef.current = null;
      }
    },
    [cancelSearch, photos],
  );

  useEffect(() => {
    cancelSearch();
    resetSearch();
  }, [cancelSearch, eventSlug, resetSearch]);

  useEffect(() => () => cancelSearch(), [cancelSearch]);

  return {
    status,
    progress,
    matches,
    errorMessage,
    isModelReady,
    isPreparingModels,
    warmupModels,
    runFaceSearch,
    resetSearch,
    cancelSearch,
  };
}

