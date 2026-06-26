import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationPanel.scss";

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: Props) => {
  const { notifications, markAsRead, markAllAsRead, dismiss } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className={`notif-panel${isOpen ? " notif-panel--open" : ""}`}>
      <div className="notif-panel__header">
        <span className="notif-panel__title">Notifications</span>
        {notifications.some((n) => !n.read) && (
          <button className="notif-panel__mark-all" onClick={markAllAsRead}>
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="notif-panel__empty">You're all caught up!</div>
      ) : (
        <ul className="notif-panel__list">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`notif-panel__item${n.read ? "" : " notif-panel__item--unread"}${n.link ? " notif-panel__item--linked" : ""}`}
              onClick={() => {
                markAsRead(n.id);
                if (n.link) { navigate(n.link); onClose(); }
              }}
            >
              <div className="notif-panel__item-content">
                <span className="notif-panel__item-title">{n.title}</span>
                <span className="notif-panel__item-body">{n.body}</span>
                <span className="notif-panel__item-time">{timeAgo(n.createdAt)}</span>
              </div>
              <button
                className="notif-panel__dismiss"
                onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                aria-label="Dismiss"
              >
                <IoClose size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
