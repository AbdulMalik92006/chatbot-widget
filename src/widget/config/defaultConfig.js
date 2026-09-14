// ---------------------------------------------------------------------------
// Default widget configuration.
//
// Anything here can be overridden per-embed via the `config` prop
// (React usage) or the object passed to `ChatbotWidget.init()` (script-tag
// usage). This file only defines the fallbacks, and is the ONE place you
// need to touch to change the webhook URL for local development/testing.
// ---------------------------------------------------------------------------

const defaultConfig = {
  // --- Backend -------------------------------------------------------------
  // Your n8n "Webhook" node URL (Production URL, not the Test URL).
  // The widget POSTs { companyId, sessionId, message } to this endpoint
  // and expects back JSON containing a reply, e.g. { "reply": "..." }.
  webhookUrl: 'https://chatbot-agent.bloodrogue16.workers.dev',

  // Identifies which tenant/company is chatting. Sent with every request
  // so a single n8n workflow (and later, a single Supabase project) can
  // serve many clients.
  companyId: 'elitefit',

  // --- Branding --------------------------------------------------------------
  botName: 'Support Assistant',
  logoUrl: '', // e.g. 'https://yoursite.com/logo.png' — falls back to initials
  greeting: "👋 Hi there! How can we help you today?",
  placeholder: 'Type your message…',
  poweredByText: 'Powered by Chatbot Widget',
  showPoweredBy: true,

  // --- Appearance ------------------------------------------------------------
  primaryColor: '#5B5FEF', // accent used for the bubble, header, send button
  theme: 'auto', // 'auto' | 'light' | 'dark'
  position: 'bottom-right', // 'bottom-right' | 'bottom-left'

  // --- Behavior --------------------------------------------------------------
  openOnLoad: false, // auto-open the window on first page load
  historyStorage: 'none', // 'local' | 'none'  (see src/widget/lib/storage.js)
  requestTimeoutMs: 60000,
};

export default defaultConfig;
