import React, { useEffect, useState } from 'react';

function getSystemScheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredScheme() {
  try {
    const val = localStorage.getItem('color-scheme');
    return val === 'light' || val === 'dark' ? val : null;
  } catch {
    return null;
  }
}

function syncMetaTag(stored) {
  if (typeof document === 'undefined') return;
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.content = stored ?? 'light dark';
  }
}

export default function ThemeToggle() {
  const [storedScheme, setStoredScheme] = useState(() => getStoredScheme());
  const [systemScheme, setSystemScheme] = useState(() => getSystemScheme());

  const resolvedScheme = storedScheme ?? systemScheme;

  useEffect(() => {
    syncMetaTag(storedScheme);
  }, [storedScheme]);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e) => {
      // Update system scheme state without retroactively clearing stored override
      setSystemScheme(e.matches ? 'dark' : 'light');
    };

    const handleStorageChange = (e) => {
      if (e.key === 'color-scheme' || e.key === null) {
        const nextStored = getStoredScheme();
        setStoredScheme(nextStored);
        syncMetaTag(nextStored);
      }
    };

    mql.addEventListener('change', handleMediaChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      mql.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const applyThemeChoice = (targetScheme) => {
    const currentSystem = getSystemScheme();
    setSystemScheme(currentSystem);

    if (targetScheme === currentSystem) {
      // Target matches current system preference: remove stored override
      try {
        localStorage.removeItem('color-scheme');
      } catch {}
      setStoredScheme(null);
      syncMetaTag(null);
    } else {
      try {
        localStorage.setItem('color-scheme', targetScheme);
      } catch {}
      setStoredScheme(targetScheme);
      syncMetaTag(targetScheme);
    }
  };

  return (
    <div
      role="group"
      aria-label="Alternar tema de leitura (Modo Claro ou Modo Escuro)"
      className="inline-flex items-center rounded-lg p-0.5 text-xs font-medium"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
      }}
    >
      <button
        type="button"
        onClick={() => applyThemeChoice('light')}
        aria-pressed={resolvedScheme === 'light'}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
        style={{
          backgroundColor: resolvedScheme === 'light' ? 'var(--bg-surface)' : 'transparent',
          color: resolvedScheme === 'light' ? 'var(--text-primary)' : 'var(--text-muted)',
          boxShadow:
            resolvedScheme === 'light' ? '0 1px 2px rgba(0, 0, 0, 0.08)' : 'none',
          fontWeight: resolvedScheme === 'light' ? 600 : 500,
        }}
        title="Modo Claro (Papel de Biblioteca)"
      >
        <span aria-hidden="true">☀️</span>
        <span>Claro</span>
      </button>

      <button
        type="button"
        onClick={() => applyThemeChoice('dark')}
        aria-pressed={resolvedScheme === 'dark'}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
        style={{
          backgroundColor: resolvedScheme === 'dark' ? 'var(--bg-surface)' : 'transparent',
          color: resolvedScheme === 'dark' ? 'var(--text-primary)' : 'var(--text-muted)',
          boxShadow:
            resolvedScheme === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.25)' : 'none',
          fontWeight: resolvedScheme === 'dark' ? 600 : 500,
        }}
        title="Modo Escuro (Leitura Noturna)"
      >
        <span aria-hidden="true">🌙</span>
        <span>Escuro</span>
      </button>
    </div>
  );
}
