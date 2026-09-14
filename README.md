# Chatbot Widget

A premium, embeddable AI chat widget built with **React + Vite**. It talks to
an **n8n webhook**, supports light/dark mode, is fully responsive, and can
ship three ways: as source you customize directly, as an installable **npm
package**, or as a **single `<script>` tag** for any website.

---

## 1. Quick start (local development)

```bash
npm install
npm run dev
```

Open the printed localhost URL. `src/App.jsx` simulates a host website with
the widget floating in the bottom-right corner — use it as your playground.

## 2. Point it at your n8n webhook

Open **`src/widget/config/defaultConfig.js`** and set:

```js
webhookUrl: 'https://YOUR-N8N-INSTANCE.app.n8n.cloud/webhook/chat',
companyId: 'your-company-id',
```

This is the *only* file you need to touch to change the backend URL. Every
other override (per customer, per environment) can be passed at runtime
instead — see [Configuration](#4-configuration) below.

### What the widget sends

On every message, it does:

```js
fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    companyId: 'elitefit',
    sessionId: 'a-stable-random-id-per-visitor',
    message: 'Hello',
  }),
});
```

### What it expects back

Any of these response shapes are accepted (from your n8n "Respond to
Webhook" node):

```json
{ "reply": "Hi! How can I help?" }
```
```json
{ "message": "Hi! How can I help?" }
```
```json
[{ "reply": "Hi! How can I help?" }]
```

See `src/widget/lib/api.js` if you need to support a different shape.

### Markdown in bot replies

Bot messages are rendered as **GitHub-Flavored Markdown** via
[`react-markdown`](https://github.com/remarkjs/react-markdown) +
[`remark-gfm`](https://github.com/remarkjs/remark-gfm) — so your n8n
workflow's reply text can use bold/italics, bullet and numbered lists,
links, tables, blockquotes, and inline/fenced code, and it'll render
properly inside the bubble. Strikethrough, task lists (`- [ ]`), and
autolinks work too via the GFM extension.

User messages are always rendered as plain text (never parsed as
markdown), so nothing a visitor types can affect the widget's layout.

`react-markdown` never renders raw HTML unless you add the `rehype-raw`
plugin — which this setup doesn't — so a malformed or adversarial bot
reply can't inject markup into the page.

Styling for markdown elements (lists, tables, code blocks, links, etc.)
lives under the `.cbw-markdown` rules in `src/widget/styles/widget.css`.

---

## 3. Project structure

```
src/
  App.jsx                    # demo "host site" (dev only, not published)
  main.jsx                   # demo entry point (dev only)
  embed.jsx                  # standalone <script> tag entry point
  widget/
    index.js                 # npm package export surface
    ChatWidget.jsx            # root component (provider + button + window)
    components/
      ChatButton.jsx          # floating action button
      ChatWindow.jsx           # header + list + input + footer container
      ChatHeader.jsx           # avatar, name, status, theme toggle, close
      MessageList.jsx          # scrollable message area, auto-scroll
      MessageBubble.jsx        # single message bubble
      TypingIndicator.jsx      # animated "..." bubble
      InputBar.jsx             # auto-resizing textarea + send button
      PoweredByFooter.jsx      # optional branding line
    context/
      ChatProvider.jsx        # combines config + theme + session + chat
    hooks/
      useChat.js               # message state, sending, persistence
      useSessionId.js          # stable per-visitor session id
      useTheme.js               # light/dark resolution + manual override
    config/
      defaultConfig.js         # <-- webhook URL & all defaults live here
    lib/
      api.js                   # fetch() wrapper around the n8n webhook
      storage.js                # localStorage history (Supabase-ready adapter)
    styles/
      widget.css                # all styles, namespaced + CSS variables
```

Everything under `widget/` is self-contained and safe to copy into another
project as-is.

---

## 4. Configuration

Pass a `config` object either as a React prop or to `ChatbotWidget.init()`.
All fields are optional and fall back to `defaultConfig.js`.

| Key              | Type                          | Description                                   |
|------------------|-------------------------------|------------------------------------------------|
| `webhookUrl`     | string                        | Your n8n webhook URL                           |
| `companyId`      | string                        | Tenant identifier sent with every message      |
| `botName`        | string                        | Name shown in the header                       |
| `logoUrl`        | string                        | Avatar image URL (falls back to initials)      |
| `greeting`       | string                        | First bot message shown on a fresh session     |
| `placeholder`    | string                        | Input field placeholder text                   |
| `primaryColor`   | string (hex)                  | Accent color — bubble, header, send button     |
| `theme`          | `'auto' \| 'light' \| 'dark'` | `'auto'` follows the visitor's OS setting      |
| `position`       | `'bottom-right' \| 'bottom-left'` | Which corner the widget docks to           |
| `openOnLoad`     | boolean                       | Auto-open the window on first paint            |
| `showPoweredBy`  | boolean                       | Show/hide the small footer branding line       |
| `poweredByText`  | string                        | Footer branding text                           |
| `historyStorage` | `'local' \| 'none'`           | Persist conversation in localStorage or not     |

### React usage

```jsx
import { ChatWidget } from '@yourorg/chatbot-widget';
import '@yourorg/chatbot-widget/style.css';

<ChatWidget
  config={{
    companyId: 'elitefit',
    webhookUrl: 'https://your-n8n.app.n8n.cloud/webhook/chat',
    primaryColor: '#5B5FEF',
    theme: 'auto',
  }}
/>
```

### Script-tag usage (any website, no build step)

```html
<script src="https://cdn.example.com/chatbot-widget.embed.js"></script>
<script>
  window.ChatbotWidget.init({
    companyId: 'elitefit',
    webhookUrl: 'https://your-n8n.app.n8n.cloud/webhook/chat',
    botName: 'EliteFit Assistant',
    primaryColor: '#5B5FEF',
  });
</script>
```

The embed build renders inside a **Shadow DOM**, so the host site's CSS
can't leak in and the widget's CSS can't leak out.

---

## 5. Building for distribution

Two separate build targets, kept independent so each stays lean:

```bash
# Installable npm package (React externalized — consumer supplies React)
npm run build:package
# -> dist/chatbot-widget.es.js
# -> dist/chatbot-widget.cjs.js
# -> dist/style.css

# Self-contained script-tag bundle (React bundled in)
npm run build:embed
# -> dist-embed/chatbot-widget.embed.js
```

### Publishing to npm

1. Update `name`, `version`, and repository fields in `package.json`.
2. `npm run build:package`
3. `npm publish --access public`

### Hosting the embed script

Upload `dist-embed/chatbot-widget.embed.js` to any static host or CDN
(S3 + CloudFront, Cloudflare Pages, etc.) and give customers the
`<script>` snippet above with your URL.

---

## 6. Multi-tenant / Supabase roadmap

The persistence layer is already split behind a small adapter interface in
`src/widget/lib/storage.js`:

```js
{ load(companyId, sessionId), save(companyId, sessionId, messages), clear(companyId, sessionId) }
```

Today `localHistoryAdapter` implements this against `localStorage`. To move
to Supabase for real multi-tenant, cross-device history:

1. Create a `messages` table keyed by `company_id` + `session_id`.
2. Implement `supabaseHistoryAdapter` with the same three methods (a sketch
   is already commented in `storage.js`).
3. Swap the import in `src/widget/hooks/useChat.js`.

No component changes are needed — `useChat` is the only place that talks to
the adapter. The same pattern applies if you later want per-tenant config
(colors, greeting, logo) served from Supabase instead of hardcoded per
embed: fetch it once in `ChatProvider` before rendering `WidgetShell`.

---

## 7. Customizing the look

All colors are CSS variables scoped under `.cbw-root` in
`src/widget/styles/widget.css`. To restyle beyond what `config` exposes
(e.g. font, corner radius, bubble shape), edit the variables at the top of
that file — every component reads from them, nothing is hardcoded inline.
