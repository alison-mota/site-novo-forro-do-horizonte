import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryCtaButton from "../components/botons/primaryctabutton/PrimaryCtaButton";
import LojinhaHeader from "../components/header/LojinhaHeader";
import "../styles/lojinha.css";
import styles from "../styles/CartPage.module.css";

type CartItem = {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
  accent: "brand" | "highlight";
};

const INITIAL_ITEMS: CartItem[] = [
  {
    id: "camiseta-organico",
    name: "Camiseta Horizonte Orgânico",
    color: "Laranja",
    size: "G",
    price: 89.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3pbZa_z9_DqeS-s3zdPaZfVb3ZFCZSO1g0eoOjQBCoQy-qG84pHjFaOe9ds8gdGrVOWu_MiXm13TkqFLL7x-ulE8SkQGvuGgh-1VXgU-r4pYu7LfhV38zI9aGLoPy6QIfviHbP6R42CTClhCvW6fjRPD9zHBceUlW77cYJL-bAaYGbcSwcUjSwwzWF_NQztNmnqUoQ-NQXx2pV_vBlD6qAmfNi9zQUVfmpzEWsWcMKZcTeqK-hf08apu14_PnEaTBxQdpvMkhneU",
    accent: "brand",
  },
  {
    id: "mochila-turquesa",
    name: "Mochila Expedição Turquesa",
    color: "Turquesa",
    size: "Único",
    price: 249,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEGOfv7hom26THDMM-KxlGImytCcBT7O-9RbbSg9ljpMgaLsgzMvdrKnjQkAVy24j76ZpW7CFgorF6hgSPylglPf_i1GXLWPd72hRgpjkOuYyp6jIUp0-IjSLcnWJJUJdWrCc6I3W2bWGvgR-2h096WW3kb5Pvz9BXutpilQnOMx2S3sWw6lzOobTqeRCDPDZHBb6mBUzAxK1j6wDqrYsnQ9vf-zZjvW99FIeriq8gyYyI1kzYt_-WR6ZOE96TBYgxzOCYA7VYybM",
    accent: "highlight",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function CartPage() {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState<Record<string, number>>(
    INITIAL_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {}),
  );

  const subtotal = useMemo(() => {
    return INITIAL_ITEMS.reduce((total, item) => total + item.price * (quantities[item.id] ?? 1), 0);
  }, [quantities]);

  const discount = subtotal * 0.1;
  const total = subtotal - discount;

  return (
    <div className={`lojinhaTheme ${styles.page}`}>
      <LojinhaHeader title="CARRINHO DE" highlightText="COMPRAS" onBack={() => navigate("/loja", { replace: true })} />

      <main className={styles.main}>
        <section className={styles.addressSection}>
          <div className={styles.addressRow}>
            <button type="button" className={styles.addressButton}>
              <span aria-hidden="true">✎</span>
              <span>Enviando para Rua algas marinhas, 180 Uberlandia - MG</span>
            </button>
            <button type="button" className={styles.deadlineButton}>
              Ver prazos
            </button>
          </div>
        </section>

        <section className={styles.itemsSection}>
          {INITIAL_ITEMS.map((item) => (
            <article key={item.id} className={styles.itemCard}>
              <input type="checkbox" className={styles.itemCheck} defaultChecked />
              <div className={styles.thumbWrap}>
                <img src={item.image} alt={item.name} className={styles.thumb} />
              </div>
              <div className={styles.itemContent}>
                <div>
                  <h2 className={styles.itemTitle}>{item.name}</h2>
                  <p className={styles.itemMeta}>
                    Cor: <span className={item.accent === "highlight" ? styles.highlightText : styles.brandText}>{item.color}</span> • Tam:{" "}
                    <span className={styles.metaStrong}>{item.size}</span>
                  </p>
                </div>
                <div className={styles.itemFooter}>
                  <strong className={styles.itemPrice}>{formatCurrency(item.price)}</strong>
                  <div className={styles.qtyBox}>
                    <button
                      type="button"
                      className={styles.qtyButton}
                      aria-label={`Diminuir quantidade de ${item.name}`}
                      onClick={() =>
                        setQuantities((current) => ({
                          ...current,
                          [item.id]: Math.max((current[item.id] ?? 1) - 1, 1),
                        }))
                      }
                    >
                      -
                    </button>
                    <span className={styles.qtyValue}>{quantities[item.id] ?? 1}</span>
                    <button
                      type="button"
                      className={styles.qtyButton}
                      aria-label={`Aumentar quantidade de ${item.name}`}
                      onClick={() =>
                        setQuantities((current) => ({
                          ...current,
                          [item.id]: (current[item.id] ?? 1) + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Resumo do Pedido</h3>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Frete</span>
            <span className={styles.freeTag}>Gratis</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
            <span>Cupom de desconto</span>
            <span className={styles.discountValue}>- {formatCurrency(discount)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </section>

        <section className={styles.couponSection}>
          <label htmlFor="coupon" className={styles.couponInputWrap}>
            <span className={styles.couponIcon} aria-hidden="true">
              ⌁
            </span>
            <input id="coupon" name="coupon" type="text" placeholder="CUPOM20" className={styles.couponInput} />
          </label>
          <button type="button" className={styles.applyButton}>
            Aplicar
          </button>
        </section>
      </main>

      <footer className={styles.checkoutBar}>
        <PrimaryCtaButton>FINALIZAR COMPRA</PrimaryCtaButton>
      </footer>
    </div>
  );
}
