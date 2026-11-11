'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Organization,
  UserProfile,
  Shipment,
  Customer,
  Container,
  TrackingMilestone,
  DocumentItem,
  DocumentValidationReport,
  FreightRate,
  Quotation,
  CustomsClearanceRecord,
  TransportOrder,
  OverseasAgent,
  MarketplaceEnquiry,
  MarketplaceBid,
  ShipmentFinancial,
  SubscriptionPlan,
  NotificationItem,
  OrganizationType,
  UserRole,
} from '@/types/logistics';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_USER,
  INITIAL_CUSTOMERS,
  INITIAL_CONTAINERS,
  INITIAL_SHIPMENTS,
  INITIAL_TRACKING,
  INITIAL_DOCUMENTS,
  SAMPLE_DISCREPANCY_REPORT,
  INITIAL_FREIGHT_RATES,
  INITIAL_CUSTOMS_CLEARANCES,
  INITIAL_TRANSPORT_ORDERS,
  INITIAL_OVERSEAS_AGENTS,
  INITIAL_MARKETPLACE_ENQUIRIES,
  INITIAL_FINANCIALS,
  SUBSCRIPTION_PLANS,
  INITIAL_NOTIFICATIONS,
} from '@/lib/mockData';

export type ActiveView =
  | 'dashboard'
  | 'shipments'
  | 'ai_docs'
  | 'doc_generator'
  | 'demurrage'
  | 'rates'
  | 'tracking'
  | 'customers'
  | 'marketplace'
  | 'customs'
  | 'transport'
  | 'finance'
  | 'subscriptions'
  | 'super_admin'
  | 'database';

interface LogisticsContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  organizations: Organization[];
  currentOrg: Organization;
  setCurrentOrg: (org: Organization) => void;
  currentUser: UserProfile;
  activeRoleType: OrganizationType | 'super_admin';
  setActiveRoleType: (role: OrganizationType | 'super_admin') => void;
  shipments: Shipment[];
  selectedShipment: Shipment | null;
  setSelectedShipment: (shipment: Shipment | null) => void;
  addShipment: (shipment: Omit<Shipment, 'id' | 'createdAt'>) => void;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  containers: Container[];
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => void;
  validationReports: Record<string, DocumentValidationReport>;
  setValidationReport: (shipmentId: string, report: DocumentValidationReport) => void;
  freightRates: FreightRate[];
  addFreightRate: (rate: Omit<FreightRate, 'id'>) => void;
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt' | 'totalShipments'>) => void;
  trackingEvents: TrackingMilestone[];
  addTrackingEvent: (event: Omit<TrackingMilestone, 'id'>) => void;
  customsClearances: CustomsClearanceRecord[];
  updateCustomsClearance: (id: string, updates: Partial<CustomsClearanceRecord>) => void;
  transportOrders: TransportOrder[];
  updateTransportOrder: (id: string, updates: Partial<TransportOrder>) => void;
  overseasAgents: OverseasAgent[];
  marketplaceEnquiries: MarketplaceEnquiry[];
  addMarketplaceEnquiry: (enquiry: Omit<MarketplaceEnquiry, 'id' | 'createdAt' | 'bidsCount'>) => void;
  marketplaceBids: MarketplaceBid[];
  addMarketplaceBid: (bid: Omit<MarketplaceBid, 'id' | 'createdAt'>) => void;
  financials: ShipmentFinancial[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  aiCredits: number;
  deductAiCredits: (amount: number) => boolean;
  addAiCredits: (amount: number) => void;
  currentPlan: SubscriptionPlan;
  setCurrentPlan: (plan: SubscriptionPlan) => void;
  resetToDemoData: () => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export function LogisticsProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [currentOrg, setCurrentOrg] = useState<Organization>(INITIAL_ORGANIZATIONS[0]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [activeRoleType, setActiveRoleTypeState] = useState<OrganizationType | 'super_admin'>('freight_forwarder');

  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(INITIAL_SHIPMENTS[0]);
  const [containers, setContainers] = useState<Container[]>(INITIAL_CONTAINERS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [validationReports, setValidationReports] = useState<Record<string, DocumentValidationReport>>({
    'ship-1': SAMPLE_DISCREPANCY_REPORT,
  });

  const [freightRates, setFreightRates] = useState<FreightRate[]>(INITIAL_FREIGHT_RATES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [trackingEvents, setTrackingEvents] = useState<TrackingMilestone[]>(INITIAL_TRACKING);
  const [customsClearances, setCustomsClearances] = useState<CustomsClearanceRecord[]>(INITIAL_CUSTOMS_CLEARANCES);
  const [transportOrders, setTransportOrders] = useState<TransportOrder[]>(INITIAL_TRANSPORT_ORDERS);
  const [overseasAgents, setOverseasAgents] = useState<OverseasAgent[]>(INITIAL_OVERSEAS_AGENTS);
  const [marketplaceEnquiries, setMarketplaceEnquiries] = useState<MarketplaceEnquiry[]>(INITIAL_MARKETPLACE_ENQUIRIES);
  const [marketplaceBids, setMarketplaceBids] = useState<MarketplaceBid[]>([]);
  const [financials, setFinancials] = useState<ShipmentFinancial[]>(INITIAL_FINANCIALS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [aiCredits, setAiCredits] = useState<number>(380);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[1]); // Professional plan

  // Synchronize active role and organization switcher
  const setActiveRoleType = (role: OrganizationType | 'super_admin') => {
    setActiveRoleTypeState(role);
    if (role === 'super_admin') {
      setActiveView('super_admin');
      return;
    }
    const matchingOrg = organizations.find((o) => o.type === role);
    if (matchingOrg) {
      setCurrentOrg(matchingOrg);
    }
  };

  const addShipment = (newShipment: Omit<Shipment, 'id' | 'createdAt'>) => {
    const id = `ship-${Date.now()}`;
    const shipment: Shipment = {
      ...newShipment,
      id,
      createdAt: new Date().toISOString(),
    };
    setShipments((prev) => [shipment, ...prev]);
    setSelectedShipment(shipment);
  };

  const updateShipment = (id: string, updates: Partial<Shipment>) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    if (selectedShipment?.id === id) {
      setSelectedShipment((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const addDocument = (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const setValidationReport = (shipmentId: string, report: DocumentValidationReport) => {
    setValidationReports((prev) => ({
      ...prev,
      [shipmentId]: report,
    }));
  };

  const addFreightRate = (rate: Omit<FreightRate, 'id'>) => {
    const newRate: FreightRate = { ...rate, id: `fr-${Date.now()}` };
    setFreightRates((prev) => [newRate, ...prev]);
  };

  const addCustomer = (cust: Omit<Customer, 'id' | 'createdAt' | 'totalShipments'>) => {
    const newCust: Customer = {
      ...cust,
      id: `cust-${Date.now()}`,
      totalShipments: 0,
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const addTrackingEvent = (event: Omit<TrackingMilestone, 'id'>) => {
    const newEvent: TrackingMilestone = {
      ...event,
      id: `tr-${Date.now()}`,
    };
    setTrackingEvents((prev) => [...prev, newEvent]);
  };

  const updateCustomsClearance = (id: string, updates: Partial<CustomsClearanceRecord>) => {
    setCustomsClearances((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const updateTransportOrder = (id: string, updates: Partial<TransportOrder>) => {
    setTransportOrders((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const addMarketplaceEnquiry = (enquiry: Omit<MarketplaceEnquiry, 'id' | 'createdAt' | 'bidsCount'>) => {
    const newEnq: MarketplaceEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      bidsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setMarketplaceEnquiries((prev) => [newEnq, ...prev]);
  };

  const addMarketplaceBid = (bid: Omit<MarketplaceBid, 'id' | 'createdAt'>) => {
    const newBid: MarketplaceBid = {
      ...bid,
      id: `bid-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMarketplaceBids((prev) => [newBid, ...prev]);
    // increment enquiry bids count
    setMarketplaceEnquiries((prev) =>
      prev.map((e) =>
        e.id === bid.enquiryId ? { ...e, bidsCount: e.bidsCount + 1 } : e
      )
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deductAiCredits = (amount: number): boolean => {
    if (aiCredits < amount) return false;
    setAiCredits((prev) => Math.max(0, prev - amount));
    return true;
  };

  const addAiCredits = (amount: number) => {
    setAiCredits((prev) => prev + amount);
  };

  const resetToDemoData = () => {
    setShipments(INITIAL_SHIPMENTS);
    setSelectedShipment(INITIAL_SHIPMENTS[0]);
    setContainers(INITIAL_CONTAINERS);
    setDocuments(INITIAL_DOCUMENTS);
    setValidationReports({ 'ship-1': SAMPLE_DISCREPANCY_REPORT });
    setFreightRates(INITIAL_FREIGHT_RATES);
    setCustomers(INITIAL_CUSTOMERS);
    setTrackingEvents(INITIAL_TRACKING);
    setCustomsClearances(INITIAL_CUSTOMS_CLEARANCES);
    setTransportOrders(INITIAL_TRANSPORT_ORDERS);
    setOverseasAgents(INITIAL_OVERSEAS_AGENTS);
    setMarketplaceEnquiries(INITIAL_MARKETPLACE_ENQUIRIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAiCredits(380);
  };

  return (
    <LogisticsContext.Provider
      value={{
        activeView,
        setActiveView,
        organizations,
        currentOrg,
        setCurrentOrg,
        currentUser,
        activeRoleType,
        setActiveRoleType,
        shipments,
        selectedShipment,
        setSelectedShipment,
        addShipment,
        updateShipment,
        containers,
        documents,
        addDocument,
        validationReports,
        setValidationReport,
        freightRates,
        addFreightRate,
        customers,
        addCustomer,
        trackingEvents,
        addTrackingEvent,
        customsClearances,
        updateCustomsClearance,
        transportOrders,
        updateTransportOrder,
        overseasAgents,
        marketplaceEnquiries,
        addMarketplaceEnquiry,
        marketplaceBids,
        addMarketplaceBid,
        financials,
        notifications,
        markNotificationRead,
        aiCredits,
        deductAiCredits,
        addAiCredits,
        currentPlan,
        setCurrentPlan,
        resetToDemoData,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
}

export function useLogistics() {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
}
