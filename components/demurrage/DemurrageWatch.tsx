'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import { Container } from '@/types/logistics';
import { formatShortDate } from '@/lib/formatters';
import {
  Clock,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  DollarSign,
  Boxes,
  Bell,
  CheckCircle2,
  Ship,
  Info,
} from 'lucide-react';

export default function DemurrageWatch() {
  const { containers, shipments } = useLogistics();

  const [filterCarrier, setFilterCarrier] = useState('ALL');

  // Compute status for each container based on current simulated date (2026-11-05)
  const now = new Date('2026-11-05T08:00:00Z').getTime();

  const containerStatusList = containers.map((cnt) => {
    const lfdTime = cnt.lastFreeDay ? new Date(cnt.lastFreeDay).getTime() : now + 86400000 * 7;
    const diffDays = Math.ceil((lfdTime - now) / (1000 * 3600 * 24));
    const isOverdue = diffDays < 0;
    const overdueDays = isOverdue ? Math.abs(diffDays) : 0;
    const estimatedPenalty = overdueDays * cnt.dailyDetentionRate;

    return {
      ...cnt,
      diffDays,
      isOverdue,
      overdueDays,
      estimatedPenalty,
      urgency: isOverdue ? 'overdue' : diffDays <= 4 ? 'warning' : 'safe',
    };
  });

  const filteredContainers = containerStatusList.filter((c) => {
    if (filterCarrier === 'ALL') return true;
    return c.carrier.includes(filterCarrier);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with authentic container terminal field backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-900/60 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/port_terminal.jpg"
          alt="Port Container Terminal Demurrage"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-25 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/25" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Container Detention & Demurrage Watchdog
              </span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Terminal Free Time & Empty Return Clock
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Proactive tracking of terminal dwell time and shipping line per-diem detention rates. Prevent
              unexpected carrier demurrage penalties through automated early warnings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800 text-right shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Simulated Clock</span>
              <div className="font-mono text-xs font-bold text-sky-400 tabular-nums">05 Nov 2026 · 08:00 UTC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400">Total Tracked Boxes</span>
          <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {containers.length}
          </p>
          <span className="text-[10px] text-slate-500">Across Maersk, MSC, Hapag</span>
        </div>

        <div className="rounded-xl border border-amber-900/40 bg-slate-900/80 p-4">
          <span className="text-xs text-amber-400 font-semibold">Approaching LFD (&le;4 Days)</span>
          <p className="mt-2 font-mono text-2xl font-bold text-amber-400 tabular-nums">
            {containerStatusList.filter((c) => c.urgency === 'warning').length}
          </p>
          <span className="text-[10px] text-amber-300/70">Urgent customs clearance needed</span>
        </div>

        <div className="rounded-xl border border-rose-900/40 bg-slate-900/80 p-4">
          <span className="text-xs text-rose-400 font-semibold">Overdue Boxes</span>
          <p className="mt-2 font-mono text-2xl font-bold text-rose-400 tabular-nums">
            {containerStatusList.filter((c) => c.urgency === 'overdue').length}
          </p>
          <span className="text-[10px] text-rose-300/70">Detention accruing daily</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400">Projected Per-Diem Accrual</span>
          <p className="mt-2 font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            $0.00
          </p>
          <span className="text-[10px] text-slate-500">Zero active penalties</span>
        </div>
      </div>

      {/* Carrier Filter */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
        <span className="text-slate-400 font-medium">Filter Shipping Line Tariff:</span>
        <button
          onClick={() => setFilterCarrier('ALL')}
          className={`rounded px-2.5 py-1 ${
            filterCarrier === 'ALL' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Carriers
        </button>
        <button
          onClick={() => setFilterCarrier('MSC')}
          className={`rounded px-2.5 py-1 ${
            filterCarrier === 'MSC' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          MSC Mediterranean
        </button>
        <button
          onClick={() => setFilterCarrier('Maersk')}
          className={`rounded px-2.5 py-1 ${
            filterCarrier === 'Maersk' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          Maersk Line
        </button>
        <button
          onClick={() => setFilterCarrier('Hapag-Lloyd')}
          className={`rounded px-2.5 py-1 ${
            filterCarrier === 'Hapag-Lloyd' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          Hapag-Lloyd
        </button>
      </div>

      {/* Active Container Radar Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Container No. / Type</th>
                <th className="px-4 py-3">Shipping Line</th>
                <th className="px-4 py-3">Arrival Date</th>
                <th className="px-4 py-3">Free Days Allowed</th>
                <th className="px-4 py-3">Last Free Day (LFD)</th>
                <th className="px-4 py-3">Days Remaining</th>
                <th className="px-4 py-3 text-right">Daily Detention</th>
                <th className="px-4 py-3 text-center">Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredContainers.map((cnt) => (
                <tr key={cnt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-white">{cnt.containerNumber}</span>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Type: {cnt.containerType} · Seal: {cnt.sealNumber}
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-200">{cnt.carrier}</td>

                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                    {formatShortDate(cnt.arrivalDate)}
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono text-slate-200">
                      {cnt.terminalFreeDays} Port / {cnt.carrierFreeDays} Carrier
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono font-semibold text-slate-200">
                    {formatShortDate(cnt.lastFreeDay)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`font-mono font-bold ${
                        cnt.isOverdue
                          ? 'text-rose-400'
                          : cnt.diffDays <= 4
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {cnt.isOverdue
                        ? `${cnt.overdueDays} Days Overdue`
                        : `${cnt.diffDays} Days Free Left`}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-200">
                    {cnt.currency} ${cnt.dailyDetentionRate}/day
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                        cnt.urgency === 'overdue'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : cnt.urgency === 'warning'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {cnt.urgency.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demurrage Calculator & Free-Time Rules Guide */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2 text-sky-400 border-b border-slate-800 pb-2">
            <Info className="h-4 w-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">
              Carrier Free-Time Rulebook Reference
            </h3>
          </div>
          <div className="mt-3 space-y-2 text-xs text-slate-400">
            <p>
              <strong className="text-white">Demurrage:</strong> Fee incurred while container is inside
              the terminal beyond allowed terminal free time (usually 3–5 days).
            </p>
            <p>
              <strong className="text-white">Detention:</strong> Fee incurred after container gates out
              until the empty container is returned to carrier&apos;s designated empty depot (usually 10–14 days).
            </p>
            <p>
              <strong className="text-white">Per Diem Tiers:</strong> Days 1–5 beyond free time: standard rate;
              Days 6+ beyond free time: 1.5x escalated tariff.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-2">
            <CheckCircle2 className="h-4 w-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">
              Automated Mitigation Actions
            </h3>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-300">Fast-Track Customs Out of Charge (OOC)</span>
              <button
                onClick={() => alert('Fast-track notice dispatched to Gulf Maritime Customs Broker.')}
                className="text-sky-400 hover:underline"
              >
                Dispatch Alert
              </button>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-300">Prioritize NorthStar Trailer Pickup for Container MRKU7102948</span>
              <button
                onClick={() => alert('Drayage order priority elevated to Urgent with Transporter.')}
                className="text-amber-400 hover:underline"
              >
                Elevate Priority
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
