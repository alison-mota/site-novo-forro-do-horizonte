import styles from "./CartFab.module.css";

type CartFabProps = {
  count: number;
  showScrollTop: boolean;
  onBackToTop: () => void;
  onOpenCart: () => void;
};

export default function CartFab({ count, showScrollTop, onBackToTop, onOpenCart }: CartFabProps) {
  return (
    <>
      <button
        type="button"
        className={`${styles.cartFab} ${showScrollTop ? styles.raised : ""}`}
        aria-label="Carrinho"
        onClick={onOpenCart}
      >
        <span className={styles.icon} aria-hidden="true">
          🛒
        </span>
        <span className={styles.badge}>{count}</span>
      </button>
      <button
        type="button"
        className={`${styles.topFab} ${showScrollTop ? styles.topFabVisible : ""}`}
        onClick={onBackToTop}
        aria-label="Voltar ao topo"
      >
        ↑
      </button>
    </>
  );
}
