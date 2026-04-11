import styles from "./CartFab.module.css";

type CartFabProps = {
  count: number;
  showScrollTop: boolean;
  onBackToTop: () => void;
};

export default function CartFab({ count, showScrollTop, onBackToTop }: CartFabProps) {
  return (
    <>
      <button type="button" className={`${styles.cartFab} ${showScrollTop ? styles.raised : ""}`} aria-label="Carrinho">
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
