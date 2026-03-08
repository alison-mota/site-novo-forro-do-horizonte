import { motion } from "framer-motion";
import EventCard from "../components/EventCard.jsx";
import { agendaData } from "../data/agenda.js";
import { getGroupMotion } from "../lib/motion.js";

export default function AgendaPage({ direction = 1 }) {
  const contentMotion = getGroupMotion("content", direction);

  return (
    <div className="content-scroll page-content">
      <motion.div className="events-list" {...contentMotion}>
        {agendaData.map((event) => (
          <EventCard key={`${event.month}-${event.day}-${event.title}`} event={event} />
        ))}
      </motion.div>
    </div>
  );
}
