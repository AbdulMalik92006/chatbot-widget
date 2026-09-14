import React from 'react';
import ChatHeader from './ChatHeader.jsx';
import MessageList from './MessageList.jsx';
import InputBar from './InputBar.jsx';
import PoweredByFooter from './PoweredByFooter.jsx';
import { useChatContext } from '../context/ChatProvider.jsx';

export default function ChatWindow() {
  const { config, theme, toggleTheme, close, messages, isTyping, sendMessage } =
    useChatContext();

  return (
    <div className="cbw-window" role="dialog" aria-label={`${config.botName} chat`}>
      <ChatHeader
        botName={config.botName}
        logoUrl={config.logoUrl}
        theme={theme}
        onToggleTheme={toggleTheme}
        onClose={close}
      />
      <MessageList messages={messages} isTyping={isTyping} />
      <InputBar onSend={sendMessage} disabled={isTyping} placeholder={config.placeholder} />
      {config.showPoweredBy && <PoweredByFooter text={config.poweredByText} />}
    </div>
  );
}
