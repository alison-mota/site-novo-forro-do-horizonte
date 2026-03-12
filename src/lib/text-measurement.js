/**
 * Mede a largura de um texto usando um canvas offscreen.
 * @param {string} text - O texto a ser medido.
 * @param {string} font - A string de fonte CSS completa (ex: "800 100px Sora").
 * @returns {number} A largura medida em pixels.
 */
export function measureTextWidth(text, font) {
  if (typeof window === "undefined") {
    return 0;
  }

  const canvas = measureTextWidth.canvas || (measureTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  
  if (context) {
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  return 0;
}
