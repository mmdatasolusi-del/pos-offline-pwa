export const THEME_CONFIG = Object.freeze({
  defaultTheme: 'light',
  storageKey: 'pos_theme',
  themes: ['light', 'dark'],
  colorTokens: {
    primary: { 50: '#EFF6FF', 100: '#DBEAFE', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
    success: { 50: '#F0FDF4', 500: '#22C55E', 600: '#16A34A' },
    warning: { 50: '#FEFCE8', 500: '#EAB308', 600: '#CA8A04' },
    danger: { 50: '#FEF2F2', 500: '#EF4444', 600: '#DC2626' },
    gray: { 50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 500: '#6B7280', 700: '#374151', 900: '#111827' },
  },
});
