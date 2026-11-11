'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import { Customer, OverseasAgent } from '@/types/logistics';
import {
  Users,
  Building,
  Mail,
  Phone,
  Plus,
  Search,
  Globe,
  Star,
  ShieldCheck,
  FileText,
  DollarSign,
} from 'lucide-react';

export default function CustomerCRM() {
  const { customers, addCustomer, overseasAgents } = useLogistics();

  const [activeTab, setActiveTab] = useState<'customers' | 'agents'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const [newCust, setNewCust] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstin: '',
    iec: '',
    address: '',
    outstandingBalance: 0,
    currency: 'USD',
    notes: '',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.companyName.trim()) return;
    addCustomer({
      orgId: 'org-ff-1',
      companyName: newCust.companyName,
      contactPerson: newCust.contactPerson,
      email: newCust.email,
      phone: newCust.phone,
      gstin: newCust.gstin,
      iec: newCust.iec,
      address: newCust.address,
      outstandingBalance: Number(newCust.outstandingBalance),
      currency: newCust.currency,
      notes: newCust.notes,
    });
    setShowAddCustomer(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner with authentic overseas network backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/maritime_vessel.jpg"
          alt="International Trade Accounts"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-20 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Commercial CRM & Network
              </span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Customer Directory & Overseas Agent Network
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Client accounts with GSTIN/IEC registry, receivables balance, and verified international destination agents across Europe, Americas, and Asia.
            </p>
          </div>

          <div className="flex gap-2">
            {activeTab === 'customers' && (
              <button
                onClick={() => setShowAddCustomer(true)}
                className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-600/30 hover:bg-sky-500 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Customer Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-medium">
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors ${
            activeTab === 'customers'
              ? 'border-sky-500 text-sky-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Building className="h-4 w-4" />
          Customer Accounts ({customers.length})
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors ${
            activeTab === 'agents'
              ? 'border-sky-500 text-sky-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="h-4 w-4" />
          Overseas Agent Network ({overseasAgents.length})
        </button>
      </div>

      {/* Customer Tab Content */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <Search className="h-4 w-4 text-slate-400 ml-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email, or contact person..."
              className="w-full rounded-lg bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{cust.companyName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{cust.contactPerson}</p>
                  </div>
                  <span className="rounded bg-sky-950 px-2 py-0.5 font-mono text-[10px] text-sky-400 border border-sky-800">
                    {cust.totalShipments} Files
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-slate-500" />
                    <span className="truncate text-slate-300">{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-slate-500" />
                    <span>{cust.phone}</span>
                  </div>
                  {cust.gstin && (
                    <div className="font-mono text-[11px] text-slate-400 pt-1">
                      GST: {cust.gstin} · IEC: {cust.iec}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Receivables Balance:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {cust.currency} ${cust.outstandingBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overseas Agents Tab Content */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overseasAgents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{agent.companyName}</h3>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {agent.performanceRating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {agent.city}, {agent.country} · Contact: {agent.contactPerson}
                  </p>
                </div>
                <span className="rounded bg-sky-950 px-2 py-0.5 text-[10px] text-sky-400 border border-sky-800">
                  {agent.activeShipmentsCount} Active Shipments
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {agent.services.map((srv, idx) => (
                  <span key={idx} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                    {srv}
                  </span>
                ))}
              </div>

              <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Credit Terms: <strong className="text-white">{agent.paymentTerms}</strong></span>
                <span>Currency: <strong className="font-mono text-sky-400">{agent.currency}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              Register New Customer Account
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-slate-400">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newCust.companyName}
                    onChange={(e) => setNewCust({ ...newCust, companyName: e.target.value })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Contact Person</label>
                  <input
                    type="text"
                    value={newCust.contactPerson}
                    onChange={(e) => setNewCust({ ...newCust, contactPerson: e.target.value })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={newCust.email}
                    onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">GSTIN</label>
                  <input
                    type="text"
                    value={newCust.gstin}
                    onChange={(e) => setNewCust({ ...newCust, gstin: e.target.value })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">IEC Code</label>
                  <input
                    type="text"
                    value={newCust.iec}
                    onChange={(e) => setNewCust({ ...newCust, iec: e.target.value })}
                    className="w-full rounded bg-slate-950 border border-slate-700 p-2 font-mono text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCustomer(false)}
                  className="rounded px-4 py-2 border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-500">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
