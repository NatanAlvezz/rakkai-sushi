# DAKKAI Sushi — site oficial

Site institucional estático do **DAKKAI Sushi — Brasil • Oriente**.

## Estrutura correta

```text
/
├── index.html
├── styles.css
├── script.js
├── config.js
├── manifest.webmanifest
├── sw.js
├── .gitignore
└── assets/
    ├── logo-dakkai.png
    ├── logo-dakkai.webp
    ├── og-dakkai.jpg
    ├── favicon-64.png
    ├── icon-192.png
    ├── icon-512.png
    ├── dakkai-hero-oficial.webp
    ├── dakkai-hero-oficial-mobile.webp
    ├── dakkai-experiencia-oficial.webp
    ├── dakkai-experiencia-oficial-mobile.webp
    ├── dakkai-galeria-sushi-mar.jpg
    ├── dakkai-galeria-sushi-mar.webp
    ├── dakkai-galeria-prato-quente.jpg
    └── dakkai-galeria-prato-quente.webp
```

## Configuração

Todos os contatos ficam em `config.js`. Preencha WhatsApp, Instagram, delivery, cardápio, reservas, Google Maps, endereço e horário.

## Publicação

Este projeto não precisa de instalação, npm ou comando de build. Na Vercel use **Framework Preset: Other** e mantenha os campos de build vazios.

Não envie arquivos ZIP para a raiz do repositório. Extraia o pacote e envie os arquivos e a pasta `assets`.
