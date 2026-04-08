# FRONTEND SYSTEM — FORRÓ DO HORIZONTE

Documento unificado de Design System (DS) e regras obrigatórias de frontend.

Stack: React + Vite + Framer Motion, CSS modular por camadas importadas via `src/styles/main.css`.

---

## 1. Design Tokens

Prefixo global: `--fdh-*`

Três camadas obrigatórias:

| Camada | Prefixo | Função |
|---|---|---|
| Reference | `--fdh-ref-*` | Valor bruto (hex, px, família) |
| System | `--fdh-sys-*` | Semântica de uso (papel, contexto) |
| Component | `--fdh-comp-*` | Decisão específica do componente |

Nenhum componente pode usar valor literal. Sempre referenciar token semântico.

---

### 1.1 Cores — Reference

```css
--fdh-ref-color-sand:   #F6F1E7;
--fdh-ref-color-gold:   #F2B84B;
--fdh-ref-color-orange: #F47A2A;
--fdh-ref-color-red:    #E33A2D;
--fdh-ref-color-deep:   #6E1E1B;
--fdh-ref-color-ink:    #1A1A1A;
--fdh-ref-color-cyan:   #41D4D4;
--fdh-ref-color-white:  #FFFFFF;
```

---

### 1.2 Cores — System

```css
/* Superfície */
--fdh-sys-color-bg:             var(--fdh-ref-color-sand);
--fdh-sys-color-surface:        var(--fdh-ref-color-white);
--fdh-sys-color-surface-muted:  rgba(255, 248, 236, 0.9);
--fdh-sys-color-overlay:        rgba(26, 26, 26, 0.72);

/* Texto */
--fdh-sys-color-text-primary:   var(--fdh-ref-color-ink);
--fdh-sys-color-text-inverse:   var(--fdh-ref-color-white);
--fdh-sys-color-text-muted:     var(--fdh-ref-color-deep);

/* Borda */
--fdh-sys-color-border-subtle:  rgba(26, 26, 26, 0.08);
--fdh-sys-color-border-default: rgba(26, 26, 26, 0.12);
--fdh-sys-color-border-strong:  rgba(26, 26, 26, 0.30);

/* Interação */
--fdh-sys-color-focus-ring:     rgba(244, 122, 42, 0.45);

/* Exclusivo hero */
--fdh-sys-color-hero-title:     var(--fdh-ref-color-cyan);
```

`--fdh-sys-color-hero-title` é exclusivo do título hero em duas camadas. Proibido em qualquer outro contexto.

---

### 1.3 Cores — Component

```css
--fdh-comp-btn-primary-bg:   linear-gradient(90deg, var(--fdh-ref-color-gold), var(--fdh-ref-color-orange), var(--fdh-ref-color-red));
--fdh-comp-btn-primary-text: var(--fdh-sys-color-text-inverse);
--fdh-comp-btn-radius:       var(--fdh-sys-radius-button);
--fdh-comp-nav-bg:           var(--fdh-ref-color-ink);
--fdh-comp-nav-text:         var(--fdh-sys-color-text-inverse);
```

---

### 1.4 Tipografia

```css
--fdh-ref-font-sora:  'Sora', sans-serif;
--fdh-ref-font-inter: 'Inter', sans-serif;

--fdh-sys-font-display: var(--fdh-ref-font-sora);
--fdh-sys-font-ui:      var(--fdh-ref-font-inter);
```

| Papel | Família | Peso | Tamanho | Obs |
|---|---|---|---|---|
| Hero title | Sora | 800 | clamp(3rem, 7vw, 7rem) | line-height 0.95 |
| Display / seções | Sora | 700 | 48px–80px | tracking -0.04em |
| Subtítulo | Sora | 600 | clamp(1.125rem, 2.3vw, 1.5rem) | — |
| Body | Inter | 400 | 16px | line-height 1.5 |
| UI / botões | Inter | 600 | 16px | uppercase |
| Micro | Inter | 500 | 10px | letter-spacing 0.3em, uppercase |

---

### 1.5 Radius

```css
--fdh-ref-radius-sm:   8px;
--fdh-ref-radius-md:   12px;
--fdh-ref-radius-lg:   16px;
--fdh-ref-radius-pill: 9999px;

--fdh-sys-radius-card:   var(--fdh-ref-radius-md);
--fdh-sys-radius-button: var(--fdh-ref-radius-pill);
--fdh-sys-radius-input:  var(--fdh-ref-radius-sm);
--fdh-sys-radius-media:  var(--fdh-ref-radius-sm);
```

O frame poster usa `clip-path` chanfrado — não usa `border-radius`.

---

### 1.6 Espaçamento

```css
--fdh-ref-spacing-sm: 8px;
--fdh-ref-spacing-md: 24px;
--fdh-ref-spacing-lg: 64px;
--fdh-ref-spacing-xl: 120px;
```

---

### 1.7 Z-index

```css
--fdh-sys-z-base:       1;
--fdh-sys-z-sun:        10;
--fdh-sys-z-photo:      20;
--fdh-sys-z-text:       30;
--fdh-sys-z-nav:        100;
```

Ordem de camadas do hero (base → topo): grain → vinheta → sol → foto banda → título → nav/footer.

---

### 1.8 Motion

```css
--fdh-motion-ease-standard: cubic-bezier(0.25, 0.8, 0.25, 1);
--fdh-motion-duration-fast: 200ms;
--fdh-motion-duration-base: 300ms;
--fdh-motion-duration-slow: 900ms;
```

`prefers-reduced-motion` cobre todas as animações contínuas e transições de rota:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 2. Layout

### 2.1 Frame poster

```
Desktop:  width: min(1100px, 92vw) / height: min(860px, 92dvh)
          clip-path chanfrado, borda dupla sutil
Mobile:   position fixed; inset: 0 (fullscreen, sem borda)
```

Breakpoint de transição: `768px`.

### 2.2 Grid

```
≥1200px: 220px / auto / 220px (colunas laterais decorativas)
<1200px: coluna central única
```

### 2.3 Breakpoints

| Token | Valor |
|---|---|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1200px |

### 2.4 Viewport

- Usar `100dvh`, não `100vh`
- Combinar com `max-height` e padding externo
- Proibido crescimento vertical livre

---

## 3. Componentes

### 3.1 Estados obrigatórios

Todo elemento interativo deve implementar os cinco estados abaixo. Sem exceção.

| Estado | Regra |
|---|---|
| default | Aparência base via tokens |
| hover | Escala 1.02 ou shift de gradiente / opacidade 0.8 |
| active | Escala 0.98 |
| focus-visible | `outline: 2px solid var(--fdh-sys-color-focus-ring); outline-offset: 3px` |
| disabled | `opacity: 0.5; pointer-events: none; filter: grayscale(1)` |

---

### 3.2 Button

Variantes: `primary`, `secondary`, `dark`.

```
primary:   --fdh-comp-btn-primary-bg (gradiente gold→orange→red)
secondary: surface + border-default
dark:      ink sólido + texto inverse
```

- Radius: `--fdh-comp-btn-radius` (pill)
- Height mínimo: 56px
- Hover primary: `background-position: 100% 0` + scale 1.02
- Gradiente exclusivo do botão primary — proibido em outros contextos

---

### 3.3 Nav

- Shape: pill, `--fdh-comp-nav-bg`, `--fdh-comp-nav-text`
- Estado scrolled: `backdrop-filter: blur(10px)` + shadow + fundo translúcido
- Mobile: overlay fullscreen com entradas tipográficas grandes
- `aria-label` e `aria-expanded` obrigatórios no toggle mobile
- Navegação por teclado obrigatória

---

### 3.4 Hero title (duas camadas)

- Camada 1 (fill): cor `--fdh-sys-color-hero-title`, z-index abaixo da foto
- Camada 2 (outline): filtro SVG `feMorphology + feComposite`, cor branca, z-index acima da foto
- Ambas as camadas: mesmo `grid-area`, mesma métrica tipográfica
- Cyan proibido fora deste componente

---

### 3.5 Cards (Agenda)

- Background: `--fdh-sys-color-surface`
- Radius: `--fdh-sys-radius-card`
- Hover: `box-shadow` via `--fdh-sys-color-border-strong`
- Botão interno: variante `primary` com todos os 5 estados

---

### 3.6 Galeria (itens de mídia)

- Radius: `--fdh-sys-radius-media`
- Hover: overlay via `--fdh-sys-color-overlay` revelando legenda ou play
- `focus-visible` no item via `--fdh-sys-color-focus-ring`

---

### 3.7 Form fields (Contato)

- Radius: `--fdh-sys-radius-input`
- Borda em repouso: `--fdh-sys-color-border-default`
- Hover: `--fdh-sys-color-border-strong`
- Focus: border-strong + `outline` via `--fdh-sys-color-focus-ring`
- Disabled: `opacity: 0.5`
- Botão submit: variante `primary`, largura total, todos os 5 estados

---

## 4. Estrutura de arquivos

```
src/
  styles/
    main.css                  → importa todas as camadas
    tokens/
      foundation.css          → --fdh-ref-*
      semantic.css            → --fdh-sys-*
      motion.css              → motion tokens + prefers-reduced-motion
  design-system/
    components/
      nav.css
      hero.css
      button.css
      editorial-footer.css
    templates/
      home.css
```

---

## 5. Regras obrigatórias

### Tokens
- Proibido hex, rgba, rgb ou valor literal em qualquer componente
- Proibido classe Tailwind arbitrária de cor
- Mudança visual: alterar token, não sobrescrever localmente

### Componentes
- Reutilizar componentes existentes antes de criar novos
- Proibido criar variações locais que dupliquem padrões do DS
- Proibido usar `className` para redefinir aparência estrutural

### Focus e acessibilidade
- `focus-visible` obrigatório em todo elemento interativo
- Contraste mínimo WCAG AA: 4.5:1 texto normal / 3:1 texto grande
- Touch target mínimo: 44×44px (nav toggle, CTAs)
- Landmarks semânticos: `<main>`, `<nav>`, hierarquia de headings

### Layout
- Proibido `overflow-hidden` para esconder erro de layout
- Proibido inline style para altura, posicionamento ou controle de viewport
- Proibido `100vh` sem estratégia de contenção — usar `100dvh`
- Proibido múltiplas camadas `fixed` sem necessidade estrutural

### Motion
- `prefers-reduced-motion` cobre sol, grain, transição de rota e wind gust
- Proibido animação contínua sem fallback de motion safety

---

## 6. Definition of Done

Uma alteração só está concluída se:

- usa tokens da camada correta (ref → sys → comp)
- nenhum valor literal fora da camada ref
- todos os estados interativos implementados (default / hover / active / focus-visible / disabled)
- `prefers-reduced-motion` cobre animações contínuas e transições
- contraste AA validado
- touch targets ≥ 44×44px
- layout funciona em resize contínuo sem scroll indevido
- build sem erros