import styles from "./MerchFooter.module.css";

function SocialIcon({ label, text }: { label: string; text: string }) {
  return (
    <button type="button" aria-label={label} className={styles.socialButton}>
      <span aria-hidden="true">{text}</span>
    </button>
  );
}

export default function MerchFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copy}>© 2026 FORRO DO HORIZONTE. BUILT FOR RHYTHM.</p>

        <nav aria-label="Links do rodape da loja" className={styles.links}>
          <a href="#" className={styles.link}>
            Garantia
          </a>
          <a href="#" className={styles.link}>
            Entregas
          </a>
          <a href="#" className={styles.link}>
            Lojas
          </a>
          <a href="#" className={styles.link}>
            Contato
          </a>
        </nav>

        <div className={styles.social}>
          <SocialIcon label="Compartilhar loja" text="↗" />
          <SocialIcon label="Favoritar loja" text="♥" />
        </div>
      </div>
    </footer>
  );
}
