import { motion } from "framer-motion";
import { getGroupMotion } from "../lib/motion.js";
import Button from "./Button.jsx";

export default function HomeHero({ direction = 1 }) {
  const mediaMotion = getGroupMotion("media", direction);
  const fillMotion = getGroupMotion("headline-fill", direction);
  const outlineMotion = getGroupMotion("headline-outline", direction);
  const subcopyMotion = getGroupMotion("subcopy", direction);
  const ctaMotion = getGroupMotion("cta", direction);

  return (
    <>
      {/* TODO: Dynamic Circle Behavior
          O círculo irá ter um comportamento dinâmico, que irá verificar a hora local.
          - Se for de dia (entre 06:00 e 18:00): o posicionamento ficará mais baixo.
          - Se for noite (entre 18:00 e 00:00): alterar para uma "Lua".
          - Se for madrugada (restante): posicionar bem mais abaixo, como sol nascente. */}
      <div className="hero-transition-content">
        <motion.div className="band-photo-container" {...mediaMotion}>
          <img src={`${import.meta.env.BASE_URL}images/general/band.png`} alt="Forró do Horizonte" className="band-photo" />
          <div className="band-photo-overlay"></div>
        </motion.div>

        <div className="hero-copy-plate"></div>

        <div className="hero-content">
          <div className="hero-title-wrapper">
            <svg className="hero-title-filter-defs" aria-hidden="true" focusable="false" width="0" height="0">
              <defs>
                <filter id="hero-outline-filter" x="-10%" y="-10%" width="120%" height="120%">
                  <feMorphology in="SourceAlpha" operator="dilate" radius="2.5" result="dilated"></feMorphology>
                  <feComposite in="dilated" in2="SourceAlpha" operator="out" result="outlineRing"></feComposite>
                  <feFlood floodColor="#ffffff" floodOpacity="0.9" result="outlineColor"></feFlood>
                  <feComposite in="outlineColor" in2="outlineRing" operator="in" result="coloredOutline"></feComposite>
                </filter>
              </defs>
            </svg>

            <motion.h1 className="hero-title" {...fillMotion}>
              <span className="hero-title__line">FORRÓ DO</span>
              <span className="hero-title__line">HORIZONTE</span>
            </motion.h1>

            <motion.div className="hero-title-outline" aria-hidden="true" {...outlineMotion}>
              <span className="hero-title-outline__line">FORRÓ DO</span>
              <span className="hero-title-outline__line">HORIZONTE</span>
            </motion.div>
          </div>

          <motion.p className="hero-subtitle" {...subcopyMotion}>
          </motion.p>

          <motion.div className="hero-buttons" {...ctaMotion}>
            <Button label="Ver fotos dos eventos" to="/galeria" variant="primary" />
            <Button label="Contratar Show" to="/contato" variant="secondary" />
          </motion.div>
        </div>
      </div>
    </>
  );
}
