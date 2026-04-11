import { useEffect, useMemo, useState } from "react";
import CartFab from "../components/CartFab/CartFab";
import CategoryBar from "../components/CategoryBar/CategoryBar";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import ProductModal from "../components/ProductModal/ProductModal";
import { PRODUCTS, type Product } from "../data/products";
import "../styles/lojinha.css";
import styles from "./LojaPage.module.css";

const ALL_CATEGORY = "Todas";

export default function LojaPage() {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [showCompactCategoryBar, setShowCompactCategoryBar] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const categories = useMemo(() => {
    const unique = new Set(PRODUCTS.map((product) => product.category));
    return [ALL_CATEGORY, ...Array.from(unique)];
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const onScroll = () => {
      setShowCompactCategoryBar(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={`lojinhaTheme ${styles.page} ${showCompactCategoryBar ? styles.scrolled : ""}`}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.assign(`${import.meta.env.BASE_URL}`);
              }
            }}
            aria-label="Voltar"
          >
            ←
          </button>
          <span className={styles.headerTitle}>
            LOJINHA DO <span className={styles.highlight}>HORIZONTE</span>
          </span>
          <span className={styles.headerSpacer} aria-hidden="true" />
        </div>
      </header>

      <main className={styles.main}>
        <CategoryBar
          categories={categories}
          activeCategory={activeCategory}
          compact={showCompactCategoryBar}
          onSelectCategory={setActiveCategory}
        />
        <ProductGrid
          products={filteredProducts}
          onAddToCart={(product) => {
            setSelectedProduct(product);
            setIsModalOpen(true);
          }}
        />
      </main>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setCartCount((count) => count + 1)}
      />

      <CartFab count={cartCount} showScrollTop={showCompactCategoryBar} onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
    </div>
  );
}
