import type { MerchCategory } from "./MerchNav";
import styles from "./MerchUnderConstruction.module.css";

type MerchUnderConstructionProps = {
  category: MerchCategory;
};

const categoryLabelMap: Record<MerchCategory, string> = {
  camisetas: "CAMISETAS",
  pochetes: "POCHETES",
  leques: "LEQUES",
  toalhas: "TOALHAS",
};

const TILES = [
  {
    src: `${import.meta.env.BASE_URL}images/merch/banner-home.png`,
    alt: "Camiseta em destaque com atmosfera quente de forro",
  },
  {
    src: `${import.meta.env.BASE_URL}images/merch/banner-2-loja-home.jpg`,
    alt: "Pessoa sorrindo com camiseta em ambiente de festa",
  },
  {
    src: `${import.meta.env.BASE_URL}images/merch/banner-home.png`,
    alt: "Detalhe de tecido e estampa com identidade da banda",
  },
  {
    src: `${import.meta.env.BASE_URL}images/merch/banner-2-loja-home.jpg`,
    alt: "Publico em clima de forro e luzes quentes",
  },
];

export default function MerchUnderConstruction({ category }: MerchUnderConstructionProps) {
  const label = categoryLabelMap[category];

  return (
    <section className={styles.section} aria-label={`${label} em obra`}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.mainContent}>
        <div className={styles.visualAnchor} aria-hidden="true">
          <div className={styles.sun} />
          <div className={styles.horizonWave} />
        </div>

        <h1 className={styles.title}>{label} em obra</h1>
        <p className={styles.text}>
          Estamos preparando cada detalhe para lancar essa categoria com a energia do Forro do
          Horizonte. Em breve, voce vai encontrar novidades com o mesmo ritmo, calor e identidade
          da nossa loja.
        </p>

        <div className={styles.newsletter}>
          <input
            type="email"
            className={styles.input}
            placeholder="Seu melhor e-mail"
            aria-label="Seu melhor e-mail"
          />
          <button type="button" className={styles.button}>
            Ser avisado do lancamento
          </button>
        </div>

        <p className={styles.helperText}>Sinta a batida vindo</p>
      </div>

      <div className={styles.tiles}>
        {TILES.map((tile, index) => (
          <figure
            key={`${tile.src}-${index}`}
            className={`${styles.tile} ${index % 2 !== 0 ? styles.tileOffset : ""}`}
          >
            <img src={tile.src} alt={tile.alt} className={styles.tileImage} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  );
}
