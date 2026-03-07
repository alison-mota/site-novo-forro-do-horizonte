import { cloneElement, isValidElement } from "react";
import { motion } from "framer-motion";
import { getSceneMotion } from "../lib/motion.js";

export default function PageScene({ children, routeId, direction = 1 }) {
  const content = isValidElement(children) ? cloneElement(children, { direction }) : children;
  const sceneMotion = getSceneMotion(direction);

  return (
    <motion.div
      className={`route-scene route-scene--${routeId}`}
      data-route-scene={routeId}
      initial={sceneMotion.initial}
      animate={sceneMotion.animate}
      exit={sceneMotion.exit}
    >
      {content}
    </motion.div>
  );
}
