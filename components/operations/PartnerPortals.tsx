'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  DollarSign,
  Phone,
  User,
  Clock,
} from 'lucide-react';

export default function PartnerPortals() {
  const {
    customsClearances,
    updateCustomsClearance,
    transportOrders,
    updateTransportOrder,
    activeRoleType,
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<'customs' | 'transport'>('customs');

  const handleToggleChecklist = (clearanceId: string, itemIdx: number) => {
    const clearance = customsClearances.find((c) => c.id === clearanceId);
    if (!clearance) return;
    const updatedChecklist = [...clearance.checklist];
    updatedChecklist[itemIdx].isVerified = !updatedChecklist[itemIdx].isVerified;
    updateCustomsClearance(clearanceId, { checklist: updatedChecklist });
  };

  const handleUpdateClearanceStatus = (clearanceId: string, status: any) => {
    updateCustomsClearance(clearanceId, { status });
  };

  const handleUpdateTransportStatus = (orderId: string, status: any) => {
    updateTransportOrder(orderId, { status });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with authentic partner operations backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/intermodal_freight.jpg"
          alt="Partner Operations Logistics"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-25 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Ecosystem Partner Operations
            </span>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Customs Clearance & Intermodal Fleet Workspaces
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Specialized operational desks for Customs Brokers (ICEGATE BOE verification, duty challans) and
              Transporters (haulage dispatch, electronic PODs).
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-medium">
        <button
          onClick={() => setActiveTab('customs')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors ${
            activeTab === 'customs'
              ? 'border-sky-500 text-sky-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Customs Broker Desk ({customsClearances.length})
        </button>
        <button
          onClick={() => setActiveTab('transport')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors ${
            activeTab === 'transport'
              ? 'border-sky-500 text-sky-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Truck className="h-4 w-4" />
          Transporter Fleet Desk ({transportOrders.length})
        </button>
      </div>

      {/* Customs Broker Desk */}
      {activeTab === 'customs' && (
        <div className="space-y-4">
          {customsClearances.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-sky-400">
                      {c.shipmentNumber}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-300 font-semibold">{c.port}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assigned Broker: <strong className="text-white">{c.customsBrokerName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase">Assessment Status</span>
                    <select
                      value={c.status}
                      onChange={(e) => handleUpdateClearanceStatus(c.id, e.target.value)}
                      className="block rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-semibold text-sky-400 focus:outline-none"
                    >
                      <option value="Documents Required">Documents Required</option>
                      <option value="Documents Under Review">Documents Under Review</option>
                      <option value="Query Raised">Query Raised</option>
                      <option value="Assessment Completed">Assessment Completed</option>
                      <option value="Duty Paid">Duty Paid</option>
                      <option value="Out of Charge (OOC)">Out of Charge (OOC)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BOE & Duty Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Bill of Entry (BOE)</span>
                  <p className="font-mono font-bold text-white text-sm mt-0.5">{c.billOfEntryNumber}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Duty Challan Amount</span>
                  <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                    ₹{c.dutyAmount.toLocaleString()} ({c.dutyPaid ? 'PAID' : 'PENDING'})
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Filing Date</span>
                  <p className="font-mono text-slate-300 mt-0.5">{c.filingDate}</p>
                </div>
              </div>

              {/* Mandatory Customs Checklist */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Statutory Customs Document Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {c.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleToggleChecklist(c.id, idx)}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:bg-slate-900 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={`h-4 w-4 ${item.isVerified ? 'text-emerald-400' : 'text-slate-600'}`}
                        />
                        <span className={item.isVerified ? 'text-slate-200' : 'text-slate-500'}>
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.isMandatory ? 'Mandatory' : 'Optional'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transporter Desk */}
      {activeTab === 'transport' && (
        <div className="space-y-4">
          {transportOrders.map((to) => (
            <div
              key={to.id}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-sky-400" />
                    <span className="font-mono text-sm font-bold text-white">
                      Vehicle: {to.vehicleNumber}
                    </span>
                    <span className="rounded bg-sky-950 px-2 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-800">
                      {to.shipmentNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Driver: <strong className="text-slate-200">{to.driverName}</strong> ({to.driverPhone})
                  </p>
                </div>

                <div>
                  <select
                    value={to.status}
                    onChange={(e) => handleUpdateTransportStatus(to.id, e.target.value)}
                    className="rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-emerald-400 focus:outline-none"
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="En Route to Pickup">En Route to Pickup</option>
                    <option value="Cargo Loaded">Cargo Loaded</option>
                    <option value="In Transit">In Transit</option>
                    <option value="At Destination">At Destination</option>
                    <option value="Delivered">Delivered</option>
                    <option value="POD Uploaded">POD Uploaded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Pickup Origin:</span>
                  <p className="text-slate-200 mt-0.5 font-medium">{to.pickupLocation}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    Scheduled: {new Date(to.scheduledPickup).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Delivery Destination:</span>
                  <p className="text-slate-200 mt-0.5 font-medium">{to.deliveryLocation}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    Delivered: {to.actualDelivery ? new Date(to.actualDelivery).toLocaleString() : 'En route'}
                  </p>
                </div>
              </div>

              {/* POD Upload & Proof */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">Electronic Proof of Delivery (e-POD):</span>
                  <span className="text-emerald-400 font-mono">Verified Sign & Stamp Attached</span>
                </div>
                <button
                  onClick={() => alert(`Opening signed e-POD receipt for ${to.vehicleNumber}`)}
                  className="rounded bg-slate-800 px-3 py-1 text-xs text-sky-400 hover:bg-slate-700"
                >
                  View Signed POD
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
