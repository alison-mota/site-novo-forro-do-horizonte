import { Link } from "react-router-dom";
import styles from "./ActionButtons.module.css";

export default function ActionButtons() {
  return (
    <div className={styles.actions}>
      <Link className={`${styles.actionBtn} ${styles.actionBtnGradient}`} to="/loja">
        <span>COMPRAR CAMISETAS</span>
        <span aria-hidden="true">→</span>
      </Link>
      <Link className={styles.actionBtn} to="/">
        <span>SITE DA BANDA</span>
        <span aria-hidden="true">←</span>
      </Link>
    </div>
  );
}
