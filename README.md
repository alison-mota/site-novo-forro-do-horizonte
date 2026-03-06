# Forró do Horizonte - Website

Site oficial da banda Forró do Horizonte, com design editorial e estética moderna.

## Estrutura do Projeto

```
/
├── pages/              # Páginas HTML do site
│   ├── index.html      # Home
│   ├── agenda.html     # Agenda de Shows
│   ├── biografia.html  # História da Banda
│   ├── galeria.html    # Fotos
│   └── contato.html    # Formulário de Contato
├── css/
│   └── styles.css      # Estilos customizados
├── assets/
│   └── images/         # Imagens e assets estáticos
└── .gitignore
```

## Tecnologias

- HTML5
- CSS3 (Tailwind CSS via CDN)
- Design Responsivo

## Como Rodar

Basta abrir o arquivo `pages/index.html` em qualquer navegador moderno.

Para desenvolvimento, recomenda-se usar uma extensão como "Live Server" no VS Code, abrindo a pasta raiz do projeto.

## Deploy

Este projeto é estático. Ao configurar o deploy (Vercel/Netlify), lembre-se de configurar o diretório de saída ou redirecionar a raiz para `pages/index.html` se necessário, ou mover o `index.html` para a raiz no processo de build.
