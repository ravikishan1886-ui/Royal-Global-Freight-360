'use client';

import React, { useState } from 'react';
import { useLogistics } from '@/context/LogisticsContext';
import { Printer, Download, X, FileText, CheckCircle2 } from 'lucide-react';

interface DocumentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentGeneratorModal({ isOpen, onClose }: DocumentGeneratorModalProps) {
  const { shipments, selectedShipment, currentOrg } = useLogistics();

  const [docType, setDocType] = useState<
    | 'Commercial Invoice'
    | 'Packing List'
    | 'Freight Quotation'
    | 'Shipping Instructions'
    | 'Draft Bill of Lading'
    | 'Arrival Notice'
    | 'Expense Report'
  >('Draft Bill of Lading');

  const [activeShipmentId, setActiveShipmentId] = useState(
    selectedShipment?.id || shipments[0]?.id || ''
  );

  const shipment = shipments.find((s) => s.id === activeShipmentId) || shipments[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-white">Logistics Document Generation Studio</h2>
              <p className="text-xs text-slate-400">
                Generate branded, compliant trade documents with automated draft BL watermarks.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-6 py-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">Select Template:</span>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-white focus:outline-none"
            >
              <option value="Draft Bill of Lading">Draft Bill of Lading (Carrier Template)</option>
              <option value="Commercial Invoice">Commercial Invoice</option>
              <option value="Packing List">Packing List</option>
              <option value="Freight Quotation">Freight Quotation</option>
              <option value="Shipping Instructions">Shipping Instructions (SI)</option>
              <option value="Arrival Notice">Arrival Notice (Destination)</option>
              <option value="Expense Report">Shipment Expense & Disbursement Report</option>
            </select>

            <span className="ml-2 text-slate-400">Shipment:</span>
            <select
              value={activeShipmentId}
              onChange={(e) => setActiveShipmentId(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-sky-400 focus:outline-none"
            >
              {shipments.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shipmentNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
            <button
              onClick={() => alert(`Exporting ${docType} for ${shipment.shipmentNumber} as PDF.`)}
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-1.5 font-semibold text-white hover:bg-sky-500 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Printable Document Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/60">
          <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 text-slate-900 shadow-2xl relative">
            {/* Draft BL Watermark Notice */}
            {docType === 'Draft Bill of Lading' && (
              <div className="mb-4 rounded border-2 border-dashed border-amber-500 bg-amber-50 p-2 text-center text-xs font-bold uppercase tracking-wider text-amber-800">
                *** DRAFT BILL OF LADING — FOR INFORMATION ONLY — NOT AN OFFICIAL BILL OF LADING ***
              </div>
            )}

            {/* Document Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  {currentOrg.name}
                </h1>
                <p className="text-[11px] text-slate-600 max-w-sm mt-0.5">
                  {currentOrg.address} · Tel: {currentOrg.phone} · Email: {currentOrg.email}
                </p>
                {currentOrg.gstin && (
                  <p className="text-[10px] font-mono text-slate-500">
                    GSTIN: {currentOrg.gstin} · IEC: {currentOrg.iec}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-bold uppercase text-white">
                  {docType}
                </span>
                <p className="font-mono text-xs font-bold text-slate-900 mt-1">
                  REF: {shipment.shipmentNumber}
                </p>
                <p className="text-[11px] text-slate-500">
                  Date: Nov 05, 2026
                </p>
              </div>
            </div>

            {/* Shipper & Consignee Columns */}
            <div className="mt-4 grid grid-cols-2 gap-4 border-b border-slate-300 pb-4 text-xs">
              <div>
                <span className="font-bold uppercase text-[10px] text-slate-500">Shipper / Exporter:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{shipment.shipperName}</p>
                <p className="text-slate-600 text-[11px] mt-0.5">{shipment.origin}</p>
              </div>
              <div>
                <span className="font-bold uppercase text-[10px] text-slate-500">Consignee:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{shipment.consigneeName}</p>
                <p className="text-slate-600 text-[11px] mt-0.5">{shipment.destination}</p>
              </div>
            </div>

            {/* Port & Routing Grid */}
            <div className="mt-4 grid grid-cols-4 gap-2 border-b border-slate-300 pb-4 text-[11px]">
              <div>
                <span className="text-slate-500 font-medium">Pre-Carriage By:</span>
                <p className="font-bold text-slate-900">NorthStar Intermodal</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Port of Loading:</span>
                <p className="font-bold text-slate-900">{shipment.portOfLoading}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Ocean Vessel / Voy:</span>
                <p className="font-bold text-slate-900">{shipment.vesselName || shipment.carrier}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Port of Discharge:</span>
                <p className="font-bold text-slate-900">{shipment.portOfDischarge}</p>
              </div>
            </div>

            {/* Cargo Particulars Table */}
            <div className="mt-4 text-xs">
              <table className="w-full text-left">
                <thead className="border-b border-slate-400 bg-slate-100 text-[10px] font-bold uppercase text-slate-700">
                  <tr>
                    <th className="p-2">Marks & Numbers</th>
                    <th className="p-2">No. of Pkgs</th>
                    <th className="p-2">Description of Goods</th>
                    <th className="p-2 text-right">Gross Wt (kg)</th>
                    <th className="p-2 text-right">Measurement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px] text-slate-800">
                  <tr>
                    <td className="p-2 font-mono">
                      {shipment.containers[0]?.containerNumber || 'FCL/FCL'}
                      <br />
                      Seal: {shipment.containers[0]?.sealNumber || 'ORIGINAL'}
                    </td>
                    <td className="p-2 font-bold">{shipment.packageQuantity} Pkgs</td>
                    <td className="p-2">
                      <p className="font-bold">{shipment.commodity}</p>
                      <p className="text-slate-500 text-[10px]">HS Tariff: {shipment.hsCode}</p>
                      <p className="text-slate-500 text-[10px]">Incoterms: {shipment.incoterms}</p>
                    </td>
                    <td className="p-2 text-right font-mono font-bold">
                      {shipment.grossWeightKg.toLocaleString()} KGS
                    </td>
                    <td className="p-2 text-right font-mono">{shipment.volumeCbm} CBM</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Signatures */}
            <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[10px] text-slate-500">
                  Freight Payable at: <strong className="text-slate-800">DESTINATION (COLLECT)</strong>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Number of Original BLs: <strong className="text-slate-800">THREE (3/3)</strong>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500">For and on behalf of the Carrier / Agent:</p>
                <div className="mt-6 border-b border-slate-400 inline-block w-48" />
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">
                  Authorized Signatory (Official Seal)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
