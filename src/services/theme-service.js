import { THEME_CONFIG } from '../config/theme.config.js';

const VALID_THEMES = new Set(THEME_CONFIG.themes);

function isValidTheme(value) {
  return VALID_THEMES.has(value);
}

function getSystemPreference() {
  try {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch {
    return THEME_CONFIG.defaultTheme;
  }
}

function persistTheme(theme) {
  try {
    localStorage.setItem(THEME_CONFIG.storageKey, theme);
  } catch {
    /* localStorage unavailable */
  }
}

function loadPersistedTheme() {
  try {
    return localStorage.getItem(THEME_CONFIG.storageKey);
  } catch {
    return null;
  }
}

export function applyTheme(theme) {
  const resolved = isValidTheme(theme) ? theme : THEME_CONFIG.defaultTheme;
  document.documentElement.setAttribute('data-theme', resolved);
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = resolved === 'dark' ? '#0F172A' : '#3B82F6';
  }
  return resolved;
}

export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || THEME_CONFIG.defaultTheme;
}

export function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  persistTheme(next);
  return next;
}

export function initTheme() {
  const persisted = loadPersistedTheme();
  const theme = persisted || getSystemPreference();
  applyTheme(theme);
  if (!persisted) {
    persistTheme(theme);
  }
}
