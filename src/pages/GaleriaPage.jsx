import { motion } from "framer-motion";
import GalleryCard from "../components/GalleryCard.jsx";
import { sortEventsByDate } from "../data/events.js";
import { useEvents } from "../hooks/useEvents.js";
import { getGroupMotion } from "../lib/motion.js";

export default function GaleriaPage({ direction = 1 }) {
  const contentMotion = getGroupMotion("content", direction);
  const { events, isLoading, error } = useEvents();
  const sortedEvents = sortEventsByDate(events);

  return (
    <div className="content-scroll page-content">
      <motion.div className="gallery-grid" {...contentMotion}>
        {isLoading ? <p className="gallery-state">Carregando eventos...</p> : null}
        {!isLoading && error ? <p className="gallery-state">{error}</p> : null}
        {!isLoading && !error
          ? sortedEvents.map((event) => <GalleryCard key={event.id} event={event} />)
          : null}
        {!isLoading && !error && !sortedEvents.length ? (
          <p className="gallery-state">Nenhum evento com fotos foi encontrado.</p>
        ) : null}
      </motion.div>
    </div>
  );
}
