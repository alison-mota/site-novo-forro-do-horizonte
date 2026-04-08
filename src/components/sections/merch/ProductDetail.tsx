import { useState } from "react";
import styles from "./ProductDetail.module.css";

const gallery = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJAwU4w1-F4lgTNszGjWZwVLAl3duapNxuvK0GOg3Q8zlt-vTz0ZGDAKV3Sbq_x1iwSu34mqVt67zN8p_GVfnzaEGq3BrsfECtWjIabZqMA_bXLzNxYCjDrMzaAJn5RX_gySclWCYDEyz5eQ3hqSlci78vXno-zcsVZJmcqw2-516yG9VYOmZ2oc8LcN2r6D2lT8h5-pSAJlqk3H3rtP-OznKK_TEDfE6Ji9waYMAdoeLDeymDmDbRBMvzAcQmxJJ8dlHkmbf_WQ",
    alt: "Detalhe de gola e costura de camiseta de alta gramatura",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnPAeb53mdL24SDVaznJW2LUNbuqGeE4A1MXsHXHsyaIvJWa4z9t0povI0NfkmxK-ZwnOueAwWGCqvO6_XFZXQIixWfxsKvy9WX0mqhxBURkP3uFnCD8x9GYbq4tATMZMw1mO168ViQqvB0llpfCZ99uVwX-BosAVn99TlS1ubt-ouxp8oHamwEbJaOZFwjB9xs6CkhUhmVnj8QF735ZEFdNTKhAPiw0QuunOfVvO08SyfvEvtf3vKfzPEi7b9IfROf3Oy6P47gg",
    alt: "Camiseta em close lateral destacando textura do tecido",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN_-ifquRYnNmW4lbeQiQ6xZjDT1StlDnSTscIeD5K4w51qFHmSsrFcghSQ-tMVyKEl-JnxOx6JnraIS4fSkU0Sg3lRVvAsd6cFl6G42iMbBGLBySCLBx7MIMvgYYUTAr0fiUm9dWBfzC95CtzaxtpJS0keaVzKJToS8MocnEIGJYI-UwumQAt3ZpkxnCYM1YAM2kcLqyo6Gvq_9z0eJICVli5F3-llIwGiyvF1HHHcaCL4mvzBfvA47e2Z8FiYp8ZZ6HeuCjmSQ",
    alt: "Close no caimento da camiseta em movimento",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAA87vFKPwXEZ5z7kAd5JkeFLkXVL2RX9ayPoUPYWn0lWuOORfdrrnn4HUHV3OeW9YKPpv3HF1UN84cKvzrzAHAQdZeeQDY233SrtgASeCYbbBBJLhfhiD258-NFCS5axZ0RWShJJtYOiW1EecveHbsJHQCDvl_Q7EH-IPWD4JgWORbUn3JFci8p6xtjmhkx-VBpLBaLUoYwdWQO_89fvDDPE3q-yArqHQlr8AuBZrLQ6L1twqaeb3G4AkGkhjJVq2Iqg5CJhYYw",
    alt: "Detalhe de acabamento industrial da costura interna",
  },
];

const sizes = ["P", "M", "G", "GG", "XG"];

const specs = [
  "Algodao sustentavel 100%",
  "Gramatura 240g/m²",
  "Gola canelada 3cm",
  "Costura reforcada no ombro",
  "Modelagem boxy fit",
  "Peca pre-encolhida",
];

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.gallery}>
          <div className={styles.mainImageWrap}>
            <img
              src={gallery[selectedImage].src}
              alt={gallery[selectedImage].alt}
              className={styles.mainImage}
            />
          </div>

          <div className={styles.thumbs}>
            {gallery.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={`${styles.thumbButton} ${
                  selectedImage === index ? styles.thumbActive : ""
                }`}
                aria-label={`Selecionar imagem ${index + 1} da galeria`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image.src} alt={image.alt} className={styles.thumbImage} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.content}>
          <header className={styles.header}>
            <p className={styles.kicker}>Industrial Series</p>
            <h2 className={styles.title}>Oversized Heavy Horizon</h2>
            <p className={styles.price}>R$ 149,90</p>
          </header>

          <div className={styles.specBlock}>
            <h3 className={styles.blockTitle}>Especificacoes tecnicas</h3>
            <ul className={styles.specList}>
              {specs.map((spec) => (
                <li key={spec} className={styles.specItem}>
                  <span className={styles.dot} aria-hidden="true" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sizeBlock}>
            <h3 className={styles.blockTitle}>Selecione o tamanho</h3>
            <div className={styles.sizeOptions}>
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`${styles.sizeButton} ${
                    selectedSize === size ? styles.sizeActive : ""
                  }`}
                  aria-pressed={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className={styles.addButton}>
            Adicionar ao carrinho
          </button>
          <p className={styles.note}>
            * Toda a renda sera revertida para a gravacao do album Horizonte Solar.
          </p>
        </div>
      </div>
    </section>
  );
}
