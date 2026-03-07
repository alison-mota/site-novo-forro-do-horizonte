import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import SectionHeading from "../components/SectionHeading.jsx";
import { getGroupMotion } from "../lib/motion.js";

const WHATSAPP_NUMBER = "5534999023439";
const CONTACT_CHAT_STORAGE_KEY = "forro-do-horizonte-contact-chat";
const BOT_REPLY_DELAY_MS = 700;
const CONTACT_CHAT_TTL_MS = 15 * 60 * 1000;

const questions = [
  {
    key: "name",
    text: "Olá! Quer contratar a gente para um show? Fala pra gente o seu nome.",
    placeholder: "Seu nome",
  },
  {
    key: "phone",
    text: "E o seu número de telefone com DDD?",
    placeholder: "Seu telefone",
  },
  {
    key: "city",
    text: "Qual a cidade do show?",
    placeholder: "Cidade do show",
  },
  {
    key: "details",
    text: "E deixe uma mensagem com mais detalhes, por favor!",
    placeholder: "Detalhes do evento, data, local...",
  },
];

const defaultAnswers = {
  name: "",
  phone: "",
  city: "",
  details: "",
};

const defaultMessages = [
  {
    id: `${questions[0].key}-bot`,
    sender: "bot",
    text: questions[0].text,
  },
];

function createDefaultChatState() {
  return {
    currentQuestionIndex: 0,
    inputValue: "",
    answers: { ...defaultAnswers },
    messages: [...defaultMessages],
    pendingBotQuestionIndex: null,
    lastUpdatedAt: null,
  };
}

function isEmptyChatState({ currentQuestionIndex, inputValue, answers, messages, pendingBotQuestionIndex }) {
  return (
    currentQuestionIndex === 0 &&
    !inputValue &&
    !answers.name &&
    !answers.phone &&
    !answers.city &&
    !answers.details &&
    pendingBotQuestionIndex == null &&
    messages.length === defaultMessages.length &&
    messages[0]?.id === defaultMessages[0].id
  );
}

function getInitialChatState() {
  const defaultState = createDefaultChatState();

  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const storedState = window.localStorage.getItem(CONTACT_CHAT_STORAGE_KEY);
    if (!storedState) {
      return defaultState;
    }

    const parsedState = JSON.parse(storedState);
    const lastUpdatedAt = typeof parsedState.lastUpdatedAt === "number" ? parsedState.lastUpdatedAt : null;

    if (!lastUpdatedAt || Date.now() - lastUpdatedAt >= CONTACT_CHAT_TTL_MS) {
      window.localStorage.removeItem(CONTACT_CHAT_STORAGE_KEY);
      return defaultState;
    }

    const hasPendingBotQuestion =
      typeof parsedState.pendingBotQuestionIndex === "number" &&
      parsedState.pendingBotQuestionIndex >= 0 &&
      parsedState.pendingBotQuestionIndex < questions.length;
    const pendingQuestion = hasPendingBotQuestion ? questions[parsedState.pendingBotQuestionIndex] : null;
    const restoredMessages =
      Array.isArray(parsedState.messages) && parsedState.messages.length ? parsedState.messages : defaultMessages;
    const hasPendingMessage =
      pendingQuestion && restoredMessages.some((message) => message.id === `${pendingQuestion.key}-bot`);

    return {
      currentQuestionIndex: hasPendingBotQuestion
        ? parsedState.pendingBotQuestionIndex
        : typeof parsedState.currentQuestionIndex === "number"
          ? parsedState.currentQuestionIndex
          : 0,
      inputValue: typeof parsedState.inputValue === "string" ? parsedState.inputValue : "",
      answers: {
        ...defaultAnswers,
        ...(parsedState.answers || {}),
      },
      messages:
        pendingQuestion && !hasPendingMessage
          ? [
              ...restoredMessages,
              {
                id: `${pendingQuestion.key}-bot`,
                sender: "bot",
                text: pendingQuestion.text,
              },
            ]
          : restoredMessages,
      pendingBotQuestionIndex: null,
      lastUpdatedAt,
    };
  } catch {
    return defaultState;
  }
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function isValidBrazilianMobilePhone(value) {
  const normalized = normalizePhone(value);
  const digits = normalized.startsWith("55") && normalized.length === 13 ? normalized.slice(2) : normalized;

  return /^[1-9]{2}9\d{8}$/.test(digits);
}

function buildWhatsappMessage(answers) {
  return `*Nome*\n${answers.name}\n\n*Telefone*\n${answers.phone}\n\n*Cidade do show*\n${answers.city}\n\n*Detalhes do evento*\n${answers.details}`;
}

function buildWhatsappLink(answers) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsappMessage(answers))}`;
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="contact-chat__whatsapp-icon">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.66 15l-1.14 4.17 4.28-1.12A10 10 0 1 0 12 2Zm5.77 14.26c-.24.67-1.39 1.28-1.92 1.34-.49.05-1.12.08-1.81-.15-.42-.14-.97-.31-1.68-.62-2.95-1.27-4.87-4.38-5.02-4.59-.15-.2-1.2-1.6-1.2-3.06s.77-2.17 1.05-2.46c.28-.3.61-.37.82-.37.2 0 .41 0 .58.01.19.01.45-.07.7.53.24.58.82 2 .89 2.14.07.14.11.31.02.51-.09.2-.13.32-.26.49-.13.17-.27.38-.38.5-.13.13-.27.28-.12.55.15.27.69 1.13 1.48 1.83 1.02.91 1.89 1.2 2.16 1.34.27.14.43.12.59-.07.16-.2.67-.78.84-1.05.18-.27.36-.22.61-.13.26.09 1.63.77 1.91.91.28.14.47.21.54.32.07.1.07.6-.17 1.27Z"
      />
    </svg>
  );
}

export default function ContatoPage({ direction = 1 }) {
  const initialState = useMemo(() => getInitialChatState(), []);
  const headlineMotion = getGroupMotion("headline", direction);
  const contentMotion = getGroupMotion("content", direction);
  const metaMotion = getGroupMotion("meta", direction);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const cacheExpiryTimeoutRef = useRef(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialState.currentQuestionIndex);
  const [inputValue, setInputValue] = useState(initialState.inputValue);
  const [answers, setAnswers] = useState(initialState.answers);
  const [messages, setMessages] = useState(initialState.messages);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [inputError, setInputError] = useState("");
  const [pendingBotQuestionIndex, setPendingBotQuestionIndex] = useState(initialState.pendingBotQuestionIndex);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState(initialState.answers);
  const [reviewError, setReviewError] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(initialState.lastUpdatedAt);

  const readyToSendWhatsapp = currentQuestionIndex >= questions.length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const showWhatsappAction = isLastQuestion || readyToSendWhatsapp;

  const currentPlaceholder = useMemo(() => {
    if (readyToSendWhatsapp) {
      return "Tudo pronto para abrir o WhatsApp";
    }

    return questions[currentQuestionIndex]?.placeholder || "";
  }, [currentQuestionIndex, readyToSendWhatsapp]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, readyToSendWhatsapp, isBotTyping, isReviewModalOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const chatState = {
      currentQuestionIndex,
      inputValue,
      answers,
      messages,
      pendingBotQuestionIndex,
      lastUpdatedAt,
    };

    if (isEmptyChatState(chatState)) {
      window.localStorage.removeItem(CONTACT_CHAT_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(CONTACT_CHAT_STORAGE_KEY, JSON.stringify(chatState));
  }, [answers, currentQuestionIndex, inputValue, lastUpdatedAt, messages, pendingBotQuestionIndex]);

  useEffect(
    () => () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      if (cacheExpiryTimeoutRef.current) {
        window.clearTimeout(cacheExpiryTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const chatState = {
      currentQuestionIndex,
      inputValue,
      answers,
      messages,
      pendingBotQuestionIndex,
    };

    if (cacheExpiryTimeoutRef.current) {
      window.clearTimeout(cacheExpiryTimeoutRef.current);
    }

    if (isEmptyChatState(chatState) || !lastUpdatedAt) {
      return;
    }

    const remainingTime = CONTACT_CHAT_TTL_MS - (Date.now() - lastUpdatedAt);

    if (remainingTime <= 0) {
      clearStoredChat();
      resetChat();
      return;
    }

    cacheExpiryTimeoutRef.current = window.setTimeout(() => {
      clearStoredChat();
      resetChat();
    }, remainingTime);
  }, [answers, currentQuestionIndex, inputValue, lastUpdatedAt, messages, pendingBotQuestionIndex]);

  useEffect(() => {
    if (!textareaRef.current || !isLastQuestion || readyToSendWhatsapp) {
      return;
    }

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [inputValue, isLastQuestion, readyToSendWhatsapp]);

  useEffect(() => {
    if (isBotTyping || readyToSendWhatsapp || isReviewModalOpen) {
      return;
    }

    const activeField = isLastQuestion ? textareaRef.current : inputRef.current;
    activeField?.focus();
  }, [currentQuestionIndex, isBotTyping, isLastQuestion, readyToSendWhatsapp, isReviewModalOpen]);

  useEffect(() => {
    if (typeof document === "undefined" || !isReviewModalOpen) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isReviewModalOpen]);

  function clearStoredChat() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CONTACT_CHAT_STORAGE_KEY);
    }
  }

  function markChatActivity() {
    setLastUpdatedAt(Date.now());
  }

  function resetChat() {
    const defaultState = createDefaultChatState();
    setCurrentQuestionIndex(defaultState.currentQuestionIndex);
    setInputValue(defaultState.inputValue);
    setAnswers(defaultState.answers);
    setMessages(defaultState.messages);
    setPendingBotQuestionIndex(defaultState.pendingBotQuestionIndex);
    setIsBotTyping(false);
    setInputError("");
    setReviewAnswers(defaultState.answers);
    setReviewError("");
    setIsReviewModalOpen(false);
    setLastUpdatedAt(defaultState.lastUpdatedAt);
  }

  function openReviewModal(finalAnswers) {
    setReviewAnswers(finalAnswers);
    setReviewError("");
    setIsReviewModalOpen(true);
    markChatActivity();
  }

  function goToWhatsapp(finalAnswers) {
    window.open(buildWhatsappLink(finalAnswers), "_blank", "noopener,noreferrer");
  }

  function handleReviewFieldChange(key, value) {
    setReviewAnswers((currentAnswers) => ({
      ...currentAnswers,
      [key]: key === "phone" ? normalizePhone(value) : value,
    }));
    markChatActivity();

    if (reviewError) {
      setReviewError("");
    }
  }

  function handleReviewSubmit(event) {
    event.preventDefault();

    if (!isValidBrazilianMobilePhone(reviewAnswers.phone)) {
      setReviewError("Digite um celular válido com DDD para enviar a mensagem.");
      return;
    }

    goToWhatsapp(reviewAnswers);
    clearStoredChat();
    resetChat();
  }

  function handleSubmitMessage(event) {
    event.preventDefault();

    if (readyToSendWhatsapp) {
      openReviewModal(answers);
      return;
    }

    if (isBotTyping) {
      return;
    }

    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const nextQuestion = questions[currentQuestionIndex + 1];

    if (currentQuestion.key === "phone" && !isValidBrazilianMobilePhone(trimmedValue)) {
      setInputError("Digite um celular válido com DDD. Ex.: (34) 99902-3439");
      return;
    }

    setInputError("");
    const nextAnswers = {
      ...answers,
      [currentQuestion.key]: trimmedValue,
    };

    setMessages((currentMessages) => {
      return [
        ...currentMessages,
        {
          id: `${currentQuestion.key}-answer`,
          sender: "user",
          text: trimmedValue,
        },
      ];
    });

    setAnswers(nextAnswers);
    setInputValue("");

    if (isLastQuestion) {
      setCurrentQuestionIndex(questions.length);
      openReviewModal(nextAnswers);
      return;
    }

    setIsBotTyping(true);
    setPendingBotQuestionIndex(currentQuestionIndex + 1);
    typingTimeoutRef.current = window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${nextQuestion.key}-bot`,
          sender: "bot",
          text: nextQuestion.text,
        },
      ]);
      setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
      setPendingBotQuestionIndex(null);
      setIsBotTyping(false);
    }, BOT_REPLY_DELAY_MS);
  }

  return (
    <div className="content-scroll page-content page-content--centered">
      <motion.div {...headlineMotion}>
        <SectionHeading>CONTRATAR SHOW</SectionHeading>
      </motion.div>

      <motion.form className="contact-chat" onSubmit={handleSubmitMessage} {...contentMotion}>
        <div className="contact-chat__halo" aria-hidden="true"></div>

        <div className="contact-chat__messages" role="log" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={[
                "contact-chat__message",
                message.sender === "bot" ? "contact-chat__message--bot" : "contact-chat__message--user",
              ].join(" ")}
            >
              <div className="contact-chat__bubble">{message.text}</div>
            </div>
          ))}
          {isBotTyping ? (
            <div className="contact-chat__message contact-chat__message--bot">
              <div className="contact-chat__bubble contact-chat__bubble--typing" aria-label="Operador digitando">
                <span className="contact-chat__typing-dot"></span>
                <span className="contact-chat__typing-dot"></span>
                <span className="contact-chat__typing-dot"></span>
              </div>
            </div>
          ) : null}
          <div ref={messagesEndRef}></div>
        </div>

        <motion.div className="contact-chat__composer" {...metaMotion}>
          {isLastQuestion && !readyToSendWhatsapp ? (
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                markChatActivity();
                if (inputError) {
                  setInputError("");
                }
              }}
              placeholder={currentPlaceholder}
              className="contact-chat__input contact-chat__input--textarea"
              disabled={readyToSendWhatsapp || isBotTyping}
              rows={3}
            ></textarea>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                markChatActivity();
                if (inputError) {
                  setInputError("");
                }
              }}
              placeholder={currentPlaceholder}
              className="contact-chat__input"
              autoComplete="off"
              disabled={readyToSendWhatsapp || isBotTyping}
            />
          )}

          {inputError ? <p className="contact-chat__error">{inputError}</p> : null}

          <button
            type="submit"
            className="contact-chat__submit"
            disabled={isBotTyping || (!readyToSendWhatsapp && !inputValue.trim())}
          >
            {showWhatsappAction ? <WhatsappIcon /> : null}
            <span>{showWhatsappAction ? "Enviar mensagem no WhatsApp" : "Enviar mensagem"}</span>
          </button>
        </motion.div>
      </motion.form>

      {isReviewModalOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="contact-chat-modal" role="dialog" aria-modal="true" aria-labelledby="contact-chat-modal-title">
              <div className="contact-chat-modal__backdrop" onClick={() => setIsReviewModalOpen(false)}></div>

              <div className="contact-chat-modal__panel">
                <div className="contact-chat-modal__header">
                  <h2 id="contact-chat-modal-title" className="contact-chat-modal__title">
                    Revisar mensagem
                  </h2>
                  <button
                    type="button"
                    className="contact-chat-modal__close"
                    onClick={() => setIsReviewModalOpen(false)}
                    aria-label="Fechar revisão"
                  >
                    ×
                  </button>
                </div>

                <form className="contact-chat-modal__form" onSubmit={handleReviewSubmit}>
                  <label className="contact-chat-modal__field">
                    <span>Nome</span>
                    <input
                      type="text"
                      value={reviewAnswers.name}
                      onChange={(event) => handleReviewFieldChange("name", event.target.value)}
                      className="contact-chat-modal__input"
                    />
                  </label>

                  <label className="contact-chat-modal__field">
                    <span>Telefone</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={reviewAnswers.phone}
                      onChange={(event) => handleReviewFieldChange("phone", event.target.value)}
                      className="contact-chat-modal__input"
                    />
                  </label>

                  <label className="contact-chat-modal__field">
                    <span>Cidade do show</span>
                    <input
                      type="text"
                      value={reviewAnswers.city}
                      onChange={(event) => handleReviewFieldChange("city", event.target.value)}
                      className="contact-chat-modal__input"
                    />
                  </label>

                  <label className="contact-chat-modal__field">
                    <span>Detalhes do evento</span>
                    <textarea
                      value={reviewAnswers.details}
                      onChange={(event) => handleReviewFieldChange("details", event.target.value)}
                      className="contact-chat-modal__input contact-chat-modal__input--textarea"
                      rows={6}
                    ></textarea>
                  </label>

                  {reviewError ? <p className="contact-chat__error">{reviewError}</p> : null}

                  <button type="submit" className="contact-chat__submit">
                    <WhatsappIcon />
                    <span>Enviar</span>
                  </button>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
