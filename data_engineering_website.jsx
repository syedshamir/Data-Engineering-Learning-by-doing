import { useState, useCallback } from "react";

const concepts = [
  { id: "dq", label: "Data Quality Checker", icon: "✓", color: "#1d9e75" },
  { id: "cdc", label: "CDC Tracker", icon: "⟳", color: "#378add" },
  { id: "star", label: "Star Schema Builder", icon: "★", color: "#ba7517" },
  { id: "api", label: "REST API → SQL Bridge", icon: "⇄", color: "#7f77dd" },
  { id: "scd", label: "SCD Type 1 & 2", icon: "⏱", color: "#d85a30" },
  { id: "lake", label: "Data Lake Organizer", icon: "⊞", color: "#1d9e75" },
  { id: "dlq", label: "Dead Letter Queue", icon: "⚑", color: "#e24b4a" },
  { id: "backfill", label: "Backfill Script", icon: "↺", color: "#378add" },
  { id: "diff", label: "Data Diff Tool", icon: "≠", color: "#ba7517" },
  { id: "config", label: "Config-Driven Pipeline", icon: "⚙", color: "#7f77dd" },
  { id: "dashboard", label: "Dashboard Backend", icon: "▤", color: "#d85a30" },
];

const Tag = ({ color, children }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 4, padding: "1px 7px", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
    {children}
  </span>
);

const Code = ({ children, style = {} }) => (
  <pre style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.7, overflowX: "auto", margin: 0, ...style }}>
    {children}
  </pre>
);

const Btn = ({ onClick, children, variant = "default", disabled = false }) => {
  const base = { cursor: disabled ? "not-allowed" : "pointer", border: "0.5px solid var(--color-border-secondary)", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 500, transition: "all .15s", opacity: disabled ? 0.5 : 1 };
  const styles = {
    default: { ...base, background: "var(--color-background-primary)", color: "var(--color-text-primary)" },
    primary: { ...base, background: "#1d9e75", color: "#fff", border: "none" },
    danger: { ...base, background: "#e24b4a", color: "#fff", border: "none" },
  };
  return <button onClick={disabled ? undefined : onClick} style={styles[variant]}>{children}</button>;
};

const SectionTitle = ({ icon, color, title, subtitle }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      <span style={{ fontSize: 20, color }}>{icon}</span>
      <span style={{ fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)" }}>{title}</span>
    </div>
    <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>{subtitle}</p>
  </div>
);

const Divider = () => <hr style={{ border: "none", borderTop: "0.5px solid var(--color-border-tertiary)", margin: "16px 0" }} />;

// ──────────────────────────────────────────────
// 1. DATA QUALITY CHECKER
// ──────────────────────────────────────────────
function DataQualityChecker() {
  const rawData = [
    { id: 1, name: "Alice", email: "alice@example.com", age: 29, country: "FI" },
    { id: 2, name: null, email: "bob@example.com", age: 31, country: "SE" },
    { id: 3, name: "Carol", email: "not-an-email", age: -5, country: "NO" },
    { id: 4, name: "Dave", email: "dave@example.com", age: null, country: "DK" },
    { id: 5, name: "Eve", email: "eve@example.com", age: 25, country: "XX" },
  ];

  const schema = { id: "integer", name: "string (required)", email: "email", age: "integer (0-120)", country: "enum: FI,SE,NO,DK" };
  const [checked, setChecked] = useState(false);

  const validate = (row) => {
    const errors = [];
    if (!row.name) errors.push({ field: "name", rule: "NOT NULL", value: row.name });
    if (row.email && !/^[^@]+@[^@]+\.[^@]+$/.test(row.email)) errors.push({ field: "email", rule: "EMAIL_FORMAT", value: row.email });
    if (row.age !== null && (row.age < 0 || row.age > 120)) errors.push({ field: "age", rule: "RANGE(0-120)", value: row.age });
    if (row.age === null) errors.push({ field: "age", rule: "NOT NULL", value: null });
    if (!["FI", "SE", "NO", "DK"].includes(row.country)) errors.push({ field: "country", rule: "ENUM_CHECK", value: row.country });
    return errors;
  };

  const results = rawData.map(row => ({ ...row, errors: validate(row) }));
  const totalErrors = results.reduce((s, r) => s + r.errors.length, 0);
  const passing = results.filter(r => r.errors.length === 0).length;

  return (
    <div>
      <SectionTitle icon="✓" color="#1d9e75" title="Data Quality Checker"
        subtitle="Validates records against a schema: null checks, type enforcement, range rules, and enum constraints. Bad rows get flagged before loading into your warehouse." />
      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>SCHEMA DEFINITION</p>
          <Code>{Object.entries(schema).map(([k, v]) => `${k.padEnd(8)}: ${v}`).join("\n")}</Code>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>QUALITY STATS</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[["Total rows", rawData.length], ["Passing ✓", passing], ["Failing ✗", rawData.length - passing], ["Errors found", totalErrors]]
              .map(([l, v]) => (
                <div key={l} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{l}</div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: l.includes("✗") || l.includes("Errors") ? "#e24b4a" : l.includes("✓") ? "#1d9e75" : "var(--color-text-primary)" }}>{v}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", margin: 0 }}>INPUT RECORDS</p>
        <Btn onClick={() => setChecked(c => !c)} variant="primary">{checked ? "Hide results" : "▶ Run quality check"}</Btn>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "var(--font-mono)" }}>
          <thead>
            <tr>{["id", "name", "email", "age", "country", ...(checked ? ["status", "violations"] : [])].map(h => (
              <th key={h} style={{ padding: "6px 10px", textAlign: "left", borderBottom: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 11 }}>{h.toUpperCase()}</th>
            ))}</tr>
          </thead>
          <tbody>
            {results.map((row) => {
              const hasErr = row.errors.length > 0;
              const errFields = row.errors.map(e => e.field);
              return (
                <tr key={row.id} style={{ background: checked && hasErr ? "#e24b4a08" : "transparent" }}>
                  {["id", "name", "email", "age", "country"].map(f => (
                    <td key={f} style={{ padding: "7px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)", color: checked && errFields.includes(f) ? "#e24b4a" : row[f] === null ? "var(--color-text-secondary)" : "var(--color-text-primary)" }}>
                      {row[f] === null ? <span style={{ opacity: 0.5 }}>NULL</span> : String(row[f])}
                    </td>
                  ))}
                  {checked && <>
                    <td style={{ padding: "7px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                      <Tag color={hasErr ? "#e24b4a" : "#1d9e75"}>{hasErr ? "FAIL" : "PASS"}</Tag>
                    </td>
                    <td style={{ padding: "7px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                      {row.errors.map((e, i) => <Tag key={i} color="#e24b4a">{e.field}: {e.rule}</Tag>)}
                    </td>
                  </>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Divider />
      <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>HOW IT WORKS (PYTHON SKETCH)</p>
      <Code>{`def check_quality(row, schema):
    errors = []
    for field, rules in schema.items():
        val = row.get(field)
        if rules.get("required") and val is None:
            errors.append({"field": field, "rule": "NOT_NULL"})
        if val and rules.get("type") == "email":
            if not re.match(r"[^@]+@[^@]+\\.[^@]+", val):
                errors.append({"field": field, "rule": "EMAIL_FORMAT"})
        if val and "range" in rules:
            lo, hi = rules["range"]
            if not (lo <= val <= hi):
                errors.append({"field": field, "rule": f"OUT_OF_RANGE({lo},{hi})"})
    return errors  # empty = PASS, non-empty = FAIL → dead letter queue`}</Code>
    </div>
  );
}

// ──────────────────────────────────────────────
// 2. CDC TRACKER
// ──────────────────────────────────────────────
function CDCTracker() {
  const before = [
    { id: 1, name: "Alice", salary: 65000, dept: "Engineering" },
    { id: 2, name: "Bob", salary: 72000, dept: "Marketing" },
    { id: 3, name: "Carol", salary: 58000, dept: "Engineering" },
    { id: 4, name: "Dave", salary: 81000, dept: "Finance" },
  ];
  const after = [
    { id: 1, name: "Alice", salary: 70000, dept: "Engineering" },  // UPDATE salary
    { id: 2, name: "Bob", salary: 72000, dept: "Sales" },           // UPDATE dept
    { id: 3, name: "Carol", salary: 58000, dept: "Engineering" },   // no change
    { id: 5, name: "Eva", salary: 61000, dept: "Design" },          // INSERT
    // id:4 Dave removed → DELETE
  ];

  const [show, setShow] = useState(false);

  const ops = [];
  const bMap = Object.fromEntries(before.map(r => [r.id, r]));
  const aMap = Object.fromEntries(after.map(r => [r.id, r]));

  before.forEach(row => {
    if (!aMap[row.id]) ops.push({ op: "DELETE", id: row.id, before: row, after: null });
  });
  after.forEach(row => {
    if (!bMap[row.id]) ops.push({ op: "INSERT", id: row.id, before: null, after: row });
    else {
      const changed = JSON.stringify(bMap[row.id]) !== JSON.stringify(row);
      if (changed) ops.push({ op: "UPDATE", id: row.id, before: bMap[row.id], after: row });
    }
  });

  const opColor = { INSERT: "#1d9e75", UPDATE: "#ba7517", DELETE: "#e24b4a" };

  return (
    <div>
      <SectionTitle icon="⟳" color="#378add" title="CDC Tracker (Change Data Capture)"
        subtitle="CDC detects row-level changes between two snapshots of a table — inserts, updates, and deletes — and streams them as events to downstream systems." />
      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {[["SNAPSHOT T₁ (before)", before, "before"], ["SNAPSHOT T₂ (after)", after, "after"]].map(([label, rows, which]) => (
          <div key={which}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>{label}</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-mono)" }}>
              <thead><tr>{["id", "name", "salary", "dept"].map(h => <th key={h} style={{ padding: "4px 8px", textAlign: "left", borderBottom: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 11 }}>{h}</th>)}</tr></thead>
              <tbody>
                {rows.map(row => {
                  const op = ops.find(o => o.id === row.id);
                  const highlight = op ? opColor[op.op] : null;
                  return (
                    <tr key={row.id} style={{ background: show && highlight ? highlight + "15" : "transparent" }}>
                      {["id", "name", "salary", "dept"].map(f => {
                        const changed = show && op?.op === "UPDATE" && op.before?.[f] !== op.after?.[f];
                        return <td key={f} style={{ padding: "5px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)", color: changed ? highlight : "var(--color-text-primary)", fontWeight: changed ? 500 : 400 }}>{String(row[f])}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", margin: 0 }}>DETECTED CHANGE EVENTS</p>
        <Btn onClick={() => setShow(s => !s)} variant="primary">{show ? "Reset" : "▶ Detect changes"}</Btn>
      </div>
      {show && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ops.map((op, i) => (
            <div key={i} style={{ border: `0.5px solid ${opColor[op.op]}44`, borderRadius: 8, padding: "10px 14px", background: opColor[op.op] + "08" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Tag color={opColor[op.op]}>{op.op}</Tag>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>id={op.id}</span>
              </div>
              {op.op === "UPDATE" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.keys(op.before).filter(k => op.before[k] !== op.after[k]).map(k => (
                    <span key={k} style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      <span style={{ color: "var(--color-text-secondary)" }}>{k}: </span>
                      <span style={{ color: "#e24b4a", textDecoration: "line-through" }}>{op.before[k]}</span>
                      <span style={{ color: "var(--color-text-secondary)" }}> → </span>
                      <span style={{ color: "#1d9e75" }}>{op.after[k]}</span>
                    </span>
                  ))}
                </div>
              )}
              {op.op === "INSERT" && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#1d9e75" }}>{JSON.stringify(op.after)}</span>}
              {op.op === "DELETE" && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#e24b4a" }}>{JSON.stringify(op.before)}</span>}
            </div>
          ))}
        </div>
      )}
      <Divider />
      <Code>{`# CDC using hash-based diffing
def detect_changes(snap_before: dict, snap_after: dict):
    events = []
    for id, row in snap_before.items():
        if id not in snap_after:
            events.append({"op": "DELETE", "id": id, "before": row})
    for id, row in snap_after.items():
        if id not in snap_before:
            events.append({"op": "INSERT", "id": id, "after": row})
        elif hash_row(snap_before[id]) != hash_row(row):
            events.append({"op": "UPDATE", "id": id,
                           "before": snap_before[id], "after": row})
    return events  # stream these to Kafka / event bus`}</Code>
    </div>
  );
}

// ──────────────────────────────────────────────
// 3. STAR SCHEMA BUILDER
// ──────────────────────────────────────────────
function StarSchema() {
  const rawJson = [
    { order_id: "ORD-001", date: "2024-01-15", customer_name: "Alice", customer_city: "Helsinki", product: "Laptop", category: "Electronics", qty: 1, unit_price: 1200 },
    { order_id: "ORD-002", date: "2024-01-16", customer_name: "Bob", customer_city: "Espoo", product: "Mouse", category: "Electronics", qty: 2, unit_price: 35 },
    { order_id: "ORD-003", date: "2024-01-16", customer_name: "Alice", customer_city: "Helsinki", product: "Desk", category: "Furniture", qty: 1, unit_price: 450 },
  ];
  const [show, setShow] = useState(false);

  const dimCustomers = [
    { customer_id: 1, name: "Alice", city: "Helsinki" },
    { customer_id: 2, name: "Bob", city: "Espoo" },
  ];
  const dimProducts = [
    { product_id: 1, name: "Laptop", category: "Electronics" },
    { product_id: 2, name: "Mouse", category: "Electronics" },
    { product_id: 3, name: "Desk", category: "Furniture" },
  ];
  const dimDates = [
    { date_id: 1, date: "2024-01-15", year: 2024, month: 1, day: 15 },
    { date_id: 2, date: "2024-01-16", year: 2024, month: 1, day: 16 },
  ];
  const factOrders = [
    { order_id: "ORD-001", customer_id: 1, product_id: 1, date_id: 1, qty: 1, revenue: 1200 },
    { order_id: "ORD-002", customer_id: 2, product_id: 2, date_id: 2, qty: 2, revenue: 70 },
    { order_id: "ORD-003", customer_id: 1, product_id: 3, date_id: 2, qty: 1, revenue: 450 },
  ];

  const Table = ({ title, color, rows, keys }) => (
    <div style={{ border: `1.5px solid ${color}66`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ background: color + "22", padding: "6px 10px", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color }}>{title}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "var(--font-mono)" }}>
        <thead><tr>{keys.map(k => <th key={k} style={{ padding: "4px 8px", textAlign: "left", borderBottom: `0.5px solid ${color}33`, color: "var(--color-text-secondary)", fontWeight: 500 }}>{k}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{keys.map(k => <td key={k} style={{ padding: "4px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{String(r[k])}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );

  return (
    <div>
      <SectionTitle icon="★" color="#ba7517" title="Star Schema Builder"
        subtitle="Dimensional modeling: flatten raw JSON into a central fact table (metrics + FK references) surrounded by dimension tables (descriptive attributes). Queries become fast joins." />
      <Divider />
      <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>RAW JSON (denormalized)</p>
      <Code style={{ fontSize: 11 }}>{JSON.stringify(rawJson[0], null, 2)}</Code>
      <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
        <Btn onClick={() => setShow(s => !s)} variant="primary">{show ? "Hide schema" : "▶ Build star schema"}</Btn>
      </div>
      {show && <>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>↓ denormalized JSON  →  fact + dimension tables</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
          <Table title="dim_customers" color="#1d9e75" rows={dimCustomers} keys={["customer_id", "name", "city"]} />
          <Table title="dim_products" color="#7f77dd" rows={dimProducts} keys={["product_id", "name", "category"]} />
          <Table title="dim_dates" color="#378add" rows={dimDates} keys={["date_id", "date", "month"]} />
        </div>
        <Table title="fact_orders  (fact table — metrics + foreign keys)" color="#ba7517"
          rows={factOrders} keys={["order_id", "customer_id", "product_id", "date_id", "qty", "revenue"]} />
        <div style={{ marginTop: 12, background: "#ba751708", border: "0.5px solid #ba751733", borderRadius: 8, padding: 12, fontSize: 12, fontFamily: "var(--font-mono)" }}>
          <span style={{ color: "#ba7517", fontWeight: 600 }}>Revenue by category this month:</span>
          <br />{"SELECT p.category, SUM(f.revenue) FROM fact_orders f"}
          <br />{"JOIN dim_products p ON f.product_id = p.product_id"}
          <br />{"JOIN dim_dates d ON f.date_id = d.date_id"}
          <br />{"WHERE d.month = 1 GROUP BY p.category"}
        </div>
      </>}
    </div>
  );
}

// ──────────────────────────────────────────────
// 4. REST API → SQL BRIDGE
// ──────────────────────────────────────────────
function APIBridge() {
  const [step, setStep] = useState(0);
  const apiResponse = {
    users: [
      { id: 101, username: "alice_fi", email: "alice@mail.com", created_at: "2024-03-01T10:00:00Z", active: true },
      { id: 102, username: "bob_se", email: "bob@mail.com", created_at: "2024-03-02T11:30:00Z", active: false },
    ]
  };
  const upsertSQL = apiResponse.users.map(u =>
    `INSERT INTO users (id, username, email, created_at, active)\nVALUES (${u.id}, '${u.username}', '${u.email}', '${u.created_at}', ${u.active})\nON CONFLICT (id) DO UPDATE SET\n  username = EXCLUDED.username,\n  email = EXCLUDED.email,\n  active = EXCLUDED.active;`
  ).join("\n\n");

  const steps = [
    { label: "1. Call API", desc: "GET /api/v1/users?updated_since=2024-03-01" },
    { label: "2. Parse JSON", desc: "Extract & validate payload" },
    { label: "3. Transform", desc: "Map fields, cast types" },
    { label: "4. UPSERT", desc: "Write to warehouse (ON CONFLICT)" },
  ];

  return (
    <div>
      <SectionTitle icon="⇄" color="#7f77dd" title="REST API → SQL Bridge"
        subtitle="APIs return JSON. Warehouses speak SQL. The bridge fetches, validates, type-casts, and upserts records — with ON CONFLICT to avoid duplicates on re-runs." />
      <Divider />
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{ flex: 1, borderRadius: 8, padding: "10px 8px", cursor: "pointer", border: `1.5px solid ${step === i ? "#7f77dd" : "var(--color-border-tertiary)"}`, background: step === i ? "#7f77dd15" : "var(--color-background-secondary)", transition: "all .15s" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: step === i ? "#7f77dd" : "var(--color-text-secondary)" }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{s.desc}</div>
          </div>
        ))}
      </div>
      {step === 0 && <>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>Paginated request with a watermark to only fetch new/changed records:</p>
        <Code>{`import requests

WATERMARK = "2024-03-01T00:00:00Z"  # stored from last run

def fetch_users(page=1):
    resp = requests.get(
        "https://api.example.com/v1/users",
        params={"updated_since": WATERMARK, "page": page, "per_page": 100},
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    resp.raise_for_status()
    return resp.json()  # {"users": [...], "next_page": 2 | null}`}</Code>
      </>}
      {step === 1 && <>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>API response payload:</p>
        <Code>{JSON.stringify(apiResponse, null, 2)}</Code>
      </>}
      {step === 2 && <>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>Type-cast and validate before writing:</p>
        <Code>{`def transform(raw: dict) -> dict:
    return {
        "id":         int(raw["id"]),
        "username":   str(raw["username"]).lower().strip(),
        "email":      str(raw["email"]).lower().strip(),
        "created_at": datetime.fromisoformat(
                          raw["created_at"].replace("Z", "+00:00")),
        "active":     bool(raw["active"]),
    }

records = [transform(u) for u in data["users"]]`}</Code>
      </>}
      {step === 3 && <>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>Generated UPSERT SQL — safe to re-run (idempotent):</p>
        <Code>{upsertSQL}</Code>
      </>}
    </div>
  );
}

// ──────────────────────────────────────────────
// 5. SCD TYPE 1 & 2
// ──────────────────────────────────────────────
function SCDHandler() {
  const [type, setType] = useState(1);
  const [applied, setApplied] = useState(false);

  const original = [{ id: 1, customer_id: 42, name: "Alice Mäkinen", city: "Tampere", valid_from: "2023-01-01", valid_to: null, is_current: true }];

  const change = { name: "Alice Johnson", city: "Helsinki" };

  const type1Result = [{ id: 1, customer_id: 42, name: "Alice Johnson", city: "Helsinki", valid_from: "2023-01-01", valid_to: null, is_current: true }];
  const type2Result = [
    { id: 1, customer_id: 42, name: "Alice Mäkinen", city: "Tampere", valid_from: "2023-01-01", valid_to: "2024-06-15", is_current: false },
    { id: 2, customer_id: 42, name: "Alice Johnson", city: "Helsinki", valid_from: "2024-06-15", valid_to: null, is_current: true },
  ];

  const result = applied ? (type === 1 ? type1Result : type2Result) : original;

  const fields = type === 2 ? ["id", "customer_id", "name", "city", "valid_from", "valid_to", "is_current"] : ["id", "customer_id", "name", "city", "valid_from", "valid_to", "is_current"];

  return (
    <div>
      <SectionTitle icon="⏱" color="#d85a30" title="Slowly Changing Dimensions (SCD)"
        subtitle="When a dimension attribute changes (a customer moves cities), do you overwrite history (Type 1) or preserve it with date-ranged versioning (Type 2)?" />
      <Divider />
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[1, 2].map(t => (
          <div key={t} onClick={() => { setType(t); setApplied(false); }} style={{ flex: 1, borderRadius: 8, padding: 14, cursor: "pointer", border: `1.5px solid ${type === t ? "#d85a30" : "var(--color-border-tertiary)"}`, background: type === t ? "#d85a3010" : "var(--color-background-secondary)" }}>
            <div style={{ fontWeight: 500, color: type === t ? "#d85a30" : "var(--color-text-primary)", marginBottom: 4 }}>SCD Type {t}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{t === 1 ? "Overwrite — no history, always current value" : "Versioned rows — full history with date ranges"}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>CURRENT STATE</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "var(--font-mono)" }}>
              <thead><tr>{fields.map(h => <th key={h} style={{ padding: "4px 6px", textAlign: "left", borderBottom: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-secondary)", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
              <tbody>{result.map((row, i) => (
                <tr key={i} style={{ background: applied && (type === 1 ? "#ba751715" : i === result.length - 1 ? "#1d9e7515" : "#37373715") }}>
                  {fields.map(f => <td key={f} style={{ padding: "4px 6px", borderBottom: "0.5px solid var(--color-border-tertiary)", whiteSpace: "nowrap" }}>{String(row[f])}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ background: "#d85a3015", border: "0.5px solid #d85a3044", borderRadius: 8, padding: "8px 12px", fontSize: 12, fontFamily: "var(--font-mono)", textAlign: "center" }}>
            <div style={{ color: "#d85a30", fontWeight: 600, marginBottom: 4 }}>INCOMING CHANGE</div>
            <div>city: <span style={{ color: "#e24b4a" }}>Tampere</span> → <span style={{ color: "#1d9e75" }}>Helsinki</span></div>
            <div>name: <span style={{ color: "#e24b4a" }}>Alice Mäkinen</span> → <span style={{ color: "#1d9e75" }}>Alice Johnson</span></div>
          </div>
          <Btn onClick={() => setApplied(true)} variant="primary" disabled={applied}>▶ Apply</Btn>
        </div>
        <div></div>
      </div>
      {applied && (
        <div style={{ background: type === 1 ? "#ba751710" : "#1d9e7510", border: `0.5px solid ${type === 1 ? "#ba751744" : "#1d9e7544"}`, borderRadius: 8, padding: 12, fontSize: 12, marginBottom: 12 }}>
          {type === 1 ? (
            <><span style={{ color: "#ba7517", fontWeight: 600 }}>Type 1 result: </span>Row overwritten. Previous values are gone — you can't tell she ever lived in Tampere or had a different name.</>
          ) : (
            <><span style={{ color: "#1d9e75", fontWeight: 600 }}>Type 2 result: </span>Old row closed (valid_to set), new row inserted. Full history preserved — you can query "where was Alice in March 2024?" and get Tampere.</>
          )}
        </div>
      )}
      <Code>{type === 1
        ? `-- SCD Type 1: simple UPDATE (overwrites history)
UPDATE dim_customers
SET name = 'Alice Johnson', city = 'Helsinki'
WHERE customer_id = 42;`
        : `-- SCD Type 2: close old row, insert new row
UPDATE dim_customers
SET valid_to = CURRENT_DATE, is_current = FALSE
WHERE customer_id = 42 AND is_current = TRUE;

INSERT INTO dim_customers
  (customer_id, name, city, valid_from, valid_to, is_current)
VALUES (42, 'Alice Johnson', 'Helsinki', CURRENT_DATE, NULL, TRUE);`}</Code>
    </div>
  );
}

// ──────────────────────────────────────────────
// 6. DATA LAKE ORGANIZER
// ──────────────────────────────────────────────
function DataLakeOrganizer() {
  const [strategy, setStrategy] = useState("hive");

  const strategies = {
    hive: {
      label: "Hive-style (year/month/day)",
      desc: "Standard partition pruning — queries filter on date, Spark/Presto skip irrelevant partitions automatically.",
      tree: [
        "s3://datalake/events/",
        "  └── year=2024/",
        "       ├── month=01/",
        "       │    ├── day=15/",
        "       │    │    ├── part-00001.parquet (128 MB)",
        "       │    │    └── part-00002.parquet (120 MB)",
        "       │    └── day=16/",
        "       │         └── part-00001.parquet (95 MB)",
        "       └── month=02/",
        "            └── day=01/",
        "                 └── part-00001.parquet (110 MB)",
      ],
    },
    region: {
      label: "Region + date",
      desc: "Multi-dimensional partitioning. Great when you frequently filter by both region and date in analytical queries.",
      tree: [
        "s3://datalake/orders/",
        "  └── region=EU/",
        "       ├── year=2024/month=01/",
        "       │    ├── part-00001.parquet",
        "       │    └── part-00002.parquet",
        "       └── year=2024/month=02/",
        "            └── part-00001.parquet",
        "  └── region=US/",
        "       └── year=2024/month=01/",
        "            ├── part-00001.parquet",
        "            └── part-00002.parquet",
      ],
    },
    ingestion: {
      label: "Ingestion timestamp (raw zone)",
      desc: "Raw landing zone — no transformation. Every batch gets its own folder keyed by ingest time. Easy to replay/reprocess.",
      tree: [
        "s3://datalake/raw/crm/",
        "  └── ingested_at=2024-01-15T10:30:00/",
        "       └── batch_00001.json.gz",
        "  └── ingested_at=2024-01-15T11:00:00/",
        "       └── batch_00001.json.gz",
        "  └── ingested_at=2024-01-16T10:00:00/",
        "       └── batch_00001.json.gz",
        "  └── _metadata/",
        "       └── schema_v2.json",
      ],
    },
  };

  const s = strategies[strategy];

  return (
    <div>
      <SectionTitle icon="⊞" color="#1d9e75" title="Data Lake File Organizer"
        subtitle="Partitioning determines which files a query must scan. Good partition design = less I/O = faster + cheaper queries." />
      <Divider />
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {Object.entries(strategies).map(([k, v]) => (
          <div key={k} onClick={() => setStrategy(k)} style={{ flex: 1, borderRadius: 8, padding: "10px 10px", cursor: "pointer", border: `1.5px solid ${strategy === k ? "#1d9e75" : "var(--color-border-tertiary)"}`, background: strategy === k ? "#1d9e7510" : "var(--color-background-secondary)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: strategy === k ? "#1d9e75" : "var(--color-text-secondary)" }}>{v.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-text-secondary)" }}>{s.desc}</p>
        <pre style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.8, color: "var(--color-text-primary)" }}>{s.tree.join("\n")}</pre>
      </div>
      <Code>{strategy === "hive"
        ? `# PySpark: read only January 2024 — partition pruning skips everything else
df = spark.read.parquet("s3://datalake/events/")
jan = df.filter((df.year == 2024) & (df.month == 1))
# Spark sees year=2024/month=01/ only → scans 2 files, not entire lake`
        : strategy === "region"
        ? `# Filter by region AND month → two-dimensional pruning
df = spark.read.parquet("s3://datalake/orders/") \\
    .filter((col("region") == "EU") & (col("year") == 2024) & (col("month") == 1))
# Scans: region=EU/year=2024/month=01/ only`
        : `# Replay a specific ingestion window (useful for debugging/reprocessing)
df = spark.read.json("s3://datalake/raw/crm/ingested_at=2024-01-15*/")
# Picks up both 10:30 and 11:00 batches`
      }</Code>
    </div>
  );
}

// ──────────────────────────────────────────────
// 7. DEAD LETTER QUEUE
// ──────────────────────────────────────────────
function DeadLetterQueue() {
  const records = [
    { id: 1, payload: '{"user": 101, "amount": 59.99}', valid: true },
    { id: 2, payload: '{"user": null, "amount": 12.00}', valid: false, reason: "user is NULL" },
    { id: 3, payload: '{"user": 103, "amount": -5.00}', valid: false, reason: "amount negative" },
    { id: 4, payload: '{"user": 104, "amount": 200.00}', valid: true },
    { id: 5, payload: 'not valid json %%', valid: false, reason: "JSON parse error" },
  ];

  const [processed, setProcessed] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const run = () => {
    setProcessed([]);
    setDone(false);
    setRunning(true);
    records.forEach((r, i) => {
      setTimeout(() => {
        setProcessed(p => [...p, r]);
        if (i === records.length - 1) { setRunning(false); setDone(true); }
      }, (i + 1) * 500);
    });
  };

  const good = processed.filter(r => r.valid);
  const bad = processed.filter(r => !r.valid);

  return (
    <div>
      <SectionTitle icon="⚑" color="#e24b4a" title="Dead Letter Queue"
        subtitle="When a pipeline record fails validation or processing, instead of crashing the whole pipeline, route it to a DLQ for inspection and manual/automated replay." />
      <Divider />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>{records.length} records entering pipeline</p>
        <Btn onClick={run} variant="primary" disabled={running}>▶ {running ? "Processing…" : "Run pipeline"}</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, alignItems: "start" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>PIPELINE PROCESSOR</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {records.map(r => {
              const p = processed.find(x => x.id === r.id);
              return (
                <div key={r.id} style={{ background: "var(--color-background-secondary)", border: `0.5px solid ${!p ? "var(--color-border-tertiary)" : p.valid ? "#1d9e7544" : "#e24b4a44"}`, borderRadius: 6, padding: "7px 10px", transition: "all .3s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <code style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{r.payload.slice(0, 38)}{r.payload.length > 38 ? "…" : ""}</code>
                    {p && <Tag color={p.valid ? "#1d9e75" : "#e24b4a"}>{p.valid ? "✓ OK" : "✗ DLQ"}</Tag>}
                  </div>
                  {p && !p.valid && <div style={{ fontSize: 11, color: "#e24b4a", marginTop: 3 }}>Reason: {p.reason}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: "#1d9e75", marginBottom: 6 }}>✓ MAIN SINK ({good.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {good.map(r => <div key={r.id} style={{ background: "#1d9e7512", border: "0.5px solid #1d9e7544", borderRadius: 6, padding: "6px 8px", fontSize: 11, fontFamily: "var(--font-mono)" }}>{r.payload}</div>)}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: "#e24b4a", marginBottom: 6 }}>⚑ DEAD LETTER ({bad.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {bad.map(r => <div key={r.id} style={{ background: "#e24b4a12", border: "0.5px solid #e24b4a44", borderRadius: 6, padding: "6px 8px", fontSize: 11, fontFamily: "var(--font-mono)" }}>
              <div style={{ color: "var(--color-text-secondary)" }}>{r.payload.slice(0, 22)}…</div>
              <div style={{ color: "#e24b4a" }}>↳ {r.reason}</div>
            </div>)}
          </div>
        </div>
      </div>
      <Divider />
      <Code>{`def process_record(record, main_sink, dlq):
    try:
        payload = json.loads(record)          # parse
        validated = validate(payload)         # schema check
        main_sink.write(validated)            # success path
    except (json.JSONDecodeError, ValidationError) as e:
        dlq.send({                            # failure path
            "original": record,
            "error": str(e),
            "timestamp": datetime.utcnow(),
            "retry_count": 0
        })
        metrics.increment("dlq.routed")`}</Code>
    </div>
  );
}

// ──────────────────────────────────────────────
// 8. BACKFILL SCRIPT
// ──────────────────────────────────────────────
function BackfillScript() {
  const [ran, setRan] = useState(false);

  const allRecords = [
    { id: 1, event: "purchase", user: 101, ts: "2024-01-10 09:00", load_ts: "2024-01-10 09:05" },
    { id: 2, event: "view", user: 102, ts: "2024-01-11 10:00", load_ts: "2024-01-11 10:05" },
    { id: 1, event: "purchase", user: 101, ts: "2024-01-10 09:00", load_ts: "2024-02-01 08:00" },  // DUPLICATE
    { id: 3, event: "click", user: 103, ts: "2024-01-12 11:00", load_ts: "2024-02-01 08:00" },
    { id: 2, event: "view", user: 102, ts: "2024-01-11 10:00", load_ts: "2024-02-01 08:01" },     // DUPLICATE
  ];

  const deduped = Object.values(
    allRecords.reduce((acc, r) => {
      if (!acc[r.id] || r.load_ts > acc[r.id].load_ts) acc[r.id] = r;
      return acc;
    }, {})
  );

  return (
    <div>
      <SectionTitle icon="↺" color="#378add" title="Backfill Script"
        subtitle="Reprocessing historical data introduces duplicates. A backfill script deduplicates by keeping the latest load_ts per business key — making reruns idempotent." />
      <Divider />
      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>All records including duplicates from the backfill run:</p>
      <div style={{ overflowX: "auto", marginBottom: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-mono)" }}>
          <thead><tr>{["id", "event", "user", "ts", "load_ts", ...(ran ? ["status"] : [])].map(h => <th key={h} style={{ padding: "5px 8px", textAlign: "left", borderBottom: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-secondary)", fontWeight: 500 }}>{h}</th>)}</tr></thead>
          <tbody>{allRecords.map((r, i) => {
            const isDup = ran && allRecords.filter(x => x.id === r.id).length > 1 && r.load_ts < allRecords.filter(x => x.id === r.id).sort((a, b) => b.load_ts.localeCompare(a.load_ts))[0].load_ts;
            return (
              <tr key={i} style={{ background: ran ? (isDup ? "#e24b4a08" : "#1d9e7508") : "transparent", opacity: ran && isDup ? 0.5 : 1 }}>
                {["id", "event", "user", "ts", "load_ts"].map(f => <td key={f} style={{ padding: "5px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{r[f]}</td>)}
                {ran && <td style={{ padding: "5px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}><Tag color={isDup ? "#e24b4a" : "#1d9e75"}>{isDup ? "DROP" : "KEEP"}</Tag></td>}
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ran ? 12 : 0 }}>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>ROW_NUMBER dedup keeps latest load_ts per business key (id)</p>
        <Btn onClick={() => setRan(r => !r)} variant="primary">{ran ? "Reset" : "▶ Deduplicate"}</Btn>
      </div>
      {ran && <>
        <p style={{ fontSize: 12, fontWeight: 500, color: "#1d9e75", marginBottom: 6 }}>✓ DEDUPLICATED RESULT ({deduped.length} rows)</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-mono)", marginBottom: 12 }}>
          <thead><tr>{["id", "event", "user", "ts", "load_ts"].map(h => <th key={h} style={{ padding: "5px 8px", textAlign: "left", borderBottom: "0.5px solid #1d9e7544", color: "#1d9e75", fontWeight: 500 }}>{h}</th>)}</tr></thead>
          <tbody>{deduped.map((r, i) => <tr key={i}><td style={{ padding: "5px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{r.id}</td><td style={{ padding: "5px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{r.event}</td><td style={{ padding: "5px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{r.user}</td><td style={{ padding: "5px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{r.ts}</td><td style={{ padding: "5px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{r.load_ts}</td></tr>)}</tbody>
        </table>
      </>}
      <Code>{`-- SQL dedup using ROW_NUMBER (idempotent backfill pattern)
WITH ranked AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY id            -- business key
      ORDER BY load_ts DESC      -- keep newest load
    ) AS rn
  FROM events_raw
)
INSERT INTO events_clean
SELECT id, event, user, ts, load_ts
FROM ranked
WHERE rn = 1;                    -- discard older duplicates`}</Code>
    </div>
  );
}

// ──────────────────────────────────────────────
// 9. DATA DIFF TOOL
// ──────────────────────────────────────────────
function DataDiffTool() {
  const tableA = [
    { id: 1, name: "Alice", score: 88, status: "active" },
    { id: 2, name: "Bob", score: 72, status: "active" },
    { id: 3, name: "Carol", score: 95, status: "inactive" },
    { id: 4, name: "Dave", score: 60, status: "active" },
  ];
  const tableB = [
    { id: 1, name: "Alice", score: 91, status: "active" },     // score changed
    { id: 2, name: "Bob", score: 72, status: "suspended" },    // status changed
    { id: 3, name: "Carol", score: 95, status: "inactive" },   // no change
    { id: 5, name: "Eva", score: 78, status: "active" },       // new row
    // id:4 Dave missing → deleted
  ];
  const [show, setShow] = useState(false);

  const diff = [];
  const bMap = Object.fromEntries(tableB.map(r => [r.id, r]));
  tableA.forEach(r => {
    if (!bMap[r.id]) diff.push({ type: "deleted", row: r });
    else {
      const b = bMap[r.id];
      const diffs = Object.keys(r).filter(k => r[k] !== b[k]).map(k => ({ field: k, a: r[k], b: b[k] }));
      if (diffs.length) diff.push({ type: "changed", rowA: r, rowB: b, diffs });
      else diff.push({ type: "match", row: r });
    }
  });
  tableB.forEach(r => { if (!Object.fromEntries(tableA.map(x => [x.id, x]))[r.id]) diff.push({ type: "added", row: r }); });

  const typeColor = { deleted: "#e24b4a", changed: "#ba7517", match: "#1d9e75", added: "#378add" };

  return (
    <div>
      <SectionTitle icon="≠" color="#ba7517" title="Data Diff Tool"
        subtitle="Compares two table snapshots row-by-row, surfacing added, deleted, and changed records. Essential for validating migrations, pipeline changes, and data quality." />
      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        {[["TABLE A (source)", tableA], ["TABLE B (target)", tableB]].map(([label, rows]) => (
          <div key={label}>
            <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>{label}</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-mono)" }}>
              <thead><tr>{["id", "name", "score", "status"].map(h => <th key={h} style={{ padding: "4px 8px", textAlign: "left", borderBottom: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-secondary)", fontWeight: 500 }}>{h}</th>)}</tr></thead>
              <tbody>{rows.map((r, i) => <tr key={i}>{["id", "name", "score", "status"].map(f => <td key={f} style={{ padding: "4px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{String(r[f])}</td>)}</tr>)}</tbody>
            </table>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: show ? 10 : 0 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(typeColor).map(([t, c]) => <Tag key={t} color={c}>{diff.filter(d => d.type === t).length} {t}</Tag>)}
        </div>
        <Btn onClick={() => setShow(s => !s)} variant="primary">{show ? "Hide diff" : "▶ Run diff"}</Btn>
      </div>
      {show && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
          {diff.map((d, i) => (
            <div key={i} style={{ background: typeColor[d.type] + "10", border: `0.5px solid ${typeColor[d.type]}44`, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: d.diffs ? 4 : 0 }}>
                <Tag color={typeColor[d.type]}>{d.type.toUpperCase()}</Tag>
                <code style={{ fontSize: 12 }}>id={d.row?.id ?? d.rowA?.id}</code>
                {d.type === "match" && <span style={{ fontSize: 12, color: "#1d9e75" }}>identical rows ✓</span>}
              </div>
              {d.diffs && d.diffs.map((x, j) => (
                <div key={j} style={{ fontSize: 12, fontFamily: "var(--font-mono)", marginLeft: 8 }}>
                  {x.field}: <span style={{ color: "#e24b4a", textDecoration: "line-through" }}>{String(x.a)}</span> → <span style={{ color: "#1d9e75" }}>{String(x.b)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <Divider />
      <Code>{`def diff_tables(df_a, df_b, key="id"):
    joined = df_a.merge(df_b, on=key, how="outer",
                        suffixes=("_a", "_b"), indicator=True)
    deleted = joined[joined["_merge"] == "left_only"]
    added   = joined[joined["_merge"] == "right_only"]
    both    = joined[joined["_merge"] == "both"]
    changed = both[both.apply(
        lambda r: any(r[f"{c}_a"] != r[f"{c}_b"]
                      for c in cols_without_key), axis=1)]
    return {"added": added, "deleted": deleted, "changed": changed}`}</Code>
    </div>
  );
}

// ──────────────────────────────────────────────
// 10. CONFIG-DRIVEN PIPELINE
// ──────────────────────────────────────────────
function ConfigDrivenPipeline() {
  const [config, setConfig] = useState({
    source: "postgres",
    destination: "bigquery",
    validate: true,
    deduplicate: true,
    partition_by: "date",
    notify_on_failure: true,
    batch_size: 1000,
  });

  const steps = [
    { key: "extract", label: "Extract", desc: `Read from ${config.source}`, always: true },
    { key: "validate", label: "Validate", desc: "Schema + null checks", always: false, flag: "validate" },
    { key: "deduplicate", label: "Deduplicate", desc: "Remove duplicate keys", always: false, flag: "deduplicate" },
    { key: "transform", label: "Transform", desc: `Partition by ${config.partition_by}`, always: true },
    { key: "load", label: "Load", desc: `Write to ${config.destination}`, always: true },
    { key: "notify", label: "Notify", desc: "Alert on failure", always: false, flag: "notify_on_failure" },
  ];

  const activeSteps = steps.filter(s => s.always || config[s.flag]);

  const yaml = `source: ${config.source}
destination: ${config.destination}
batch_size: ${config.batch_size}
steps:
  - extract
${config.validate ? "  - validate\n" : ""}${config.deduplicate ? "  - deduplicate\n" : ""}  - transform
  - load: {partition_by: ${config.partition_by}}
${config.notify_on_failure ? "  - notify_on_failure" : ""}`.replace(/\n\n+/g, "\n");

  return (
    <div>
      <SectionTitle icon="⚙" color="#7f77dd" title="Config-Driven Pipeline"
        subtitle="Pipeline behaviour is controlled by a YAML/JSON config — no code changes needed to toggle steps, swap sources, or adjust parameters. Infrastructure as config." />
      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 10 }}>PIPELINE CONTROLS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Source</label>
                <select value={config.source} onChange={e => setConfig(c => ({ ...c, source: e.target.value }))} style={{ width: "100%", marginTop: 3 }}>
                  {["postgres", "mysql", "s3", "api"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Destination</label>
                <select value={config.destination} onChange={e => setConfig(c => ({ ...c, destination: e.target.value }))} style={{ width: "100%", marginTop: 3 }}>
                  {["bigquery", "snowflake", "redshift", "duckdb"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Batch size: {config.batch_size}</label>
              <input type="range" min={100} max={5000} step={100} value={config.batch_size} onChange={e => setConfig(c => ({ ...c, batch_size: +e.target.value }))} style={{ width: "100%", marginTop: 3 }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Partition by</label>
              <select value={config.partition_by} onChange={e => setConfig(c => ({ ...c, partition_by: e.target.value }))} style={{ width: "100%", marginTop: 3 }}>
                {["date", "region", "user_id", "event_type"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            {[["validate", "Validate schema"], ["deduplicate", "Deduplicate records"], ["notify_on_failure", "Notify on failure"]].map(([k, label]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                <input type="checkbox" checked={config[k]} onChange={e => setConfig(c => ({ ...c, [k]: e.target.checked }))} />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 10 }}>GENERATED CONFIG (YAML)</p>
          <Code>{yaml}</Code>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6, marginTop: 12 }}>ACTIVE PIPELINE STEPS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {activeSteps.map((s, i) => (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7f77dd", flexShrink: 0 }} />
                  {i < activeSteps.length - 1 && <div style={{ width: 1.5, height: 28, background: "#7f77dd44" }} />}
                </div>
                <div style={{ marginLeft: 10, paddingBottom: i < activeSteps.length - 1 ? 12 : 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: 8 }}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 11. MINI DASHBOARD BACKEND
// ──────────────────────────────────────────────
function DashboardBackend() {
  const rawData = [
    { date: "2024-01", region: "EU", product: "Laptop", revenue: 48000, units: 40 },
    { date: "2024-01", region: "US", product: "Laptop", revenue: 72000, units: 60 },
    { date: "2024-01", region: "EU", product: "Mouse", revenue: 2800, units: 80 },
    { date: "2024-02", region: "EU", product: "Laptop", revenue: 52000, units: 43 },
    { date: "2024-02", region: "US", product: "Laptop", revenue: 68000, units: 57 },
    { date: "2024-02", region: "EU", product: "Mouse", revenue: 3100, units: 89 },
    { date: "2024-03", region: "EU", product: "Laptop", revenue: 56000, units: 47 },
    { date: "2024-03", region: "US", product: "Laptop", revenue: 75000, units: 63 },
    { date: "2024-03", region: "EU", product: "Mouse", revenue: 2600, units: 74 },
  ];

  const [groupBy, setGroupBy] = useState("region");
  const [metric, setMetric] = useState("revenue");

  const aggregated = rawData.reduce((acc, r) => {
    const k = r[groupBy];
    acc[k] = acc[k] || { revenue: 0, units: 0 };
    acc[k].revenue += r.revenue;
    acc[k].units += r.units;
    return acc;
  }, {});

  const chartData = Object.entries(aggregated).sort((a, b) => b[1][metric] - a[1][metric]);
  const max = Math.max(...chartData.map(([, v]) => v[metric]));

  const byDate = rawData.reduce((acc, r) => {
    acc[r.date] = (acc[r.date] || 0) + r[metric];
    return acc;
  }, {});

  return (
    <div>
      <SectionTitle icon="▤" color="#d85a30" title="Mini Dashboard Backend"
        subtitle="The backend aggregates raw transactional data into summary metrics. Dashboards query pre-aggregated tables (materialized views) rather than raw rows — orders of magnitude faster." />
      <Divider />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["region", "product", "date"].map(g => (
            <button key={g} onClick={() => setGroupBy(g)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 500, border: `1.5px solid ${groupBy === g ? "#d85a30" : "var(--color-border-secondary)"}`, background: groupBy === g ? "#d85a3015" : "transparent", color: groupBy === g ? "#d85a30" : "var(--color-text-secondary)" }}>
              {g}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          {["revenue", "units"].map(m => (
            <button key={m} onClick={() => setMetric(m)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 500, border: `1.5px solid ${metric === m ? "#7f77dd" : "var(--color-border-secondary)"}`, background: metric === m ? "#7f77dd15" : "transparent", color: metric === m ? "#7f77dd" : "var(--color-text-secondary)" }}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>BY {groupBy.toUpperCase()} — {metric.toUpperCase()}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {chartData.map(([k, v]) => (
              <div key={k}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ fontWeight: 500 }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>
                    {metric === "revenue" ? `€${(v[metric] / 1000).toFixed(0)}k` : v[metric]}
                  </span>
                </div>
                <div style={{ height: 10, background: "var(--color-background-secondary)", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(v[metric] / max) * 100}%`, background: "#d85a30", borderRadius: 5, transition: "width .4s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>TREND BY MONTH — {metric.toUpperCase()}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(byDate).map(([d, v]) => {
              const dateMax = Math.max(...Object.values(byDate));
              return (
                <div key={d}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ fontWeight: 500 }}>{d}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>
                      {metric === "revenue" ? `€${(v / 1000).toFixed(0)}k` : v}
                    </span>
                  </div>
                  <div style={{ height: 10, background: "var(--color-background-secondary)", borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(v / dateMax) * 100}%`, background: "#7f77dd", borderRadius: 5, transition: "width .4s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Code>{`-- Materialized view: pre-aggregated for dashboard speed
CREATE MATERIALIZED VIEW mv_sales_by_region_month AS
SELECT
  region,
  DATE_TRUNC('month', order_date)  AS month,
  product_category,
  SUM(revenue)                     AS total_revenue,
  SUM(units_sold)                  AS total_units,
  COUNT(DISTINCT order_id)         AS order_count
FROM fact_orders f
JOIN dim_products p  ON f.product_id = p.id
JOIN dim_customers c ON f.customer_id = c.id
GROUP BY region, month, product_category;

-- Dashboard query (hits the materialized view, not raw rows)
SELECT region, SUM(total_revenue)
FROM mv_sales_by_region_month
WHERE month >= '2024-01-01'
GROUP BY region;`}</Code>
    </div>
  );
}

const PANELS = { dq: DataQualityChecker, cdc: CDCTracker, star: StarSchema, api: APIBridge, scd: SCDHandler, lake: DataLakeOrganizer, dlq: DeadLetterQueue, backfill: BackfillScript, diff: DataDiffTool, config: ConfigDrivenPipeline, dashboard: DashboardBackend };

export default function App() {
  const [active, setActive] = useState("dq");
  const Panel = PANELS[active];
  const concept = concepts.find(c => c.id === active);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)" }}>
      <div style={{ width: 220, flexShrink: 0, borderRight: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "16px 14px 12px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Data Engineering Lab</div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>11 interactive concepts</div>
        </div>
        <nav style={{ padding: "8px 0", flex: 1 }}>
          {concepts.map(c => (
            <div key={c.id} onClick={() => setActive(c.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", cursor: "pointer", background: active === c.id ? "var(--color-background-primary)" : "transparent", borderLeft: `2.5px solid ${active === c.id ? c.color : "transparent"}`, transition: "all .12s" }}>
              <span style={{ fontSize: 14, color: c.color, minWidth: 18, textAlign: "center" }}>{c.icon}</span>
              <span style={{ fontSize: 12, fontWeight: active === c.id ? 500 : 400, color: active === c.id ? "var(--color-text-primary)" : "var(--color-text-secondary)", lineHeight: 1.3 }}>{c.label}</span>
            </div>
          ))}
        </nav>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 32px" }}>
          <Panel />
        </div>
      </div>
    </div>
  );
}