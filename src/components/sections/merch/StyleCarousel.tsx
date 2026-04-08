import styles from "./StyleCarousel.module.css";

const stylesData = [
  {
    name: "Oversized",
    spec: "Heavy Cotton • 240g",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9uDH8kCalVcI7Sot8vrfDJ4dBv1F7ESw9Psqe7Es4ddHUfZ4JqrtPyY64K6xxnNCixdmhL7UGn5R-qaNH8nCNkZb_48R4SYHThgrSgoBEMBr3KOOJ_OSaBxupdKQdYRZZzux0JUqrT-bFi6oZ02jxO2j2T85pI1XkCl_xD_qvvw22lDaG-5f1Q91rEQINQFN3Ujyitxi0wx7vW_vLNiHRdqnADPbMYrsSihYayMJJnhITcowrmrO7HYRQKzwHamcL1VDWrauy8g",
    alt: "Modelo masculino com camiseta oversized de algodao pesado",
  },
  {
    name: "Babylook",
    spec: "Fitted • 180g",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnQMa1uto2vOlGNsO2l6_k73glP_N1Zm4NpA4STkscz1Zb6Uj6aGoup_DMnlxU4hiQ2dDH0yZNvDm7F6JnGWftqplyHQMMYhraZ19VwSOZTRthsJmyXj2ttPyG6C7hKyYqWS8lNdlJJQ8ga797rvRUHKFn3-3oYPlaJYBF5ZmLsUh9YS5bSPuAHcEBV62boPTAu3sbYvu-t2hbs5rfYh8wJlJ8t14TXIGfdVOl7R7tmRgtHrFFcxOZA4vmistWIgFemMx4R-cBCg",
    alt: "Camiseta babylook branca em composicao minimalista",
  },
  {
    name: "Cavada",
    spec: "Freedom • 160g",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbxObWHrT93bJn6UBTBbvqzWTvbH8Y_lYwRt4tXZqbjRndB_g_oghZRExnJ3JVDTD64cJuusqRMloNxGDRnSIo7d5R30NzT_-P9vL1vR-W8dYVzMRLkmTHs8ATvY0FoOsAVN28SqR4sjaBl3UB-36vOTyPMkCLck_R2zNGWBaIKUy8HbI1ovuJBtj45H7gYsDATc8T8GkR-Ak4-yrd-U-qoGa5pAl5ZwuNcazBFab6rFilpWecGg8QtMgo4l1dwBl4bSEJrnGICw",
    alt: "Regata cavada branca em cabide com fundo neutro",
  },
  {
    name: "Tradicional",
    spec: "Regular • 200g",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDun1biACABtgJTEAc6GISIV8OS4IiX69qvNRCdsK64Kx8qZwNFtvV6L5uKr2zhOg3gd0j9-bPFerYEGKBphlNFeyMUz14ruEtxy0HwZwSEEMuONEJ421Gjia2xzO5YvWIaenjqjIumw74z5JF8Q47osKD-eOyyMUslQ1Rb3V27ESYLbBWojHHNnrFlEPBikKjmHdEE6qBjwPnpwBpySLS9Gmp-BItYGoXvxIsFYUjEjV208_WCibSU22vlTGdja543SDxM_I3xhA",
    alt: "Camiseta tradicional regular fit com costuras reforcadas",
  },
];

export default function StyleCarousel() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>Escolha seu estilo</h2>
            <p className={styles.subtitle}>Quatro modelagens pensadas para o movimento.</p>
          </div>
          <div className={styles.controls}>
            <button type="button" className={styles.controlButton} aria-label="Estilo anterior">
              &#8249;
            </button>
            <button type="button" className={styles.controlButton} aria-label="Proximo estilo">
              &#8250;
            </button>
          </div>
        </header>

        <div className={styles.grid}>
          {stylesData.map((item, index) => (
            <article
              key={item.name}
              className={`${styles.card} ${index === 1 ? styles.cardActive : ""}`}
            >
              <button type="button" className={styles.cardButton}>
                <div className={styles.imageWrap}>
                  <img src={item.image} alt={item.alt} className={styles.image} />
                </div>
                <h3 className={styles.cardTitle}>{item.name}</h3>
                <p className={styles.cardSpec}>{item.spec}</p>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
