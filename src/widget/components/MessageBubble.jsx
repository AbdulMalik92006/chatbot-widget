import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Bot replies are rendered as GitHub-Flavored Markdown (bold, italics,
// bullet/numbered lists, links, tables, strikethrough, etc). remark-gfm
// adds the GFM extensions on top of standard CommonMark. react-markdown
// never renders raw HTML by default (no rehype-raw plugin is used), so
// a malicious or malformed bot response can't inject markup.
//
// User messages are always rendered as plain text — never parsed as
// markdown — so nothing a visitor types can affect the widget's layout.
export default function MessageBubble({ role, text, timestamp }) {
  const isUser = role === 'user';
  return (
    <div className={`cbw-row ${isUser ? 'cbw-row--user' : 'cbw-row--bot'}`}>
      <div className="cbw-bubble-group">
        <div
          className={`cbw-bubble ${
            isUser ? 'cbw-bubble--user' : 'cbw-bubble--bot cbw-markdown'
          }`}
        >
          {isUser ? (
            text
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          )}
        </div>
        <div className="cbw-timestamp">{formatTime(timestamp)}</div>
      </div>
    </div>
  );
}
