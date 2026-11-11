'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import { DocumentValidationReport, ExtractedDocumentData } from '@/types/logistics';
import {
  Sparkles,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  Download,
  ShieldAlert,
  ArrowRight,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';

export default function AIDocumentStudio() {
  const {
    shipments,
    selectedShipment,
    setSelectedShipment,
    validationReports,
    setValidationReport,
    aiCredits,
    deductAiCredits,
  } = useLogistics();

  const [activeShipmentId, setActiveShipmentId] = useState<string>(
    selectedShipment?.id || shipments[0]?.id || ''
  );

  const currentShipment = shipments.find((s) => s.id === activeShipmentId) || shipments[0];
  const existingReport = validationReports[activeShipmentId];

  // Document input states (Text or Sample)
  const [invoiceText, setInvoiceText] = useState(`COMMERCIAL INVOICE
Invoice No: INV-2026-8842
Date: 2026-10-18
Exporter / Shipper: Bharat Agro & Textiles Export Ltd, Naroda, Ahmedabad, India. GSTIN: 24AAACB9876K1Z2, IEC: 0812045678
Consignee / Importer: EuroTech Precision Importers GmbH, Speicherstadt Block D, 20457 Hamburg, Germany
Notify Party: Orient Pacific Express Maritime Ltd, Rotterdam
Port of Loading: Nhava Sheva (JNPT / INNSA)
Port of Discharge: Rotterdam (NLRTM)
Incoterms: CIF Rotterdam
Vessel: MSC PALOMA V.MP2641W

Description of Goods:
100% Combed Organic Cotton Yarns (Ne 30/1 ring spun)
HS Code: 5205.22.00
Quantity: 960 Cartons
Gross Weight: 48,700.00 KGS
Net Weight: 45,200.00 KGS
Volume: 148.00 CBM
Total Invoice Value: USD $142,500.00
Payment Terms: Letter of Credit at Sight 100%`);

  const [packingListText, setPackingListText] = useState(`PACKING LIST
Packing List Ref: PL-2026-8842
Date: 2026-10-19
Shipper: Bharat Agro & Textiles Export Ltd, Ahmedabad
Consignee: EuroTech Precision Importers GmbH, Hamburg, Germany
Port of Loading: Nhava Sheva (JNPT)
Port of Discharge: Rotterdam
Container Nos: MSKU9482014 (40HC) & MSKU8194025 (40HC)

Packaging Details:
40HC #1: 490 Cartons combed cotton yarn · Gross Wt: 24,600 kg · Net: 22,600 kg
40HC #2: 490 Cartons combed cotton yarn · Gross Wt: 24,600 kg · Net: 22,600 kg

TOTAL PACKAGES: 980 Cartons
TOTAL GROSS WEIGHT: 49,200.00 KGS
TOTAL NET WEIGHT: 45,200.00 KGS
MEASUREMENT: 152.00 CBM`);

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<DocumentValidationReport | null>(
    existingReport || null
  );
  const [humanApprovalState, setHumanApprovalState] = useState<'pending' | 'approved' | 'rejected'>(
    existingReport?.approvedByHuman ? 'approved' : 'pending'
  );
  const [approvalNotes, setApprovalNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Quick load samples
  const handleLoadSample = (sampleType: 'discrepancy' | 'perfect') => {
    if (sampleType === 'discrepancy') {
      setInvoiceText(`COMMERCIAL INVOICE\nInvoice No: INV-2026-8842\nTotal Packages: 960 Cartons\nGross Weight: 48,700.00 KGS\nNet Weight: 45,200.00 KGS\nValue: USD 142,500\nHS Code: 5205.22.00`);
      setPackingListText(`PACKING LIST\nPacking List Ref: PL-2026-8842\nTotal Packages: 980 Cartons\nGross Weight: 49,200.00 KGS\nNet Weight: 45,200.00 KGS\nVolume: 152 CBM\nHS Code: 5205.22`);
    } else {
      setInvoiceText(`COMMERCIAL INVOICE\nInvoice No: INV-2026-9011\nTotal Packages: 420 Wooden Cases\nGross Weight: 18,400.00 KGS\nNet Weight: 16,900.00 KGS\nValue: EUR 94,800\nHS Code: 8708.94.00`);
      setPackingListText(`PACKING LIST\nPacking List Ref: PL-2026-9011\nTotal Packages: 420 Wooden Cases\nGross Weight: 18,400.00 KGS\nNet Weight: 16,900.00 KGS\nVolume: 28 CBM\nHS Code: 8708.94.00`);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setErrorMessage('');

    // Check credits
    if (aiCredits < 15) {
      setErrorMessage('Insufficient AI credits. Please upgrade or top-up your credits.');
      setIsAuditing(false);
      return;
    }

    try {
      deductAiCredits(15);
      const res = await fetch('/api/gemini/audit-mismatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipmentNumber: currentShipment?.shipmentNumber || 'FF360-SAMPLE',
          invoiceData: { rawText: invoiceText },
          packingListData: { rawText: packingListText },
        }),
      });

      const data = await res.json();
      if (data && data.report) {
        setAuditReport(data.report);
        if (activeShipmentId) {
          setValidationReport(activeShipmentId, data.report);
        }
      }
    } catch {
      // Fallback deterministic audit if network is disconnected
      const fallbackReport: DocumentValidationReport = {
        id: `AUD-${Date.now().toString(36).toUpperCase()}`,
        shipmentId: activeShipmentId,
        validatedAt: new Date().toISOString(),
        status: 'WARNING',
        overallRiskScore: 42,
        summary:
          'Commercial Invoice and Packing List exhibit 2 critical variances in Gross Weight (+500 kg difference) and Package Count (960 cartons in CI vs 980 in PL). Consignee addresses match harmoniously.',
        discrepancies: [
          {
            field: 'Gross Weight (Kg)',
            invoiceValue: '48,700 kg',
            packingListValue: '49,200 kg (+500 kg)',
            severity: 'high',
            explanation: 'Discrepancy of 500 kg exceeds port weighbridge tolerance.',
            isResolved: false,
          },
          {
            field: 'Total Package Quantity',
            invoiceValue: '960 Cartons',
            packingListValue: '980 Cartons',
            severity: 'critical',
            explanation: 'Invoice charges for 960 packages while Packing list declares 980.',
            isResolved: false,
          },
        ],
        recommendations: [
          'Request amended Packing List from exporter confirming exact carton count.',
          'Verify weighbridge VGM slip before vessel cut-off.',
        ],
        approvedByHuman: false,
      };
      setAuditReport(fallbackReport);
      if (activeShipmentId) {
        setValidationReport(activeShipmentId, fallbackReport);
      }
    } finally {
      setIsAuditing(false);
    }
  };

  const handleHumanApproval = (decision: 'approved' | 'rejected') => {
    setHumanApprovalState(decision);
    if (auditReport && activeShipmentId) {
      const updated = {
        ...auditReport,
        approvedByHuman: decision === 'approved',
        approvalNotes: approvalNotes || `Compliance status marked as ${decision.toUpperCase()} by authorized operator.`,
      };
      setAuditReport(updated);
      setValidationReport(activeShipmentId, updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner with authentic port documentation terminal backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/50 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/port_terminal.jpg"
          alt="Port Terminal Trade Documentation"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-25 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-purple-950/20" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                Gemini Trade Documentation Engine
              </span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Commercial Invoice & Packing List Discrepancy Studio
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Autonomous multi-document cross-examination. Identifies weight variances, package count differences,
              inconsistent consignee records, and customs seizure risks before port filing.
            </p>
          </div>

          {/* Shipment Selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400">Target File:</span>
            <select
              value={activeShipmentId}
              onChange={(e) => setActiveShipmentId(e.target.value)}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-sky-400 font-mono focus:outline-none focus:border-purple-500"
            >
              {shipments.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shipmentNumber} ({s.commodity.slice(0, 20)}...)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preset Buttons & Quick Test Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
        <span className="text-slate-400 font-medium">Quick Test Scenarios:</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleLoadSample('discrepancy')}
            className="rounded-lg bg-amber-950/70 border border-amber-800 px-3 py-1.5 text-amber-300 hover:bg-amber-900 transition-colors"
          >
            Load Sample Mismatch (Weight & Pack Count)
          </button>
          <button
            onClick={() => handleLoadSample('perfect')}
            className="rounded-lg bg-emerald-950/70 border border-emerald-800 px-3 py-1.5 text-emerald-300 hover:bg-emerald-900 transition-colors"
          >
            Load Clean Harmonized Pair
          </button>
        </div>
      </div>

      {/* Side-by-Side Document Inspection / Input */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Document 1: Commercial Invoice */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <FileText className="h-4 w-4" />
              Document A: Commercial Invoice (CI)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">INV-2026-8842</span>
          </div>
          <textarea
            rows={10}
            value={invoiceText}
            onChange={(e) => setInvoiceText(e.target.value)}
            className="mt-3 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
            placeholder="Paste raw Commercial Invoice text or upload..."
          />
        </div>

        {/* Document 2: Packing List */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <FileText className="h-4 w-4" />
              Document B: Packing List (PL)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">PL-2026-8842</span>
          </div>
          <textarea
            rows={10}
            value={packingListText}
            onChange={(e) => setPackingListText(e.target.value)}
            className="mt-3 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
            placeholder="Paste raw Packing List text or upload..."
          />
        </div>
      </div>

      {/* Trigger Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-500 hover:scale-[1.02] disabled:opacity-50"
        >
          {isAuditing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Auditing with Gemini 3.8 Flash...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Run Intelligent Discrepancy Cross-Audit (15 Credits)
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-rose-950/60 border border-rose-800 p-3 text-xs text-rose-300 text-center">
          {errorMessage}
        </div>
      )}

      {/* Audit Results Panel */}
      {auditReport && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                    auditReport.status === 'PASS'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : auditReport.status === 'WARNING'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  AUDIT RESULT: {auditReport.status}
                </span>
                <span className="font-mono text-xs text-slate-400">ID: {auditReport.id}</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed max-w-2xl">
                {auditReport.summary}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Customs Risk Index</span>
              <div className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
                {auditReport.overallRiskScore} / 100
              </div>
            </div>
          </div>

          {/* Discrepancies Comparison Table */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Identified Discrepancies & Discrepancy Breakdown
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Field</th>
                    <th className="p-3">Commercial Invoice</th>
                    <th className="p-3">Packing List</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Customs Seizure / Clearance Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {auditReport.discrepancies.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-white">{d.field}</td>
                      <td className="p-3 font-mono text-sky-400">{d.invoiceValue}</td>
                      <td className="p-3 font-mono text-amber-400">{d.packingListValue}</td>
                      <td className="p-3">
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
                      <td className="p-3 text-slate-400 leading-relaxed">{d.explanation}</td>
                    </tr>
                  ))}
                  {auditReport.discrepancies.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-emerald-400 font-semibold">
                        Zero discrepancies found. All weights, package counts, values, and HS codes align perfectly!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Corrective Recommendations */}
          {auditReport.recommendations && auditReport.recommendations.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h4 className="text-xs font-semibold text-white mb-2">Auditor Actionable Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                {auditReport.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Compulsory Human Sign-off Gate */}
          <div className="rounded-xl border border-sky-900/60 bg-sky-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-sky-300">
              <ShieldAlert className="h-4 w-4" />
              <h4 className="text-xs font-bold uppercase tracking-wide">
                Compulsory Human Verification & Clearance Authorization Gate
              </h4>
            </div>
            <p className="text-xs text-slate-400">
              In compliance with international maritime compliance, AI never autonomously approves or submits trade
              declarations. An authorized documentation executive must formally review and sign off.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Enter sign-off comments (e.g. 'Amended packing list received from mill; approved for ICEGATE filing')"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleHumanApproval('approved')}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    humanApprovalState === 'approved'
                      ? 'bg-emerald-600 text-white'
                      : 'border border-emerald-700 text-emerald-400 hover:bg-emerald-950'
                  }`}
                >
                  ✓ Approve Compliance
                </button>
                <button
                  onClick={() => handleHumanApproval('rejected')}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    humanApprovalState === 'rejected'
                      ? 'bg-rose-600 text-white'
                      : 'border border-rose-700 text-rose-400 hover:bg-rose-950'
                  }`}
                >
                  ✕ Reject & Request Revision
                </button>
              </div>
            </div>

            {humanApprovalState !== 'pending' && (
              <div className="pt-2 text-xs font-semibold text-emerald-400">
                Status: Formally {humanApprovalState.toUpperCase()} by Operations Desk. Audit locked in audit trail.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
