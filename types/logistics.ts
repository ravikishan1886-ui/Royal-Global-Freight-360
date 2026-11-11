// FREIGHTFLOW 360 - Comprehensive Logistics Domain Types & Schemas

export type OrganizationType =
  | 'freight_forwarder'
  | 'exporter'
  | 'importer'
  | 'customs_broker'
  | 'transporter'
  | 'overseas_agent';

export type UserRole =
  | 'super_admin'
  | 'support_admin'
  | 'company_owner'
  | 'company_admin'
  | 'operations_manager'
  | 'documentation_executive'
  | 'finance_manager'
  | 'sales_executive'
  | 'customer';

export type TransportMode =
  | 'FCL'
  | 'LCL'
  | 'Air Freight'
  | 'Road Freight'
  | 'Rail Freight'
  | 'Project Cargo';

export type ShipmentStatus =
  | 'Enquiry'
  | 'Quotation'
  | 'Booking Pending'
  | 'Booking Confirmed'
  | 'Cargo Received'
  | 'Customs Clearance'
  | 'Vessel Departed'
  | 'In Transit'
  | 'Arrived'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Closed';

export type Incoterm =
  | 'EXW'
  | 'FCA'
  | 'CPT'
  | 'CIP'
  | 'DAP'
  | 'DPU'
  | 'DDP'
  | 'FAS'
  | 'FOB'
  | 'CFR'
  | 'CIF';

export type ContainerType =
  | '20GP'
  | '40GP'
  | '40HC'
  | '45HC'
  | '20RF'
  | '40RF'
  | '20OT'
  | '40OT'
  | '20FR'
  | '40FR';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  country: string;
  city: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  gstin?: string;
  iec?: string;
  isVerified: boolean;
  verificationBadge: 'verified' | 'pending' | 'unverified';
  logoUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  orgId: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Customer {
  id: string;
  orgId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin?: string;
  iec?: string;
  address: string;
  outstandingBalance: number;
  currency: string;
  totalShipments: number;
  notes?: string;
  createdAt: string;
}

export interface Container {
  id: string;
  shipmentId: string;
  containerNumber: string;
  containerType: ContainerType;
  sealNumber: string;
  grossWeightKg: number;
  tareWeightKg: number;
  carrier: string;
  arrivalDate?: string;
  terminalFreeDays: number;
  carrierFreeDays: number;
  lastFreeDay?: string;
  emptyReturnDeadline?: string;
  dailyDetentionRate: number;
  currency: string;
  status: 'at_origin' | 'on_board' | 'discharged' | 'gated_out' | 'empty_returned';
}

export interface TrackingMilestone {
  id: string;
  shipmentId: string;
  milestone:
    | 'Booking Confirmed'
    | 'Cargo Picked Up'
    | 'Gate-in Container'
    | 'Customs Clearance Started'
    | 'Customs Cleared'
    | 'Vessel Departed'
    | 'Transshipment'
    | 'Vessel Arrived'
    | 'Discharged'
    | 'Out for Delivery'
    | 'Delivered';
  location: string;
  timestamp: string;
  isCompleted: boolean;
  isManual: boolean;
  notes?: string;
  vesselName?: string;
  voyageNumber?: string;
}

export interface DocumentItem {
  id: string;
  shipmentId: string;
  orgId: string;
  name: string;
  type:
    | 'Commercial Invoice'
    | 'Packing List'
    | 'Bill of Lading'
    | 'Shipping Instructions'
    | 'Arrival Notice'
    | 'Delivery Order'
    | 'Certificate of Origin'
    | 'Insurance Certificate'
    | 'E-Way Bill'
    | 'Customs Declaration';
  fileUrl: string;
  fileSize: string;
  status: 'draft' | 'pending_review' | 'verified' | 'approved' | 'rejected';
  isGenerated: boolean;
  isDraft: boolean; // BL Draft rule
  version: number;
  uploadedAt: string;
  approvedBy?: string;
}

export interface ExtractedDocumentData {
  documentId?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  exporter: {
    name: string;
    address: string;
    gstin?: string;
    iec?: string;
  };
  importer: {
    name: string;
    address: string;
    taxId?: string;
  };
  consignee: {
    name: string;
    address: string;
  };
  notifyParty?: string;
  origin: string;
  destination: string;
  portOfLoading: string;
  portOfDischarge: string;
  incoterm: Incoterm;
  currency: string;
  totalInvoiceValue: number;
  totalPackages: number;
  packageType: string;
  grossWeightKg: number;
  netWeightKg: number;
  volumeCbm: number;
  items: Array<{
    itemCode?: string;
    description: string;
    hsCode: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalAmount: number;
  }>;
}

export interface DocumentDiscrepancy {
  field: string;
  invoiceValue: string | number;
  packingListValue: string | number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  isResolved: boolean;
}

export interface DocumentValidationReport {
  id: string;
  shipmentId: string;
  validatedAt: string;
  status: 'PASS' | 'WARNING' | 'FAILED';
  overallRiskScore: number; // 0 - 100
  discrepancies: DocumentDiscrepancy[];
  summary: string;
  recommendations: string[];
  approvedByHuman: boolean;
  approvalNotes?: string;
}

export interface Shipment {
  id: string;
  shipmentNumber: string; // FF360-2026-XXXXXX
  orgId: string;
  customerId: string;
  customerName: string;
  exporterName: string;
  importerName: string;
  shipperName: string;
  consigneeName: string;
  notifyParty?: string;
  origin: string;
  destination: string;
  portOfLoading: string;
  portOfDischarge: string;
  transportMode: TransportMode;
  incoterms: Incoterm;
  commodity: string;
  hsCode: string;
  containerType: ContainerType;
  containers: Container[];
  grossWeightKg: number;
  netWeightKg: number;
  packageQuantity: number;
  volumeCbm: number;
  carrier: string;
  vesselName?: string;
  voyageNumber?: string;
  bookingNumber: string;
  blNumber: string;
  isBlDraft: boolean;
  etd: string;
  eta: string;
  actualDeparture?: string;
  actualArrival?: string;
  status: ShipmentStatus;
  overseasAgentId?: string;
  overseasAgentName?: string;
  customsBrokerId?: string;
  customsBrokerName?: string;
  transporterId?: string;
  transporterName?: string;
  assignedManager: string;
  createdAt: string;
}

export interface FreightRate {
  id: string;
  vendorId: string;
  vendorName: string;
  carrier: string;
  origin: string;
  destination: string;
  containerType: ContainerType;
  oceanFreight: number;
  originCharges: number;
  destinationCharges: number;
  documentationFee: number;
  otherCharges: number;
  currency: string;
  transitDays: number;
  validityDate: string;
  routeType: 'Direct' | 'Transshipment';
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  shipmentId?: string;
  customerId: string;
  customerName: string;
  origin: string;
  destination: string;
  transportMode: TransportMode;
  containerType?: ContainerType;
  baseFreightCost: number;
  originLocalCharges: number;
  destinationLocalCharges: number;
  customsBrokerageFee: number;
  insuranceFee: number;
  markupPercentage: number;
  totalQuoteAmount: number;
  currency: string;
  status: 'draft' | 'sent' | 'accepted' | 'negotiation' | 'declined' | 'expired';
  validUntil: string;
  termsAndConditions: string;
  createdAt: string;
}

export interface CustomsClearanceRecord {
  id: string;
  shipmentId: string;
  shipmentNumber: string;
  customsBrokerId: string;
  customsBrokerName: string;
  port: string;
  billOfEntryNumber: string;
  filingDate: string;
  status:
    | 'Documents Required'
    | 'Documents Under Review'
    | 'Query Raised'
    | 'Assessment Completed'
    | 'Duty Paid'
    | 'Out of Charge (OOC)'
    | 'Clearance Completed';
  dutyAmount: number;
  dutyPaid: boolean;
  checklist: Array<{
    title: string;
    isMandatory: boolean;
    isVerified: boolean;
  }>;
  customsNotes?: string;
  completedAt?: string;
}

export interface TransportOrder {
  id: string;
  shipmentId: string;
  shipmentNumber: string;
  transporterId: string;
  transporterName: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  pickupLocation: string;
  deliveryLocation: string;
  scheduledPickup: string;
  actualPickup?: string;
  scheduledDelivery: string;
  actualDelivery?: string;
  status:
    | 'Assigned'
    | 'En Route to Pickup'
    | 'Cargo Loaded'
    | 'In Transit'
    | 'At Destination'
    | 'Delivered'
    | 'POD Uploaded';
  podUrl?: string;
  transportCharges: number;
  currency: string;
}

export interface OverseasAgent {
  id: string;
  companyName: string;
  country: string;
  city: string;
  contactPerson: string;
  email: string;
  phone: string;
  services: string[];
  paymentTerms: string;
  currency: string;
  performanceRating: number; // 1 to 5
  activeShipmentsCount: number;
  notes?: string;
}

export interface MarketplaceEnquiry {
  id: string;
  exporterOrgId: string;
  exporterOrgName: string;
  isVerifiedExporter: boolean;
  origin: string;
  destination: string;
  transportMode: TransportMode;
  containerType?: ContainerType;
  commodity: string;
  approxWeightKg: number;
  targetShipmentDate: string;
  targetRate?: number;
  currency: string;
  status: 'Open for Bids' | 'Bidding Closed' | 'Awarded';
  bidsCount: number;
  lowestBid?: number;
  createdAt: string;
}

export interface MarketplaceBid {
  id: string;
  enquiryId: string;
  forwarderOrgId: string;
  forwarderOrgName: string;
  forwarderRating: number;
  isVerifiedForwarder: boolean;
  bidAmount: number;
  transitDays: number;
  carrier: string;
  validUntil: string;
  status: 'Submitted' | 'Shortlisted' | 'Accepted' | 'Declined';
  notes?: string;
  createdAt: string;
}

export interface ShipmentFinancial {
  id: string;
  shipmentId: string;
  shipmentNumber: string;
  revenueItems: Array<{
    id: string;
    description: string;
    amount: number;
    currency: string;
    invoiceNumber: string;
    isPaid: boolean;
  }>;
  expenseItems: Array<{
    id: string;
    vendorName: string;
    category: 'Ocean Freight' | 'Port Handling' | 'Customs' | 'Haulage' | 'Documentation' | 'Demurrage';
    amount: number;
    currency: string;
    billNumber: string;
    isPaid: boolean;
  }>;
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  profitMarginPercent: number;
  currency: string;
}

export interface ShipmentTask {
  id: string;
  shipmentId: string;
  title: string;
  assignedRole: UserRole;
  dueDate: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface ShipmentMessage {
  id: string;
  shipmentId: string;
  senderOrgName: string;
  senderName: string;
  senderRole: string;
  message: string;
  timestamp: string;
  isInternalOnly: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'demurrage_alert' | 'document_discrepancy' | 'clearance_update' | 'bid_received' | 'tracking_milestone';
  shipmentNumber?: string;
  createdAt: string;
  isRead: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: 'Starter' | 'Professional' | 'Business' | 'Enterprise';
  priceMonthlyInr: number;
  aiCreditsMonthly: number;
  maxUsers: number;
  maxActiveShipments: number;
  features: string[];
}
