import { useMemo, useState, type CSSProperties } from "react";
import type { Product } from "../../data/products";
import ImageViewer from "../imageviewer/ImageViewer";
import PrimaryCtaButton from "../botons/primaryctabutton/PrimaryCtaButton";
import styles from "./ProductModal.module.css";

type ProductModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const SIZES = ["P", "M", "G", "GG", "XG"];
const COLORS = [
  { id: "brand", label: "Cor laranja", swatch: "#e55341" },
  { id: "dark", label: "Cor preta", swatch: "#1c1917" },
  { id: "mid", label: "Cor cinza", swatch: "#a8a29e" },
  { id: "light", label: "Cor bege", swatch: "#e7e5e4" },
];

export default function ProductModal({ product, isOpen, onClose, onConfirm }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("brand");
  const [viewerSrc, setViewerSrc] = useState("");

  const gallery = useMemo(() => {
    if (!product) return [];
    return product.images.length ? product.images : ["https://placehold.co/600x750"];
  }, [product]);

  if (!isOpen || !product) {
    return null;
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true">
        <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
          <div className={styles.handle} />
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar modal">
            ×
          </button>
          <div className={styles.content}>
            <div className={styles.gallery}>
              {gallery.map((image) => (
                <button
                  key={image}
                  type="button"
                  className={styles.slide}
                  onClick={() => setViewerSrc(image)}
                  aria-label="Abrir imagem ampliada"
                >
                  <img src={image} alt={product.name} />
                </button>
              ))}
            </div>

            <div className={styles.body}>
              <h2 className={styles.title}>{product.name}</h2>
              <p className={styles.price}>{product.price}</p>
              <section>
                <h3 className={styles.label}>Sobre o produto</h3>
                <p className={styles.description}>{product.description}</p>
              </section>
              <section>
                <h3 className={styles.label}>Cor</h3>
                <div className={styles.colorList}>
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      className={`${styles.colorItem} ${selectedColor === color.id ? styles.colorSelected : ""}`}
                      style={{ "--swatch-color": color.swatch } as CSSProperties}
                      onClick={() => setSelectedColor(color.id)}
                      aria-label={color.label}
                    />
                  ))}
                </div>
              </section>
              <section>
                <h3 className={styles.label}>Tamanho</h3>
                <div className={styles.sizeList}>
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`${styles.sizeItem} ${selectedSize === size ? styles.sizeSelected : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
          <div className={styles.ctaWrap}>
            <PrimaryCtaButton
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              ADICIONAR AO CARRINHO
            </PrimaryCtaButton>
          </div>
        </div>
      </div>
      <ImageViewer isOpen={Boolean(viewerSrc)} src={viewerSrc} alt={product.name} onClose={() => setViewerSrc("")} />
    </>
  );
}
