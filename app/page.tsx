'use client';

import React, { useState } from 'react';
import { LogisticsProvider, useLogistics } from '@/context/LogisticsContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MasterDashboard from '@/components/dashboards/MasterDashboard';
import ShipmentList from '@/components/shipments/ShipmentList';
import ShipmentDetailView from '@/components/shipments/ShipmentDetailView';
import CreateShipmentModal from '@/components/shipments/CreateShipmentModal';
import AIDocumentStudio from '@/components/documents/AIDocumentStudio';
import DocumentGeneratorModal from '@/components/documents/DocumentGeneratorModal';
import DemurrageWatch from '@/components/demurrage/DemurrageWatch';
import FreightRateManager from '@/components/rates/FreightRateManager';
import ShipmentTrackingRadar from '@/components/tracking/ShipmentTrackingRadar';
import CustomerCRM from '@/components/customers/CustomerCRM';
import LogisticsMarketplace from '@/components/marketplace/LogisticsMarketplace';
import PartnerPortals from '@/components/operations/PartnerPortals';
import FinanceCenter from '@/components/finance/FinanceCenter';
import SubscriptionBilling from '@/components/subscriptions/SubscriptionBilling';
import SuperAdminPanel from '@/components/admin/SuperAdminPanel';
import DatabaseSchemaModal from '@/components/database/DatabaseSchemaModal';
import AIAssistantDrawer from '@/components/ai/AIAssistantDrawer';

function AppContent() {
  const {
    activeView,
    setActiveView,
    selectedShipment,
    setSelectedShipment,
  } = useLogistics();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);
  const [isDocGeneratorOpen, setIsDocGeneratorOpen] = useState(false);

  // Detail view state for shipments tab
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const handleSelectShipment = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsDetailViewOpen(true);
    setActiveView('shipments');
  };

  const handleBackToList = () => {
    setIsDetailViewOpen(false);
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
          <span className="font-mono text-xs tracking-wider uppercase text-slate-300">
            Initializing FREIGHTFLOW 360 Workspace...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Header */}
      <Header
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        isCopilotOpen={isCopilotOpen}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {activeView === 'dashboard' && (
              <MasterDashboard onOpenCreateShipment={() => setIsCreateShipmentOpen(true)} />
            )}

            {activeView === 'shipments' && (
              <>
                {isDetailViewOpen && selectedShipment ? (
                  <ShipmentDetailView
                    shipment={selectedShipment}
                    onBack={handleBackToList}
                    onOpenDocStudio={() => setActiveView('ai_docs')}
                    onOpenDocGenerator={() => setIsDocGeneratorOpen(true)}
                  />
                ) : (
                  <ShipmentList
                    onOpenCreate={() => setIsCreateShipmentOpen(true)}
                    onSelectShipment={handleSelectShipment}
                  />
                )}
              </>
            )}

            {activeView === 'ai_docs' && <AIDocumentStudio />}

            {activeView === 'doc_generator' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">Document Generation Studio</h2>
                    <p className="text-xs text-slate-400">
                      Produce branded trade documents with auto-generated non-negotiable BL draft watermarks.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDocGeneratorOpen(true)}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500"
                  >
                    Launch Interactive Generator
                  </button>
                </div>
              </div>
            )}

            {activeView === 'demurrage' && <DemurrageWatch />}

            {activeView === 'rates' && (
              <FreightRateManager onOpenDocGenerator={() => setIsDocGeneratorOpen(true)} />
            )}

            {activeView === 'tracking' && <ShipmentTrackingRadar />}

            {activeView === 'customers' && <CustomerCRM />}

            {activeView === 'marketplace' && <LogisticsMarketplace />}

            {(activeView === 'customs' || activeView === 'transport') && <PartnerPortals />}

            {activeView === 'finance' && <FinanceCenter />}

            {activeView === 'subscriptions' && <SubscriptionBilling />}

            {activeView === 'super_admin' && <SuperAdminPanel />}

            {activeView === 'database' && <DatabaseSchemaModal />}
          </div>
        </main>
      </div>

      {/* Modals & Slide-over Drawers */}
      <CreateShipmentModal
        isOpen={isCreateShipmentOpen}
        onClose={() => setIsCreateShipmentOpen(false)}
      />

      <DocumentGeneratorModal
        isOpen={isDocGeneratorOpen}
        onClose={() => setIsDocGeneratorOpen(false)}
      />

      <AIAssistantDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </div>
  );
}

export default function Page() {
  return (
    <LogisticsProvider>
      <AppContent />
    </LogisticsProvider>
  );
}
