'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import { MarketplaceEnquiry, MarketplaceBid, TransportMode } from '@/types/logistics';
import {
  Store,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function LogisticsMarketplace() {
  const {
    marketplaceEnquiries,
    addMarketplaceEnquiry,
    marketplaceBids,
    addMarketplaceBid,
    currentOrg,
    activeRoleType,
  } = useLogistics();

  const [selectedEnquiry, setSelectedEnquiry] = useState<MarketplaceEnquiry>(
    marketplaceEnquiries[0]
  );
  const [showPostModal, setShowPostModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);

  // New enquiry form
  const [newEnquiry, setNewEnquiry] = useState({
    origin: 'Nhava Sheva (INNSA)',
    destination: 'Hamburg (DEHAM)',
    transportMode: 'FCL' as TransportMode,
    commodity: 'Pharmaceutical API Intermediate Drums',
    approxWeightKg: 18500,
    targetShipmentDate: '2026-12-10',
    targetRate: 2100,
    currency: 'USD',
  });

  // Bid form
  const [bidAmount, setBidAmount] = useState<number>(2250);
  const [transitDays, setTransitDays] = useState<number>(24);
  const [bidCarrier, setBidCarrier] = useState('Hapag-Lloyd');
  const [bidNotes, setBidNotes] = useState('Includes 14 days destination free time at Hamburg.');

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    addMarketplaceEnquiry({
      ...newEnquiry,
      exporterOrgId: currentOrg.id,
      exporterOrgName: currentOrg.name,
      isVerifiedExporter: currentOrg.isVerified,
      status: 'Open for Bids',
    });
    setShowPostModal(false);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    addMarketplaceBid({
      enquiryId: selectedEnquiry.id,
      forwarderOrgId: currentOrg.id,
      forwarderOrgName: currentOrg.name,
      forwarderRating: 4.9,
      isVerifiedForwarder: true,
      bidAmount,
      transitDays,
      carrier: bidCarrier,
      validUntil: '2026-11-20',
      status: 'Submitted',
      notes: bidNotes,
    });
    setShowBidModal(false);
  };

  const bidsForCurrent = marketplaceBids.filter((b) => b.enquiryId === selectedEnquiry?.id);

  return (
    <div className="space-y-6">
      {/* Top Banner with authentic air/ocean cargo marketplace backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/air_cargo.jpg"
          alt="Global Air & Ocean Freight Marketplace"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-25 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Verified B2B Freight Marketplace
              </span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Global Spot Enquiries & Forwarder Bidding
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Exporters publish shipment enquiries to verified freight forwarders. Compare quotes, transit
              times, carrier reliability, and negotiate spot rates securely.
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-600/30 hover:bg-sky-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Post Freight Enquiry
          </button>
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Enquiries Feed (2 cols) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Open Cargo Enquiries for Bidding</h2>
            <div className="space-y-3">
              {marketplaceEnquiries.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                return (
                  <div
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-950/30 ring-1 ring-sky-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{enq.exporterOrgName}</span>
                          {enq.isVerifiedExporter && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Verified Exporter
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-300">
                          {enq.origin} &rarr; {enq.destination} · Mode: {enq.transportMode}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase">Target Rate</span>
                        <div className="font-mono text-base font-bold text-emerald-400">
                          {enq.currency} ${enq.targetRate ? enq.targetRate.toLocaleString() : 'Open Bid'}
                        </div>
                        <span className="text-[10px] text-sky-400 font-semibold">
                          {enq.bidsCount} Bids Submitted
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                      <span>Commodity: <strong className="text-slate-200">{enq.commodity}</strong></span>
                      <span>Target Sailing: {enq.targetShipmentDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Enquiry Details & Bidding Room (1 col) */}
        {selectedEnquiry && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-400">Enquiry File</span>
                <h3 className="text-sm font-bold text-white">{selectedEnquiry.commodity}</h3>
              </div>
              <span className="rounded bg-sky-950 px-2 py-0.5 text-[10px] text-sky-300 border border-sky-800">
                {selectedEnquiry.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Route:</span>
                  <span className="font-semibold text-white">
                    {selectedEnquiry.origin} &rarr; {selectedEnquiry.destination}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Sailing:</span>
                  <span className="font-mono text-slate-200">{selectedEnquiry.targetShipmentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Weight:</span>
                  <span className="font-mono text-slate-200">{selectedEnquiry.approxWeightKg} kg</span>
                </div>
              </div>

              {/* Bids List for this enquiry */}
              <div>
                <h4 className="text-xs font-semibold text-white mb-2">
                  Submitted Forwarder Quotations ({bidsForCurrent.length})
                </h4>
                {bidsForCurrent.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic p-3 rounded bg-slate-950 text-center">
                    No quotations submitted yet for this lane. Be the first to quote!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {bidsForCurrent.map((bid) => (
                      <div key={bid.id} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                        <div className="flex justify-between">
                          <span className="font-semibold text-sky-400">{bid.forwarderOrgName}</span>
                          <span className="font-mono font-bold text-emerald-400">${bid.bidAmount}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Carrier: {bid.carrier} · {bid.transitDays} Days
                        </p>
                        {bid.notes && <p className="text-[10px] text-slate-500 mt-1">{bid.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Bid Button */}
              <button
                onClick={() => setShowBidModal(true)}
                className="w-full rounded-lg bg-sky-600 py-2.5 font-bold text-white hover:bg-sky-500 transition-colors shadow-md"
              >
                Submit Forwarder Quotation Bid
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Post Enquiry Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              Post Cargo Enquiry to Marketplace
            </h3>
            <form onSubmit={handleCreateEnquiry} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Port of Loading</label>
                  <input
                    type="text"
                    value={newEnquiry.origin}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, origin: e.target.value })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Port of Discharge</label>
                  <input
                    type="text"
                    value={newEnquiry.destination}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, destination: e.target.value })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Commodity</label>
                  <input
                    type="text"
                    value={newEnquiry.commodity}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, commodity: e.target.value })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Target Budget ($)</label>
                  <input
                    type="number"
                    value={newEnquiry.targetRate}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, targetRate: Number(e.target.value) })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="rounded px-4 py-2 border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-500">
                  Publish Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              Submit Quotation for {selectedEnquiry?.commodity}
            </h3>
            <form onSubmit={handleSubmitBid} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Quote Price ($ USD)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Transit Time (Days)</label>
                  <input
                    type="number"
                    value={transitDays}
                    onChange={(e) => setTransitDays(Number(e.target.value))}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 font-mono text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-400">Proposed Ocean Carrier</label>
                  <input
                    type="text"
                    value={bidCarrier}
                    onChange={(e) => setBidCarrier(e.target.value)}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-400">Terms & Free Time Inclusions</label>
                  <textarea
                    rows={2}
                    value={bidNotes}
                    onChange={(e) => setBidNotes(e.target.value)}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="rounded px-4 py-2 border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-500">
                  Submit Binding Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
