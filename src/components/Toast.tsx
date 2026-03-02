import React, { useState, useEffect, useCallback } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
}

// Global toast state
let toastTimeout: ReturnType<typeof setTimeout> | null = null;
let listeners: Array<(msg: string, vis: boolean) => void> = [];

export function showToast(msg: string) {
  if (toastTimeout) clearTimeout(toastTimeout);
  listeners.forEach(l => l(msg, true));
  toastTimeout = setTimeout(() => {
    listeners.forEach(l => l(msg, false));
  }, 2400);
}

export const Toast: React.FC = () => {
  const [state, setState] = useState<ToastProps>({ message: '', visible: false });

  useEffect(() => {
    const listener = (message: string, visible: boolean) => {
      setState({ message, visible });
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-7 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-[13px] font-bold z-[999] whitespace-nowrap shadow-[0_4px_24px_rgba(0,0,0,0.2)] tracking-[-0.01em] pointer-events-none transition-transform duration-300 ease-out ${
        state.visible ? 'translate-y-0' : 'translate-y-[60px]'
      }`}
    >
      {state.message}
    </div>
  );
};
