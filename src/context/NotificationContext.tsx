'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NotificationType = 'system' | 'success' | 'error';

interface NotificationData {
  title: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  isVisible: boolean;
  notification: NotificationData | null;
  showNotification: (title: string, message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showNotification = useCallback((title: string, message: string, type: NotificationType) => {
    // Clear any existing timeout to prevent race conditions
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new notification
    setNotification({ title, message, type });
    setIsVisible(true);

    // Auto-hide after 5 seconds
    const newTimeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    setTimeoutId(newTimeoutId);
  }, [timeoutId]);

  return (
    <NotificationContext.Provider value={{ isVisible, notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
