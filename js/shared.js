// ─────────────────────────────────────────────────────────
// shared.js — reusable UI primitives used by every concept
// ─────────────────────────────────────────────────────────

window.Tag = function Tag({ color, children }) {
  return (
    <span
      className="tag"
      style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    >
      {children}
    </span>
  );
};

window.Code = function Code({ children, style = {} }) {
  return (
    <pre className="code-block" style={style}>
      {children}
    </pre>
  );
};

window.Btn = function Btn({ onClick, children, variant = "default", disabled = false }) {
  return (
    <button
      className={`btn${variant === "primary" ? " primary" : ""}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

window.SectionTitle = function SectionTitle({ icon, color, title, subtitle }) {
  return (
    <div className="section-title">
      <div className="section-title-row">
        <span className="section-icon" style={{ color }}>{icon}</span>
        <span className="section-name">{title}</span>
      </div>
      <p className="section-desc">{subtitle}</p>
    </div>
  );
};

window.Divider = function Divider() {
  return <hr className="divider" />;
};
