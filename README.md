# IITD Pulse — System Architecture & Application Context

*This document is designed to provide comprehensive context to any AI, developer, or stakeholder analyzing the IITD Pulse platform. It details the problem statement, functional modules, and the bespoke technical architecture of the application.*

---

## 1. The Problem Statement
Indian Institute of Technology Delhi (IITD) students and staff frequently engage with multiple isolated campus services: health centers, sports complexes, and infrastructure maintenance (Campus Care). Historically, these systems are disconnected, requiring forms, physical visits, or emails. 

**The Objective:** To build a centralized, zero-friction, mobile-first Web Application ("IITD Pulse") that unified all major campus quality-of-life services into a single, cohesive dashboard using extremely lightweight, serverless technology.

---

## 2. What the Application Is & What It Does
**IITD Pulse** is a fully responsive, static-hosted Web Application built for the IIT Delhi campus. It serves two distinct user bases: **Students** (who consume services and make requests) and **Staff** (who manage, approve, and resolve those requests).

### Core Capabilities:
- **Universal Dashboard Tracking:** Students have a centralized "Hub" where their upcoming doctor appointments, reserved tennis courts, and active maintenance tickets are tracked dynamically in real-time.
- **Medical/Hospital Portal:** Real-time filtering, searching, and booking of highly specialized doctors (Psychiatrists, Dermatologists, General Physicians) complete with AI-generated photorealistic portraits.
- **Athletics/Sports Portal:** A massive interactive grid to book specific sports facilities (Football pitches, Badminton courts) or rent physical equipment via a zero-cost checkout flow.
- **Campus Care Protocol:** A specialized reporting tool allowing students to drop-pin infrastructure issues (e.g., broken ACs, plumbing leaks) with photo attachments, triggering a live timeline ticket system.

---

## 3. Technical Architecture & Data Flow
Because the application is hosted natively on **GitHub Pages**, it lacks a traditional Node.js/Python server. To overcome this, the application uses a highly innovative **Two-Part Serverless Persistence Architecture**:

### A. The Frontend Logic & State Management (`js/db.js`)
- **Vanilla JavaScript & TailwindCSS:** The application avoids bloated frameworks like React or Angular to prioritize sheer speed, relying on raw JS and Tailwind utility classes.
- **Local Storage State Manager (`db.js`):** A custom library acts as a pseudo-NoSQL database within the browser. Whenever a student books a facility or files a complaint, `db.js` securely catches the action, reformats it, and caches it in local memory so the user retains their dashboard state perfectly across browser refreshes.

### B. The Cloud Backend (`backend/PulseDB.gs`)
- **Google Apps Script NoSQL Proxy:** To allow data synchronization globally across varying devices (mobile phones, laptops), the app connects to a `PulseDB.gs` file deployed on Google Apps Script. 
- **How it Works:** The Google Script acts as an enterprise-grade NoSQL router. It intercepts JSON actions from the GitHub frontend (`INSERT`, `DELETE`) and natively manipulates a literal Google Spreadsheet as its database core. 
- **Concurrency Protected:** It utilizes Google's `LockService`. If 50 students attempt to book a facility at the same millisecond, the backend logically queues the requests to prevent "Last-Writer-Wins" overwrite collisions.
- **Infinite Flexibility:** The backend enforces no strict schemas. The entire database is stored as a single parsed JSON string in Cell A1 of the Spreadsheet. This guarantees that any AI or future developer can add entirely new features (like a payment gateway or user roles) directly from the GitHub frontend without ever needing to modify the backend database router.

---

## 4. Application Parts / Directory Map

### `/pages/student/`
- `login.html`: Secure student access portal utilizing micro-animations.
- `hub.html`: The central nervous system showing dynamic "Active Bookings" and immediate action items perfectly synced from `db.js`.
- `hospital.html`: Medical booking portal with active dropdown/search filtering.
- `sports.html`: Athletics portal managing dual flows for Facility Booking and Equipment Rental via overlay modals.
- `campus-care.html`: Issue reporting portal supporting drag-and-drop file proofs and ticket tracking.

### `/pages/staff/`
- Contains mirrored versions of the student portals but designed for administrative control (e.g., resolving tickets, issuing prescriptions, verifying equipment stocks).

### `/js/`
- `auth.js`: Handles session verification and mock JWT-style login tokens.
- `shared.js`: Master controller for UI elements (Dynamic Particle Canvas backgrounds, Toast notifications, Modal states).
- `db.js`: The most critical architectural file. Handles all asynchronous `fetch()` requests to the Google Apps Script and local memory state mapping.
- `demo-data.js`: Provides simulated SMS/Email popup notifications when database events trigger correctly.

---

## 5. How to Expand the Application (AI Instructions)
If an AI agent is instructed to add a new feature to IITD Pulse in the future:
1. **No Backend Adjustment Required:** Do *not* write code for `backend/PulseDB.gs`. The Google Script automatically handles any new JSON tables or arrays the frontend invents.
2. **Use Database Methods:** Inject changes directly via `DB.syncAction('INSERT', 'new_table_name', { data })` found inside `js/db.js`.
3. **Keep Tailwind Consistent:** Utilize the defined `primary`, `secondary`, and `surface-container` custom hex colors located in the `<script>` tailwind config block explicitly at the top of every HTML file for visual harmony.
