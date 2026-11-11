'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLogistics } from '@/context/LogisticsContext';
import { SUBSCRIPTION_PLANS } from '@/lib/mockData';
import { SubscriptionPlan } from '@/types/logistics';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Coins,
  ShieldCheck,
  Download,
  AlertCircle,
  X,
  Zap,
} from 'lucide-react';

export default function SubscriptionBilling() {
  const { currentPlan, setCurrentPlan, aiCredits, addAiCredits } = useLogistics();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(
    null
  );
  const [topupCreditsQty, setTopupCreditsQty] = useState<number>(0);
  const [checkoutAmount, setCheckoutAmount] = useState<number>(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanForCheckout(plan);
    setTopupCreditsQty(0);
    const price = billingCycle === 'annual' ? plan.priceMonthlyInr * 10 : plan.priceMonthlyInr;
    setCheckoutAmount(price);
    setShowRazorpayModal(true);
    setPaymentSuccess(false);
  };

  const handleTopupCredits = (credits: number, costInr: number) => {
    setSelectedPlanForCheckout(null);
    setTopupCreditsQty(credits);
    setCheckoutAmount(costInr);
    setShowRazorpayModal(true);
    setPaymentSuccess(false);
  };

  const handleSimulateRazorpaySuccess = () => {
    setTimeout(() => {
      setPaymentSuccess(true);
      if (selectedPlanForCheckout) {
        setCurrentPlan(selectedPlanForCheckout);
        addAiCredits(selectedPlanForCheckout.aiCreditsMonthly);
      } else if (topupCreditsQty > 0) {
        addAiCredits(topupCreditsQty);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with authentic enterprise billing backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <Image
          src="/images/air_cargo.jpg"
          alt="Enterprise Logistics Cloud Billing"
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-20 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Monetization & Plans
            </span>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Subscription Tier & AI Processing Credits
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Hybrid SaaS billing with Razorpay payment processing for Indian and international logistics enterprises.
            </p>
          </div>

          {/* Current Active Plan Badge */}
          <div className="rounded-xl border border-sky-800/60 bg-sky-950/60 p-3 text-right shadow-sm">
            <span className="text-[10px] text-sky-300 uppercase font-semibold">Active Plan</span>
            <p className="font-bold text-sm text-white">{currentPlan.name} Edition</p>
            <span className="text-[10px] text-slate-400">Renews on 01 Dec 2026</span>
          </div>
        </div>
      </div>

      {/* AI Credit Wallet Strip */}
      <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">AI Documentation Credit Wallet</span>
              <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
                {aiCredits} Credits Available
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Each document extraction and discrepancy audit uses 15 credits.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleTopupCredits(200, 799)}
            className="rounded-lg border border-amber-700/60 bg-amber-950/70 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-900 transition-colors"
          >
            +200 Credits (₹799)
          </button>
          <button
            onClick={() => handleTopupCredits(600, 1999)}
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition-colors shadow-sm"
          >
            +600 Credits (₹1,999)
          </button>
        </div>
      </div>

      {/* Billing Cycle Switcher */}
      <div className="flex justify-center">
        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`rounded-md px-4 py-1.5 font-medium transition-colors ${
              billingCycle === 'monthly' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`rounded-md px-4 py-1.5 font-medium transition-colors ${
              billingCycle === 'annual' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Annual Billing (2 Months Free)
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentPlan.id === plan.id;
          const displayPrice =
            billingCycle === 'annual'
              ? Math.round((plan.priceMonthlyInr * 10) / 12)
              : plan.priceMonthlyInr;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-sky-500 bg-sky-950/20 ring-1 ring-sky-500 shadow-xl'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-base text-white">{plan.name}</h3>
                  {isCurrent && (
                    <span className="rounded bg-sky-950 px-2 py-0.5 text-[10px] font-bold text-sky-400 border border-sky-800">
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold text-white">
                    ₹{displayPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Includes {plan.aiCreditsMonthly} AI Credits / mo
                </p>

                <ul className="mt-5 space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={isCurrent}
                className={`mt-6 w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
                  isCurrent
                    ? 'border border-slate-700 bg-slate-800 text-slate-400 cursor-default'
                    : 'bg-sky-600 text-white hover:bg-sky-500 shadow-sm'
                }`}
              >
                {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Razorpay Checkout Modal Simulation */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-sky-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Razorpay Secure Checkout</h3>
                  <span className="text-[10px] text-slate-500 font-mono">ORDER_ID: rzp_live_94821094</span>
                </div>
              </div>
              <button onClick={() => setShowRazorpayModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!paymentSuccess ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order Description:</span>
                    <span className="font-semibold text-white">
                      {selectedPlanForCheckout
                        ? `${selectedPlanForCheckout.name} Plan (${billingCycle})`
                        : `${topupCreditsQty} AI Credits Pack`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold">
                    <span className="text-slate-300">Total Payable Amount:</span>
                    <span className="font-mono text-sky-400">₹{checkoutAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400">Select Simulated Payment Method:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="p-2.5 rounded-lg border border-sky-600 bg-sky-950/40 text-center font-semibold text-white"
                    >
                      UPI / GPay / PhonePe
                    </button>
                    <button
                      type="button"
                      className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-center text-slate-400"
                    >
                      Corporate NetBanking
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSimulateRazorpaySuccess}
                  className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-lg hover:bg-emerald-500 transition-colors"
                >
                  Authorize Payment of ₹{checkoutAmount.toLocaleString()}
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Payment Verified Successfully</h4>
                <p className="text-slate-400 text-xs">
                  Razorpay Payment ID: <span className="font-mono text-sky-400">pay_91824018249</span>.
                  Your account has been upgraded and AI credits updated.
                </p>
                <button
                  onClick={() => setShowRazorpayModal(false)}
                  className="rounded-lg bg-sky-600 px-6 py-2 font-semibold text-white hover:bg-sky-500"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
