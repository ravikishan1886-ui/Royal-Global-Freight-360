'use client';

import React, { useState } from 'react';
import { useLogistics } from '@/context/LogisticsContext';
import { Shipment, TransportMode } from '@/types/logistics';
import { formatDisplayDate } from '@/lib/formatters';
import {
  Ship,
  FileText,
  Clock,
  Compass,
  DollarSign,
  MessageSquare,
  CheckSquare,
  History,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Download,
  Send,
  Upload,
  Calendar,
  Layers,
  Shield,
  FileCheck,
  User,
  ArrowLeft,
  Share2,
} from 'lucide-react';

interface ShipmentDetailViewProps {
  shipment: Shipment;
  onBack: () => void;
  onOpenDocStudio: () => void;
  onOpenDocGenerator: () => void;
}

export default function ShipmentDetailView({
  shipment,
  onBack,
  onOpenDocStudio,
  onOpenDocGenerator,
}: ShipmentDetailViewProps) {
  const {
    documents,
    trackingEvents,
    validationReports,
    financials,
    updateShipment,
    activeRoleType,
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'documents' | 'tracking' | 'quotations' | 'communication' | 'financials' | 'tasks' | 'history'
  >('overview');

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'Rajesh Nair (Operations Manager)',
      role: 'Freight Forwarder',
      time: '2026-10-24 10:15',
      text: 'Leads confirmed with MSC Booking desk. LEO received from customs. Vessel departure expected at 18:00.',
    },
    {
      id: 'm2',
      sender: 'Vikram Joshi (Customs Broker)',
      role: 'Customs House Agency',
      time: '2026-10-23 16:20',
      text: 'Let Export Order (LEO) passed by JNCH appraising officer. Shipping bill sent to shipping line agent.',
    },
    {
      id: 'm3',
      sender: 'Karan Patel (Exporter)',
      role: 'Shipper',
      time: '2026-10-21 14:00',
      text: 'Commercial Invoice and Packing List uploaded. Please check if gross weight requires calibration slip.',
    },
  ]);

  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Collect VGM Slip from Container Terminal', role: 'Operations', done: true },
    { id: 't2', title: 'Submit Shipping Instructions to MSC Line', role: 'Documentation', done: true },
    { id: 't3', title: 'Cross-Audit Commercial Invoice vs Packing List with Gemini', role: 'Compliance', done: true },
    { id: 't4', title: 'Obtain Original Bill of Lading (3/3)', role: 'Documentation', done: false },
    { id: 't5', title: 'Issue Destination Arrival Notice to Consignee', role: 'Overseas Agent', done: false },
    { id: 't6', title: 'Surrender BL & Issue Delivery Order (D/O)', role: 'Overseas Agent', done: false },
  ]);

  const shipmentDocs = documents.filter((d) => d.shipmentId === shipment.id);
  const shipmentTracking = trackingEvents.filter((t) => t.shipmentId === shipment.id);
  const shipmentFinance = financials.find((f) => f.shipmentId === shipment.id);
  const auditReport = validationReports[shipment.id];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      id: `m-${Date.now()}`,
      sender: `Active Operator (${activeRoleType.replace('_', ' ')})`,
      role: activeRoleType.replace('_', ' '),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newMessage.trim(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Back to Shipment Register"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-sky-400">
                {shipment.shipmentNumber}
              </span>
              <span className="rounded bg-sky-950 px-2 py-0.5 text-[10px] font-semibold text-sky-300 border border-sky-800">
                {shipment.status}
              </span>
              {shipment.isBlDraft && (
                <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-800">
                  BL Draft
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {shipment.origin} &rarr; {shipment.destination} · {shipment.commodity}
            </p>
          </div>
        </div>

        {/* Header Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenDocStudio}
            className="flex items-center gap-1.5 rounded-lg border border-purple-600/60 bg-purple-950/60 px-3 py-1.5 text-xs font-semibold text-purple-200 transition-colors hover:bg-purple-900"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            AI Discrepancy Audit
          </button>
          <button
            onClick={onOpenDocGenerator}
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-sky-500"
          >
            <FileText className="h-3.5 w-3.5" />
            Generate Document PDF
          </button>
        </div>
      </div>

      {/* The 8 Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950 px-2 text-xs">
        {[
          { id: 'overview', label: '1. Overview', icon: Layers },
          { id: 'documents', label: '2. Documents & AI', icon: FileText, badge: shipmentDocs.length },
          { id: 'tracking', label: '3. Tracking & Milestones', icon: Compass },
          { id: 'quotations', label: '4. Quotations & Rates', icon: DollarSign },
          { id: 'communication', label: '5. Communication', icon: MessageSquare, badge: messages.length },
          { id: 'financials', label: '6. Financials & P&L', icon: DollarSign },
          { id: 'tasks', label: '7. Tasks & Clearances', icon: CheckSquare },
          { id: 'history', label: '8. History & Audit', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-3 font-medium transition-colors border-b-2 ${
                isActive
                  ? 'border-sky-500 text-sky-400 bg-slate-900/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Key Consignment Details */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
                Core Logistics & Route Parameters
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Shipper / Exporter</span>
                  <p className="font-semibold text-slate-200">{shipment.shipperName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Consignee / Importer</span>
                  <p className="font-semibold text-slate-200">{shipment.consigneeName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Port of Loading (POL)</span>
                  <p className="font-semibold text-slate-200">{shipment.portOfLoading}</p>
                </div>
                <div>
                  <span className="text-slate-500">Port of Discharge (POD)</span>
                  <p className="font-semibold text-slate-200">{shipment.portOfDischarge}</p>
                </div>
                <div>
                  <span className="text-slate-500">Transport Mode</span>
                  <p className="font-semibold text-slate-200">
                    {shipment.transportMode} · Incoterm: {shipment.incoterms}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Carrier & Vessel</span>
                  <p className="font-semibold text-slate-200">
                    {shipment.carrier} · {shipment.vesselName || 'Scheduled'} {shipment.voyageNumber || ''}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Booking Number</span>
                  <p className="font-mono font-semibold text-slate-200">{shipment.bookingNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">Bill of Lading Number</span>
                  <p className="font-mono font-semibold text-sky-400">
                    {shipment.blNumber} {shipment.isBlDraft && '(DRAFT - NON-NEGOTIABLE)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Cargo Measurements */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
                Cargo Specifications & Packing
              </h2>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-950">
                  <span className="text-slate-500">Gross Weight</span>
                  <p className="font-mono font-bold text-base text-white tabular-nums">
                    {shipment.grossWeightKg.toLocaleString()} kg
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950">
                  <span className="text-slate-500">Net Weight</span>
                  <p className="font-mono font-bold text-base text-slate-300 tabular-nums">
                    {shipment.netWeightKg.toLocaleString()} kg
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950">
                  <span className="text-slate-500">Total Packages</span>
                  <p className="font-mono font-bold text-base text-white tabular-nums">
                    {shipment.packageQuantity} Packages
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950">
                  <span className="text-slate-500">Volume</span>
                  <p className="font-mono font-bold text-base text-slate-300 tabular-nums">
                    {shipment.volumeCbm} CBM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Ecosystem Partners (Sidebar) */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
                Assigned Stakeholders
              </h2>
              <div className="mt-3 space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Customs Broker</span>
                  <p className="font-semibold text-slate-200">{shipment.customsBrokerName || 'Pending Assignment'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Transporter / Fleet</span>
                  <p className="font-semibold text-slate-200">{shipment.transporterName || 'Pending Assignment'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Overseas Destination Agent</span>
                  <p className="font-semibold text-slate-200">{shipment.overseasAgentName || 'Direct Delivery'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Account Manager</span>
                  <p className="font-semibold text-slate-200">{shipment.assignedManager}</p>
                </div>
              </div>
            </div>

            {/* Containers summary */}
            {shipment.containers.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
                  Containers ({shipment.containers.length})
                </h2>
                <div className="mt-3 space-y-2">
                  {shipment.containers.map((cnt) => (
                    <div key={cnt.id} className="p-2 rounded bg-slate-950 text-xs font-mono">
                      <div className="flex justify-between font-bold text-sky-400">
                        <span>{cnt.containerNumber}</span>
                        <span>{cnt.containerType}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                        <span>Seal: {cnt.sealNumber}</span>
                        <span>Tare: {cnt.tareWeightKg}kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Documents & AI Audit */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Consignment Trade Documents</h2>
              <p className="text-xs text-slate-400">
                Commercial Invoice, Packing List, BL Draft, Shipping Instructions, and automated Gemini cross-checks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDocStudio}
                className="flex items-center gap-1.5 rounded-lg border border-purple-600 bg-purple-950/80 px-3 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-900"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                Run Gemini Audit
              </button>
            </div>
          </div>

          {/* AI Audit Report Card if Available */}
          {auditReport && (
            <div className="rounded-xl border border-amber-900/70 bg-gradient-to-r from-amber-950/30 to-slate-900 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="font-semibold text-sm text-white">
                    Gemini AI Discrepancy Audit: Status {auditReport.status}
                  </span>
                  <span className="rounded bg-amber-950 px-2 py-0.5 font-mono text-[11px] text-amber-400 border border-amber-800">
                    Risk Score: {auditReport.overallRiskScore}/100
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Validated: {formatDisplayDate(auditReport.validatedAt)}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-300 leading-relaxed">{auditReport.summary}</p>

              {/* Discrepancies Table */}
              <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Field</th>
                      <th className="p-2.5">Commercial Invoice</th>
                      <th className="p-2.5">Packing List</th>
                      <th className="p-2.5">Severity</th>
                      <th className="p-2.5">Customs Risk Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {auditReport.discrepancies.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-semibold text-white">{d.field}</td>
                        <td className="p-2.5 font-mono text-sky-400">{d.invoiceValue}</td>
                        <td className="p-2.5 font-mono text-amber-400">{d.packingListValue}</td>
                        <td className="p-2.5">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              d.severity === 'critical'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : d.severity === 'high'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {d.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400">{d.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Document Files List */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Stored File Versions</h3>
            <div className="space-y-2">
              {shipmentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-sky-400" />
                    <div>
                      <span className="font-semibold text-slate-200">{doc.name}</span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{doc.type}</span>
                        <span>·</span>
                        <span>{doc.fileSize}</span>
                        <span>·</span>
                        <span>v{doc.version}</span>
                        {doc.isDraft && <span className="text-amber-400 font-bold">(DRAFT BL)</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                        doc.status === 'verified'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {doc.status}
                    </span>
                    <button
                      onClick={() => alert(`Downloading verified copy of ${doc.name}`)}
                      className="rounded bg-slate-800 p-1.5 text-slate-300 hover:text-white"
                      title="Download Original"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tracking & Milestones */}
      {activeTab === 'tracking' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">End-to-End Tracking Timeline</h2>
              <p className="text-xs text-slate-400">
                Carrier EDI / AIS vessel tracking for {shipment.carrier} ({shipment.vesselName || 'Scheduled'})
              </p>
            </div>
            <span className="font-mono text-xs text-sky-400">
              Vessel Speed: 16.4 kts · Lat/Long: 22.4°N, 68.2°E
            </span>
          </div>

          <div className="mt-6 space-y-6">
            {shipmentTracking.map((milestone, idx) => (
              <div key={milestone.id} className="relative flex gap-4">
                {/* Connecting Line */}
                {idx !== shipmentTracking.length - 1 && (
                  <div
                    className={`absolute left-3 top-6 bottom-0 w-0.5 ${
                      milestone.isCompleted ? 'bg-sky-500' : 'bg-slate-800'
                    }`}
                  />
                )}
                {/* Dot */}
                <div
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    milestone.isCompleted
                      ? 'border-sky-500 bg-sky-600 text-white shadow-sm'
                      : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                {/* Content */}
                <div className="flex-1 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-white">{milestone.milestone}</span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {new Date(milestone.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-400">
                    Location: <strong className="text-slate-200">{milestone.location}</strong>
                  </p>
                  {milestone.notes && (
                    <p className="mt-1 text-[11px] text-slate-500 italic">{milestone.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Quotations & Rates */}
      {activeTab === 'quotations' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
            Commercial Freight Quotation
          </h2>
          <div className="mt-4 p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs space-y-3">
            <div className="flex justify-between font-bold text-white border-b border-slate-800 pb-2">
              <span>Item Description</span>
              <span>Amount (USD)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Ocean Freight (2 x 40HC @ $2,450)</span>
              <span className="font-mono">$4,900.00</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Origin Terminal Handling Charges (THC)</span>
              <span className="font-mono">$640.00</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Documentation & BL Issuance</span>
              <span className="font-mono">$120.00</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Customs Clearance Brokerage</span>
              <span className="font-mono">$150.00</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Forwarder Operating Margin (+18%)</span>
              <span className="font-mono text-emerald-400">+$1,045.00</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-3 text-sm font-bold text-white">
              <span>Total Client Quote Amount</span>
              <span className="font-mono text-sky-400 text-base">$6,855.00</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Communication */}
      {activeTab === 'communication' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
            Connected Multi-Stakeholder Thread
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sky-400">{m.sender}</span>
                  <span className="text-[10px] text-slate-500">{m.time}</span>
                </div>
                <p className="mt-1.5 text-slate-300 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Post update to shipper, broker, trucker, and agent..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500"
            >
              <Send className="h-3.5 w-3.5" />
              Send
            </button>
          </form>
        </div>
      )}

      {/* Tab 6: Financials & P&L */}
      {activeTab === 'financials' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Shipment Profit & Loss Statement</h2>
              <p className="text-xs text-slate-400">Formula: Shipment Profit = Total Revenue - Total Expenses</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase">Gross Profit</span>
              <p className="font-mono text-lg font-bold text-emerald-400">
                +${shipmentFinance?.grossProfit.toLocaleString() || '1,300'} (
                {shipmentFinance?.profitMarginPercent || '17.5'}%)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Revenue Column */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h3 className="font-semibold text-sky-400 mb-2">Customer Receivables (Revenue)</h3>
              <div className="space-y-2">
                {shipmentFinance?.revenueItems.map((r) => (
                  <div key={r.id} className="flex justify-between border-b border-slate-900 pb-1">
                    <span className="text-slate-300">{r.description}</span>
                    <span className="font-mono text-white font-semibold">${r.amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                <span>Total Invoiced Revenue</span>
                <span className="font-mono text-sky-400">${shipmentFinance?.totalRevenue}</span>
              </div>
            </div>

            {/* Expenses Column */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h3 className="font-semibold text-rose-400 mb-2">Carrier & Vendor Payables (Expenses)</h3>
              <div className="space-y-2">
                {shipmentFinance?.expenseItems.map((e) => (
                  <div key={e.id} className="flex justify-between border-b border-slate-900 pb-1">
                    <span className="text-slate-300">{e.vendorName} ({e.category})</span>
                    <span className="font-mono text-rose-300 font-semibold">${e.amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                <span>Total Direct Expenses</span>
                <span className="font-mono text-rose-400">${shipmentFinance?.totalExpenses}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Tasks & Clearances */}
      {activeTab === 'tasks' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
            Operations & Customs Task Execution
          </h2>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  task.done
                    ? 'border-emerald-900/40 bg-emerald-950/20 text-slate-400 line-through'
                    : 'border-slate-800 bg-slate-950 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare
                    className={`h-4 w-4 ${task.done ? 'text-emerald-400' : 'text-slate-500'}`}
                  />
                  <span className="text-xs">{task.title}</span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                  {task.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: History & Audit */}
      {activeTab === 'history' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-xs">
          <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
            Immutable Audit Trail & Changelog
          </h2>
          <div className="space-y-2 font-mono text-[11px] text-slate-400">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span>[2026-10-24 18:00:00Z] Status updated to &apos;In Transit&apos; by MSC Paloma Departure AIS feed.</span>
              <span className="text-slate-500">System</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span>[2026-10-23 16:20:00Z] Customs LEO granted. BOE cleared by Gulf Maritime CHA.</span>
              <span className="text-slate-500">Vikram Joshi</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span>[2026-10-20 12:00:00Z] Gemini Document Validation Audit AUD-8842 generated (Score: 42).</span>
              <span className="text-purple-400">Gemini 3.8</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span>[2026-10-18 10:00:00Z] Shipment file FF360-2026-000842 initiated for Bharat Agro.</span>
              <span className="text-slate-500">Rajesh Nair</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
