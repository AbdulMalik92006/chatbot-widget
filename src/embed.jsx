import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from './widget/ChatWidget.jsx';
import defaultConfig from './widget/config/defaultConfig.js';
// `?inline` gives us the raw CSS text (not auto-injected) so we can put it
// inside the Shadow DOM ourselves — this is what keeps the widget's styles
// from leaking onto the host page, and the host page's styles from leaking in.
import widgetStyles from './widget/styles/widget.css?inline';

const CONTAINER_ID = 'cbw-container';

function mount(userConfig) {
  if (document.getElementById(CONTAINER_ID)) {
    console.warn('[ChatbotWidget] already initialized — call destroy() first.');
    return;
  }

  const hostEl = document.createElement('div');
  hostEl.id = CONTAINER_ID;
  document.body.appendChild(hostEl);

  const shadowRoot = hostEl.attachShadow({ mode: 'open' });

  const styleTag = document.createElement('style');
  styleTag.textContent = widgetStyles;
  shadowRoot.appendChild(styleTag);

  const mountPoint = document.createElement('div');
  shadowRoot.appendChild(mountPoint);

  const config = { ...defaultConfig, ...userConfig };
  const root = createRoot(mountPoint);
  root.render(<ChatWidget config={config} />);

  hostEl.__cbwRoot = root;
}

function destroy() {
  const hostEl = document.getElementById(CONTAINER_ID);
  if (!hostEl) return;
  hostEl.__cbwRoot?.unmount();
  hostEl.remove();
}

const ChatbotWidget = { init: mount, destroy };

if (typeof window !== 'undefined') {
  window.ChatbotWidget = ChatbotWidget;

  // Optional zero-JS-call convenience: a site can define
  //   <script>window.ChatbotWidgetConfig = { companyId: '...', webhookUrl: '...' };</script>
  // before loading this file, and it will auto-init.
  if (window.ChatbotWidgetConfig) {
    mount(window.ChatbotWidgetConfig);
  }
}

export default ChatbotWidget;
