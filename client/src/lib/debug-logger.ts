// Simple localStorage-based logger that works in Farcaster frames
const MAX_LOGS = 100;
const LOG_KEY = 'COPE_DEBUG_LOGS';

export const debugLog = {
  log: (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const msg = `[${timestamp}] ${message}`;
    const fullMsg = data ? `${msg} ${JSON.stringify(data)}` : msg;
    
    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    const updated = [fullMsg, ...existing].slice(0, MAX_LOGS);
    localStorage.setItem(LOG_KEY, JSON.stringify(updated));
    
    // Also log to console
    console.log(msg, data || '');
  },

  error: (message: string, error?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const msg = `❌ [${timestamp}] ${message}`;
    const fullMsg = error ? `${msg} ${JSON.stringify(error)}` : msg;
    
    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    const updated = [fullMsg, ...existing].slice(0, MAX_LOGS);
    localStorage.setItem(LOG_KEY, JSON.stringify(updated));
    
    // Also log to console
    console.error(msg, error || '');
  },

  getLogs: (): string[] => {
    return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  },

  clear: () => {
    localStorage.removeItem(LOG_KEY);
  },
};
