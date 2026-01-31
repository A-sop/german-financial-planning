# Product Requirements Document

## Executive Concierge Orchestration

**Status:** Active PRD – MVP with Roadmap

---

## 1) Product Vision

Build an executive concierge and operational assistant that turns voice instructions, forwarded messages, and documents into structured client cases, obligations, and executed workflows. The system minimizes human oversight while preserving control by routing sensitive actions to a designated human assistant for approval.

The product functions as a **CRM + task manager + document intelligence system** for modern executives and concierge operators.

---

## 2) Objective

Enable an executive to delegate operational complexity to a system that:

* captures instructions via **voice, messages, and documents**,
* maintains a reliable, structured case database,
* drafts communications and prepares documents and forms,
* and uses a **human assistant approval layer** for outbound communication and high-risk updates.

---

## 3) Users & Roles (MVP)

### 1. Executive (Primary User)

* Owns the account and subscription
* Issues instructions (voice, forwarded messages, uploads)
* Oversees cases and final outcomes
* Can act on behalf of their own clients

### 2. Assistant (Human Approver – Included)

* Added by the Executive (name + email)
* Has access to assigned cases and tasks
* Reviews and approves:

  * outbound communications
  * sensitive data updates
* Can send communications **on behalf of the Executive or their clients**, within granted permissions

> **Note:** MVP supports **one assistant per account**, included in the base subscription. Expanded team roles are on the roadmap.

---

## 4) Non-Goals (MVP)

* No fully autonomous outbound communication (approval always required)
* No native mobile app (roadmap)
* No unlimited team permissions (1 assistant only)
* No attempt to provide legal advice (process support only)

Billing and subscription logic **is in scope** but may be minimal at MVP launch.

---

## 5) Core Data Objects

### Account

* Subscription
* Users (Executive + Assistant)
* Permissions

### Case

* Client
* Service type (relocation, business setup, etc.)
* Status/stage
* Linked tasks, documents, messages
* Approval rules

### Contact

* Person or organization
* Role (client, authority, vendor)
* Communication permissions

### Task / Obligation

* Owner
* Due date
* Priority
* Status
* Linked Case

### Document

* Original file
* Extracted text
* Structured fields (candidate + approved)
* Normalized file name
* Audit history

### Message

* Inbound / outbound
* Source (email, forwarded message, voice transcript)
* Sender / recipient
* Approval status

### Voice Instruction

* Audio
* Transcript
* Interpreted intent
* Confidence score
* Approval requirement

---

## 6) Scope (MVP)

### A) Multi-Channel Input

* Email forwarding / CC
* Voice instructions (speech-to-text)
* Forwarded messages from other platforms (e.g. WhatsApp via forwarding)
* Optional Slack intake (not required, not core)

### B) Document Ingestion & Intelligence

* Supported formats:

  * PDF
  * DOCX
  * XLS/XLSX
  * Common image formats
* OCR for scanned documents and images
* Text extraction for digital files
* Structured data extraction with confidence scoring

### C) Approval-Gated Database Updates

* All extracted data shown as **candidate updates**
* Assistant or Executive approves before write
* High-risk fields always require approval
* Full audit trail

### D) Document Normalization & Retrieval

* Automatic human-readable renaming:

  * Case
  * Document type
  * Date
  * Identifier
* Searchable and attachable later
* Original files preserved

### E) Case Workspace (CRM)

* Single source of truth:

  * Contacts
  * Documents
  * Fields
  * Tasks
  * Timeline
* Role-based visibility (Executive vs Assistant)
* Accessible UI (keyboard, screen reader)

### F) Task Orchestration

* Tasks created from:

  * Voice
  * Messages
  * Documents
* Global and case-specific task views
* Waiting-on tracking

### G) Communications & Letters (Approval Required)

#### Email

* Drafted by system
* Approved by Assistant or Executive
* Sent on behalf of:

  * Executive
  * Executive's client (where permitted)

#### Letters (DIN-Compliant)

* Generate formal letters:

  * With or without letterhead
  * DIN-standard layout
  * Sender, receiver, date, subject
  * Placeholder for logo
* Export as PDF or DOCX
* Approval required before sending or exporting

### H) Form Assistance

* Form-ready data packets
* Missing-field detection
* Approval-gated requests for missing information

### I) Accessibility

* Keyboard navigation
* Screen reader compatibility
* Adequate contrast
* Text-to-speech for summaries and drafts

---

## 7) Permissions Model (MVP)

| Action                 | Executive | Assistant         |
| ---------------------- | --------- | ----------------- |
| View cases             | Yes       | Assigned only     |
| Upload documents       | Yes       | Yes               |
| Edit candidate updates | Yes       | Yes               |
| Approve updates        | Yes       | Yes               |
| Draft communications   | Yes       | Yes               |
| Send communications    | Yes       | Yes (if approved) |
| Manage users           | Yes       | No                |

---

## 8) Automation & Control Policy

* **Always approval-required:**

  * Outbound communications
  * Identity/legal data updates
* Optional future setting:

  * Auto-apply low-risk, high-confidence updates
* All actions logged and auditable

---

## 9) Success Metrics (Initial)

* Time from input → structured case/task
* % of documents with approved extracted fields
* Reduction in manual task creation
* Approval turnaround time
* On-time task completion
* Document retrieval success

---

## 10) Roadmap & UI Placeholders

### Coming Soon (Visible in UI)

* Native mobile app
* Additional assistants
* Expanded messaging ingestion
* Automated follow-ups
* Advanced workflow automation
* Case templates by service type

UI should clearly mark these as **"Coming Soon"** to set expectations.

---

## 11) Implementation Phases (High-Level)

**Phase 1 – Core MVP**

* Users & permissions
* Intake (email, voice, forwarding)
* Cases, tasks, documents
* OCR + extraction + approval
* Drafting + approval-gated sending
* DIN letter generation

**Phase 2 – Expansion**

* Mobile app
* Additional assistants
* Smarter automation rules
* Deeper form integrations

---

## 12) Implementation Plan

### Stage 1 — UI Design Only

* ✅ Extract user stories, acceptance criteria, and list required UI parts (pages, sections, components)
* ✅ Install shadcn/ui components (Button, Card, Badge; tables/structures built with native HTML)
* ✅ Create page and components at `/task-orchestration`; compose layout
* ✅ Create realistic mock data and placeholder content; wire into UI
* ✅ Ensure each user story is visually supported and acceptance criteria represented
* ✅ Keep interactions non-destructive (placeholders, no real logic)
* ✅ Run lint/type check and fix UI-only issues
* ✅ Add professional polish (spacing, typography, focus/hover states)
* ✅ Improve accessibility (labels, roles, ARIA, keyboard navigation, skip link)
* ✅ Verify responsive behavior and dark mode compatibility

### Stage 2 — Backend & Data (Not started)

* Connect to database/API
* Replace mock data with real data
* Implement CRUD operations for cases, tasks, documents, contacts

### Stage 3 — Full Functionality (Not started)

* Approval flows and workflow logic
* Document ingestion and extraction
* Communications drafting and sending

---

**Stage 1 summary:** UI built at `/task-orchestration` using shadcn/ui components (Button, Card, Badge). Mock data lives in `src/lib/mock-data.ts`. Includes Cases list, Case workspace (Overview, Contacts, Documents, Tasks, Timeline), Tasks view with global/by-case filter, and Coming Soon section.
