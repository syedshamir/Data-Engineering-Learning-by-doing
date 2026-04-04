// ─────────────────────────────────────────────────────────
// app.js — concept registry, sidebar navigation, app shell
// ─────────────────────────────────────────────────────────

// ── Concept registry ──────────────────────────────────────
// Add a new concept here + create its file in js/concepts/
// and it will appear in the sidebar automatically.
const CONCEPTS = [
  { id: "dq",        label: "Data Quality Checker",   icon: "✓", color: "#00d97e", num: "01", component: () => window.DataQualityChecker   },
  { id: "cdc",       label: "CDC Tracker",             icon: "⟳", color: "#4dabf7", num: "02", component: () => window.CDCTracker          },
  { id: "star",      label: "Star Schema Builder",     icon: "★", color: "#fcc419", num: "03", component: () => window.StarSchema          },
  { id: "api",       label: "REST API → SQL Bridge",   icon: "⇄", color: "#b197fc", num: "04", component: () => window.APIBridge          },
  { id: "scd",       label: "SCD Type 1 & 2",          icon: "⏱", color: "#ff8787", num: "05", component: () => window.SCDHandler         },
  { id: "lake",      label: "Data Lake Organizer",     icon: "⊞", color: "#00d97e", num: "06", component: () => window.DataLakeOrganizer  },
  { id: "dlq",       label: "Dead Letter Queue",       icon: "⚑", color: "#ff6b6b", num: "07", component: () => window.DeadLetterQueue    },
  { id: "backfill",  label: "Backfill Script",         icon: "↺", color: "#4dabf7", num: "08", component: () => window.BackfillScript     },
  { id: "diff",      label: "Data Diff Tool",          icon: "≠", color: "#fcc419", num: "09", component: () => window.DataDiffTool       },
  { id: "config",    label: "Config-Driven Pipeline",  icon: "⚙", color: "#b197fc", num: "10", component: () => window.ConfigDrivenPipeline },
  { id: "dashboard", label: "Dashboard Backend",       icon: "▤", color: "#ff8787", num: "11", component: () => window.DashboardBackend   },
];

// ── Sidebar nav item ──────────────────────────────────────
function NavItem({ concept, active, onClick }) {
  return (
    <div
      className={`nav-item${active ? " active" : ""}`}
      onClick={onClick}
    >
      <span className="nav-icon" style={{ color: concept.color }}>{concept.icon}</span>
      <span className="nav-label">{concept.label}</span>
      <span className="nav-number">{concept.num}</span>
    </div>
  );
}

// ── Hero banner ───────────────────────────────────────────
function Hero() {
  return (
    <div className="hero">
      <div className="grid-pattern" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-badge">● Data Engineering Lab</div>
        <h1>Learn data engineering<br /><span>by doing it.</span></h1>
        <p>
          11 interactive playgrounds covering the core patterns every data engineer needs to know —
          from CDC and SCD to partitioning, quality checks, and backfills.
          Click, tweak, and see it run.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">11</span>
            <span className="hero-stat-label">Concepts</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">100%</span>
            <span className="hero-stat-label">Interactive</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">0</span>
            <span className="hero-stat-label">Setup required</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App shell ─────────────────────────────────────────────
function App() {
  const { useState } = React;
  const [activeId, setActiveId] = useState(CONCEPTS[0].id);

  const active  = CONCEPTS.find(c => c.id === activeId);
  const Panel   = active.component(); // resolved from window global

  return (
    <div id="root">
      <Hero />

      <div className="app-shell">
        {/* sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">Concepts</div>
          {CONCEPTS.map(c => (
            <NavItem
              key={c.id}
              concept={c}
              active={c.id === activeId}
              onClick={() => setActiveId(c.id)}
            />
          ))}
        </div>

        {/* main content */}
        <div className="content">
          <div className="panel">
            {/* key=activeId resets local state when switching concepts */}
            <Panel key={activeId} />
          </div>
        </div>
      </div>

      <footer className="footer">
        <span>Data Engineering Lab — 11 interactive concepts</span>
        <span>Built with React </span>
      </footer>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
