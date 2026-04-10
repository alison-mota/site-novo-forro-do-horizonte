// @ts-ignore
import styles from "./MerchHero.module.css";

// @ts-ignore
const HERO_IMAGE = `${import.meta.env.BASE_URL}images/merch/banner-home.png`;

export default function MerchHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>Support the Music</span>
          <h1 className={styles.title}>
            VISTA O RITMO, <span>FINANCIE A MÚSICA.</span>
          </h1>
          <p className={styles.description}>
            Cada camiseta vendida é um passo em direção ao nosso primeiro álbum.
            Se vista de Horizonte e financie a gravação das faixas que vão levar a gente pra juntim de você!
          </p>
          <button type="button" className={styles.cta}>
            Comprar agora
          </button>
        </div>

        <div className={styles.media}>
          <img
            src={HERO_IMAGE}
            alt="Close na textura premium de camiseta com luz quente em estúdio"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
}
