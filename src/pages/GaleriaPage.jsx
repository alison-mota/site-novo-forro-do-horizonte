import { motion } from "framer-motion";
import GalleryCard from "../components/GalleryCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { galeriaData } from "../data/galeria.js";
import { getGroupMotion } from "../lib/motion.js";

export default function GaleriaPage({ direction = 1 }) {
  const headlineMotion = getGroupMotion("headline", direction);
  const contentMotion = getGroupMotion("content", direction);

  return (
    <div className="content-scroll page-content">
      <motion.div {...headlineMotion}>
        <SectionHeading>FOTOS</SectionHeading>
      </motion.div>

      <motion.div className="gallery-grid" {...contentMotion}>
        {galeriaData.map((item) => (
          <GalleryCard key={`${item.label}-${item.alt}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}
