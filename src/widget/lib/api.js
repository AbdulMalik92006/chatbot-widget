// ---------------------------------------------------------------------------
// Talks to the n8n webhook. Kept isolated from React so it's trivial to
// unit test, swap out, or later point at a different backend (e.g. a
// Supabase Edge Function) without touching any component.
// ---------------------------------------------------------------------------

/**
 * POSTs a chat message to the configured n8n webhook.
 *
 * Request body:
 *   { companyId, sessionId, message }
 *
 * Expected response (any of these shapes is accepted):
 *   { "reply": "..." }
 *   { "message": "..." }
 *   { "output": "..." }
 *   [{ "reply": "..." }]   (n8n "Respond to Webhook" sometimes wraps in an array)
 *
 * @returns {Promise<string>} the assistant's reply text
 */
export async function sendMessageToWebhook({
  webhookUrl,
  companyId,
  sessionId,
  message,
  timeoutMs = 20000,
  signal,
}) {
  if (!webhookUrl || webhookUrl.includes('YOUR-N8N-INSTANCE')) {
    throw new Error(
      'Webhook URL is not configured. Set `webhookUrl` in src/widget/config/defaultConfig.js or pass it via the `config` prop.'
    );
  }

 const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), timeoutMs);

if (signal) {
  signal.addEventListener('abort', () => controller.abort(), { once: true });
}

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyId, sessionId, message }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }

    const data = await response.json().catch(() => null);
    return extractReply(data);
  } finally {
    clearTimeout(timeout);
  }
}

function extractReply(data) {
  if (data == null) return "Sorry, I didn't get a response. Please try again.";

  const payload = Array.isArray(data) ? data[0] : data;

  if (typeof payload === 'string') return payload;

  return (
    payload?.reply ??
    payload?.message ??
    payload?.output ??
    payload?.text ??
    payload?.answer ??
    "Sorry, I didn't understand that response format."
  );
}
