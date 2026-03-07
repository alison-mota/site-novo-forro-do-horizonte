import { motion } from "framer-motion";
import Button from "../components/Button.jsx";
import ContactInfoBlock from "../components/ContactInfoBlock.jsx";
import FormField from "../components/FormField.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { getGroupMotion } from "../lib/motion.js";

const formFields = [
  { id: "name", label: "Nome", type: "text", placeholder: "Seu nome" },
  { id: "email", label: "Email", type: "email", placeholder: "seu@email.com" },
  {
    id: "subject",
    label: "Assunto",
    type: "select",
    options: ["Contratar Show", "Imprensa", "Parceria", "Outro"],
  },
  {
    id: "message",
    label: "Mensagem",
    type: "textarea",
    rows: 4,
    placeholder: "Detalhes do evento, data, local...",
  },
];

export default function ContatoPage({ direction = 1 }) {
  const headlineMotion = getGroupMotion("headline", direction);
  const contentMotion = getGroupMotion("content", direction);
  const metaMotion = getGroupMotion("meta", direction);

  return (
    <div className="content-scroll page-content page-content--centered">
      <motion.div {...headlineMotion}>
        <SectionHeading>CONTRATAR SHOW</SectionHeading>
      </motion.div>

      <motion.form className="contact-form" onSubmit={(event) => event.preventDefault()} {...contentMotion}>
        <div className="contact-form__grid">
          <FormField field={formFields[0]} />
          <FormField field={formFields[1]} />
        </div>
        <FormField field={formFields[2]} />
        <FormField field={formFields[3]} />
        <Button label="Enviar Mensagem" variant="dark" type="submit" fullWidth />
      </motion.form>

      <motion.div {...metaMotion}>
        <ContactInfoBlock />
      </motion.div>
    </div>
  );
}
