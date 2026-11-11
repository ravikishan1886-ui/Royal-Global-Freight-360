'use client';

import React from 'react';
import { useLogistics, ActiveView } from '@/context/LogisticsContext';
import {
  LayoutDashboard,
  Ship,
  FileSearch,
  FileText,
  Clock,
  Calculator,
  Compass,
  Users,
  Store,
  ShieldCheck,
  Truck,
  DollarSign,
  CreditCard,
  Settings,
  Database,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const { activeView, setActiveView, activeRoleType, currentOrg } = useLogistics();

  const navItems: Array<{
    id: ActiveView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    category?: string;
    badge?: string;
  }> = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, category: 'Core Operations' },
    { id: 'shipments', label: 'Shipments Hub', icon: Ship, category: 'Core Operations', badge: 'Active' },
    { id: 'ai_docs', label: 'AI Document Studio', icon: FileSearch, category: 'AI & Documentation', badge: 'Gemini' },
    { id: 'doc_generator', label: 'Document Generator', icon: FileText, category: 'AI & Documentation' },
    { id: 'demurrage', label: 'Demurrage Radar', icon: Clock, category: 'Container & Fleet', badge: 'Alerts' },
    { id: 'rates', label: 'Freight Rates & Quotes', icon: Calculator, category: 'Commercial' },
    { id: 'tracking', label: 'Tracking & AIS', icon: Compass, category: 'Core Operations' },
    { id: 'customers', label: 'Customer CRM', icon: Users, category: 'Commercial' },
    { id: 'marketplace', label: 'Logistics Marketplace', icon: Store, category: 'Commercial' },
    { id: 'customs', label: 'Customs Clearance', icon: ShieldCheck, category: 'Partner Portals' },
    { id: 'transport', label: 'Transport & Fleet', icon: Truck, category: 'Partner Portals' },
    { id: 'finance', label: 'Finance & P&L', icon: DollarSign, category: 'Financials' },
    { id: 'subscriptions', label: 'Subscriptions & AI', icon: CreditCard, category: 'Financials' },
    { id: 'super_admin', label: 'Super Admin Control', icon: Settings, category: 'Governance' },
    { id: 'database', label: 'PostgreSQL & Supabase', icon: Database, category: 'Governance' },
  ];

  const categories = Array.from(new Set(navItems.map((item) => item.category)));

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-200 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Current Organization Info Header */}
      {!isCollapsed && (
        <div className="border-b border-slate-800/80 p-3.5">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Active Organization
              </p>
              <h2 className="truncate text-xs font-semibold text-white">{currentOrg.name}</h2>
            </div>
            <span className="shrink-0 rounded bg-sky-950/80 px-1.5 py-0.5 text-[10px] font-medium text-sky-400 border border-sky-800/40">
              {activeRoleType.replace('_', ' ')}
            </span>
          </div>
          {currentOrg.gstin && (
            <p className="mt-1 font-mono text-[10px] text-slate-500 truncate">
              GST: {currentOrg.gstin} {currentOrg.iec ? `· IEC: ${currentOrg.iec}` : ''}
            </p>
          )}
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {categories.map((category) => {
          const items = navItems.filter((i) => i.category === category);
          return (
            <div key={category} className="space-y-1">
              {!isCollapsed && category && (
                <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  {category}
                </div>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="flex-1 truncate text-left">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                          isActive
                            ? 'bg-sky-800 text-sky-100'
                            : 'bg-slate-800 text-sky-400 group-hover:bg-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom Toggle */}
      <div className="border-t border-slate-800/80 p-2">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200"
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${
              isCollapsed ? '' : 'rotate-180'
            }`}
          />
          {!isCollapsed && <span className="text-[11px]">Collapse Navigation</span>}
        </button>
      </div>
    </aside>
  );
}
