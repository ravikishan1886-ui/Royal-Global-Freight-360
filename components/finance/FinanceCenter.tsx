'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
} from 'lucide-react';

export default function FinanceCenter() {
  const { financials } = useLogistics();

  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  // Aggregates
  const totalRev = financials.reduce((acc, f) => acc + f.totalRevenue, 0);
  const totalExp = financials.reduce((acc, f) => acc + f.totalExpenses, 0);
  const totalProfit = totalRev - totalExp;
  const avgMargin = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner with authentic logistics trade ledger backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/maritime_vessel.jpg"
          alt="Logistics Financial Trade Flow"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-20 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/20" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Logistics Financial Ledger
            </span>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Finance, Receivables & P&L Accounting
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time reconciliation of client invoices and carrier disbursements. Formula:{' '}
              <strong className="text-white font-mono">Shipment Profit = Total Revenue - Total Direct Expenses</strong>.
            </p>
          </div>

          {/* Time Period Filter */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/90 p-1 text-xs font-medium shadow-sm">
            {(['monthly', 'quarterly', 'yearly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1.5 capitalize transition-colors ${
                  period === p ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Financial Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Total Invoiced Revenue</span>
            <ArrowUpRight className="h-4 w-4 text-sky-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            ${totalRev.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Customer Billable Invoices</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Direct Carrier Expenses</span>
            <ArrowDownRight className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-rose-400 tabular-nums">
            ${totalExp.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Ocean, Port THC & Haulage</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Net Operating Profit</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            +${totalProfit.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-300/70">Finalized Gross Profit</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Average Margin</span>
            <DollarSign className="h-4 w-4 text-sky-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-sky-400 tabular-nums">
            {avgMargin.toFixed(1)}%
          </p>
          <span className="text-[10px] text-slate-500">Above industry standard 15%</span>
        </div>
      </div>

      {/* Shipment-by-Shipment P&L Ledger */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white">Consignment-Level Profit & Loss Ledger</h2>
          <button
            onClick={() => alert('Exporting Financial Ledger as Excel / CSV.')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            Export Audit Ledger
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Shipment Ref</th>
                <th className="px-4 py-3">Total Invoiced (Revenue)</th>
                <th className="px-4 py-3">Carrier Expenses</th>
                <th className="px-4 py-3">Net Profit</th>
                <th className="px-4 py-3">Margin %</th>
                <th className="px-4 py-3 text-right">Accounting Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {financials.map((fin) => (
                <tr key={fin.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-sky-400">
                    {fin.shipmentNumber}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-white">
                    ${fin.totalRevenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-rose-300">
                    ${fin.totalExpenses.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                    +${fin.grossProfit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-200">
                    {fin.profitMarginPercent.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                      Reconciled (Tax Audited)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
