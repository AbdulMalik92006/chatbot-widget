import React, { useState } from 'react';
import './styles/widget.css';
import { ChatProvider, useChatContext } from './context/ChatProvider.jsx';
import ChatButton from './components/ChatButton.jsx';
import ChatWindow from './components/ChatWindow.jsx';

function hexToRgb(hex) {
  const clean = (hex || '').replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const int = parseInt(full, 16);
  if (Number.isNaN(int) || full.length !== 6) return '91, 95, 239'; // fallback accent
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255].join(', ');
}

function WidgetShell() {
  const { config, theme, isOpen, toggleOpen } = useChatContext();
  const [hasPulsed, setHasPulsed] = useState(false);

  const rootStyle = {
    '--cbw-accent': config.primaryColor,
    '--cbw-accent-rgb': hexToRgb(config.primaryColor),
  };

  const handleToggle = () => {
    setHasPulsed(true);
    toggleOpen();
  };

  return (

  <div
  className={`cbw-root cbw-${theme} cbw-position-${config.position} cbw-size-${config.widgetSize || 'medium'}`}
  style={rootStyle}
  >
      {isOpen && <ChatWindow />}
      <ChatButton isOpen={isOpen} onClick={handleToggle} hasPulsed={hasPulsed} />
    </div>
  );
}

/**
 * The main entry point for embedding the widget in a React app:
 *
 *   import { ChatWidget } from '@yourorg/chatbot-widget';
 *
 *   <ChatWidget config={{ companyId: 'elitefit', webhookUrl: '...' }} />
 */
export default function ChatWidget({ config }) {
  return (
    <ChatProvider config={config}>
      <WidgetShell />
    </ChatProvider>
  );
}
