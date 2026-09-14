import { useState } from 'react';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `sid-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Returns a stable random session ID for this visitor + company, persisted
 * in localStorage so a page refresh continues the same conversation.
 */
export function useSessionId(companyId) {
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return generateId();

    const key = `cbw_session_${companyId}`;
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;

    const fresh = generateId();
    try {
      window.localStorage.setItem(key, fresh);
    } catch {
      // ignore — session just won't persist across reloads
    }
    return fresh;
  });

  return sessionId;
}
