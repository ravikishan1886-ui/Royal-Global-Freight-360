'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import { ContainerType, FreightRate } from '@/types/logistics';
import {
  Calculator,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function FreightRateManager({ onOpenDocGenerator }: { onOpenDocGenerator: () => void }) {
  const { freightRates, addFreightRate } = useLogistics();

  const [selectedRate, setSelectedRate] = useState<FreightRate>(freightRates[0]);
  const [markupPercent, setMarkupPercent] = useState<number>(18);
  const [customFee, setCustomFee] = useState<number>(150);

  // New rate modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRate, setNewRate] = useState({
    vendorName: 'CMA CGM Global',
    carrier: 'CMA CGM',
    origin: 'Nhava Sheva (INNSA)',
    destination: 'Rotterdam (NLRTM)',
    containerType: '40HC' as ContainerType,
    oceanFreight: 2480,
    originCharges: 310,
    destinationCharges: 420,
    documentationFee: 65,
    otherCharges: 80,
    currency: 'USD',
    transitDays: 21,
    validityDate: '2026-11-30',
    routeType: 'Direct' as 'Direct' | 'Transshipment',
  });

  // Calculate pricing breakdown
  const baseCost =
    selectedRate.oceanFreight +
    selectedRate.originCharges +
    selectedRate.destinationCharges +
    selectedRate.documentationFee +
    selectedRate.otherCharges;

  const markupAmount = (baseCost * markupPercent) / 100;
  const totalClientPrice = baseCost + markupAmount + customFee;

  const handleAddRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFreightRate({
      ...newRate,
      vendorId: `v-${Date.now()}`,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with authentic container shipping backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/port_terminal.jpg"
          alt="Carrier Commercial Tariffs & Freight"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-25 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Commercial Rate Engine
            </span>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Freight Rates & Client Quotation Calculator
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Live carrier tariffs, origin/destination local charge matrices, margin markup calculator, and
              automated customer quotation preparation.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-600/30 hover:bg-sky-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Vendor Tariff Rate
          </button>
        </div>
      </div>

      {/* Main Grid: Rate Cards & Live Profit Calculator */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Available Rates Matrix (2 cols) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Live Carrier Freight Matrix</h2>
            <div className="space-y-3">
              {freightRates.map((rate) => {
                const isSelected = selectedRate.id === rate.id;
                const totalCost =
                  rate.oceanFreight +
                  rate.originCharges +
                  rate.destinationCharges +
                  rate.documentationFee +
                  rate.otherCharges;

                return (
                  <div
                    key={rate.id}
                    onClick={() => setSelectedRate(rate)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-950/30 ring-1 ring-sky-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{rate.carrier}</span>
                          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-sky-400">
                            {rate.containerType}
                          </span>
                          <span className="text-xs text-slate-500">·</span>
                          <span className="text-xs text-slate-400">{rate.routeType}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-300">
                          {rate.origin} &rarr; {rate.destination} · {rate.transitDays} Transit Days
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase">Total Landed Base</span>
                        <div className="font-mono text-base font-bold text-sky-400">
                          {rate.currency} ${totalCost.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          Valid till {rate.validityDate}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-4 gap-2 border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                      <div>Ocean: <span className="font-mono text-slate-200">${rate.oceanFreight}</span></div>
                      <div>Origin THC: <span className="font-mono text-slate-200">${rate.originCharges}</span></div>
                      <div>Dest THC: <span className="font-mono text-slate-200">${rate.destinationCharges}</span></div>
                      <div>Doc Fee: <span className="font-mono text-slate-200">${rate.documentationFee}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Profit Margin & Quotation Calculator (1 col) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-emerald-400">
            <Calculator className="h-4 w-4" />
            <h2 className="text-sm font-bold text-white">Quotation Profit Margin Builder</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400">Selected Carrier Tariff:</span>
              <p className="font-semibold text-white mt-0.5">
                {selectedRate.carrier} ({selectedRate.containerType})
              </p>
              <p className="font-mono text-sky-400 text-xs">
                Base Carrier Cost: ${baseCost.toLocaleString()}
              </p>
            </div>

            {/* Margin Slider */}
            <div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Target Profit Margin:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{markupPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(Number(e.target.value))}
                className="mt-2 w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>+5%</span>
                <span>+15% (Typical)</span>
                <span>+25%</span>
                <span>+40%</span>
              </div>
            </div>

            {/* Extra Brokerage / Handling Fee */}
            <div>
              <label className="text-slate-300 font-medium">Local Customs & Handling Fee ($):</label>
              <input
                type="number"
                value={customFee}
                onChange={(e) => setCustomFee(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Calculations Breakdown */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Direct Carrier Freight:</span>
                <span className="font-mono text-slate-200">${baseCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Gross Margin ({markupPercent}%):</span>
                <span className="font-mono text-emerald-400 font-bold">
                  +${Math.round(markupAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Brokerage / Agency:</span>
                <span className="font-mono text-slate-200">+${customFee}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold text-white">
                <span>Final Client Price:</span>
                <span className="font-mono text-sky-400 text-base">
                  ${Math.round(totalClientPrice).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={onOpenDocGenerator}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
            >
              <Download className="h-4 w-4" />
              Prepare Client Quotation PDF
            </button>
          </div>
        </div>
      </div>

      {/* Add New Rate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              Add Shipping Line Tariff Rate
            </h3>
            <form onSubmit={handleAddRateSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400">Carrier</label>
                  <input
                    type="text"
                    value={newRate.carrier}
                    onChange={(e) => setNewRate({ ...newRate, carrier: e.target.value })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Container Type</label>
                  <select
                    value={newRate.containerType}
                    onChange={(e) => setNewRate({ ...newRate, containerType: e.target.value as any })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  >
                    <option value="20GP">20GP</option>
                    <option value="40GP">40GP</option>
                    <option value="40HC">40HC</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400">Ocean Freight ($)</label>
                  <input
                    type="number"
                    value={newRate.oceanFreight}
                    onChange={(e) => setNewRate({ ...newRate, oceanFreight: Number(e.target.value) })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Origin THC ($)</label>
                  <input
                    type="number"
                    value={newRate.originCharges}
                    onChange={(e) => setNewRate({ ...newRate, originCharges: Number(e.target.value) })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded px-4 py-2 border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-500"
                >
                  Save Tariff Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
