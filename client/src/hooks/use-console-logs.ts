import { useState, useEffect } from 'react';

export function useConsoleLogs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev.slice(-49), message]);
      originalLog(...args);
    };

    console.error = (...args) => {
      const message = '❌ ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev.slice(-49), message]);
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  return logs;
}
