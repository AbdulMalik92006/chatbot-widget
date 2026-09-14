// ---------------------------------------------------------------------------
// Chat history persistence, behind a tiny adapter interface:
//
//   { load(companyId, sessionId) -> Message[],
//     save(companyId, sessionId, messages) -> void,
//     clear(companyId, sessionId) -> void }
//
// Today this is backed by localStorage (per browser, per companyId).
// Multi-tenant / cross-device history (the Supabase step) is a drop-in
// replacement: implement the same three methods against a `messages`
// table keyed by (company_id, session_id) and swap `localHistoryAdapter`
// for `supabaseHistoryAdapter` in useChat.js — nothing else changes.
// ---------------------------------------------------------------------------

const keyFor = (companyId, sessionId) => `cbw_history_${companyId}_${sessionId}`;

export const localHistoryAdapter = {
  load(companyId, sessionId) {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(keyFor(companyId, sessionId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save(companyId, sessionId, messages) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        keyFor(companyId, sessionId),
        JSON.stringify(messages)
      );
    } catch {
      // localStorage can throw (quota, private browsing) — history just
      // won't persist across reloads, which is a safe degradation.
    }
  },

  clear(companyId, sessionId) {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(keyFor(companyId, sessionId));
  },
};

// ---------------------------------------------------------------------------
// FUTURE: Supabase-backed adapter (multi-tenant, cross-device history).
// Sketch — wire up when ready:
//
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
//
// export const supabaseHistoryAdapter = {
//   async load(companyId, sessionId) {
//     const { data } = await supabase
//       .from('messages')
//       .select('*')
//       .eq('company_id', companyId)
//       .eq('session_id', sessionId)
//       .order('created_at', { ascending: true });
//     return data ?? [];
//   },
//   async save(companyId, sessionId, messages) {
//     // insert only the newest message(s) rather than the whole array
//     // in a real implementation — kept simple here for parity with
//     // the localStorage adapter's signature.
//   },
//   async clear(companyId, sessionId) {
//     await supabase
//       .from('messages')
//       .delete()
//       .eq('company_id', companyId)
//       .eq('session_id', sessionId);
//   },
// };
// ---------------------------------------------------------------------------

export function createMessage(role, text) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role, // 'user' | 'bot'
    text,
    timestamp: new Date().toISOString(),
  };
}
