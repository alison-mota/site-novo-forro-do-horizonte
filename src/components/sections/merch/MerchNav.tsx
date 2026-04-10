import { useEffect, useState } from "react";
// @ts-ignore
import styles from "./MerchNav.module.css";

export const MERCH_CATEGORIES = ["camisetas", "pochetes", "leques", "toalhas"] as const;

export type MerchCategory = (typeof MERCH_CATEGORIES)[number];

const menuItems: Array<{ id: MerchCategory; label: string }> = [
  { id: "camisetas", label: "CAMISETAS" },
  { id: "pochetes", label: "POCHETES" },
  { id: "leques", label: "LEQUES" },
  { id: "toalhas", label: "TOALHAS" },
];

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
      <path d="M7 18a2 2 0 1 0 0 4a2 2 0 0 0 0-4M17 18a2 2 0 1 0 0 4a2 2 0 0 0 0-4M3 3h3l2.4 10.2a2 2 0 0 0 1.95 1.55h7.9a2 2 0 0 0 1.94-1.5L22 6H7.1" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
      <path d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4M4 20a8 8 0 1 1 16 0" />
    </svg>
  );
}

type MerchNavProps = {
  activeCategory: MerchCategory;
  onSelectCategory: (category: MerchCategory) => void;
};

export default function MerchNav({ activeCategory, onSelectCategory }: MerchNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Loja de Merch"
      className={`${styles.nav} ${isScrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoWarm}>FORRÓ DO</span>{" "}
          <span className={styles.logoCool}>HORIZONTE</span>
        </a>

        <ul className={styles.links} aria-label="Navegacao da loja">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.navLink} ${styles.navButton} ${
                  activeCategory === item.id ? styles.navLinkActive : ""
                }`}
                onClick={() => onSelectCategory(item.id)}
                aria-current={activeCategory === item.id ? "page" : undefined}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button type="button" className={styles.iconButton} aria-label="Abrir carrinho">
            <CartIcon />
          </button>
          <button type="button" className={styles.iconButton} aria-label="Abrir perfil">
            <ProfileIcon />
          </button>
        </div>
      </div>
    </nav>
  );
}
