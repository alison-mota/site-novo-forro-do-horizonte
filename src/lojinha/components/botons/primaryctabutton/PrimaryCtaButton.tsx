import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./PrimaryCtaButton.module.css";

type PrimaryCtaButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  children: ReactNode;
};

export default function PrimaryCtaButton({ children, type = "button", ...props }: PrimaryCtaButtonProps) {
  return (
    <button type={type} className={styles.button} {...props}>
      {children}
    </button>
  );
}
