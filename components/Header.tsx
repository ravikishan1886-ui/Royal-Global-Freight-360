'use client';

import React, { useState } from 'react';
import { useLogistics, ActiveView } from '@/context/LogisticsContext';
import { OrganizationType } from '@/types/logistics';
import { formatDisplayTime } from '@/lib/formatters';
import {
  Ship,
  Bell,
  Sparkles,
  ShieldCheck,
  Building2,
  ChevronDown,
  Globe,
  Database,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
} from 'lucide-react';

interface HeaderProps {
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
}

export default function Header({ onToggleCopilot, isCopilotOpen }: HeaderProps) {
  const {
    currentOrg,
    activeRoleType,
    setActiveRoleType,
    aiCredits,
    notifications,
    markNotificationRead,
    setActiveView,
  } = useLogistics();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const roleOptions: Array<{ type: OrganizationType | 'super_admin'; label: string; icon: string }> = [
    { type: 'freight_forwarder', label: 'Freight Forwarder (Apex Global)', icon: '🚢' },
    { type: 'exporter', label: 'Exporter (Bharat Agro & Textiles)', icon: '📦' },
    { type: 'importer', label: 'Importer (EuroTech GmbH)', icon: '🏢' },
    { type: 'customs_broker', label: 'Customs Broker (Gulf Maritime)', icon: '📋' },
    { type: 'transporter', label: 'Transporter (NorthStar Intermodal)', icon: '🚛' },
    { type: 'overseas_agent', label: 'Overseas Agent (Orient Pacific NL)', icon: '🌐' },
    { type: 'super_admin', label: 'Super Admin Platform Control', icon: '⚡' },
  ];

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur md:px-6">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 font-bold text-white shadow-sm shadow-sky-600/30">
          <Ship className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white">FREIGHTFLOW 360</span>
            <span className="text-[10px] font-medium tracking-wide uppercase text-sky-400">Enterprise</span>
          </div>
          <p className="hidden text-[11px] text-slate-400 sm:block">One Platform. Every Shipment. Complete Control.</p>
        </div>
      </div>

      {/* Role Context Switcher */}
      <div className="relative">
        <button
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
          title="Switch Active Stakeholder View"
        >
          <Building2 className="h-3.5 w-3.5 text-sky-400" />
          <span className="max-w-[140px] truncate md:max-w-none">
            {activeRoleType === 'super_admin'
              ? 'Super Admin Platform'
              : `${currentOrg.name} (${activeRoleType.replace('_', ' ')})`}
          </span>
          {currentOrg.isVerified && activeRoleType !== 'super_admin' && (
            <span title="GSTIN/IEC Verified">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        {showRoleMenu && (
          <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-xl shadow-black/60 z-50">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/80">
              Active Workspace Perspective
            </div>
            <div className="mt-1 space-y-0.5">
              {roleOptions.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => {
                    setActiveRoleType(opt.type);
                    setShowRoleMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                    activeRoleType === opt.type
                      ? 'bg-sky-600 text-white font-medium'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </span>
                  {activeRoleType === opt.type && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Zone: AI Credits, Notifications, DB Schema, AI Assistant */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Credits Widget */}
        <button
          onClick={() => setActiveView('subscriptions')}
          className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-slate-700 md:flex"
          title="AI Document Processing Credits"
        >
          <Coins className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-mono tabular-nums font-semibold text-amber-300">{aiCredits}</span>
          <span className="text-[10px] text-slate-400">Credits</span>
        </button>

        {/* Database & Supabase Schema Viewer */}
        <button
          onClick={() => setActiveView('database')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          title="PostgreSQL 33-Table Schema & Supabase Connector"
        >
          <Database className="h-3.5 w-3.5 text-indigo-400" />
          <span className="hidden lg:inline text-[11px]">DB Schema</span>
        </button>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
            title="Notification Center"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-white">Logistics Alerts & Milestones</span>
                <button
                  onClick={() => setShowNotifMenu(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 max-h-80 space-y-2 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`cursor-pointer rounded-lg p-2.5 text-xs transition-colors ${
                      notif.isRead
                        ? 'bg-slate-950/40 text-slate-400'
                        : 'bg-slate-800/80 text-slate-200 border-l-2 border-sky-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="flex items-center gap-1.5">
                        {notif.type === 'demurrage_alert' && (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        )}
                        {notif.type === 'document_discrepancy' && (
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        )}
                        {notif.type === 'clearance_update' && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        )}
                        <span className="text-white">{notif.title}</span>
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{notif.message}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{notif.shipmentNumber}</span>
                      <span>{formatDisplayTime(notif.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Copilot Trigger */}
        <button
          onClick={onToggleCopilot}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            isCopilotOpen
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 ring-1 ring-sky-300'
              : 'border border-sky-700/50 bg-sky-950/60 text-sky-300 hover:bg-sky-900/60 hover:text-white'
          }`}
          title="Open Gemini AI Logistics Copilot"
        >
          <Sparkles className="h-3.5 w-3.5 text-sky-400" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>
      </div>
    </header>
  );
}
