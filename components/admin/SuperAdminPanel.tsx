'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import {
  Settings,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Cpu,
  Layers,
} from 'lucide-react';

export default function SuperAdminPanel() {
  const { organizations, shipments } = useLogistics();

  const [orgList, setOrgList] = useState(organizations);

  const toggleVerify = (orgId: string) => {
    setOrgList((prev) =>
      prev.map((o) =>
        o.id === orgId
          ? {
              ...o,
              isVerified: !o.isVerified,
              verificationBadge: !o.isVerified ? 'verified' : 'unverified',
            }
          : o
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with authentic ecosystem platform backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-900/50 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/air_cargo.jpg"
          alt="Platform Governance Infrastructure"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-20 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-rose-950/25" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Platform Owner Operations
            </span>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Super Administrator Governance
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Central tenant verification, organization regulatory compliance audits (GSTIN/IEC), dispute
              management, and system-wide telemetry.
            </p>
          </div>

          <div className="rounded-xl border border-rose-800/60 bg-rose-950/60 p-3 text-right shadow-sm">
            <span className="text-[10px] text-rose-300 uppercase font-semibold">Security Clearance</span>
            <p className="font-bold text-sm text-white">Super Admin Tier 1</p>
            <span className="text-[10px] text-slate-400">Role-Based Database Isolation</span>
          </div>
        </div>
      </div>

      {/* Platform Telemetry Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400">Total Tenanted Orgs</span>
          <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {orgList.length}
          </p>
          <span className="text-[10px] text-emerald-400 font-medium">All isolated workspaces</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400">Platform Recurring MRR</span>
          <p className="mt-2 font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            ₹1,42,800
          </p>
          <span className="text-[10px] text-slate-500">Across 6 tenant tiers</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400">Gemini 3.8 Flash Uptime</span>
          <p className="mt-2 font-mono text-2xl font-bold text-purple-400 tabular-nums">
            99.98%
          </p>
          <span className="text-[10px] text-purple-300">Avg token latency: 840ms</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400">Active Audit Disputes</span>
          <p className="mt-2 font-mono text-2xl font-bold text-sky-400 tabular-nums">
            0
          </p>
          <span className="text-[10px] text-slate-500">Zero arbitration escalations</span>
        </div>
      </div>

      {/* Organization Verification & KYC Review Board */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Organization Verification & KYC Compliance Desk
            </h2>
            <p className="text-xs text-slate-400">
              Only verified entities receive the blue shield verification mark in the Marketplace.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Organization Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">GSTIN & IEC Registry</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">KYC Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {orgList.map((org) => (
                <tr key={org.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{org.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {org.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {org.city}, {org.country}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-300">
                    {org.gstin ? `GST: ${org.gstin}` : 'Overseas Non-GST'}
                    {org.iec && <span className="text-slate-500 block">IEC: {org.iec}</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                        org.isVerified
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {org.isVerified && <ShieldCheck className="h-3 w-3" />}
                      {org.isVerified ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleVerify(org.id)}
                      className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                        org.isVerified
                          ? 'border border-rose-800 text-rose-400 hover:bg-rose-950'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {org.isVerified ? 'Revoke Badge' : 'Grant Verified Badge'}
                    </button>
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
