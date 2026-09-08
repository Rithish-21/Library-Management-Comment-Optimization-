# Smart Library Management System (LMS)

A state-of-the-art intelligent Library Management System built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Zustand**. Designed and delivered in strict adherence to the **Product Requirements Document (PRD)**, **Technical Requirements Document (TRD)**, and **DevOps Implementation Plan**.

---

## Key Features & 10 Functional Screens

1. **Authentication & RBAC (`/login`)** — Role switcher supporting **Student** (`student@lib.com`) and **Librarian** (`librarian@lib.com`) credentials with demo password `demo123` and quick-fill chips.
2. **Operations Dashboard (`/dashboard`)** — Real-time KPI summary widgets, dynamic **"Due Soon" Alert Banner** (Feature 6), role-specific CTAs, and recent activity ledger.
3. **Book Catalog (`/catalog`)** — Full catalog browser with category pills, physical shelf locations (`A1`, `B2`...), status badges (*Available*, *Issued*, *Lost*), and recommendation popups.
4. **Fast Search & Benchmark (`/search`)** — Demonstrates **O(log n) Binary Search** on pre-sorted array vs. **O(n) Linear Scan** with side-by-side timing in milliseconds, step counter, and interactive execution trace visualizer (Feature 1).
5. **Issue Book (`/issue`)** — Digital checkout with real-time stock verification guardrail (blocks issue if stock = 0), member selection, and automatic inventory decrement (Feature 2 & 4).
6. **Return Book & Fine Calculator (`/return`)** — Automated late penalty calculation ($5/day formula) with interactive date pickers and instant physical stock replenishment (Feature 3).
7. **Reservation Priority Queue (`/reservation`)** — FIFO waitlist queue allocation for checked-out / out-of-stock titles with live queue position indicator (`#1`, `#2`...) and rebalancing (Features 5 & 14).
8. **Inventory & Backup Center (`/inventory`)** — Admin control center with **Deduplication Check** on ingestion (Feature 7), status toggles, stock adjustments, and one-click in-memory **Backup Snapshots** and JSON export/restore (Feature 15).
9. **Smart Recommendations (`/recommendations`)** — Category affinity suggestions (Feature 8) and **Borrow Popularity Leaderboard** with the `#1 Trending` badge computed via `max()` (Feature 11).
10. **Executive Analytics & Members (`/analytics`)** — KPIs, categorical stock distribution progress bars, operational health monitors, and member directory lookup with borrow history (Features 9 & 13).

---

## Core Algorithms Implemented (`/src/services`)

| Algorithm | File | Complexity | Purpose |
|---|---|---|---|
| `binarySearch` | `searchService.ts` | **O(log n)** | Sub-millisecond catalog lookup on title-sorted books array |
| `calculateFine` | `fineService.ts` | **O(1)** | Computes `$5 × (ReturnDate - DueDate)` for late returns |
| `isReminderDue` | `fineService.ts` | **O(1)** | Flags loans due within 2 days or currently overdue |
| `issueFromInventory` | `inventoryService.ts` | **O(1)** | Guards against stock deficits and decrements inventory safely |
| `addBookIfNotDuplicate` | `inventoryService.ts` | **O(n)** | Validates title and ISBN uniqueness before adding |
| `createReservation` | `reservationService.ts` | **O(n)** | Appends member to FIFO priority queue with position `#index+1` |
| `mostPopular` | `recommendationService.ts` | **O(n log n)** | Sorts borrow counts descending to highlight top titles |

---

## Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Start Vite hot-reloading dev server (runs on port 3000)
npm run dev
```

### Running Automated Unit Tests
```bash
# Run Vitest test suite
npm test
```

### Production Build
```bash
# Type check and build optimized bundle
npm run build
```

### Docker Deployment
```bash
# Build and run container with Nginx
docker-compose up --build -d
```
Access the application at `http://localhost:8080`.
