#!/usr/bin/env node
/**
 * check-arquitetura.mjs
 *
 * Valida regras arquiteturais do site Forró do Horizonte.
 * Projeto: React + Vite + Framer Motion, CSS modular.
 *
 * Uso:
 *   node scripts/check-arquitetura.mjs
 *   node scripts/check-arquitetura.mjs --json
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const argv = new Set(process.argv.slice(2));
const OUTPUT_JSON = argv.has("--json");

const CONFIG = {
  extensions: [".ts", ".tsx", ".js", ".jsx"],

  // Pastas permitidas em src/components/
  allowedComponentRoots: ["ui", "layout", "sections"],

  // Páginas existentes do site
  knownPages: ["Home", "Agenda", "Bio", "Galeria", "Contato"],

  // CSS: arquivos de token obrigatórios em src/styles/tokens/
  requiredTokenFiles: ["foundation.css", "semantic.css", "motion.css"],

  // Limite de linhas por arquivo de página
  pageMaxLines: 200,

  // Limite de linhas por componente
  componentMaxLines: 300,
};

const RESULTS = { errors: [], warnings: [], info: [] };

function add(level, code, message, file = null) {
  RESULTS[level].push({
    level,
    code,
    message,
    file: file ? toPosix(path.relative(ROOT, file)) : null,
  });
}

function toPosix(p) { return p.split(path.sep).join("/"); }

function readDirSafe(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return []; }
}

function readFileSafe(f) {
  try { return fs.readFileSync(f, "utf8"); }
  catch { return ""; }
}

function walkFiles(dir, acc = []) {
  for (const entry of readDirSafe(dir)) {
    const full = path.join(dir, entry.name);
    if (["node_modules", ".git", "dist", "build"].includes(entry.name)) continue;
    if (entry.isDirectory()) walkFiles(full, acc);
    else if (entry.isFile()) acc.push(full);
  }
  return acc;
}

function isCodeFile(f) { return CONFIG.extensions.some(ext => f.endsWith(ext)); }

function getAllCodeFiles() { return walkFiles(SRC_DIR).filter(isCodeFile); }

// ------------------------------------------------------------
// 1. Estrutura obrigatória de src/
// ------------------------------------------------------------
function checkSrcStructure() {
  const required = ["components", "pages", "styles", "routes"];
  for (const dir of required) {
    const full = path.join(SRC_DIR, dir);
    if (!fs.existsSync(full)) {
      add("errors", "SRC_DIR_MISSING",
        `Pasta obrigatória "src/${dir}/" não encontrada.`);
    }
  }
}

// ------------------------------------------------------------
// 2. Pastas permitidas em src/components/
// ------------------------------------------------------------
function checkComponentsStructure() {
  const componentsDir = path.join(SRC_DIR, "components");
  if (!fs.existsSync(componentsDir)) return;

  for (const entry of readDirSafe(componentsDir)) {
    if (!entry.isDirectory()) continue;
    if (!CONFIG.allowedComponentRoots.includes(entry.name)) {
      add("errors", "COMPONENTS_INVALID_ROOT",
        `Pasta "components/${entry.name}/" não permitida. Válidas: ${CONFIG.allowedComponentRoots.join(", ")}.`,
        path.join(componentsDir, entry.name));
    }
  }
}

// ------------------------------------------------------------
// 3. Tokens CSS obrigatórios
// ------------------------------------------------------------
function checkTokenFiles() {
  const tokensDir = path.join(SRC_DIR, "styles", "tokens");
  for (const file of CONFIG.requiredTokenFiles) {
    const full = path.join(tokensDir, file);
    if (!fs.existsSync(full)) {
      add("errors", "TOKEN_FILE_MISSING",
        `Arquivo de token obrigatório não encontrado: src/styles/tokens/${file}`);
    }
  }
}

// ------------------------------------------------------------
// 4. main.css deve importar as três camadas de tokens
// ------------------------------------------------------------
function checkMainCssImports() {
  const mainCss = path.join(SRC_DIR, "styles", "main.css");
  if (!fs.existsSync(mainCss)) {
    add("errors", "MAIN_CSS_MISSING", "src/styles/main.css não encontrado.");
    return;
  }
  const content = readFileSafe(mainCss);
  for (const file of CONFIG.requiredTokenFiles) {
    if (!content.includes(file)) {
      add("errors", "MAIN_CSS_MISSING_IMPORT",
        `src/styles/main.css não importa "tokens/${file}".`,
        mainCss);
    }
  }
}

// ------------------------------------------------------------
// 5. Páginas: uma por arquivo, tamanho controlado
// ------------------------------------------------------------
function checkPages(allFiles) {
  const pagesDir = path.join(SRC_DIR, "pages");
  if (!fs.existsSync(pagesDir)) return;

  const pageFiles = allFiles.filter(f => toPosix(path.relative(SRC_DIR, f)).startsWith("pages/"));

  for (const file of pageFiles) {
    const content = readFileSafe(file);
    const lines = content.split(/\r?\n/).length;

    if (lines > CONFIG.pageMaxLines) {
      add("warnings", "PAGE_TOO_LARGE",
        `${path.basename(file)}: ${lines} linhas (limite ${CONFIG.pageMaxLines}). Extrair blocos para src/components/sections/.`,
        file);
    }

    // Página não deve importar diretamente de outra página
    const imports = parseImports(content);
    for (const imp of imports) {
      if (imp.includes("/pages/")) {
        add("errors", "PAGE_IMPORTS_PAGE",
          `Página importando outra página: "${imp}". Extrair componente compartilhado para components/.`,
          file);
      }
    }
  }
}

// ------------------------------------------------------------
// 6. Componentes: tamanho e sem lógica de rota
// ------------------------------------------------------------
function checkComponents(allFiles) {
  const compFiles = allFiles.filter(f =>
    toPosix(path.relative(SRC_DIR, f)).startsWith("components/")
  );

  for (const file of compFiles) {
    const content = readFileSafe(file);
    const lines = content.split(/\r?\n/).length;

    if (lines > CONFIG.componentMaxLines) {
      add("warnings", "COMPONENT_TOO_LARGE",
        `${path.basename(file)}: ${lines} linhas (limite ${CONFIG.componentMaxLines}). Considerar divisão.`,
        file);
    }

    // Componentes UI não devem importar react-router diretamente (exceto layout)
    const rel = toPosix(path.relative(SRC_DIR, file));
    if (rel.startsWith("components/ui/")) {
      if (content.includes("react-router") || content.includes("useNavigate") || content.includes("useLocation")) {
        add("errors", "UI_COMPONENT_ROUTER_IMPORT",
          `Componente UI com import de roteamento: "${rel}". Passar callbacks via props.`,
          file);
      }
    }
  }
}

// ------------------------------------------------------------
// 7. CSS modular: arquivos de estilo de componente junto ao componente
// ------------------------------------------------------------
function checkCssCoLocation(allFiles) {
  // Verificar se há CSS solto na raiz de src/ (fora de styles/)
  for (const file of allFiles) {
    const rel = toPosix(path.relative(SRC_DIR, file));
    if (!file.endsWith(".css")) continue;
    if (rel.startsWith("styles/")) continue;
    // CSS de componente co-localizado é permitido
    if (rel.startsWith("components/") || rel.startsWith("pages/")) continue;

    add("warnings", "CSS_UNORGANIZED",
      `Arquivo CSS fora das pastas esperadas: "src/${rel}". Mover para src/styles/ ou co-localizar com o componente.`,
      file);
  }
}

// ------------------------------------------------------------
// 8. Framer Motion: não usar em components/ui/ (apenas em pages/ e sections/)
// ------------------------------------------------------------
function checkMotionUsage(allFiles) {
  const uiFiles = allFiles.filter(f =>
    toPosix(path.relative(SRC_DIR, f)).startsWith("components/ui/")
  );

  for (const file of uiFiles) {
    const content = readFileSafe(file);
    if (content.includes("framer-motion")) {
      add("warnings", "FRAMER_IN_UI",
        `Framer Motion em componente UI: "${path.basename(file)}". Motion deve ficar em pages/ ou components/sections/.`,
        file);
    }
  }
}

// ------------------------------------------------------------
// Utilitários
// ------------------------------------------------------------
function parseImports(content) {
  const re = /\bimport\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g;
  const result = [];
  let m;
  while ((m = re.exec(content)) !== null) result.push(m[1]);
  return result;
}

// ------------------------------------------------------------
// Saída
// ------------------------------------------------------------
function printHuman() {
  const groups = [
    ["errors",   "❌ ERROS (bloqueantes)"],
    ["warnings", "⚠️  WARNINGS (revisar)"],
    ["info",     "ℹ️  INFO"],
  ];

  let total = 0;
  for (const [key, title] of groups) {
    const items = RESULTS[key];
    if (!items.length) continue;
    total += items.length;
    console.log(`\n${title} — ${items.length} encontrado(s)\n`);
    for (const item of items) {
      if (item.file) console.log(`   📁 ${item.file}`);
      console.log(`   [${item.code}] ${item.message}\n`);
    }
  }

  if (total === 0) console.log("✔ Nenhum problema arquitetural encontrado.");
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error("ERRO CRÍTICO: pasta src/ não encontrada.");
    process.exit(1);
  }

  const allFiles = getAllCodeFiles();

  checkSrcStructure();
  checkComponentsStructure();
  checkTokenFiles();
  checkMainCssImports();
  checkPages(allFiles);
  checkComponents(allFiles);
  checkCssCoLocation(allFiles);
  checkMotionUsage(allFiles);

  if (OUTPUT_JSON) {
    console.log(JSON.stringify(RESULTS, null, 2));
  } else {
    printHuman();
    const e = RESULTS.errors.length;
    const w = RESULTS.warnings.length;
    console.log("═══════════════════════════════════════════");
    console.log(`RESUMO: ${e} erro(s), ${w} warning(s)`);
    console.log("═══════════════════════════════════════════");
  }

  process.exit(RESULTS.errors.length > 0 ? 1 : 0);
}

main();
