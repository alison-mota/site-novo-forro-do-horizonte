import styles from "./PurposeSection.module.css";

const IMAGE = `${import.meta.env.BASE_URL}images/merch/banner-2-loja-home.jpg`;

export default function PurposeSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Built for <span>the dance.</span>
          </h2>
          <p className={styles.text}>
            Forro nao e so musica, e atrito. E suor, giro e calor do salao em
            plena madrugada. Cada peca nasce para acompanhar esse ritmo.
          </p>
          <p className={styles.text}>
            Desenvolvemos camisetas com alta gramatura e fibras que respiram,
            testadas em noites longas de xote e baiao para garantir resistencia
            sem perder a leveza do passo.
          </p>

          <div className={styles.stats}>
            <article>
              <strong>100%</strong>
              <p>Algodao premium</p>
            </article>
            <article>
              <strong>+500h</strong>
              <p>Horas de teste</p>
            </article>
          </div>
        </div>

        <figure className={styles.media}>
          <img
            src={IMAGE}
            alt="Casal dancando forro em ambiente com luz quente e movimento"
            className={styles.image}
          />
        </figure>
      </div>
    </section>
  );
}
