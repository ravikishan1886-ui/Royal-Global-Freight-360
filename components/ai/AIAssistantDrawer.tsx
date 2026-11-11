'use client';

import React, { useState } from 'react';
import { useLogistics } from '@/context/LogisticsContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistantDrawer({ isOpen, onClose }: AIAssistantDrawerProps) {
  const { selectedShipment, activeRoleType, aiCredits, deductAiCredits } = useLogistics();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your **FREIGHTFLOW 360 AI Logistics Specialist** powered by Gemini 3.8 Flash.
I can help draft shipping instructions, explain Incoterms 2020 rules, audit trade documents, draft arrival emails, or calculate demurrage risks.

*Context Active:* Shipment **${selectedShipment?.shipmentNumber || 'FF360-2026-000842'}** (${selectedShipment?.commodity || 'Organic Cotton Yarns'}). How can I assist you today?`,
    },
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Draft an arrival notice email to EuroTech GmbH',
    'Explain difference between demurrage and detention',
    'What documents are mandatory for ICEGATE LEO clearance?',
    'Summarize P&L and net margin for active shipment',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    setChatHistory((prev) => [...prev, { sender: 'user', text }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      deductAiCredits(5);
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          activeRole: activeRoleType,
          shipmentContext: selectedShipment,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setChatHistory((prev) => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err: any) {
      console.error('Copilot error:', err);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `**Operational Copilot Guidance:**\n\nFor shipment **${
            selectedShipment?.shipmentNumber || 'FF360-2026-000842'
          }**, ensure that the Bill of Lading (BL) has been verified against weighbridge VGM data before vessel sailing. If you are preparing arrival notices, remind the consignee of the 14-day carrier free time at Rotterdam terminal to avoid detention fees.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Gemini Logistics Copilot</h3>
            <span className="text-[10px] text-sky-400 font-mono">gemini-3.8-flash · Active</span>
          </div>
        </div>
        <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 p-2.5">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-semibold mb-1.5">
          <Lightbulb className="h-3 w-3 text-amber-400" />
          Recommended Logistics Queries:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-sky-950 hover:text-sky-300 transition-colors text-left"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`relative max-w-[90%] rounded-2xl p-3.5 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-br-none shadow-sm'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.sender === 'ai' && (
                <button
                  onClick={() => copyToClipboard(msg.text, idx)}
                  className="mt-2 flex items-center gap-1 text-[10px] text-slate-500 hover:text-sky-400 transition-colors"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy text</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-xs text-sky-400 font-medium">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Analyzing logistics rules with Gemini...
          </div>
        )}
      </div>

      {/* Bottom Input */}
      <div className="border-t border-slate-800 bg-slate-950 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about HS codes, draft an email, check demurrage..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="rounded-xl bg-sky-600 px-3.5 py-2 text-white hover:bg-sky-500 transition-colors disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <div className="mt-2 flex justify-between text-[10px] text-slate-500">
          <span>AI never autonomously files legal declarations</span>
          <span>5 credits per query</span>
        </div>
      </div>
    </div>
  );
}
