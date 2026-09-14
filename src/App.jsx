import React, { useEffect, useState } from 'react';
import { getCompanySettings } from './widget/lib/testSupabase';
import { ChatWidget } from './widget';

// This file simulates "any website" that has embedded the widget.
// It's only used for `npm run dev` — it is NOT part of the published package.
export default function App() {
  const [companySettings, setCompanySettings] = useState(null);
  
useEffect(() => {
  async function loadCompanySettings() {
    const companyId = 'elitefit';

    const data = await getCompanySettings(companyId);

    if (data) {
      setCompanySettings(data);
    }
  }

  loadCompanySettings();
}, []);

  const [theme, setTheme] = useState('auto');
  if (!companySettings) {
  return <div>Loading chatbot...</div>;
  }
  return (
    <div style={pageStyles.page}>
      <header style={pageStyles.header}>
        <div style={pageStyles.logo}>EliteFit</div>
        <nav style={pageStyles.nav}>
          <span>Home</span>
          <span>Plans</span>
          <span>Coaches</span>
          <span>Contact</span>
        </nav>
      </header>

      <main style={pageStyles.hero}>
        <h1 style={pageStyles.h1}>Your host website</h1>
        <p style={pageStyles.p}>
          This page stands in for any site you'd embed the widget on. The chat
          bubble in the bottom-right corner is the actual widget — try it.
        </p>

        <div style={pageStyles.controls}>

          <label style={pageStyles.label}>
            Theme
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="auto">Auto (system)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </main>

      <ChatWidget
        config={{
          companyId: companySettings.company_id,
          botName: companySettings.bot_name,
          greeting: companySettings.welcome_message,
          primaryColor: companySettings.chatbot_color,
          theme,
          logoUrl: companySettings.logo_url,
          poweredByText: `Powered by ${companySettings.company_name} AI`,
        }}
      />
    </div>
  );
}

const pageStyles = {
  page: {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#fafafa',
    color: '#111',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 48px',
    borderBottom: '1px solid #eee',
  },
  logo: { fontWeight: 700, fontSize: 20 },
  nav: { display: 'flex', gap: 24, color: '#555', fontSize: 14 },
  hero: { padding: '96px 48px', maxWidth: 640 },
  h1: { fontSize: 42, margin: 0, letterSpacing: '-0.02em' },
  p: { fontSize: 16, color: '#555', lineHeight: 1.6, marginTop: 16 },
  controls: {
    marginTop: 32,
    display: 'flex',
    gap: 24,
    alignItems: 'center',
    padding: 16,
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: 12,
    width: 'fit-content',
  },
  label: { fontSize: 14, color: '#333' },
};
