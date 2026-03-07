import { motion } from "framer-motion";
import { breezeEase } from "../lib/motion.js";
import { getSunRouteConfig } from "../lib/sun.js";
import SunBackdrop from "./SunBackdrop.jsx";

export default function SunLayer({ routeId }) {
  const sunConfig = getSunRouteConfig(routeId);

  return (
    <div className="sun-layer-stack">
      <motion.div
        className="sun-layer-scene"
        initial={false}
        animate={{ y: sunConfig.y }}
        transition={{
          duration: 0.8,
          ease: breezeEase,
        }}
      >
        <SunBackdrop
          style={{
            "--sun-base-y": "0px",
            opacity: sunConfig.opacity,
          }}
        />
      </motion.div>
    </div>
  );
}
