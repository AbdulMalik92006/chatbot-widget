import { getCompanySettings } from '../lib/testSupabase.js';
import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import defaultConfig from '../config/defaultConfig.js';
import { useSessionId } from '../hooks/useSessionId.js';
import { useTheme } from '../hooks/useTheme.js';
import { useChat } from '../hooks/useChat.js';

const ChatContext = createContext(null);

export function ChatProvider({ config: userConfig = {}, children }) {
    const [companySettings, setCompanySettings] = useState(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const config = useMemo(
    () => ({
      ...defaultConfig,
      ...userConfig,

      ...(companySettings
        ? {
            botName: companySettings.bot_name,
            greeting: companySettings.welcome_message,
            primaryColor: companySettings.chatbot_color,
            logoUrl: companySettings.logo_url,
              widgetSize: companySettings.widget_size || 'medium', 
          }
        : {}),
    }),
    [JSON.stringify(userConfig), companySettings]
  );

    useEffect(() => {
    async function loadCompanySettings() {
      if (!config.companyId) {
        console.error('No companyId provided to ChatWidget');
        return;
      }

      const data = await getCompanySettings(config.companyId);

      if (data) {
        setCompanySettings(data);
      }
      setIsLoadingSettings(false);
    }

    loadCompanySettings();
  }, [config.companyId]);
  const [isOpen, setIsOpen] = useState(Boolean(config.openOnLoad));
  const sessionId = useSessionId(config.companyId);
  const { theme, toggleTheme } = useTheme(config.theme);
  const { messages, isTyping, error, sendMessage, resetConversation } = useChat({
    config,
    sessionId,
  });

  const value = {
    config,
    sessionId,
    theme,
    toggleTheme,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggleOpen: () => setIsOpen((v) => !v),
    messages,
    isTyping,
    error,
    sendMessage,
    resetConversation,
  };

  if (isLoadingSettings) {
  return null;
}

return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChatContext must be used within a <ChatProvider>');
  }
  return ctx;
}
