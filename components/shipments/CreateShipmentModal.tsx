'use client';

import React, { useState } from 'react';
import { useLogistics } from '@/context/LogisticsContext';
import { TransportMode, Incoterm, ContainerType } from '@/types/logistics';
import { X, Ship, Sparkles } from 'lucide-react';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateShipmentModal({ isOpen, onClose }: CreateShipmentModalProps) {
  const { addShipment, customers, shipments } = useLogistics();

  const nextShipmentNumber = `FF360-2026-000${842 + shipments.length + 1}`;

  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.companyName || 'Bharat Agro & Textiles Export Ltd',
    exporterName: 'Bharat Agro & Textiles Export Ltd, Ahmedabad',
    importerName: 'Global Commodities Trading GmbH, Hamburg',
    shipperName: 'Bharat Agro & Textiles Export Ltd',
    consigneeName: 'Global Commodities Trading GmbH',
    origin: 'Ahmedabad ICD, India',
    destination: 'Rotterdam Port, Netherlands',
    portOfLoading: 'Nhava Sheva (JNPT / INNSA)',
    portOfDischarge: 'Rotterdam (NLRTM)',
    transportMode: 'FCL' as TransportMode,
    incoterms: 'CIF' as Incoterm,
    commodity: 'Refined Cotton Textiles & Finished Fabrics',
    hsCode: '5208.11.00',
    containerType: '40HC' as ContainerType,
    containerNumber: `MSKU${9820000 + shipments.length}`,
    sealNumber: `SL-84920${shipments.length}`,
    carrier: 'MSC Mediterranean Shipping Co',
    bookingNumber: `BKG-881920${shipments.length}`,
    blNumber: `MEDU981249${shipments.length}`,
    grossWeightKg: 24500,
    netWeightKg: 22800,
    packageQuantity: 480,
    volumeCbm: 68,
    etd: '2026-11-12T10:00:00Z',
    eta: '2026-12-04T18:00:00Z',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addShipment({
      shipmentNumber: nextShipmentNumber,
      orgId: 'org-ff-1',
      customerId: formData.customerId,
      customerName: formData.customerName,
      exporterName: formData.exporterName,
      importerName: formData.importerName,
      shipperName: formData.shipperName,
      consigneeName: formData.consigneeName,
      origin: formData.origin,
      destination: formData.destination,
      portOfLoading: formData.portOfLoading,
      portOfDischarge: formData.portOfDischarge,
      transportMode: formData.transportMode,
      incoterms: formData.incoterms,
      commodity: formData.commodity,
      hsCode: formData.hsCode,
      containerType: formData.containerType,
      containers: [
        {
          id: `cnt-${Date.now()}`,
          shipmentId: '',
          containerNumber: formData.containerNumber,
          containerType: formData.containerType,
          sealNumber: formData.sealNumber,
          grossWeightKg: formData.grossWeightKg,
          tareWeightKg: 3880,
          carrier: formData.carrier,
          arrivalDate: formData.eta,
          terminalFreeDays: 5,
          carrierFreeDays: 14,
          lastFreeDay: '2026-12-09T23:59:59Z',
          dailyDetentionRate: 140,
          currency: 'USD',
          status: 'at_origin',
        },
      ],
      grossWeightKg: Number(formData.grossWeightKg),
      netWeightKg: Number(formData.netWeightKg),
      packageQuantity: Number(formData.packageQuantity),
      volumeCbm: Number(formData.volumeCbm),
      carrier: formData.carrier,
      bookingNumber: formData.bookingNumber,
      blNumber: formData.blNumber,
      isBlDraft: true,
      etd: formData.etd,
      eta: formData.eta,
      status: 'Booking Confirmed',
      assignedManager: 'Rajesh Nair',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-white">Create Shipment File</h2>
              <span className="font-mono text-xs text-sky-400">{nextShipmentNumber}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium">Customer / Account</label>
              <select
                value={formData.customerId}
                onChange={(e) => {
                  const c = customers.find((cust) => cust.id === e.target.value);
                  setFormData({
                    ...formData,
                    customerId: e.target.value,
                    customerName: c?.companyName || '',
                    shipperName: c?.companyName || '',
                  });
                }}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-medium">Consignee Name</label>
              <input
                type="text"
                value={formData.consigneeName}
                onChange={(e) => setFormData({ ...formData, consigneeName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium">Port of Loading (POL)</label>
              <input
                type="text"
                value={formData.portOfLoading}
                onChange={(e) => setFormData({ ...formData, portOfLoading: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium">Port of Discharge (POD)</label>
              <input
                type="text"
                value={formData.portOfDischarge}
                onChange={(e) => setFormData({ ...formData, portOfDischarge: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium">Transport Mode</label>
              <select
                value={formData.transportMode}
                onChange={(e) => setFormData({ ...formData, transportMode: e.target.value as TransportMode })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
              >
                <option value="FCL">FCL Ocean</option>
                <option value="LCL">LCL Ocean</option>
                <option value="Air Freight">Air Freight</option>
                <option value="Road Freight">Road Freight</option>
                <option value="Project Cargo">Project Cargo</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-medium">Incoterms</label>
              <select
                value={formData.incoterms}
                onChange={(e) => setFormData({ ...formData, incoterms: e.target.value as Incoterm })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
              >
                <option value="CIF">CIF - Cost, Insurance & Freight</option>
                <option value="FOB">FOB - Free on Board</option>
                <option value="EXW">EXW - Ex Works</option>
                <option value="DAP">DAP - Delivered at Place</option>
                <option value="DDP">DDP - Delivered Duty Paid</option>
                <option value="CIP">CIP - Carriage & Insurance Paid</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-medium">Commodity Description</label>
              <input
                type="text"
                value={formData.commodity}
                onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium">HS Tariff Code</label>
              <input
                type="text"
                value={formData.hsCode}
                onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium">Ocean / Air Carrier</label>
              <input
                type="text"
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium">Container Number</label>
              <input
                type="text"
                value={formData.containerNumber}
                onChange={(e) => setFormData({ ...formData, containerNumber: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium">Gross Weight (Kg)</label>
              <input
                type="number"
                value={formData.grossWeightKg}
                onChange={(e) => setFormData({ ...formData, grossWeightKg: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium">Total Package Quantity</label>
              <input
                type="number"
                value={formData.packageQuantity}
                onChange={(e) => setFormData({ ...formData, packageQuantity: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-white focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-5 py-2 font-semibold text-white shadow-sm hover:bg-sky-500"
            >
              Create Shipment File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
