import styles from "./CategoryBar.module.css";

type CategoryBarProps = {
  categories: string[];
  activeCategory: string;
  compact: boolean;
  onSelectCategory: (category: string) => void;
};

export default function CategoryBar({
  categories,
  activeCategory,
  compact,
  onSelectCategory,
}: CategoryBarProps) {
  return (
    <section className={`${styles.categories} ${compact ? styles.compact : ""}`}>
      <div className={styles.track}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`${styles.item} ${activeCategory === category ? styles.active : ""}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}
