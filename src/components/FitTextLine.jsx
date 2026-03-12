import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { measureTextWidth } from "../lib/text-measurement.js";

// Configuração da animação (mais suave e focada em leitura)
const ANIM_START = 0.05;
const ANIM_END = 0.42;
const X_OFFSET = 24;
const BLUR_MAX = 3;
const OPACITY_START = 0.55;

function splitTextIdeally(text) {
  // Se tiver " • ", divide por ele
  if (text.includes(" • ")) {
    const parts = text.split(" • ");
    return { left: parts[0], separator: " • ", right: parts[1] };
  }

  // Se tiver espaços, tenta dividir no meio
  if (text.includes(" ")) {
    const words = text.split(" ");
    const mid = Math.ceil(words.length / 2);
    const left = words.slice(0, mid).join(" ");
    const right = words.slice(mid).join(" ");
    return { left, separator: " ", right };
  }

  // Se for palavra única longa, divide caracteres
  if (text.length > 3) {
    const mid = Math.ceil(text.length / 2);
    return { left: text.slice(0, mid), separator: "", right: text.slice(mid) };
  }

  // Fallback
  return { left: text, separator: "", right: "" };
}

export default function FitTextLine({
  text,
  minSize = 16,
  maxSize = 200,
  scrollContainerRef,
  scaleFactor = 1
}) {
  const containerRef = useRef(null);
  const [fontSize, setFontSize] = useState(minSize);
  
  // Scroll Animation Hooks - usa o container de scroll correto (.content-scroll)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef ?? undefined,
    offset: ["start 95%", "end 45%"],
    layoutEffect: false
  });

  // Logs fixos sobre a configuração da animação (úteis para depuração)
  useEffect(() => {
    console.log("--- DEBUG INFLUENCES ANIMATION ---");
    console.log("Scroll start threshold:", ANIM_START);
    console.log("Scroll end threshold:", ANIM_END);
    console.log("TranslateX range:", X_OFFSET, "-> 0");
    console.log("Blur range:", BLUR_MAX, "-> 0");
    console.log("Opacity range:", OPACITY_START, "-> 1");
  }, []);

  // Animação mais suave e concentrada no começo do scroll da seção
  const opacity = useTransform(
    scrollYProgress,
    [0, ANIM_START, ANIM_END, 1],
    [OPACITY_START, OPACITY_START, 1, 1]
  );

  const blur = useTransform(
    scrollYProgress,
    [0, ANIM_START, ANIM_END, 1],
    [BLUR_MAX, BLUR_MAX, 0, 0]
  );
  
  // Movimento oposto: esquerda vem levemente da esquerda (-x), direita vem levemente da direita (+x)
  const xLeft = useTransform(
    scrollYProgress,
    [0, ANIM_START, ANIM_END, 1],
    [-X_OFFSET, -X_OFFSET, 0, 0]
  );

  const xRight = useTransform(
    scrollYProgress,
    [0, ANIM_START, ANIM_END, 1],
    [X_OFFSET, X_OFFSET, 0, 0]
  );
  
  // Separador (se houver) faz fade in cedo, mas discreto
  const separatorOpacity = useTransform(
    scrollYProgress,
    [0, ANIM_START, ANIM_END, 1],
    [0, 0, 1, 1]
  );

  const { left, separator, right } = splitTextIdeally(text);

  const updateSize = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const baseSize = 100;
    const fontStyle = `800 ${baseSize}px "Sora", sans-serif`;

    const measuredWidth = measureTextWidth(text, fontStyle);
    if (measuredWidth === 0) return;

    // Preencher quase toda a largura, deixando respiro nas laterais
    const targetWidth = containerWidth * 0.9;
    const calculatedSize = (targetWidth / measuredWidth) * baseSize;

    // Aplicar escala global da seção para respeitar a altura disponível
    const scaledSize = calculatedSize * scaleFactor;
    const finalSize = Math.max(minSize, Math.min(scaledSize, maxSize));

    setFontSize(finalSize);

    // Logs de tipografia da linha (focados em leitura)
    const approxRenderedWidth = (measuredWidth / baseSize) * finalSize;
    console.log(`Line: "${text}"`);
    console.log("Font-size:", finalSize.toFixed(2));
    console.log("Rendered width (approx):", approxRenderedWidth.toFixed(2));
  };

  useLayoutEffect(() => {
    updateSize();
    
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateSize);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [text, minSize, maxSize, scaleFactor]);

  return (
    <div 
      ref={containerRef}
      className="bio-fit-line"
      style={{ 
        position: "relative", // Required for useScroll target
        width: "100%", 
        lineHeight: 0.85,
        overflow: "hidden",
        fontSize: `${fontSize}px`,
        whiteSpace: "nowrap",
        textAlign: "center",
        display: "flex",
        justifyContent: "center"
      }}
    >
      {/* Bloco Esquerdo */}
      <motion.span style={{ x: xLeft, opacity, filter: blur, display: "inline-block" }}>
        {left}
      </motion.span>

      {/* Separador */}
      {separator && (
        <motion.span style={{ opacity: separatorOpacity, display: "inline-block" }}>
          {separator}
        </motion.span>
      )}

      {/* Bloco Direito */}
      {right && (
        <motion.span style={{ x: xRight, opacity, filter: blur, display: "inline-block" }}>
          {right}
        </motion.span>
      )}
    </div>
  );
}
