import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import HomePage from "../pages/HomePage.jsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");

const heroCss = readFileSync(path.join(projectRoot, "pages/styles/components/hero.css"), "utf8");

function loadTestStyles() {
  const stylePaths = [
    "pages/styles/base/tokens.css",
    "pages/styles/base/reset.css",
    "pages/styles/base/typography.css",
    "pages/styles/layout/shell.css",
    "pages/styles/components/poster-frame.css",
    "pages/styles/components/background-effects.css",
    "pages/styles/components/nav.css",
    "pages/styles/components/buttons.css",
    "pages/styles/components/hero.css",
    "pages/styles/components/cards.css",
    "pages/styles/components/form.css",
    "pages/styles/pages/home.css",
    "src/styles/react-shell.css",
  ];

  const styleTag = document.createElement("style");
  styleTag.dataset.testStyles = "true";
  styleTag.textContent = stylePaths
    .map((relativePath) => readFileSync(path.join(projectRoot, relativePath), "utf8"))
    .join("\n");
  document.head.appendChild(styleTag);
}

function mountHomePage() {
  render(
    <MemoryRouter>
      <HomePage direction={1} />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    loadTestStyles();
    mountHomePage();
  });

  it("constrói a home com o título em duas camadas, uma atrás da foto e outra sobre a foto", () => {
    const fillTitle = document.querySelector(".hero-title");
    const outlineTitle = document.querySelector(".hero-title-outline");
    const bandPhotoContainer = document.querySelector(".band-photo-container");

    expect(fillTitle).toBeTruthy();
    expect(outlineTitle).toBeTruthy();
    expect(bandPhotoContainer).toBeTruthy();
    expect(document.querySelector("#hero-outline-filter")).toBeTruthy();
    expect(document.querySelector(".hero-copy-plate")).toBeTruthy();
    expect(document.querySelector(".band-photo").getAttribute("src")).toBe("/images/general/band.png");
    expect([...fillTitle.querySelectorAll("span")].map((node) => node.textContent.trim())).toEqual([
      "FORRÓ DO",
      "HORIZONTE",
    ]);
    expect([...outlineTitle.querySelectorAll("span")].map((node) => node.textContent.trim())).toEqual([
      "FORRÓ DO",
      "HORIZONTE",
    ]);

    const photoStyle = getComputedStyle(bandPhotoContainer);
    const fillStyle = getComputedStyle(fillTitle);
    const outlineStyle = getComputedStyle(outlineTitle);

    expect(Number.parseInt(fillStyle.zIndex, 10)).toBeLessThan(Number.parseInt(photoStyle.zIndex, 10));
    expect(Number.parseInt(outlineStyle.zIndex, 10)).toBeGreaterThan(Number.parseInt(photoStyle.zIndex, 10));
    expect(heroCss).toMatch(/\.hero-title-outline\s*\{[\s\S]*filter:\s*url\(#hero-outline-filter\);/);
    expect(outlineTitle.style.filter || "").not.toContain("blur");
  });

  it("mantém as duas camadas do título sincronizadas no mesmo posicionamento x/y", () => {
    const wrapper = document.querySelector(".hero-title-wrapper");
    const fillTitle = document.querySelector(".hero-title");
    const outlineTitle = document.querySelector(".hero-title-outline");

    expect(getComputedStyle(wrapper).display).toBe("inline-grid");

    const fillRect = fillTitle.getBoundingClientRect();
    const outlineRect = outlineTitle.getBoundingClientRect();

    expect(fillRect.x).toBe(outlineRect.x);
    expect(fillRect.y).toBe(outlineRect.y);
    expect(fillRect.width).toBe(outlineRect.width);
    expect(fillRect.height).toBe(outlineRect.height);

    expect(heroCss).toMatch(/\.hero-title,\s*\.hero-title-outline\s*\{[\s\S]*grid-area:\s*1\s*\/\s*1;/);
    expect(heroCss).toMatch(/\.hero-title,\s*\.hero-title-outline\s*\{[\s\S]*font-size:\s*clamp\(3rem,\s*7vw,\s*7rem\);/);
    expect(heroCss).toMatch(/\.hero-title,\s*\.hero-title-outline\s*\{[\s\S]*line-height:\s*0\.95;/);
    expect(heroCss).toMatch(/\.hero-title,\s*\.hero-title-outline\s*\{[\s\S]*text-align:\s*center;/);
  });
});
