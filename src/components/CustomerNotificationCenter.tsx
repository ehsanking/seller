import React, { useState } from 'react';
import { CustomerNotification } from '../types';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Truck, 
  Tag, 
  PackageCheck, 
  MessageSquare, 
  Sparkles, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';

interface CustomerNotificationCenterProps {
  notifications: CustomerNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onTriggerTestNotification?: () => void;
}

export const CustomerNotificationCenter: React.FC<CustomerNotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
  onTriggerTestNotification
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'order' | 'promo'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'order') return n.type === 'order_status' || n.type === 'back_in_stock';
    if (activeFilter === 'promo') return n.type === 'coupon' || n.type === 'promo';
    return true;
  });

  const getIconForType = (type: CustomerNotification['type']) => {
    switch (type) {
      case 'order_status':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'back_in_stock':
        return <PackageCheck className="w-4 h-4 text-emerald-600" />;
      case 'coupon':
      case 'promo':
        return <Tag className="w-4 h-4 text-purple-600" />;
      case 'ticket':
        return <MessageSquare className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center justify-center"
        title="Customer Notification Center"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over Drawer / Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 transition-all">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-400/30">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Customer Notifications</h3>
                <p className="text-[10px] text-slate-300">{unreadCount} unread update{unreadCount === 1 ? '' : 's'}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="px-2 py-1 text-[10px] font-bold text-indigo-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activeFilter === 'all' ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200' : 'text-slate-600'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activeFilter === 'unread' ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200' : 'text-slate-600'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setActiveFilter('order')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activeFilter === 'order' ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200' : 'text-slate-600'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveFilter('promo')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activeFilter === 'promo' ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200' : 'text-slate-600'
                }`}
              >
                Offers
              </button>
            </div>

            {onTriggerTestNotification && (
              <button
                type="button"
                onClick={onTriggerTestNotification}
                className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                title="Send test customer alert"
              >
                + Test Alert
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Bell className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p>No notifications in this section.</p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onMarkAsRead(item.id)}
                  className={`p-3.5 transition cursor-pointer flex items-start gap-3 relative ${
                    !item.isRead ? 'bg-indigo-50/40 hover:bg-indigo-50/80' : 'hover:bg-slate-50'
                  }`}
                >
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-4 left-2" />
                  )}

                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 ml-1">
                    {getIconForType(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.createdAt}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>

                    {item.badgeText && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCoupon(item.badgeText!);
                          }}
                          className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-mono font-bold rounded border border-purple-200 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCode === item.badgeText ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Copied Code!</span>
                            </>
                          ) : (
                            <>
                              <Tag className="w-3 h-3 text-purple-600" />
                              <span>Code: {item.badgeText}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={onClearNotifications}
              className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear List</span>
            </button>
            <span className="text-slate-400 font-mono">Live Customer Feed</span>
          </div>
        </div>
      )}
    </div>
  );
};
