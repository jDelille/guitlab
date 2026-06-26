import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabase";
import { useUser } from "../hooks/useUser";

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  link?: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  dismiss: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const { data: allNotifs } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!allNotifs) return;

    const { data: states } = await supabase
      .from("user_notification_state")
      .select("notification_id, read, dismissed")
      .eq("user_id", user.id);

    const stateMap = new Map(
      (states ?? []).map((s) => [s.notification_id, s])
    );

    const merged: Notification[] = allNotifs
      .filter((n) => !stateMap.get(n.id)?.dismissed)
      .map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        read: stateMap.get(n.id)?.read ?? false,
        createdAt: new Date(n.created_at),
        link: n.link ?? undefined,
      }));

    setNotifications(merged);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const upsertState = async (
    notificationId: string,
    patch: { read?: boolean; dismissed?: boolean }
  ) => {
    if (!user) return;
    await supabase.from("user_notification_state").upsert(
      { user_id: user.id, notification_id: notificationId, ...patch, updated_at: new Date().toISOString() },
      { onConflict: "user_id,notification_id" }
    );
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await upsertState(id, { read: true });
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await Promise.all(unread.map((n) => upsertState(n.id, { read: true })));
  };

  const dismiss = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await upsertState(id, { dismissed: true, read: true });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, dismiss }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
