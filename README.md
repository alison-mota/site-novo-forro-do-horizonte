# Forró do Horizonte - Website

Site oficial da banda Forró do Horizonte, com design editorial e estética moderna.

## Estrutura do Projeto

```
/
├── pages/                   # Fonte do Vite para rotas limpas
│   ├── index.html           # Home
│   ├── agenda.html          # Agenda de Shows
│   ├── biografia.html       # História da Banda
│   ├── galeria.html         # Fotos
│   ├── contato.html         # Formulário de Contato
│   ├── src/
│   │   ├── components/      # Botões, navegação, hero, cards e campos
│   │   ├── data/            # Conteúdo estruturado de agenda e galeria
│   │   ├── entries/         # Entradas por rota
│   │   ├── layouts/         # Shell compartilhado das páginas
│   │   └── pages/           # Renderizadores por página
│   └── styles/
│       ├── base/            # Tokens, reset, tipografia e animações
│       ├── layout/          # Estrutura global
│       ├── components/      # Estilos de componentes reutilizáveis
│       └── pages/           # Ajustes específicos por rota
├── assets/
│   └── images/              # Imagens e assets estáticos
└── .gitignore
```

## Tecnologias

- HTML5
- CSS3 (Tailwind CSS via CDN)
- Vite (dev server e build)
- Design Responsivo

## Como Rodar

1. Instale as dependencias:
   - `npm install`
2. Rode em desenvolvimento:
   - `npm run dev`
3. Build de producao:
   - `npm run build`
4. Preview local da build:
   - `npm run preview`

## Deploy

Este projeto gera arquivos estaticos em `dist/` apos `npm run build`, com rotas limpas como `/index.html`, `/agenda.html`, `/biografia.html`, `/galeria.html` e `/contato.html` (sem `/pages` na URL). Essa pasta pode ser publicada em Vercel, Netlify, GitHub Pages ou outro host estatico.
