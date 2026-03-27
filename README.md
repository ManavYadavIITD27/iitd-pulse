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

## 4. In-Depth Screen-by-Screen Breakdown

### A. The Authentication Layer (`/pages/student/login.html` & `/staff/login.html`)
**What it does:** The primary secure entryway to the platform.
**Features & Interactions:**
- **Magic Link Simulation:** Instead of complex passwords, the login portal utilizes an ultra-modern authentication UI with particle backgrounds where users simply enter their IITD email, simulating a Magic Link process.
- **Role Isolation:** Staff and Students have physically distinct login portals. The `auth.js` controller provisions mock JWT tokens locally based on the entry point granting distinct UI access.

### B. The Command Center / Hub (`/pages/student/hub.html`)
**What it does:** The centralized core of the application where a student gets a panoramic view of literally every action they have taken across the university.
**Features & Interactions:**
- **Dynamic Quick Links:** Four massive visual action cards exist to instantly jump to Hospital booking, Sports reservations, Mess tracking (mock), and Campus reporting.
- **The "Active Board" (Database Driven):** Rather than static text, the main dashboard contains an active list of upcoming doctor appointments, reserved tennis courts, and pending maintenance tickets. 
- **In-Line Cancellation:** Students can click the red 'Cancel' icon on any active booking. It triggers a JavaScript DOM removal micro-animation and atomic `DELETE` command into the `db.js` Local Storage, wiping the booking permanently from memory and cloud.

### C. The Medical / Hospital Screens (`/pages/student/hospital.html` & `/staff/pharmacy.html`)
**What it does:** A comprehensive booking and filtering portal for campus physicians.
**Features & Interactions:**
- **Photorealistic AI Grid:** The student view displays 9 distinct, highly-specialized doctors represented by hyper-realistic generative AI portraits.
- **Real-Time Live Filtering:** The UI includes a native Search Bar and a Department Dropdown (e.g., "Psychiatry", "Dermatology"). Typing into the search instantly filters the grid without page reloads using Vanilla JS DOM filtering.
- **Appointment Booking & Database Injection:** Clicking "Book Appointment" opens a localized confirmation Toast. Under the hood, this simultaneously pushes an `INSERT` command to the `db.js` memory, allowing that specific doctor to instantly appear on the `hub.html` dashboard.

### D. The Athletics / Sports Screens (`/pages/student/sports.html` & `/staff/sports-admin.html`)
**What it does:** A dual-purpose portal allowing students to book immovable facilities (like a Cricket pitch) or rent portable equipment (like Footballs).
**Features & Interactions:**
- **Zero-Friction Facility Workflow:** Students browse a grid of facilities (Badminton, Athletics, Swimming). Clicking "Book Slot" opens a slick Overlay Modal capturing Date and Time logic without navigating away.
- **Equipment Checkout Modal:** Students can rent high-demand gear. The application removed all pricing models (Cost: ₹0.00) to act purely as an inventory logger. Renting gear injects a structured booking confirmation directly into the NoSQL pipeline, triggering a simulated confirmation SMS.

### E. The Campus Care Reporting Screens (`/pages/student/campus-care.html` & `/staff/maintenance-report.html`)
**What it does:** A highly specific infrastructure reporting ticket system. 
**Features & Interactions:**
- **Drag-and-Drop Image Attachments:** Students can describe a broken AC unit or plumbing leak and actively drag an image photo of the breakage into a customized "Drop Zone". 
- **Ticket Generation:** On hitting submit, the UI resets and creates an `"iss_"` timestamped unique ticket ID. It generates a persistent database issue that appears across the student's Hub and theoretically on the Staff's management portal.
- **Timeline Tracking:** The right column features a beautifully CSS-styled vertical Timeline showing precise steps of the repair (Problem Logged -> Department Assigned -> Solution in Progress) informing the user of resolution estimates.

---

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
