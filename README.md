# Library Management Comment Optimization (Version 2.0)

[![Release](https://img.shields.io/badge/Release-v2.0-purple.svg)](https://github.com/Rithish-21/Library-Management-Comment-Optimization-)
[![Tests](https://img.shields.io/badge/Tests-55%20Passed-emerald.svg)](https://github.com/Rithish-21/Library-Management-Comment-Optimization-)
[![RBAC](https://img.shields.io/badge/RBAC-Librarian%20Protected-indigo.svg)](https://github.com/Rithish-21/Library-Management-Comment-Optimization-)

A state-of-the-art intelligent **Library Management Comment Optimization** system built with **React 18**, **JavaScript (ES Modules)**, **Tailwind CSS**, **Zustand**, and a high-performance **Python FastAPI** backend with **Pydantic** models.

---

## 🔒 Version 2.0 RBAC Permission Matrix

| Capability / Module | Student Role | Librarian Role | Enforcement Layer |
|---|---|---|---|
| **Add Stock & Books** | 🚫 Restricted | ✅ Authorized | Store guardrail + UI Ingestion Terminal |
| **Delete Stock & Books** | 🚫 Restricted | ✅ Authorized | Store guardrail + Inventory Delete Action |
| **Edit "About Books" / Metadata** | 👁️ View-only | ✅ Edit & Save | Catalog & Inventory Modal Guards |
| **Return Book Processing** | 🚫 Restricted | ✅ Authorized | Screen 6 Guard + Store validation |
| **Fine Allocation & Waivers** | 🚫 Restricted | ✅ Authorized | Custom penalty rates & waiver reasons |
| **Fine Collection & Receipts** | 🚫 Restricted | ✅ Authorized | Audit receipts & Collection Ledger |
| **Book Catalog & O(log n) Search** | ✅ Full Access | ✅ Full Access | Public reader access |
| **FIFO Reservation Queue** | ✅ Full Access | ✅ Full Access | Priority queue booking |
| **Smart Recommendations & Trends** | ✅ Full Access | ✅ Full Access | Affinity & popularity leaderboards |

---

## 🚀 Key Features & 10 Functional Screens

1. **Authentication & RBAC (`/login`)** — Role switcher supporting **Student** (`student@lib.com`) and **Librarian** (`librarian@lib.com`) credentials with demo password `demo123` and quick-fill chips.
2. **Operations Dashboard (`/dashboard`)** — Real-time KPI summary widgets, dynamic **"Due Soon" Alert Banner** (Feature 6), role-tailored CTAs, and recent activity ledger.
3. **Book Catalog (`/catalog`)** — Full catalog browser with category pills, physical shelf locations (`A1`, `B2`...), status badges, and Librarian-only **"Edit About Book"** controls.
4. **Fast Search & Benchmark (`/search`)** — Demonstrates **O(log n) Binary Search** on pre-sorted array vs. **O(n) Linear Scan** with side-by-side timing in milliseconds, step counter, and interactive execution trace visualizer (Feature 1).
5. **Issue Book (`/issue`)** — Digital checkout with real-time stock verification guardrail (blocks issue if stock = 0), member selection, and automatic inventory decrement (Features 2 & 4).
6. **Return Book & Fine Allocation / Collection (`/return`)** — **Librarian-exclusive** screen with automated formula assessment, custom penalty rate allocation, manual waiver options, settlement methods, and permanent collection audit receipts (Feature 3).
7. **Reservation Priority Queue (`/reservation`)** — FIFO waitlist queue allocation for checked-out / out-of-stock titles with live queue position indicator (`#1`, `#2`...) and rebalancing (Features 5 & 14).
8. **Stocks & Inventory Center (`/inventory`)** — **Librarian-exclusive** control center for **Add & Delete Stocks**, book deduplication, status toggles, editing "About Books" details, and memory snapshot backups (Features 7, 12, 15).
9. **Smart Recommendations (`/recommendations`)** — Category affinity suggestions (Feature 8) and **Borrow Popularity Leaderboard** with the `#1 Trending` badge computed via `max()` (Feature 11).
10. **Executive Analytics & Members (`/analytics`)** — KPIs, categorical stock distribution progress bars, operational health monitors, and member directory lookup with borrow history (Features 9 & 13).


---

## 🧠 Core Algorithms & Architectures

| Algorithm / Service | Implementation | Complexity | Purpose |
|---|---|---|---|
| `binarySearch` | `searchService.js` / `search_service.py` | **O(log n)** | Sub-millisecond catalog lookup on title-sorted books array |
| `calculateFine` | `fineService.js` / `fine_service.py` | **O(1)** | Strict `$5 × (ReturnDate - DueDate)` late fee calculation |
| `isReminderDue` | `fineService.js` / `fine_service.py` | **O(1)** | Flags loans due within threshold days or overdue |
| `issueFromInventory` | `inventoryService.js` / `inventory_service.py` | **O(1)** | Safe inventory decrement guardrails (prevents negative stock) |
| `addBookIfNotDuplicate` | `inventoryService.js` / `inventory_service.py` | **O(n)** | Validates title and ISBN uniqueness before ingestion |
| `createReservation` | `reservationService.js` / `reservation_service.py` | **O(n)** | Appends member to FIFO priority queue with position `#index+1` |
| `mostPopular` | `recommendationService.js` / `recommendation_service.py` | **O(n log n)** | Sorts borrow counts descending to highlight trending titles |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Pure JavaScript (JSX, ES Modules), Tailwind CSS, Lucide React icons, Three.js 3D Book Scene.
- **State Management**: Zustand with persistent storage.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, Uvicorn ASGI server.
- **Testing**: Vitest (JavaScript frontend & algorithmic suite), Pytest & FastAPI TestClient (Python backend).
- **Containerization**: Docker & Docker Compose (`nginx:alpine` frontend, `python:3.11-slim` backend).

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (with pip)

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start Vite dev server (runs on port 3000)
npm run dev
```

### 2. Python Backend Setup
```bash
# Install Python backend dependencies
pip install -r backend/requirements.txt

# Start FastAPI backend server (runs on port 8000)
npm run backend:dev
# Alternatively:
# python -m uvicorn backend.main:app --reload --port 8000
```
Interactive OpenAPI / Swagger documentation is available at `http://127.0.0.1:8000/docs`.

---

## 🧪 Running Automated Tests

Run the full dual-stack test suite (JavaScript + Python):
```bash
npm run test:all
```

Or run suites independently:
```bash
# Frontend & algorithmic Vitest suite (23 tests)
npm test

# Python backend & API Pytest suite (17 tests)
npm run backend:test
```

---

## 🐳 Docker Deployment

```bash
docker-compose up --build -d
```
Access the application at `http://localhost:8080`.
