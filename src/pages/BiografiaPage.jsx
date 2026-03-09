import { motion } from "framer-motion";
import { getGroupMotion } from "../lib/motion.js";

export default function BiografiaPage({ direction = 1 }) {
  const contentMotion = getGroupMotion("content", direction);
  const mediaMotion = getGroupMotion("media", direction);

  return (
    <div className="content-scroll page-content">
      <div className="bio-layout">
        <motion.div className="bio-copy" {...contentMotion}>
          <p className="bio-lead">
            A banda FORRÓ DO HORIZONTE é uma banda de forró pé de serra autoral que traz referências goianas, mineiras e da cultura nordestina. A banda procura sempre trabalhar em seus shows ao vivo suas músicas autorais, além de interpretar músicas de outros artistas do gênero, como Dominguinhos, Luiz Gonzaga, Dió de Araújo, Trio Dona Zefa, Trio Nordestino, Os 3 do Nordeste, Flávio José, Marinês, Gilberto Gil, Oswaldinho do Acordeon, Sivuca, entre outros.
          </p>
          <p className="bio-text">
            Uma das principais preocupações da banda é com seu público dançante, tanto em relação ao espaço dos locais dos shows quanto à escolha e dinâmica da execução do repertório em suas apresentações.
          </p>
          <div className="bio-members">
            <h3 className="bio-members__title">Integrantes</h3>
            <ul className="bio-members__list">
              <li>
                <strong>Honorato</strong> — Triângulo e voz principal
              </li>
              <li>
                <strong>Alison Alves</strong> — Zabumba e voz
              </li>
              <li>
                <strong>Thales Anilson</strong> — Sanfona e voz
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div className="bio-media" {...mediaMotion}>
          <div className="bio-media__frame">
            <img src={`${import.meta.env.BASE_URL}images/general/band-2.png`} alt="Banda Forró do Horizonte" className="bio-media__image" />
            <div className="bio-media__overlay"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
