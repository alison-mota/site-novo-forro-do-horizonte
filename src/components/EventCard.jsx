import Button from "./Button.jsx";

export default function EventCard({ event }) {
  return (
    <article className="event-card">
      <div className="event-card__layout">
        <div className="event-card__info">
          <div className="event-card__date">
            <span className="event-card__month">{event.month}</span>
            <span className="event-card__day">{event.day}</span>
          </div>
          <div className="event-card__copy">
            <h3 className="event-card__title">{event.title}</h3>
            <p className="event-card__location">{event.location}</p>
          </div>
        </div>
        <div className="event-card__action">
          {event.statusLabel ? (
            <span className="event-card__status">{event.statusLabel}</span>
          ) : (
            <Button label={event.ctaLabel} to={event.ctaTo} variant="small" size="sm" />
          )}
        </div>
      </div>
    </article>
  );
}
