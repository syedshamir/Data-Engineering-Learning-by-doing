# Data Engineering Lab — Learn by Building

An interactive educational platform with **hands-on playgrounds** for learning essential data engineering concepts. No setup required — open in any browser and start experimenting.

## �� What You'll Learn

| # | Concept | What It Does |
|---|---------|-------------|
| 01 | **Data Quality Checker** | Validates records against schema rules (nulls, formats, ranges, enums) before loading to warehouse |
| 02 | **CDC Tracker** | Detects row-level changes (inserts, updates, deletes) between snapshots — simulates change data capture |
| 03 | **Star Schema Builder** | Transforms denormalized JSON into dimensional model (fact + dimension tables) |
| 04 | **REST API → SQL Bridge** | Fetches JSON from APIs, validates, type-casts, and upserts to database (idempotent) |
| 05 | **SCD (Type 1 & 2)** | Handles slowly-changing dimensions — overwrite history vs. preserve full audit trail |
| 06 | **Data Lake Organizer** | Explores partitioning strategies (Hive-style, region+date, ingestion timestamp) for query performance |
| 07 | **Dead Letter Queue** | Routes failed records to DLQ instead of crashing pipeline — keep the data flowing |
| 08 | **Backfill Script** | Deduplicates records when reprocessing historical data using ROW_NUMBER() |
| 09 | **Data Diff Tool** | Compares two table snapshots to surface added, deleted, and changed rows |
| 10 | **Config-Driven Pipeline** | Controls pipeline behavior via YAML — swap sources, toggle steps, adjust parameters without code |
| 11 | **Dashboard Backend** | Pre-aggregates raw transactional data into materialized views for fast dashboard queries |

## 🚀 Getting Started

### Requirements
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No installation, build step, or dependencies

### Run
1. Clone or download this repository
2. Open `website.html` in your browser
3. Click through the sidebar to explore each concept
4. Click "Run" buttons to see interactive examples in action

## 📁 Project Structure

```
.
├── website.html          # Single-file React app (no build step)
├── data_engineering.jsx  # (Optional) Separate JSX file for future modular expansion
└── README.md            # This file
```

## 🎨 Features

- **Interactive UI**: Click buttons to trigger simulations, toggle state, adjust controls
- **Live Code Examples**: Each concept includes Python/SQL sketches showing real-world patterns
- **Dark Theme**: Easy on the eyes with a modern dark design
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Zero Dependencies**: Pure React from CDN — runs offline once loaded

## 🛠️ Technologies Used

- **React 18** — UI framework (production build from CDN)
- **Babel Standalone** — JSX transpilation in the browser
- **CSS Grid & Flexbox** — Responsive layout
- **IBM Plex Mono & DM Sans** — Fonts from Google Fonts

## 📚 How Each Playground Works

### Data Quality Checker
- Simulates validation rules (NOT NULL, EMAIL_FORMAT, RANGE, ENUM_CHECK)
- Shows passing vs. failing records
- Demonstrates how bad rows get routed to DLQ before warehouse load

### CDC Tracker
- Compares two snapshots to detect INSERT, UPDATE, DELETE operations
- Highlights which fields changed between versions
- Real-world pattern for streaming change events

### Star Schema Builder
- Takes denormalized raw JSON (e.g., order with customer + product details inline)
- Breaks it into fact table (metrics + foreign keys) and dimension tables
- Shows why dimensional modeling makes analytic queries fast

### REST API → SQL Bridge
- Demonstrates paginated API fetch with watermark tracking
- JSON validation and type-casting
- UPSERT pattern with ON CONFLICT for idempotency

### SCD (Type 1 & 2)
- **Type 1**: Overwrite — no history, latest value always
- **Type 2**: Versioned rows with date ranges — full audit trail
- Interactive toggle to see the difference

### Data Lake Organizer
- Hive-style partitioning (year/month/day)
- Region + date multi-dimensional partitioning
- Raw ingestion zone with timestamp buckets
- Shows how partition pruning reduces I/O

### Dead Letter Queue
- Processes records through a pipeline (JSON parse, validation)
- Successful records → main sink
- Failed records → DLQ for replay/investigation
- Keeps pipeline alive on failures

### Backfill Script
- Demonstrates duplicate rows when reprocessing historical data
- Uses ROW_NUMBER() to keep latest version per business key
- Makes backfills idempotent — safe to re-run

### Data Diff Tool
- Compares Table A vs. Table B row-by-row
- Surfaces 4 types: MATCH, ADDED, DELETED, CHANGED
- Shows exact field-level differences
- Essential for validating migrations

### Config-Driven Pipeline
- YAML-driven pipeline configuration
- Toggle validation, deduplication, notification steps
- Swap source/destination connectors
- Adjust batch size and partition strategy
- No code changes — just update config

### Dashboard Backend
- Pre-aggregates raw transactional data
- Group by different dimensions (region, product, date)
- Switch metrics (revenue, units)
- Trend analysis by month
- Shows why materialized views beat raw row queries at scale

## 💡 Learning Outcomes

After exploring all 11 concepts, you'll understand:

✅ How to validate data before loading  
✅ How change-data-capture (CDC) detects updates  
✅ Why dimensional modeling matters  
✅ How to integrate REST APIs safely  
✅ When to preserve vs. overwrite historical data  
✅ How partitioning affects query performance  
✅ Why dead-letter queues prevent pipeline crashes  
✅ How to make batch jobs idempotent  
✅ How to validate data transformations  
✅ Why configuration beats hardcoding  
✅ Why pre-aggregation makes dashboards fast  

## 🔧 Customization

### Change Colors
Edit the CSS variables in the `<style>` block:
```css
:root{
  --green:#00d97e;
  --blue:#4dabf7;
  --amber:#fcc419;
  /* ...etc */
}
```

### Add New Concepts
1. Add a new concept object to the `concepts` array
2. Create a new function component (e.g., `function MyNewConcept() { ... }`)
3. Add it to the `PANELS` object
4. It will auto-appear in the sidebar

### Modify Data
Each concept has inline mock data (arrays, objects). Edit them to explore different scenarios.

## 📖 Resources

- **React Docs**: https://react.dev
- **Data Engineering Fundamentals**: Look up CDC, SCD, dimensional modeling on your favorite learning platform
- **SQL Patterns**: The code blocks show real SQL — study them, adapt them to your warehouse

## ⚖️ License

Open source. Use, modify, and share freely.

## 🤝 Contributing

Found a bug or have an idea? Feel free to fork, edit, and submit improvements.

## 📧 Questions?

Review the **"Python sketch"** and **code blocks** in each concept for deeper understanding. Each playground includes working code you can adapt.

---

**Built with ❤️ for data engineers who learn by doing.**

Open `website.html` now and start exploring!
