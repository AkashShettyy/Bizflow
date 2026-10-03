import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import api from "../services/api.js";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  resource?: string;
  resourceId?: string;
  createdAt: string;
}

function AppLayout() {
  const { user, tenant, logout } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Customers",
      path: "/customers",
    },
    {
      name: "Projects",
      path: "/projects",
    },
    {
      name: "Tasks",
      path: "/tasks",
    },
    {
      name: "Invoices",
      path: "/invoices",
    },
    {
      name: "Reports",
      path: "/reports",
    },
    {
      name: "Users",
      path: "/users",
    },
    {
      name: "Role & Permissions",
      path: "/role-permissions",
    },
    {
      name: "Audit Logs",
      path: "/audit-logs",
    },
  ];

  const fetchNotifications = async () => {
    try {
      const [notificationsResponse, countResponse] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread-count"),
      ]);

      setNotifications(notificationsResponse.data.data);
      setUnreadCount(countResponse.data.data.count);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 print:min-h-0 print:bg-white">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r bg-white print:hidden">
        <div className="border-b px-6 py-5">
          <h1 className="text-xl font-bold text-slate-900">BizFlow</h1>

          <p className="mt-1 truncate text-sm text-slate-500">{tenant?.name}</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-4">
          <div className="mb-3 px-2">
            <p className="truncate text-sm font-medium text-slate-900">
              {user?.name}
            </p>

            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col print:min-h-0">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 print:hidden">
          {/* Welcome */}
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>

            <p className="font-semibold text-slate-900">{user?.name}</p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications((current) => !current)}
                className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Notifications"
              >
                <span className="text-xl">🔔</span>

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 z-50 mt-2 w-96 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="font-semibold text-slate-900">
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification._id}
                          onClick={() =>
                            !notification.isRead &&
                            handleMarkAsRead(notification._id)
                          }
                          className={`w-full border-b px-4 py-3 text-left transition hover:bg-slate-50 ${
                            !notification.isRead ? "bg-blue-50" : "bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-1 text-xs ${
                                notification.isRead
                                  ? "text-slate-300"
                                  : "text-blue-500"
                              }`}
                            >
                              ●
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-medium text-slate-900">
                                  {notification.title}
                                </p>

                                {!notification.isRead && (
                                  <span className="shrink-0 text-xs font-medium text-blue-600">
                                    New
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-xs text-slate-600">
                                {notification.message}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tenant */}
            <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
              {tenant?.name}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 print:flex-none print:bg-white print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
