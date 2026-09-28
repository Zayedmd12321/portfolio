'use client';
import React, { createContext, useContext, useState, useCallback, useMemo, useRef, ReactNode } from 'react';

export type NotificationType = 'system' | 'success' | 'error';

interface NotificationData {
  title: string;
  message: string;
  type: NotificationType;
  onClick?: () => void;
}

interface NotificationState {
  isVisible: boolean;
  notification: NotificationData | null;
}

interface NotificationApi {
  showNotification: (title: string, message: string, type: NotificationType, onClick?: () => void) => void;
}

// Split into two contexts so that showing a notification only re-renders the
// <Notification> component (which reads state), not every consumer that just
// wants to call showNotification (which reads the stable API).
const NotificationStateContext = createContext<NotificationState | undefined>(undefined);
const NotificationApiContext = createContext<NotificationApi | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotificationState>({ isVisible: false, notification: null });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = useCallback(
    (title: string, message: string, type: NotificationType, onClick?: () => void) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState({ isVisible: true, notification: { title, message, type, onClick } });
      timeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isVisible: false }));
      }, 5000);
    },
    [],
  );

  const api = useMemo<NotificationApi>(() => ({ showNotification }), [showNotification]);

  return (
    <NotificationApiContext.Provider value={api}>
      <NotificationStateContext.Provider value={state}>
        {children}
      </NotificationStateContext.Provider>
    </NotificationApiContext.Provider>
  );
}

export function useNotificationState() {
  const ctx = useContext(NotificationStateContext);
  if (ctx === undefined) throw new Error('useNotificationState must be used within a NotificationProvider');
  return ctx;
}

export function useNotificationApi() {
  const ctx = useContext(NotificationApiContext);
  if (ctx === undefined) throw new Error('useNotificationApi must be used within a NotificationProvider');
  return ctx;
}

// Backwards-compatible combined hook: re-renders on any state change, so
// prefer useNotificationApi / useNotificationState when possible.
export function useNotification() {
  return { ...useNotificationState(), ...useNotificationApi() };
}
