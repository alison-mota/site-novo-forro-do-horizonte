import { AnimatePresence, motion } from "framer-motion";
import { breezeEase } from "../lib/motion.js";

export default function WindOverlay({ transitionKey, direction = 1 }) {
  const startX = direction >= 0 ? "-30%" : "30%";
  const middleX = direction >= 0 ? "8%" : "-8%";
  const endX = direction >= 0 ? "30%" : "-30%";

  return (
    <div className="wind-overlay" aria-hidden="true">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={transitionKey}
          className="wind-overlay__gust"
          initial={{ opacity: 0, x: startX }}
          animate={{
            opacity: [0, 0.16, 0],
            x: [startX, middleX, endX],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.78, ease: breezeEase }}
        />
      </AnimatePresence>
    </div>
  );
}
