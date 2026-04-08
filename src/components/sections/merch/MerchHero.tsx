// @ts-ignore
import styles from "./MerchHero.module.css";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD4lHXj6feaNhb0yJAmUMWRbWPuFS9likTu682Sj5FcdlvlLBt_dVPEvK8mVCNrdtJYzKrhcAFn_Kejn0o37DGzxSf-OKwPFBVjUiTJml84aYo5PthCpSwnEJT6YJbCwFc1GXLqXnAoJ4E7Q4QVQcOjnGy9CVXKrtWX_PVzIxeLXnadh9tZq9QSsjVUx-oDv2etEXd_xZamuh2OnA7Aw8UKgt_vGVkQ_S9ROa5wK8-jWoofP25Q-tVooZLlW5HlbLF_ong4UdfFUw";

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
            Garantir minha peca
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
