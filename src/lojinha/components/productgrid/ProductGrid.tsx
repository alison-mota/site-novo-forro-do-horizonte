import type { Product } from "../../data/products";
import ProductCard from "../productcard/ProductCard";
import styles from "./ProductGrid.module.css";

type ProductGridProps = {
  products: Product[];
  onAddToCart: (product: Product) => void;
};

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <section className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </section>
  );
}
