'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import { Shipment, TransportMode, ShipmentStatus } from '@/types/logistics';
import { formatShortDate } from '@/lib/formatters';
import {
  Ship,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  Plane,
  Truck,
  Box,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface ShipmentListProps {
  onOpenCreate: () => void;
  onSelectShipment: (shipment: Shipment) => void;
}

export default function ShipmentList({ onOpenCreate, onSelectShipment }: ShipmentListProps) {
  const { shipments } = useLogistics();
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.blNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMode = modeFilter === 'ALL' || s.transportMode === modeFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

    return matchesSearch && matchesMode && matchesStatus;
  });

  const getModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'Air Freight':
        return <Plane className="h-3.5 w-3.5 text-sky-400" />;
      case 'Road Freight':
        return <Truck className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <Ship className="h-3.5 w-3.5 text-indigo-400" />;
    }
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'In Transit':
        return 'bg-sky-950 text-sky-400 border border-sky-800';
      case 'Customs Clearance':
        return 'bg-amber-950 text-amber-400 border border-amber-800';
      case 'Delivered':
        return 'bg-emerald-950 text-emerald-400 border border-emerald-800';
      case 'Arrived':
        return 'bg-purple-950 text-purple-400 border border-purple-800';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner with authentic ocean freight backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/maritime_vessel.jpg"
          alt="International Freight Register"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-25 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Core Master Register
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">Multi-Modal Freight Files</span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Central Shipment Register
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Total of <span className="font-mono text-white font-semibold">{shipments.length}</span> active international freight files
              with live multi-party tracking, container dwell monitoring, and verified document vaults.
            </p>
          </div>
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-600/30 transition-colors hover:bg-sky-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Create New Shipment
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Shipment ID, BL#, Carrier, Commodity, Port..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>

        {/* Mode Filter */}
        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
        >
          <option value="ALL">All Modes</option>
          <option value="FCL">FCL Ocean</option>
          <option value="LCL">LCL Ocean</option>
          <option value="Air Freight">Air Freight</option>
          <option value="Road Freight">Road Freight</option>
          <option value="Project Cargo">Project Cargo</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="In Transit">In Transit</option>
          <option value="Customs Clearance">Customs Clearance</option>
          <option value="Arrived">Arrived</option>
          <option value="Delivered">Delivered</option>
          <option value="Booking Confirmed">Booking Confirmed</option>
        </select>
      </div>

      {/* High-Density Data Grid */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Shipment ID / BL</th>
                <th className="px-4 py-3">Shipper & Consignee</th>
                <th className="px-4 py-3">Trade Lane</th>
                <th className="px-4 py-3">Mode & Cargo</th>
                <th className="px-4 py-3">Vessel / Carrier</th>
                <th className="px-4 py-3 text-right">Schedule (ETD / ETA)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredShipments.map((ship) => (
                <tr
                  key={ship.id}
                  onClick={() => onSelectShipment(ship)}
                  className="cursor-pointer transition-colors hover:bg-slate-800/50"
                >
                  {/* Shipment ID & BL */}
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-sky-400">{ship.shipmentNumber}</div>
                    <div className="font-mono text-[11px] text-slate-500">
                      BL: {ship.blNumber} {ship.isBlDraft && <span className="text-amber-400 font-semibold">(DRAFT)</span>}
                    </div>
                  </td>

                  {/* Customer / Shipper */}
                  <td className="px-4 py-3 max-w-[180px]">
                    <div className="truncate font-medium text-slate-200">{ship.shipperName}</div>
                    <div className="truncate text-[11px] text-slate-500">&rarr; {ship.consigneeName}</div>
                  </td>

                  {/* Trade Lane */}
                  <td className="px-4 py-3">
                    <div className="text-slate-200">{ship.portOfLoading}</div>
                    <div className="text-[11px] text-slate-500">&rarr; {ship.portOfDischarge}</div>
                  </td>

                  {/* Mode & Cargo */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 font-medium text-slate-200">
                      {getModeIcon(ship.transportMode)}
                      <span>{ship.transportMode}</span>
                      <span className="text-[10px] text-slate-400">({ship.incoterms})</span>
                    </div>
                    <div className="truncate text-[11px] text-slate-400 max-w-[170px]">
                      {ship.commodity}
                    </div>
                  </td>

                  {/* Carrier / Vessel */}
                  <td className="px-4 py-3">
                    <div className="text-slate-200">{ship.carrier}</div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {ship.vesselName ? `${ship.vesselName} ${ship.voyageNumber || ''}` : 'Scheduled'}
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-4 py-3 text-right">
                    <div className="font-mono text-[11px] text-slate-400">
                      ETD: {formatShortDate(ship.etd)}
                    </div>
                    <div className="font-mono font-semibold text-slate-200">
                      ETA: {formatShortDate(ship.eta)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(ship.status)}`}>
                      {ship.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectShipment(ship);
                      }}
                      className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-sky-600 hover:text-white transition-colors"
                    >
                      Open File
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredShipments.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No shipments match the selected filters or search terms.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
