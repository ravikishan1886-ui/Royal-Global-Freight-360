'use client';

import React from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import { formatShortDate } from '@/lib/formatters';
import {
  Ship,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Truck,
  CheckCircle2,
  Building,
  ArrowRight,
  Sparkles,
  FileText,
  Boxes,
  Plus,
} from 'lucide-react';

export default function MasterDashboard({
  onOpenCreateShipment,
}: {
  onOpenCreateShipment: () => void;
}) {
  const {
    activeRoleType,
    currentOrg,
    shipments,
    containers,
    documents,
    validationReports,
    setActiveView,
    setSelectedShipment,
    transportOrders,
    customsClearances,
    marketplaceEnquiries,
    customers,
  } = useLogistics();

  // Metrics computation
  const activeShipments = shipments.filter(
    (s) => s.status !== 'Delivered' && s.status !== 'Closed'
  );
  const completedShipments = shipments.filter(
    (s) => s.status === 'Delivered' || s.status === 'Closed'
  );
  const pendingDocs = documents.filter((d) => d.status === 'pending_review');
  const criticalReports = Object.values(validationReports).filter(
    (r) => r.status === 'WARNING' || r.status === 'FAILED'
  );

  // Demurrage at-risk containers: lastFreeDay within 4 days or overdue
  const atRiskContainers = containers.filter((c) => {
    if (!c.lastFreeDay) return false;
    const lfd = new Date(c.lastFreeDay).getTime();
    const now = new Date('2026-11-04T12:00:00Z').getTime();
    const diffDays = (lfd - now) / (1000 * 3600 * 24);
    return diffDays <= 4;
  });

  // Role: Freight Forwarder Dashboard
  if (activeRoleType === 'freight_forwarder') {
    return (
      <div className="space-y-6">
        {/* Welcome Banner with authentic maritime field backdrop */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <Image
            src="/images/maritime_vessel.jpg"
            alt="Maritime Container Vessel"
            fill
            referrerPolicy="no-referrer"
            className="object-cover object-center opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

          <div className="relative z-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  Operations Nerve Center
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400">{currentOrg.name}</span>
              </div>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
                Global Freight Forwarding Command
              </h1>
              <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
                Monitoring {activeShipments.length} active multi-modal movements across Nhava Sheva, Mundra,
                Chennai, Rotterdam, and Hamburg with live Gemini documentation checks.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setActiveView('ai_docs')}
                className="flex items-center gap-1.5 rounded-lg border border-sky-600/50 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-sky-200 transition-colors hover:bg-slate-800 shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                AI Doc Cross-Audit
              </button>
              <button
                onClick={onOpenCreateShipment}
                className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-600/30 transition-colors hover:bg-sky-500"
              >
                <Plus className="h-3.5 w-3.5" />
                New Shipment Booking
              </button>
            </div>
          </div>
        </div>

        {/* Operational KPI Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Active Shipments</span>
              <Ship className="h-4 w-4 text-sky-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tabular-nums text-white">
                {activeShipments.length}
              </span>
              <span className="text-[11px] text-slate-400">of {shipments.length} total</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>{completedShipments.length} Delivered</span>
              <button
                onClick={() => setActiveView('shipments')}
                className="text-sky-400 hover:underline"
              >
                View all &rarr;
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Demurrage At-Risk</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tabular-nums text-amber-400">
                {atRiskContainers.length}
              </span>
              <span className="text-[11px] text-amber-200/70">containers &le;4 days LFD</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Jebel Ali Port / Rotterdam</span>
              <button
                onClick={() => setActiveView('demurrage')}
                className="text-amber-400 hover:underline"
              >
                Inspect clocks &rarr;
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">AI Document Audits</span>
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tabular-nums text-purple-300">
                {criticalReports.length}
              </span>
              <span className="text-[11px] text-rose-400 font-medium">Discrepancy Flags</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Weight & Package checks</span>
              <button
                onClick={() => setActiveView('ai_docs')}
                className="text-purple-400 hover:underline"
              >
                Audit Studio &rarr;
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Net Gross Profit</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tabular-nums text-emerald-400">
                $18,450
              </span>
              <span className="text-[11px] text-emerald-300/80">+17.5% margin</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Revenue - Carrier Bills</span>
              <button
                onClick={() => setActiveView('finance')}
                className="text-emerald-400 hover:underline"
              >
                P&L Ledger &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Active Shipments & Demurrage Alarm Dual Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Shipments Pipeline (2 cols) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Live Cargo Consignments</h2>
                <p className="text-[11px] text-slate-400">Real-time status across maritime & air trade lanes</p>
              </div>
              <button
                onClick={() => setActiveView('shipments')}
                className="text-xs font-medium text-sky-400 hover:text-sky-300"
              >
                View all ({shipments.length})
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-800/80">
              {shipments.map((ship) => (
                <div
                  key={ship.id}
                  onClick={() => {
                    setSelectedShipment(ship);
                    setActiveView('shipments');
                  }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 hover:bg-slate-800/40 rounded-lg px-2 cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-400">
                        {ship.shipmentNumber}
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs font-medium text-slate-200">{ship.customerName}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400 border border-slate-700">
                        {ship.transportMode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {ship.origin} &rarr; {ship.destination} ·{' '}
                      <span className="text-slate-300">{ship.commodity}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
                          ship.status === 'In Transit'
                            ? 'bg-sky-950 text-sky-400 border border-sky-800'
                            : ship.status === 'Customs Clearance'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : ship.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {ship.status}
                      </span>
                      <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                        ETA: {formatShortDate(ship.eta)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Demurrage Watch & AI Discrepancy Spotlight (1 col) */}
          <div className="space-y-4">
            {/* Demurrage Clock Box */}
            <div className="rounded-xl border border-amber-900/50 bg-gradient-to-b from-amber-950/20 to-slate-900 p-4">
              <div className="flex items-center justify-between text-amber-400">
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <Clock className="h-4 w-4" />
                  Demurrage Free Days Countdown
                </span>
                <span className="text-[10px] font-medium text-amber-300/80">Carrier Tariffs</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {containers.slice(0, 2).map((cnt) => (
                  <div key={cnt.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {cnt.containerNumber} ({cnt.containerType})
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-amber-400">
                        {cnt.lastFreeDay ? '2 Days Left' : 'Nominal'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{cnt.carrier.split(' ')[0]}</span>
                      <span className="font-mono text-rose-400 font-semibold">
                        ${cnt.dailyDetentionRate}/day per diem
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveView('demurrage')}
                className="mt-3 w-full rounded-lg bg-amber-500/10 py-1.5 text-center text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
              >
                Manage Demurrage & Deadlines &rarr;
              </button>
            </div>

            {/* AI Discrepancy Spotlight */}
            <div className="rounded-xl border border-purple-900/50 bg-gradient-to-b from-purple-950/20 to-slate-900 p-4">
              <div className="flex items-center justify-between text-purple-300">
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  Gemini Discrepancy Radar
                </span>
                <span className="text-[10px] font-mono text-purple-400">CI vs PL</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-300 leading-relaxed">
                Shipment <strong className="text-white">FF360-2026-000842</strong>: Gross weight mismatch
                (+500 kg) and carton quantity discrepancy (960 vs 980) detected.
              </p>
              <div className="mt-2 rounded bg-purple-950/60 p-2 text-[10px] font-mono text-purple-200 border border-purple-800/40">
                Risk Score: 42/100 · 2 Action items pending human sign-off
              </div>
              <button
                onClick={() => setActiveView('ai_docs')}
                className="mt-3 w-full rounded-lg bg-purple-600 px-3 py-1.5 text-center text-xs font-semibold text-white transition-colors hover:bg-purple-500 shadow-sm"
              >
                Review & Resolve Audit &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Role: Exporter Dashboard
  if (activeRoleType === 'exporter') {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <Image
            src="/images/port_terminal.jpg"
            alt="Export Container Terminal"
            fill
            referrerPolicy="no-referrer"
            className="object-cover object-center opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  Exporter Hub
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="rounded bg-sky-950/80 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-sky-800">
                  Star Export House
                </span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Bharat Agro & Textiles Exports</h1>
              <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
                GSTIN: <span className="font-mono text-slate-200">24AAACB9876K1Z2</span> · IEC:{' '}
                <span className="font-mono text-slate-200">0812045678</span> · Outward containerized shipments via JNPT & Mundra.
              </p>
            </div>
            <button
              onClick={() => setActiveView('marketplace')}
              className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-600/30 hover:bg-sky-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Post Shipment Enquiry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Active Export Bookings</span>
            <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">3 Shipments</p>
            <span className="text-[10px] text-slate-500">To Rotterdam, Jebel Ali</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Marketplace Quotations</span>
            <p className="mt-2 font-mono text-2xl font-bold text-sky-400 tabular-nums">4 Bids Received</p>
            <span className="text-[10px] text-slate-500">From Verified Forwarders</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Pending Commercial Docs</span>
            <p className="mt-2 font-mono text-2xl font-bold text-amber-400 tabular-nums">1 Packing List</p>
            <span className="text-[10px] text-slate-500">Weight clarification needed</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Total Cargo Value</span>
            <p className="mt-2 font-mono text-2xl font-bold text-emerald-400 tabular-nums">$348,200</p>
            <span className="text-[10px] text-slate-500">Inward Remittance Expected</span>
          </div>
        </div>

        {/* Active Export Bookings */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-white">Current Export Consignments</h2>
          <div className="mt-4 divide-y divide-slate-800">
            {shipments.slice(0, 2).map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-sky-400">{s.shipmentNumber}</span>
                  <p className="text-xs text-slate-300">{s.commodity}</p>
                  <p className="text-[11px] text-slate-500">
                    {s.portOfLoading} &rarr; {s.portOfDischarge} · Carrier: {s.carrier}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded bg-sky-950 px-2 py-0.5 text-[10px] font-semibold text-sky-300 border border-sky-800">
                    {s.status}
                  </span>
                  <p className="mt-1 font-mono text-[10px] text-slate-400">ETA: {formatShortDate(s.eta)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Role: Importer Dashboard
  if (activeRoleType === 'importer') {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <Image
            src="/images/maritime_vessel.jpg"
            alt="Inbound Ocean Carrier"
            fill
            referrerPolicy="no-referrer"
            className="object-cover object-center opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Importer Destination Portal
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                European Inward Consignments
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">EuroTech Precision Importers GmbH</h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Hamburg Commercial Register <span className="font-mono text-slate-200">HRB 84920</span> · VAT ID:{' '}
              <span className="font-mono text-slate-200">DE 294819204</span> · Direct customs bond for Rotterdam and Hamburg ports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Inward Shipments</span>
            <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">2 Consignments</p>
            <span className="text-[10px] text-slate-500">Due at Rotterdam & Hamburg</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Expected Arrival (ETA)</span>
            <p className="mt-2 font-mono text-2xl font-bold text-sky-400 tabular-nums">Nov 08, 2026</p>
            <span className="text-[10px] text-slate-500">MSC Paloma (Rotterdam)</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Customs Clearance</span>
            <p className="mt-2 font-mono text-2xl font-bold text-amber-400 tabular-nums">Pending LEO</p>
            <span className="text-[10px] text-slate-500">T1 Transit Doc Ready</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Duty & Tax Obligations</span>
            <p className="mt-2 font-mono text-2xl font-bold text-emerald-400 tabular-nums">€8,450</p>
            <span className="text-[10px] text-slate-500">Import VAT & Customs Duty</span>
          </div>
        </div>

        {/* Incoming Shipment Milestones */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-white">Consignment Inward Tracker</h2>
          <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-sky-400">FF360-2026-000842</span>
                <p className="text-xs text-slate-200 mt-0.5">2x40HC Combed Organic Cotton Yarns</p>
              </div>
              <span className="rounded bg-sky-950 px-2 py-0.5 text-[10px] text-sky-300 font-semibold border border-sky-800">
                In Transit · Mediterranean
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900">
                <span className="text-[10px] text-slate-400">Shipper</span>
                <p className="text-white font-medium truncate">Bharat Agro & Textiles</p>
              </div>
              <div className="p-2 rounded bg-slate-900">
                <span className="text-[10px] text-slate-400">Overseas Agent</span>
                <p className="text-white font-medium truncate">Orient Pacific NL</p>
              </div>
              <div className="p-2 rounded bg-slate-900">
                <span className="text-[10px] text-slate-400">Free Days at POD</span>
                <p className="text-emerald-400 font-bold font-mono">14 Days Carrier Free</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Role: Customs Broker Dashboard
  if (activeRoleType === 'customs_broker') {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <Image
            src="/images/port_terminal.jpg"
            alt="Port Terminal Examination"
            fill
            referrerPolicy="no-referrer"
            className="object-cover object-center opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Customs House Brokerage Console
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-800">
                ICEGATE Gateway Live
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Gulf Maritime Customs Agency</h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              JNCH License: <span className="font-mono text-slate-200">CHA-11/2012</span> · Indian Customs EDI gateway connected. Handling automated Bill of Entry checks & Out of Charge.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Assigned Shipments</span>
            <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">4 Consignments</p>
            <span className="text-[10px] text-slate-500">JNPT & Chennai Ports</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Pending Bill of Entry</span>
            <p className="mt-2 font-mono text-2xl font-bold text-amber-400 tabular-nums">1 Under Review</p>
            <span className="text-[10px] text-slate-500">Appraising Officer Query</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Doc Verification Check</span>
            <p className="mt-2 font-mono text-2xl font-bold text-rose-400 tabular-nums">1 Weight Mismatch</p>
            <span className="text-[10px] text-slate-500">FF360-2026-000842 flagged</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Duty Challans Cleared</span>
            <p className="mt-2 font-mono text-2xl font-bold text-emerald-400 tabular-nums">₹84,500</p>
            <span className="text-[10px] text-slate-500">Out of Charge Issued</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white">Customs Clearance Queue</h2>
            <button
              onClick={() => setActiveView('customs')}
              className="text-xs text-sky-400 hover:underline"
            >
              Open Customs Workspace &rarr;
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {customsClearances.map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">{c.shipmentNumber}</span>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-800">
                    {c.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>BOE Number: <strong className="text-white font-mono">{c.billOfEntryNumber}</strong></span>
                  <span>Port: {c.port}</span>
                  <span className="font-mono text-emerald-400 font-semibold">Duty: ₹{c.dutyAmount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Role: Transporter Dashboard
  if (activeRoleType === 'transporter') {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <Image
            src="/images/intermodal_freight.jpg"
            alt="Intermodal Freight Fleet"
            fill
            referrerPolicy="no-referrer"
            className="object-cover object-center opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Fleet & Intermodal Logistics
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="rounded bg-sky-950/80 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-sky-800">
                42 Heavy Multi-Axle Trailers
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">NorthStar Intermodal Logistics</h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              First-mile and last-mile container drayage with satellite GPS telematics across the Ahmedabad-JNPT and Mundra corridors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Active Transport Orders</span>
            <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">{transportOrders.length} Trips</p>
            <span className="text-[10px] text-slate-500">First / Last Mile Drayage</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Trailers On Road</span>
            <p className="mt-2 font-mono text-2xl font-bold text-sky-400 tabular-nums">18 Trailers</p>
            <span className="text-[10px] text-slate-500">Ahmedabad to JNPT Corridor</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">e-PODs Verified</span>
            <p className="mt-2 font-mono text-2xl font-bold text-emerald-400 tabular-nums">100% On-Time</p>
            <span className="text-[10px] text-slate-500">Gate-in receipts uploaded</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Pending Haulage Invoices</span>
            <p className="mt-2 font-mono text-2xl font-bold text-amber-400 tabular-nums">₹48,500</p>
            <span className="text-[10px] text-slate-500">Payment in 15 days</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white">Transport Trip Dispatch & Delivery</h2>
            <button
              onClick={() => setActiveView('transport')}
              className="text-xs text-sky-400 hover:underline"
            >
              Open Transport Hub &rarr;
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {transportOrders.map((to) => (
              <div key={to.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">Trip: {to.vehicleNumber}</span>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-800">
                    {to.status}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-300">
                  <p>Route: {to.pickupLocation} &rarr; {to.deliveryLocation}</p>
                  <p className="text-slate-500 mt-1">Driver: {to.driverName} ({to.driverPhone})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Role: Overseas Agent Dashboard
  if (activeRoleType === 'overseas_agent') {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <Image
            src="/images/maritime_vessel.jpg"
            alt="Overseas Destination Agency"
            fill
            referrerPolicy="no-referrer"
            className="object-cover object-center opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Overseas Destination Network
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-800">
                Rating: 4.9/5.0
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Orient Pacific Express Maritime Ltd</h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Rotterdam Maasvlakte Port Agency · Handling destination BL surrender, cargo arrival notices, and Delivery Order (D/O) releases.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Inbound Assigned</span>
            <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">6 Consignments</p>
            <span className="text-[10px] text-slate-500">From Indian & Asian Ports</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Arrival Notices Sent</span>
            <p className="mt-2 font-mono text-2xl font-bold text-sky-400 tabular-nums">4 Notices</p>
            <span className="text-[10px] text-slate-500">Consignees notified</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Delivery Orders (D/O)</span>
            <p className="mt-2 font-mono text-2xl font-bold text-emerald-400 tabular-nums">2 Ready</p>
            <span className="text-[10px] text-slate-500">BL Surrendered</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400">Agency Profit Share</span>
            <p className="mt-2 font-mono text-2xl font-bold text-purple-400 tabular-nums">€3,280</p>
            <span className="text-[10px] text-slate-500">Handling fee margin</span>
          </div>
        </div>
      </div>
    );
  }

  // Role: Super Admin Dashboard
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/air_cargo.jpg"
          alt="Ecosystem Infrastructure"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-25 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Super Admin Governance Console
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="rounded bg-rose-950/80 px-2 py-0.5 text-[10px] font-mono text-rose-300 border border-rose-800">
              Ecosystem Root Access
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Platform Ecosystem Control</h1>
          <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
            Multi-tenant workspace isolation, KYC verification approvals, Razorpay subscription MRR, and autonomous Gemini AI auditing telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400">Total Organizations</span>
          <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">6 Verified</p>
          <span className="text-[10px] text-emerald-400">100% KYC Approved</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400">Platform MRR</span>
          <p className="mt-2 font-mono text-2xl font-bold text-emerald-400 tabular-nums">₹1,42,000</p>
          <span className="text-[10px] text-slate-500">Razorpay Subscriptions</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400">Gemini AI Invocations</span>
          <p className="mt-2 font-mono text-2xl font-bold text-purple-400 tabular-nums">1,240 calls</p>
          <span className="text-[10px] text-purple-300">Avg latency: 1.1s</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400">Dispute Rate</span>
          <p className="mt-2 font-mono text-2xl font-bold text-sky-400 tabular-nums">0.0%</p>
          <span className="text-[10px] text-slate-500">Zero active escalations</span>
        </div>
      </div>
    </div>
  );
}
