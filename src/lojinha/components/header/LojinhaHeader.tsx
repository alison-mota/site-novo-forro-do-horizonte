import BackButton from "../botons/backbutton/BackButton";
import styles from "./LojinhaHeader.module.css";

type LojinhaHeaderProps = {
  title: string;
  highlightText?: string;
  fallbackPath?: string;
  onBack?: () => void;
  scrolled?: boolean;
};

export default function LojinhaHeader({
  title,
  highlightText,
  fallbackPath = "/loja",
  onBack,
  scrolled = false,
}: LojinhaHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    const normalizedPath = fallbackPath.startsWith("/") ? fallbackPath.slice(1) : fallbackPath;
    window.location.replace(`${import.meta.env.BASE_URL}${normalizedPath}`);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <div className={styles.inner}>
        <BackButton onClick={handleBack} />
        <h1 className={styles.title}>
          {title} {highlightText ? <span className={styles.highlight}>{highlightText}</span> : null}
        </h1>
      </div>
    </header>
  );
}
