import type { CSSProperties } from "react";
import type { Product } from "../../data/products";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

function getTagClass(tag: Product["tag"]) {
  if (tag === "Promoção") return styles.tagPromo;
  if (tag === "Único Lote") return styles.tagUnico;
  if (tag === "Novo") return styles.tagNovo;
  return "";
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.photo} style={{ "--photo-bg": product.swatchBg } as CSSProperties}>
        <span className={styles.photoIcon} aria-hidden="true">
          ◉
        </span>
        {product.tag ? <span className={`${styles.tag} ${getTagClass(product.tag)}`}>{product.tag}</span> : null}
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.price}>{product.price}</p>
        <button type="button" className={styles.addButton} onClick={() => onAddToCart(product)}>
          <span>Adicionar ao carrinho</span>
        </button>
      </div>
    </article>
  );
}
