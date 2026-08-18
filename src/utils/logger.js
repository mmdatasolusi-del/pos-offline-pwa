import { APP_CONFIG } from '../config/app.config.js';

const PREFIX = '[POS]';

let enabled = APP_CONFIG.debugMode;

export function initLogger(config) {
  enabled = config?.debugMode ?? false;
}

function formatArgs(args) {
  return [PREFIX, ...args];
}

export const logger = {
  info(...args) {
    if (enabled) console.info(...formatArgs(args));
  },
  warn(...args) {
    if (enabled) console.warn(...formatArgs(args));
  },
  error(...args) {
    console.error(...formatArgs(args));
  },
  debug(...args) {
    if (enabled) console.debug(...formatArgs(args));
  },
  log(...args) {
    if (enabled) console.log(...formatArgs(args));
  },
};
