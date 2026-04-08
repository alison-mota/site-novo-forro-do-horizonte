import { useState } from "react";
import styles from "./MerchFaq.module.css";

const faqItems = [
  {
    id: "size-guide",
    question: "Como escolher o tamanho ideal?",
    answer:
      "Consulte a tabela de medidas no checkout e compare com uma camiseta sua. Se ficar entre dois tamanhos, escolha o maior para caimento solto.",
  },
  {
    id: "delivery-time",
    question: "Qual o prazo de entrega?",
    answer:
      "O envio ocorre em ate 3 dias uteis apos confirmacao do pagamento. O prazo total varia conforme o CEP e aparece no carrinho.",
  },
  {
    id: "band-support",
    question: "Como o dinheiro ajuda a banda?",
    answer:
      "Todo lucro liquido vai para o fundo de producao do album, cobrindo estudio, mixagem, masterizacao e equipe de apoio.",
  },
  {
    id: "exchange-policy",
    question: "Politica de trocas",
    answer:
      "Voce pode solicitar troca em ate 7 dias corridos apos o recebimento. A peca deve estar sem uso e com etiqueta original.",
  },
];

export default function MerchFaq() {
  const [openId, setOpenId] = useState("band-support");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Duvidas frequentes</h2>

        <div className={styles.list}>
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const triggerId = `faq-trigger-${item.id}`;

            return (
              <article key={item.id} className={styles.item}>
                <button
                  id={triggerId}
                  type="button"
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? "" : item.id)}
                >
                  <span>{item.question}</span>
                  <span className={styles.symbol} aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    className={styles.panel}
                    role="region"
                    aria-labelledby={triggerId}
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
