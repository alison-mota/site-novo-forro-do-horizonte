import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartFab from "../components/cartfab/CartFab";
import CategoryBar from "../components/categorybar/CategoryBar";
import LojinhaHeader from "../components/header/LojinhaHeader";
import ProductGrid from "../components/productgrid/ProductGrid";
import ProductModal from "../components/productmodal/ProductModal";
import { PRODUCTS, type Product } from "../data/products";
import "../styles/lojinha.css";
import styles from "../styles/LojaPage.module.css";

const ALL_CATEGORY = "Todas";

export default function LojaPage() {
  const navigate = useNavigate();
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
    <div className={`lojinhaTheme ${styles.page}`}>
      <LojinhaHeader
        title="LOJINHA DO"
        highlightText="HORIZONTE"
        onBack={() => navigate("/loja/landing", { replace: true })}
        scrolled={showCompactCategoryBar}
      />

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

      <CartFab
        count={cartCount}
        showScrollTop={showCompactCategoryBar}
        onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onOpenCart={() => navigate("/loja/carrinho")}
      />
    </div>
  );
}
