import { useState } from "react";
import { Bell, X, Check, CheckCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Fetch notifications
  const { data: notifications, isLoading, refetch } = trpc.notifications.list.useQuery(
    { limit: 10, unreadOnly: false },
    { refetchInterval: 5000 } // Refetch every 5 seconds
  );

  // Fetch unread count
  const { data: unreadCount } = trpc.notifications.unreadCount.useQuery(undefined, {
    refetchInterval: 5000,
  });

  // Mutations
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate({ id });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
    toast.success("تم تحديث جميع الإشعارات");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return "🕐";
      case "warning":
        return "⚠️";
      case "salary":
        return "💰";
      case "leave":
        return "🏖️";
      case "gps_alert":
        return "📍";
      case "buddy_punch":
        return "🚨";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "attendance":
        return "bg-blue-50 border-blue-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "salary":
        return "bg-green-50 border-green-200";
      case "leave":
        return "bg-purple-50 border-purple-200";
      case "gps_alert":
        return "bg-orange-50 border-orange-200";
      case "buddy_punch":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount && unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg">الإشعارات</h3>
            <div className="flex gap-2">
              {unreadCount && unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-blue-600"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck size={16} className="ml-1" />
                  تحديد الكل
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-600 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">جاري التحميل...</div>
            ) : notifications && notifications.length > 0 ? (
              <div className="divide-y">
                {notifications?.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 border-blue-500 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString("ar-SA")}
                        </p>
                      </div>

                      {/* Actions */}
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex-shrink-0 text-blue-600 hover:text-blue-700"
                        >
                          <Check size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p>لا توجد إشعارات</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-3 border-t flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={16} className="ml-1" />
              الإعدادات
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
