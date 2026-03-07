export default function GalleryCard({ item }) {
  return (
    <article className="gallery-card">
      <div className="gallery-card__overlay"></div>
      <div className="gallery-card__label-wrap">
        <span className="gallery-card__label">{item.label}</span>
      </div>
      <img src={item.image} alt={item.alt} className="gallery-card__image" />
    </article>
  );
}
