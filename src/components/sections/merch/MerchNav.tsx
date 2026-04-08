import { useEffect, useState } from "react";
import styles from "./MerchNav.module.css";

const links = ["Colecoes", "Custom", "Materiais", "Sustentabilidade"];

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

export default function MerchNav() {
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
        <a href="/loja" className={styles.logo}>
          Forro do Horizonte
        </a>

        <ul className={styles.links} aria-label="Navegacao da loja">
          {links.map((link, index) => (
            <li key={link}>
              <a
                href="#"
                className={`${styles.navLink} ${
                  index === 1 ? styles.navLinkActive : ""
                }`}
              >
                {link}
              </a>
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
