import React, { useState } from 'react';
import { Bell, CheckCheck, ShieldAlert, ShieldX, Info, Filter } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const NotificationsPage = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useProducts();
  const [selectedTab, setSelectedTab] = useState('All');

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedTab === 'Warranty') return notif.type === 'expiring_soon' || notif.type === 'expired';
    if (selectedTab === 'Service') return notif.type === 'service_update';
    if (selectedTab === 'System') return notif.type === 'system';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-sm text-slate-500 mt-0.5">Automated internal system alerts for warranty expirations and maintenance updates</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-indigo-600" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="card-saas p-2 flex items-center gap-1 overflow-x-auto">
        {['All', 'Warranty', 'Service', 'System'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedTab === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab === 'All' ? 'All Alerts' : `${tab} Alerts`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="card-saas divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No notifications found under this category.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => markNotificationRead(notif._id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                !notif.read ? 'bg-indigo-50/40 hover:bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                    notif.type === 'expiring_soon'
                      ? 'bg-amber-100 text-amber-700'
                      : notif.type === 'expired'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {notif.type === 'expiring_soon' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : notif.type === 'expired' ? (
                    <ShieldX className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  <span className="text-[11px] text-slate-400 font-medium mt-2 block">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(notif._id);
                  }}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-sm"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
