import React from "react";
import { useNotifications } from "./NotificationContext";
import { LucideX, LucideCheckCircle2, LucideTrash2 } from "lucide-react";

export default function NotificationSidebar() {
  const {
    notifications,
    markAllRead,
    clearNotifications,
    sidebarOpen,
    setSidebarOpen,
  } = useNotifications();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col ${
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded">
          <LucideX size={20} />
        </button>
      </div>
      <div className="flex gap-2 p-4 border-b">
        <button
          onClick={markAllRead}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          <LucideCheckCircle2 size={16} /> Mark all read
        </button>
        <button
          onClick={clearNotifications}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          <LucideTrash2 size={16} /> Clear all
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-gray-400 text-center mt-10">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded border flex items-start gap-2 shadow-sm ${
                n.read ? "bg-gray-50" : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{n.message}</div>
                {n.time && (
                  <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                )}
              </div>
              {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 