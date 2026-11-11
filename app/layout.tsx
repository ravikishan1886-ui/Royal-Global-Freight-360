import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FREIGHTFLOW 360 | One Platform. Every Shipment. Complete Control.',
  description:
    'Complete full-stack international logistics SaaS ecosystem connecting Freight Forwarders, Exporters, Importers, Customs Brokers, Transporters, and Overseas Agents with Gemini AI document automation, container demurrage tracking, and real-time collaboration.',
  openGraph: {
    title: 'FREIGHTFLOW 360 | International Logistics SaaS Ecosystem',
    description:
      'Digitize and connect the complete shipment lifecycle with AI document extraction, container demurrage monitoring, and multi-tenant workspaces.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FREIGHTFLOW 360',
    description: 'One Platform. Every Shipment. Complete Control.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
