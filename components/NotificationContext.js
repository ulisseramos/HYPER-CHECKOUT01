import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifs, setNotifs] = useState([]);

  const addNotification = useCallback((notif) => {
    setNotifs((prev) => [
      { ...notif, id: Math.random().toString(36).slice(2), unread: true },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifs((prev) => prev.map(n => ({ ...n, unread: false })));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifs, addNotification, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
} 