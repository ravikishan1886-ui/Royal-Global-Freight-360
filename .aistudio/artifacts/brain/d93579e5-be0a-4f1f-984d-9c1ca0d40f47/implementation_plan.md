# FREIGHTFLOW 360 — International Logistics SaaS Ecosystem

A unified, multi-tenant digital operating system for global logistics that connects Freight Forwarders, Exporters, Importers, Customs Brokers, Transporters, and Overseas Agents from shipment enquiry to final cargo delivery with Gemini-powered document extraction and audit automation.

### User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying questions were skipped by the user, so the following recommended industry-standard defaults have been adopted for execution:
> - **Workspace & Persistence Strategy**: Comprehensive enterprise-grade reactive workspace engine with realistic multi-tenant seed data, state persistence in localStorage/IndexedDB, instant tenant isolation, plus a full Supabase PostgreSQL schema connector and migration export.
> - **Default Active Experience**: Freight Forwarder 360 Cockpit by default with an instant multi-role switcher allowing one-click exploration of Exporter, Importer, Customs Broker, Transporter, Overseas Agent, and Super Admin workspaces.
> - **Spotlighted AI Workflow**: Commercial Invoice and Packing List automated extraction paired with intelligent discrepancy auditing (weight, package quantity, HS code, and value consistency verification) powered server-side by Gemini 3.8 Flash (`gemini-3.8-flash`).

---

### 1. Overview & Core Concept

- **What It Does**: Digitizes and automates the entire international shipment lifecycle (FCL, LCL, Air, Road, Rail, Project Cargo). Features centralized shipment files (`FF360-2026-XXXXXX`), shared multi-party collaboration workspaces, automated AI document extraction and cross-check validation, container demurrage/detention clocks, customer CRM, rate matrices, freight quotation builders, billing/invoicing with Razorpay integration, and a B2B logistics freight marketplace.
- **Target Audience / Personas**:
  - *Freight Forwarders*: Operational nerve center for bookings, ocean/air tracking, rates, margin calculation, and multi-party coordination.
  - *Exporters & Importers*: Self-service portal to request rates, accept quotes, review cargo milestones, and access trade documents.
  - *Customs Brokers*: Dedicated clearance workflow, document checklists, discrepancy alerts, and clearance status approvals.
  - *Transporters*: First/last-mile truck dispatching, driver assignment, gate-in/gate-out logs, and electronic Proof of Delivery (e-POD) capture.
  - *Overseas Agents*: Destination delivery orders, arrival notices, and mutual billing reconciliations.
  - *Super Admin*: Platform governance, tenant verification (GSTIN/IEC checks), subscription telemetry, and dispute management.
- **Key Value**: Eliminates manual cross-checking errors between Commercial Invoices and Packing Lists, prevents costly container detention penalties with automated free-day countdowns, and reduces quotation turnaround from days to minutes.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Onboarding & Role Context Switching**: Users enter the platform with pre-configured verified organizations or register a new entity (with GSTIN, IEC, country, and role). A persistent top-bar workspace switcher lets operators transition seamlessly between stakeholder views to observe multi-tenant collaboration in real time.
2. **Shipment Creation & Multi-Tab File**: Forwarder or Exporter initiates a shipment (e.g., `FF360-2026-000842`). The unified shipment file features 8 dedicated operational tabs: *Overview, Documents & AI Audit, Tracking & Milestones, Quotations & Rates, Communication & Notes, Financials & P&L, Tasks & Clearances, and Audit History*.
3. **AI Document Extraction & Discrepancy Audit**: User uploads or selects trade documents (Commercial Invoice, Packing List, BL Draft). Server-side Gemini API extracts key invoice items, weights, and packages, then runs an automated reconciliation highlighting discrepancies (e.g., net vs gross weight inversion, quantity mismatch, or value inconsistencies).
4. **Container Demurrage & Detention Countdown**: Visual traffic-light tracking of terminal free time, shipping line detention deadlines, and estimated per-diem accruals.
5. **Logistics Marketplace**: Exporters post freight enquiries; Forwarders browse filtered lanes (e.g., Nhava Sheva to Rotterdam FCL), submit competitive bids, negotiate, and accept contracts.
6. **Billing & Hybrid Monetization**: Subscription tiers (Starter ₹999/mo, Professional ₹2,499/mo, Business ₹5,999/mo, Enterprise) with Razorpay checkout integration, AI credit balance monitoring, and automated tax invoicing.

#### Visual Identity & Theme
- **Aesthetic Direction**: High-density international B2B SaaS interface built for maritime, air, and intermodal freight operations. Clean, authoritative, and utilitarian with zero visual clutter.
- **Color Palette & Mood**:
  - Dominant Neutral: Deep Navy Slate (`#0B132B`, `#1C2541`) paired with Crisp White (`#FFFFFF`) and Cool Gray canvas (`#F8FAFC`).
  - Structural Surfaces: Hairline borders (`border-slate-200 dark:border-slate-800`), muted card surfaces (`#FFFFFF dark:#0F172A`).
  - Accents: Sky Blue (`#0284C7`, `#38BDF8`) for interactive focus, Emerald (`#16A34A`) for verified/cleared statuses, Amber (`#D97706`) for demurrage warnings, and Crimson (`#DC2626`) for document mismatches and overdue demurrage.
- **Typography & Hierarchy**:
  - Primary Display & Navigation: `Plus Jakarta Sans` / `Outfit` for crisp structure.
  - Primary Body: `DM Sans` / `Public Sans` (13px–15px) for dense, fatigue-free scanning.
  - Data & Financial Numerals: `JetBrains Mono` / `tabular-nums` for container numbers, weights, HS codes, currencies, and timestamps.
- **Anti-Slop Discipline**: Strict anti-pill discipline for static metadata; no mechanical code-comment titles; no fake pulsing dots on static text; single-elevation depth with clean hairline dividers.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Layer Persistence (Reactive Workspace + Supabase Schema Engine)**
  - *Chosen Approach*: Deliver an immediate, fully functional multi-tenant application powered by a synchronized in-memory and persistent reactive state engine with comprehensive pre-seeded real-world logistics data, paired with a dedicated Database & Migration Center exporting the complete 33-table PostgreSQL/Supabase schema and live connector.
  - *Why*: Allows instantaneous out-of-the-box exploration of all 6 portals and full CRUD operations without requiring users to configure external cloud databases upfront, while remaining 100% architecturally compliant with production Supabase deployments.
- **Decision 2: Server-Side Gemini API with Structured Schema Validation**
  - *Chosen Approach*: Route all document extraction, mismatch auditing, quotation generation, and assistant queries through secure Next.js server routes (`/api/gemini/*`) using `@google/genai` and `gemini-3.8-flash` with JSON response schemas.
  - *Why*: Prevents API key exposure to the client, enforces strict data schemas for logistics fields, and provides reliable error fallbacks.
- **Decision 3: Integrated Multi-Party Shipment Workspace**
  - *Chosen Approach*: Link all participants (Shipper, Consignee, Forwarder, Broker, Trucker, Agent) to the exact same shipment record, but render contextual action sets based on the active role's permission matrix.
  - *Why*: Accurately mirrors real-world supply chain workflows where all parties collaborate on a single master shipment file while maintaining data segregation.
- **Decision 4: Demurrage & Detention Clock Calculator**
  - *Chosen Approach*: Implement an interactive deadline calculator with shipping line rules (Maersk, MSC, CMA CGM, Hapag-Lloyd standard tariffs) calculating free days, last free day (LFD), and accumulated detention per container.
  - *Why*: Container detention is one of the biggest unexpected operational costs in logistics; automated alerts deliver immense practical value.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          FREIGHTFLOW 360 UI                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Top Navigation: Brand | Role Switcher | Notifications | Profile  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────┬──────────────────────────────────────────────┐  │
│  │ Collapsible Nav   │ Main Viewport Content                        │  │
│  │ - Dashboard       │ - 6 Role-Specific Dashboards                 │  │
│  │ - Shipments       │ - Shipment Central (List & 8-Tab Workspace)  │  │
│  │ - AI Doc Studio   │ - Commercial Invoice vs Packing List Audit   │  │
│  │ - Rates & Quotes  │ - Matrix, Profit Calculator & PDF Exporter   │  │
│  │ - Tracking Radar  │ - Milestones & AIS Tracking Simulator       │  │
│  │ - Demurrage Watch │ - Free Days & Detention Fee Counter          │  │
│  │ - Marketplace     │ - B2B Freight Enquiries & Bidding Hub        │  │
│  │ - Customs Broker  │ - Task Checklist & Clearance Filings         │  │
│  │ - Transporter Hub │ - Truck Dispatch & Electronic POD            │  │
│  │ - Finance & P&L   │ - Invoices, Bills, Currency, Profit Formula  │  │
│  │ - Subscriptions   │ - Razorpay Plans & AI Credit Wallet          │  │
│  │ - Super Admin     │ - Verification, Platform Telemetry & Config  │  │
│  └───────────────────┴──────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Client State / Server Proxy
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND & API LAYER (Next.js)                   │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  /api/gemini/extract-document │  │  /api/gemini/audit-mismatch    │ │
│  │  - Commercial Invoice parser  │  │  - CI vs PL reconciliation     │ │
│  │  - Packing List & BL draft    │  │  - Weight & package warnings   │ │
│  └───────────────────────────────┘  └────────────────────────────────┘ │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  /api/gemini/logistics-copilot│  │  /api/payments/razorpay        │ │
│  │  - Smart email & quote draft  │  │  - Order creation & webhooks   │ │
│  │  - Terminology & missing docs │  │  - AI credit top-ups           │ │
│  └───────────────────────────────┘  └────────────────────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         DATA PERSISTENCE LAYER                         │
│  - Multi-tenant Organization Engine (Isolated by Org ID)               │
│  - 33 Normalized Entities (Shipments, Containers, Audits, Rates, etc.) │
│  - Supabase PostgreSQL Connector & DDL Export Console                  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Complete 33-Table Normalized Entity Schema
1. `organizations` (id, name, type, country, city, address, gstin, iec, verified_status, created_at)
2. `organization_members` (id, org_id, user_id, role, title, created_at)
3. `user_profiles` (id, email, full_name, phone, avatar_url, preferences)
4. `organization_verifications` (id, org_id, document_type, doc_url, review_status, notes)
5. `customers` (id, org_id, company_name, email, phone, gstin, iec, balance, notes)
6. `shipments` (id, shipment_number, org_id, mode, incoterms, status, origin, destination, pol, pod, etd, eta, booking_no, bl_no)
7. `shipment_participants` (id, shipment_id, org_id, role, access_level)
8. `containers` (id, shipment_id, container_no, type, seal_no, gross_wt, tare_wt, arrival_date, free_days, return_deadline, status)
9. `documents` (id, shipment_id, org_id, name, type, file_url, status, uploaded_by, created_at)
10. `document_versions` (id, document_id, version_num, file_url, change_log)
11. `document_extractions` (id, document_id, raw_json, exporter, importer, invoice_no, total_value, currency, total_packages, gross_wt)
12. `document_validations` (id, shipment_id, invoice_doc_id, packing_list_doc_id, status, mismatch_count, details_json)
13. `quotations` (id, shipment_id, quote_no, customer_id, freight_charge, origin_charges, dest_charges, margin, currency, status, validity_date)
14. `freight_rates` (id, vendor_id, carrier, origin, destination, container_type, ocean_freight, currency, valid_until)
15. `vendors` (id, org_id, name, type, contact, email, rating)
16. `overseas_agents` (id, org_id, company_name, country, city, contact_person, email, payment_terms, rating)
17. `customs_clearances` (id, shipment_id, broker_id, port, boe_number, status, filing_date, clearance_date, notes)
18. `transport_orders` (id, shipment_id, transporter_id, driver_name, vehicle_no, pickup_time, delivery_time, pod_url, status)
19. `tracking_events` (id, shipment_id, milestone, location, timestamp, status_code, is_manual, notes)
20. `shipment_tasks` (id, shipment_id, title, assigned_role, due_date, completed, priority)
21. `shipment_messages` (id, shipment_id, sender_org_id, sender_name, message, channel, created_at)
22. `invoices` (id, shipment_id, customer_id, invoice_number, subtotal, tax, total, currency, payment_status, due_date)
23. `expenses` (id, shipment_id, vendor_id, category, amount, currency, status, receipt_url)
24. `payments` (id, invoice_id, amount, method, transaction_id, status, recorded_at)
25. `subscriptions` (id, org_id, plan_id, status, current_period_end, cancel_at_period_end)
26. `subscription_plans` (id, name, price_monthly_inr, ai_credits_monthly, max_users, features_json)
27. `ai_credits` (id, org_id, total_credits, used_credits, updated_at)
28. `transactions` (id, org_id, type, amount, credits, razorpay_payment_id, status, timestamp)
29. `marketplace_enquiries` (id, exporter_org_id, origin, destination, mode, commodity, target_date, status, bids_count)
30. `marketplace_bids` (id, enquiry_id, forwarder_org_id, quote_amount, transit_days, validity_date, status)
31. `notifications` (id, user_id, org_id, title, message, link, read, created_at)
32. `audit_logs` (id, org_id, user_id, action, entity_type, entity_id, metadata_json, created_at)
33. `support_tickets` (id, org_id, subject, priority, status, created_at, resolved_at)

#### Interactive Components & Workflows
- **Shipment Management Central**: Filterable grid with status pipeline chips, search by container/BL, quick shipment creation drawer, and deep-dive detail modal/view.
- **AI Document Extraction & Audit Studio**: Upload drag-and-drop area, side-by-side extraction viewer, interactive discrepancy badge list with one-click resolution and human approval checkpoint.
- **Freight Rate & Quotation Engine**: Multi-lane comparison, margin markup slider (+15%, +20%, custom), multi-currency selector (USD, EUR, INR, AED), and PDF quotation preview.
- **Demurrage & Detention Radar**: Real-time days-remaining counter, color-coded urgency bands, port terminal rules, and cost projection sheet.
- **Marketplace Hub**: Lane search, verified badge inspection, quote submission modal, and bidder counter-offer negotiation thread.
- **Role Switcher & Super Admin Oversight**: Global header control to effortlessly preview the exact platform experience from any of the 6 logistics stakeholder perspectives or the platform administrator.
