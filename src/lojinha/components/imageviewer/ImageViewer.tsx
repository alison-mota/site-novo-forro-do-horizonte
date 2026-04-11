import styles from "./ImageViewer.module.css";

type ImageViewerProps = {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
};

export default function ImageViewer({ isOpen, src, alt, onClose }: ImageViewerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.viewer} onClick={onClose} aria-hidden="true">
      <div className={styles.content} onClick={(event) => event.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar visualização">
          <span aria-hidden="true">×</span>
        </button>
        <img className={styles.image} src={src} alt={alt} />
      </div>
    </div>
  );
}
