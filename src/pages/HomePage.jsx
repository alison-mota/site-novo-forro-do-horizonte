import { motion } from "framer-motion";
import EditorialFooter from "../components/EditorialFooter.jsx";
import HomeHero from "../components/HomeHero.jsx";
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
