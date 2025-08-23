import React, { useEffect, useState } from 'react';

export default function ThemeToggle(){
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const next = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <button type="button" className="theme-toggle" onClick={next} title="Toggle theme">
      <span>{theme === 'dark' ? '🌙 Dark' : '🌞 Light'}</span>
    </button>
  );
}
