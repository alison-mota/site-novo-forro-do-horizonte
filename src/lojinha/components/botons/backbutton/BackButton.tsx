import styles from "./BackButton.module.css";

type BackButtonProps = {
  onClick: () => void;
  label?: string;
};

export default function BackButton({ onClick, label = "voltar" }: BackButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick} aria-label="Voltar">
      <span className={styles.icon} aria-hidden="true">
        ←
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
