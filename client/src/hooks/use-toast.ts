import { useState, useCallback } from 'react';

interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((data: Toast) => {
    const id = Math.random();
    setToasts((prev) => [...prev, data]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((_, i) => i !== 0));
    }, 3000);
  }, []);

  return { toast, toasts };
}
