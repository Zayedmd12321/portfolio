'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NotificationType = 'system' | 'success' | 'error';

interface NotificationData {
  title: string;
  message: string;
  type: NotificationType;
  onClick?: () => void; // ✅ Added click handler support
}

interface NotificationContextType {
  isVisible: boolean;
  notification: NotificationData | null;
  showNotification: (title: string, message: string, type: NotificationType, onClick?: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showNotification = useCallback((title: string, message: string, type: NotificationType, onClick?: () => void) => {
    if (timeoutId) clearTimeout(timeoutId);

    setNotification({ title, message, type, onClick });
    setIsVisible(true);

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