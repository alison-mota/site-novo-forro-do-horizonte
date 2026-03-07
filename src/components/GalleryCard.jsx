import { Link } from "react-router-dom";
import { generateEventSlug } from "../data/events.js";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-card__meta-icon">
      <rect x="3.75" y="5.75" width="16.5" height="14.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7.5 3.75v4M16.5 3.75v4M3.75 10h16.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-card__meta-icon">
      <path
        d="M12 20.25s6-5.54 6-10.25a6 6 0 1 0-12 0c0 4.71 6 10.25 6 10.25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.25" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function GalleryCard({ event }) {
  return (
    <Link to={`/galeria/${generateEventSlug(event.title)}`} className="gallery-card">
      {event.previewImage ? (
        <img src={event.previewImage} alt={event.title} className="gallery-card__image" />
      ) : (
        <div className="gallery-card__fallback" aria-hidden="true">
          FORRÓ
        </div>
      )}
      <div className="gallery-card__body">
        <p className="gallery-card__eyebrow">Arquivo fotográfico</p>
        <h3 className="gallery-card__title">{event.title}</h3>
        <p className="gallery-card__description">{event.description}</p>
        <div className="gallery-card__meta">
          <p className="gallery-card__meta-item">
            <CalendarIcon />
            <span>{event.date}</span>
          </p>
          <p className="gallery-card__meta-item">
            <LocationIcon />
            <span>{event.location}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
