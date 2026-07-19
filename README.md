# DAKKAI Sushi — site oficial

Site estático premium, responsivo e instalável como aplicativo (PWA), pronto para GitHub e Vercel.

## Estrutura

- `index.html` — página principal.
- `styles.css` — identidade visual e responsividade.
- `script.js` — menu, animações, links e instalação PWA.
- `config.js` — único arquivo que precisa receber os dados oficiais.
- `manifest.webmanifest` e `sw.js` — permitem instalar o site no celular.
- `assets/` — logo vetorial, favicon e ícones.

## Antes de publicar

Abra `config.js` e preencha:

- WhatsApp: país + DDD + número, somente números.
- Instagram.
- Delivery.
- Cardápio.
- Reservas.
- Trabalhe conosco.
- Google Maps.
- Endereço, horário e forma de atendimento.

Quando um link estiver vazio, o site não envia o cliente para um contato falso: mostra um aviso de configuração.

## Publicar no GitHub

```bash
git init
git add .
git commit -m "publica site oficial DAKKAI Sushi"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

## Publicar na Vercel

1. Acesse a Vercel.
2. Clique em **Add New > Project**.
3. Importe o repositório do DAKKAI.
4. Use **Framework Preset: Other**.
5. Não preencha Build Command.
6. Clique em **Deploy**.

Depois disso, cada `git push` cria uma atualização automática.
