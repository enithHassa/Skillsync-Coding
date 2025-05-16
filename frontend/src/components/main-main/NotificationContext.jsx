import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const NOTIF_KEY = "skillsync_notifications";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(NOTIF_KEY);
    if (stored) setNotifications(JSON.parse(stored));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = notif => {
    setNotifications(prev => [{ ...notif, id: Date.now(), read: false }, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllRead,
        clearNotifications,
        unreadCount,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 