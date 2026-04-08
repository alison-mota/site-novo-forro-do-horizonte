import { motion } from "framer-motion";
import { EditorialFooter } from "../components/layout/index.js";
import { HomeHero } from "../components/sections/index.js";
import { getGroupMotion } from "../lib/motion.js";

export default function HomePage({ direction = 1 }) {
  const footerMotion = getGroupMotion("meta", direction);

  return (
    <>
      <HomeHero direction={direction} />
      <motion.div className="home-editorial-footer-layer" {...footerMotion}>
        <EditorialFooter />
      </motion.div>
    </>
  );
}
