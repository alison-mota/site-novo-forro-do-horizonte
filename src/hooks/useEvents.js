import { useEffect, useState } from "react";
import { eventCatalog } from "../data/events.js";
import { hasGoogleDriveApiKey, processEventWithDriveFolder } from "../lib/googleDrive.js";

let cachedEvents = [];
let loadingPromise = null;

async function initializeEvents() {
  if (cachedEvents.length) {
    return cachedEvents;
  }

  if (!loadingPromise) {
    loadingPromise = Promise.all(eventCatalog.map((event) => processEventWithDriveFolder(event)))
      .then((events) => {
        cachedEvents = events;
        return events;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  return loadingPromise;
}

export function useEvents() {
  const [events, setEvents] = useState(cachedEvents);
  const [isLoading, setIsLoading] = useState(!cachedEvents.length);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!hasGoogleDriveApiKey()) {
      setEvents(eventCatalog);
      setError("A chave VITE_GOOGLE_DRIVE_API_KEY não está configurada.");
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    initializeEvents()
      .then((loadedEvents) => {
        if (!active) {
          return;
        }

        setEvents(loadedEvents);
        setError(null);
      })
      .catch((err) => {
        if (!active) {
          return;
        }

        console.error("Erro ao carregar eventos:", err);
        setError("Erro ao carregar eventos do Google Drive.");
        setEvents(eventCatalog);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { events, isLoading, error };
}
