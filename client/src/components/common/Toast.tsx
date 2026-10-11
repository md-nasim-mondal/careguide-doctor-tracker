"use client";

import React, { createContext, useContext, useCallback, useSyncExternalStore } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

// Global event store for toast calls outside React component lifecycle if needed
type Listener = () => void;
let memoryToasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export const toast = {
  show: (type: ToastType, message: string, title?: string, duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastItem = { id, type, message, title, duration };
    memoryToasts = [...memoryToasts, newToast];
    emitChange();

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
  },
  success: (message: string, title?: string, duration?: number) => {
    toast.show("success", message, title, duration);
  },
  error: (message: string, title?: string, duration?: number) => {
    toast.show("error", message, title, duration);
  },
  info: (message: string, title?: string, duration?: number) => {
    toast.show("info", message, title, duration);
  },
  warning: (message: string, title?: string, duration?: number) => {
    toast.show("warning", message, title, duration);
  },
  dismiss: (id: string) => {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
    emitChange();
  },
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toasts = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => memoryToasts,
    () => []
  );

  const showToast = useCallback((t: Omit<ToastItem, "id">) => {
    toast.show(t.type, t.message, t.title, t.duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    toast.dismiss(id);
  }, []);

  const value: ToastContextType = {
    toasts,
    showToast,
    removeToast,
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: memoryToasts,
      showToast: (t) => toast.show(t.type, t.message, t.title, t.duration),
      removeToast: toast.dismiss,
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warning: toast.warning,
    };
  }
  return context;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-9999 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3 sm:px-0"
    >
      {toasts.map((t) => (
        <ToastItemCard key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItemCard({
  toast: t,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const config = {
    success: {
      icon: "✅",
      border: "border-success/40",
      bg: "bg-card/95 backdrop-blur-md",
      badge: "bg-success/15 text-success",
      titleColor: "text-foreground",
    },
    error: {
      icon: "❌",
      border: "border-destructive/40",
      bg: "bg-card/95 backdrop-blur-md",
      badge: "bg-destructive/15 text-destructive",
      titleColor: "text-destructive",
    },
    warning: {
      icon: "⚠️",
      border: "border-amber-500/40",
      bg: "bg-card/95 backdrop-blur-md",
      badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      titleColor: "text-foreground",
    },
    info: {
      icon: "ℹ️",
      border: "border-primary/40",
      bg: "bg-card/95 backdrop-blur-md",
      badge: "bg-primary/15 text-primary",
      titleColor: "text-foreground",
    },
  }[t.type];

  return (
    <div
      className={`pointer-events-auto rounded-xl border ${config.border} ${config.bg} p-3.5 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 flex items-start gap-3`}
      role="alert"
    >
      <div className={`p-1.5 rounded-lg text-sm shrink-0 ${config.badge}`}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0 pr-1">
        {t.title && (
          <h4 className={`text-xs font-bold leading-tight ${config.titleColor}`}>
            {t.title}
          </h4>
        )}
        <p className="text-xs text-foreground/90 mt-0.5 leading-snug wrap-break-word">
          {t.message}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground text-xs p-1 rounded-md hover:bg-muted transition shrink-0 cursor-pointer"
        aria-label="Dismiss toast"
      >
        ✕
      </button>
    </div>
  );
}
