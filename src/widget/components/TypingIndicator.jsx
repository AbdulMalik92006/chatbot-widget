import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="cbw-row cbw-row--bot" aria-live="polite" aria-label="Assistant is typing">
      <div className="cbw-typing-bubble">
        <span className="cbw-typing-dot" />
        <span className="cbw-typing-dot" />
        <span className="cbw-typing-dot" />
      </div>
    </div>
  );
}
