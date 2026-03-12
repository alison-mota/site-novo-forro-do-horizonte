import { useRef } from "react";
import { motion } from "framer-motion";
import { getGroupMotion } from "../lib/motion.js";
import Button from "../components/Button.jsx";
import FitTextLine from "../components/FitTextLine.jsx";

export default function BiografiaPage({ direction = 1 }) {
  const contentMotion = getGroupMotion("content", direction);
  const scrollContainerRef = useRef(null);

  // Estrutura de linhas editoriais
  const influenceLines = [
    "LUIZ GONZAGA",
    "DOMINGUINHOS",
    "FLÁVIO JOSÉ",
    "MARINÊS • SIVUCA",
    "GILBERTO GIL",
    "TRIO NORDESTINO",
    "OS 3 DO NORDESTE"
  ];

  return (
    <div ref={scrollContainerRef} className="content-scroll page-content">
      <div className="bio-container">
        {/* 1. HERO EDITORIAL */}
        <section className="bio-hero">
          <div className="bio-hero__header">
            <motion.div 
              className="bio-hero__meta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span>HZNTE / BRAZIL</span>
              <span className="bio-hero__meta-divider">—</span>
              <span>EST. 2024</span>
            </motion.div>
            
            <svg className="hero-title-filter-defs" aria-hidden="true" focusable="false" width="0" height="0">
              <defs>
                <filter id="bio-hero-outline-filter" x="-10%" y="-10%" width="120%" height="120%">
                  <feMorphology in="SourceAlpha" operator="dilate" radius="2.5" result="dilated"></feMorphology>
                  <feComposite in="dilated" in2="SourceAlpha" operator="out" result="outlineRing"></feComposite>
                  <feFlood floodColor="#ffffff" floodOpacity="0.9" result="outlineColor"></feFlood>
                  <feComposite in="outlineColor" in2="outlineRing" operator="in" result="coloredOutline"></feComposite>
                </filter>
              </defs>
            </svg>

            <div className="bio-hero__title-wrapper">
              <motion.h1 
                className="bio-hero__title"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
              >
                <span className="d-block">FORRÓ DO</span>
                <span className="d-block text-indent">HORIZONTE</span>
              </motion.h1>

              <motion.div 
                className="bio-hero__title-outline" 
                aria-hidden="true"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
              >
                <span className="d-block">FORRÓ DO</span>
                <span className="d-block text-indent">HORIZONTE</span>
              </motion.div>
            </div>
          </div>

          <motion.div 
            className="bio-hero__image-wrapper"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 1.2, ease: "easeOut" }}
          >
            <img 
              src={`${import.meta.env.BASE_URL}images/general/band-2.png`} 
              alt="Banda Forró do Horizonte" 
              className="bio-hero__image" 
            />
            <div className="bio-hero__overlay"></div>
          </motion.div>
        </section>

        {/* 2. HISTÓRIA */}
        <section className="bio-section bio-history">
          <div className="bio-grid">
            <div className="bio-grid__col bio-grid__col--empty">
              <span className="bio-label">A JORNADA</span>
            </div>
            <div className="bio-grid__col bio-grid__col--text">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8 }}
              >
                <p>
                  A banda FORRÓ DO HORIZONTE é uma banda de forró pé de serra autoral que traz referências goianas, mineiras e da cultura nordestina. 
                </p>
                <p>
                  A banda procura sempre trabalhar em seus shows ao vivo suas músicas autorais, além de interpretar músicas de outros artistas do gênero.
                </p>
                <p>
                  Uma das principais preocupações da banda é com seu público dançante, tanto em relação ao espaço dos locais dos shows quanto à escolha e dinâmica da execução do repertório em suas apresentações.
                </p>
              </motion.div>
            </div>
            <div className="bio-grid__col bio-grid__col--highlight">
              <motion.blockquote 
                className="bio-quote"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                "O forró é encontro, calor e dança."
              </motion.blockquote>
            </div>
          </div>
        </section>

        {/* 3. INFLUÊNCIAS */}
        <section className="bio-section bio-influences">
          <div className="bio-section__header">
            <h2 className="bio-section__title">INFLUÊNCIAS</h2>
            <div className="bio-line"></div>
          </div>
          
          <div className="bio-influences__list">
            {influenceLines.map((line, index) => (
              <FitTextLine 
                key={line} 
                text={line} 
                scrollContainerRef={scrollContainerRef}
                minSize={24}
                maxSize={300}
              />
            ))}
          </div>
        </section>

        {/* 4. INTEGRANTES */}
        <section className="bio-section bio-members">
          <div className="bio-section__header">
            <h2 className="bio-section__title">A BANDA</h2>
            <div className="bio-line"></div>
          </div>

          <div className="bio-members__grid">
            {[
              { name: "HONORATO", role: "Triângulo • Voz" },
              { name: "ALISON ALVES", role: "Zabumba • Voz" },
              { name: "THALES ANILSON", role: "Sanfona • Voz" }
            ].map((member, index) => (
              <motion.div 
                key={member.name}
                className="bio-member"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              >
                <div className="bio-member__line"></div>
                <h3 className="bio-member__name">{member.name}</h3>
                <p className="bio-member__role">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. CONVITE */}
        <section className="bio-cta">
          <motion.div 
            className="bio-cta__content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="bio-cta__text">
              O forró do horizonte nasce no palco,<br />
              mas acontece de verdade no salão.
            </p>
            <div className="bio-cta__action">
              <div className="bio-cta__shimmer-btn">
                <Button label="Contratar Show" to="/contato" variant="primary" size="md" />
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
