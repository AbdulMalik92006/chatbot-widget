import { useCallback, useEffect, useRef, useState } from 'react';
import { sendMessageToWebhook } from '../lib/api.js';
import { createMessage, localHistoryAdapter } from '../lib/storage.js';

/**
 * Owns the conversation: message list, typing state, sending, and
 * localStorage persistence. Talks to n8n via lib/api.js.
 */
export function useChat({ config, sessionId }) {
  const { companyId, webhookUrl, greeting, requestTimeoutMs, historyStorage } = config;

  const historyEnabled = historyStorage !== 'none';
  const abortRef = useRef(null);

  const [messages, setMessages] = useState([]);

useEffect(() => {
  if (!greeting) return;

  if (!historyEnabled) {
    setMessages([createMessage('bot', greeting)]);
    return;
  }

  const saved = localHistoryAdapter.load(companyId, sessionId);

  if (saved.length > 0) {
    setMessages(saved);
  } else {
    setMessages([createMessage('bot', greeting)]);
  }
}, [greeting, companyId, sessionId, historyEnabled]);

  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Persist on every change
  useEffect(() => {
    if (!historyEnabled) return;
    localHistoryAdapter.save(companyId, sessionId, messages);
  }, [messages, companyId, sessionId, historyEnabled]);

  // Cancel any in-flight request on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setError(null);
      setMessages((prev) => [...prev, createMessage('user', trimmed)]);
      setIsTyping(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const reply = await sendMessageToWebhook({
          webhookUrl,
          companyId,
          sessionId,
          message: trimmed,
          timeoutMs: requestTimeoutMs,
          signal: controller.signal,
        });
        setMessages((prev) => [...prev, createMessage('bot', reply)]);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Something went wrong.');
        setMessages((prev) => [
          ...prev,
          createMessage(
            'bot',
            "Sorry, something went wrong on our end. Please try again in a moment."
          ),
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [webhookUrl, companyId, sessionId, requestTimeoutMs, isTyping]
  );

  const resetConversation = useCallback(() => {
    localHistoryAdapter.clear(companyId, sessionId);
    setMessages(greeting ? [createMessage('bot', greeting)] : []);
  }, [companyId, sessionId, greeting]);

  return { messages, isTyping, error, sendMessage, resetConversation };
}
