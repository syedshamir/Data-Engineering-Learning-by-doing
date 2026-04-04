# 🧪 Data Engineering Lab — Learn by Building

An **interactive, zero-setup** learning platform for core data engineering concepts. Built entirely with React (CDN — no build step), it runs from a single HTML file and lets you click, tweak, and see results in real time.

![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)
![Concepts](https://img.shields.io/badge/Concepts-11-blueviolet)

---

## ✨ What's Inside

| # | Concept | What You'll Learn |
|---|---------|-------------------|
| 01 | **Data Quality Checker** | Schema validation, null checks, range & enum rules |
| 02 | **CDC Tracker** | Detect INSERTs, UPDATEs, DELETEs between snapshots |
| 03 | **Star Schema Builder** | Fact + dimension tables from raw JSON |
| 04 | **REST API → SQL Bridge** | Fetch → parse → transform → idempotent UPSERT |
| 05 | **SCD Type 1 & 2** | Overwrite vs. versioned history for dimension changes |
| 06 | **Data Lake Organizer** | Hive-style, region, and ingestion-time partitioning |
| 07 | **Dead Letter Queue** | Route failed records instead of crashing the pipeline |
| 08 | **Backfill Script** | ROW_NUMBER dedup for idempotent historical reprocessing |
| 09 | **Data Diff Tool** | Row-by-row comparison of two table snapshots |
| 10 | **Config-Driven Pipeline** | YAML/JSON config controls pipeline behaviour — no code changes |
| 11 | **Dashboard Backend** | Pre-aggregated materialized views for fast dashboard queries |

---

## 🚀 Quick Start

**No Node.js, no npm, no build tools.** Just a static file server.

```bash
# 1. Clone or download the project
cd /path/to/de-lab

# 2. Start any static file server
python3 -m http.server 8000

# 3. Open in your browser
open http://localhost:8000
```

> **Alternative servers:**
> ```bash
> # Node.js (npx — no install needed)
> npx serve .
>
> # PHP
> php -S localhost:8000
>
> # VS Code — install "Live Server" extension, right-click index.html → Open with Live Server
> ```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **UI Framework** | React 18.2 (CDN, no build step) |
| **JSX Transpilation** | Babel Standalone 7.23 (in-browser) |
| **Fonts** | IBM Plex Mono + DM Sans (Google Fonts) |
| **Styling** | Vanilla CSS with custom properties |
| **Build Tools** | None — fully static |

---

## 📸 How It Works

1. **Open the app** → A hero banner introduces the lab
2. **Pick a concept** from the sidebar (left panel)
3. **Interact** — click buttons, toggle options, change configs
4. **Read the code** — every concept shows the equivalent Python/SQL implementation

Each concept is a self-contained React component that registers itself on `window` and gets picked up by the app shell automatically.

---

## 📄 License

MIT — use it, fork it, teach with it.