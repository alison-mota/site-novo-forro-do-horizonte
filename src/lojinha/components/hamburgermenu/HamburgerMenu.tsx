import styles from "./HamburgerMenu.module.css";

export default function HamburgerMenu() {
  return (
    <button type="button" className={styles.hamburger} aria-label="Abrir menu">
      <span aria-hidden="true">☰</span>
    </button>
  );
}
