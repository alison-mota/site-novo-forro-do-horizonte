import { useEffect, useState } from "react";
import { eventCatalog, sortEventsByDate } from "../data/events.js";
import { hasGoogleDriveApiKey, processEventWithDriveFolder } from "../lib/googleDrive.js";

let cachedEvents = [];
let loadingPromise = null;

async function initializeEvents() {
  if (cachedEvents.length) {
    return cachedEvents;
  }

  if (!loadingPromise) {
    loadingPromise = (async () => {
      // Pré-carrega somente o evento mais recente com dados do Google Drive.
      const [latestEvent] = sortEventsByDate(eventCatalog);

      if (!latestEvent) {
        cachedEvents = eventCatalog;
        return cachedEvents;
      }

      const processedLatest = await processEventWithDriveFolder(latestEvent);

      const enrichedEvents = eventCatalog.map((event) =>
        event.id === processedLatest.id ? processedLatest : event,
      );

      cachedEvents = enrichedEvents;
      return enrichedEvents;
    })().finally(() => {
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
      setError("A integração com o Google Drive não está configurada.");
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
