'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import { formatDateTime } from '@/lib/formatters';
import {
  Compass,
  Ship,
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function ShipmentTrackingRadar() {
  const { shipments, selectedShipment, setSelectedShipment, trackingEvents, addTrackingEvent } =
    useLogistics();

  const [activeShipmentId, setActiveShipmentId] = useState(
    selectedShipment?.id || shipments[0]?.id || ''
  );

  const shipment = shipments.find((s) => s.id === activeShipmentId) || shipments[0];
  const milestones = trackingEvents.filter((t) => t.shipmentId === shipment.id);

  const [customMilestone, setCustomMilestone] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMilestone.trim() || !customLocation.trim()) return;

    addTrackingEvent({
      shipmentId: shipment.id,
      milestone: customMilestone.trim() as any,
      location: customLocation.trim(),
      timestamp: new Date().toISOString(),
      isCompleted: true,
      isManual: true,
      notes: 'Manually logged by station operations executive.',
    });

    setCustomMilestone('');
    setCustomLocation('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with authentic maritime tracking backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/maritime_vessel.jpg"
          alt="Carrier AIS Tracking Vessel"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-25 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-sky-950/20" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Carrier AIS & Radar Telemetry
              </span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Unified Intermodal Cargo Tracking
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Integrates maritime AIS transponder signals, port terminal EDI feeds, and ground GPS
              checkpoints. Distinguishes confirmed carrier positions from estimated vessel schedules.
            </p>
          </div>

          {/* Shipment Selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400">Select Tracked File:</span>
            <select
              value={activeShipmentId}
              onChange={(e) => setActiveShipmentId(e.target.value)}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-mono text-sky-400 focus:outline-none focus:border-sky-500"
            >
              {shipments.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shipmentNumber} · {s.carrier}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AIS Vessel Live Position Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-sky-400" />
              <h2 className="text-base font-bold text-white">
                {shipment.vesselName || 'MSC PALOMA'} ({shipment.carrier})
              </h2>
              <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-800">
                AIS Live Connected
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Voyage: <span className="text-slate-200 font-mono">{shipment.voyageNumber || 'MP2641W'}</span> ·
              IMO: <span className="text-slate-200 font-mono">9482019</span> · MMSI: <span className="text-slate-200 font-mono">354891000</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Vessel Speed</span>
              <span className="text-emerald-400 font-bold">16.4 Knots</span>
            </div>
            <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Current Heading</span>
              <span className="text-white font-bold">284° WNW</span>
            </div>
            <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Draft Depth</span>
              <span className="text-sky-400 font-bold">14.2 m</span>
            </div>
          </div>
        </div>

        {/* Global Maritime Corridor Visual Representation */}
        <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-6 overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 mb-4 flex items-center justify-between">
            <span>Maritime Transit Corridor: Arabian Sea &rarr; Bab-el-Mandeb &rarr; Mediterranean</span>
            <span className="text-[10px] text-slate-500">Live coordinates: 24.12° N, 59.84° E</span>
          </div>

          {/* Interactive Route Segment Bar */}
          <div className="relative flex items-center justify-between py-6">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800" />
            <div className="absolute left-0 w-3/5 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="h-4 w-4 rounded-full bg-sky-500 ring-4 ring-sky-950" />
              <span className="mt-2 text-xs font-bold text-white">Nhava Sheva</span>
              <span className="text-[10px] text-slate-500">Sailed Oct 24</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="h-4 w-4 rounded-full bg-sky-500 ring-4 ring-sky-950" />
              <span className="mt-2 text-xs font-bold text-white">Gulf of Aden</span>
              <span className="text-[10px] text-slate-500">Passed Oct 29</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-emerald-950 animate-pulse flex items-center justify-center">
                <Ship className="h-3 w-3 text-slate-950" />
              </div>
              <span className="mt-2 text-xs font-bold text-emerald-400">Current Position</span>
              <span className="text-[10px] text-emerald-300/80 font-mono">16.4 kts cruising</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="h-4 w-4 rounded-full bg-slate-700 ring-4 ring-slate-900" />
              <span className="mt-2 text-xs font-bold text-slate-400">Gibraltar Strait</span>
              <span className="text-[10px] text-slate-500">ETA Nov 05</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="h-4 w-4 rounded-full bg-slate-700 ring-4 ring-slate-900" />
              <span className="mt-2 text-xs font-bold text-slate-400">Rotterdam (ECT)</span>
              <span className="text-[10px] text-slate-500">ETA Nov 08</span>
            </div>
          </div>
        </div>

        {/* Milestone Chronology Table */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Milestone Verification Chronology
          </h3>
          <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      m.isCompleted ? 'bg-sky-400' : 'bg-slate-700'
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-white">{m.milestone}</span>
                    <p className="text-[11px] text-slate-400">
                      Location: {m.location} {m.isManual && <span className="text-amber-400 font-mono">(Manual Ground Entry)</span>}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-slate-300">
                    {formatDateTime(m.timestamp)}
                  </span>
                  <div className="text-[10px] text-slate-500">
                    {m.isCompleted ? 'Confirmed Event' : 'Scheduled Milestone'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Milestone Event Logging (Operator Control) */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <h4 className="text-xs font-semibold text-white mb-2">Log Verified Ground / Terminal Milestone</h4>
          <form onSubmit={handleAddMilestone} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customMilestone}
              onChange={(e) => setCustomMilestone(e.target.value)}
              placeholder="Milestone (e.g. 'Discharged at Berth 4', 'T1 Customs Released')"
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="Location (e.g. 'Rotterdam ECT Delta Terminal')"
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition-colors"
            >
              Record Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
