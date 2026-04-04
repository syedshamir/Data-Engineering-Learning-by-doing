# 📖 Project Structure & Contribution Guide

This document explains the architecture, file responsibilities, and step-by-step instructions for adding new features or modifying existing ones.

---

## 📁 Project Structure

```
de-lab/
├── index.html                          # Entry point — loads React, Babel, and all scripts
├── styles.css                          # Global design tokens + all component styles
├── README.md                           # Project overview & quick start
├── CONTRIBUTING.md                     # This file — structure & contribution guide
└── js/
    ├── shared.js                       # Reusable UI primitives (Tag, Code, Btn, etc.)
    ├── app.js                          # App shell: concept registry, sidebar, Hero, routing
    └── concepts/                       # One file per concept — self-registering components
        ├── 01-data-quality.js
        ├── 02-cdc-tracker.js
        ├── 03-star-schema.js
        ├── 04-api-bridge.js
        ├── 05-scd-handler.js
        ├── 06-data-lake.js
        ├── 07-dlq.js
        ├── 08-backfill.js
        ├── 09-data-diff.js
        ├── 10-config-pipeline.js
        └── 11-dashboard-backend.js
```

---

## 🔑 File Responsibilities

### `index.html`
- Loads **React**, **ReactDOM**, and **Babel** from CDN
- Loads Google Fonts and `styles.css`
- Loads scripts in the correct order:
  1. `js/shared.js` — shared primitives must be available first
  2. `js/concepts/*.js` — each concept registers itself on `window`
  3. `js/app.js` — reads `window` globals and renders the app

> ⚠️ **Load order matters.** If you add a new concept file, its `<script>` tag must come **before** `js/app.js` and **after** `js/shared.js`.

### `styles.css`
- CSS custom properties (design tokens) defined in `:root`
- Layout styles: hero, sidebar, content panel, footer
- Shared component classes: `.btn`, `.tag`, `.code-block`, `.tab`, `.metric-card`, tables
- Responsive breakpoints at `768px`

### `js/shared.js`
- Exports reusable primitives to `window`:
  - **`Tag`** — colored label pill (`<Tag color="#00d97e">PASS</Tag>`)
  - **`Code`** — syntax-highlighted code block
  - **`Btn`** — button with `default` and `primary` variants
  - **`SectionTitle`** — icon + title + subtitle header
  - **`Divider`** — horizontal rule

### `js/app.js`
- **`CONCEPTS` array** — the central registry. Each entry defines:
  ```js
  {
    id: "dq",                              // unique slug
    label: "Data Quality Checker",         // sidebar label
    icon: "✓",                             // sidebar icon (emoji/symbol)
    color: "#00d97e",                      // accent color
    num: "01",                             // display number
    component: () => window.DataQualityChecker  // resolver function
  }
  ```
- **`NavItem`** — sidebar navigation button
- **`Hero`** — top banner with stats
- **`App`** — shell that wires sidebar selection to panel rendering

### `js/concepts/XX-name.js`
- Each file defines **one** React component and assigns it to `window`:
  ```js
  window.MyComponent = function MyComponent() { ... };
  ```
- Components use primitives from `window` (Tag, Code, Btn, etc.)
- Components are fully self-contained — all data, state, and logic lives inside

---

## ➕ Adding a New Concept

Follow these **3 steps**:

### Step 1: Create the concept file

Create `js/concepts/12-my-concept.js`:

```js
// filepath: js/concepts/12-my-concept.js
window.MyConcept = function MyConcept() {
  const { useState } = React;
  const { Tag, Code, Btn, SectionTitle, Divider } = window;

  // Your state, data, and logic here
  const [count, setCount] = useState(0);

  return (
    <div>
      <SectionTitle
        icon="◆"
        color="#4dabf7"
        title="My New Concept"
        subtitle="A brief description of what this concept teaches."
      />
      <Divider />

      {/* Your interactive UI here */}
      <p>Count: {count}</p>
      <Btn onClick={() => setCount(c => c + 1)} variant="primary">
        Increment
      </Btn>

      <Divider />
      <Code>{`# Equivalent Python/SQL code
print("Hello from concept 12")`}</Code>
    </div>
  );
};
```

### Step 2: Register in `js/app.js`

Add an entry to the `CONCEPTS` array:

```js
// filepath: /Users/syedshamirraza/Downloads/de-lab/js/app.js
const CONCEPTS = [
  // ...existing code...
  { id: "dashboard", label: "Dashboard Backend",  icon: "▤", color: "#ff8787", num: "11", component: () => window.DashboardBackend },
  { id: "mycon",     label: "My New Concept",     icon: "◆", color: "#4dabf7", num: "12", component: () => window.MyConcept        },
];
```

### Step 3: Add the script tag in `index.html`

```html
<!-- filepath: /Users/syedshamirraza/Downloads/de-lab/index.html -->
  <!-- ...existing code... -->
  <script type="text/babel" src="js/concepts/11-dashboard-backend.js"></script>
  <script type="text/babel" src="js/concepts/12-my-concept.js"></script>

  <!-- App shell — must load last -->
  <script type="text/babel" src="js/app.js"></script>
  <!-- ...existing code... -->
```

That's it. The sidebar, routing, and panel rendering are all automatic.

---

## 🔧 Common Modifications

### Change the color scheme
Edit CSS custom properties in `styles.css`:
```css
:root {
  --bg:    #0a0a0a;   /* main background */
  --green: #00d97e;   /* primary accent  */
  --blue:  #4dabf7;   /* secondary       */
  /* ... */
}
```

### Add a new shared UI primitive
1. Define it in `js/shared.js` and assign to `window`:
   ```js
   window.MyPrimitive = function MyPrimitive({ children }) {
     return <div className="my-primitive">{children}</div>;
   };
   ```
2. Add the `.my-primitive` styles in `styles.css`
3. Use it in any concept: `const { MyPrimitive } = window;`

### Modify an existing concept
Each concept file is self-contained. Open the relevant file under `js/concepts/` and edit directly. Changes are reflected on browser refresh.

### Update sidebar order
Reorder entries in the `CONCEPTS` array in `js/app.js`. The sidebar renders in array order.

### Change hero content
Edit the `Hero` function in `js/app.js` — it's plain JSX with no dependencies.

### Add responsive breakpoints
Add or modify `@media` queries at the bottom of `styles.css`.

---

## ⚠️ Important Conventions

| Rule | Why |
|------|-----|
| Every concept must assign to `window` | `app.js` resolves components via `window.ComponentName` |
| Script load order: shared → concepts → app | Concepts depend on shared primitives; app depends on concepts |
| Use `<script type="text/babel">` | Babel Standalone transpiles JSX in the browser |
| Keep concepts self-contained | No imports between concept files — all shared code goes in `shared.js` |
| Use `key={activeId}` on `<Panel>` | Resets component state when switching between concepts |

---

## 🧪 Testing Changes

Since there's no build step, testing is simple:

```bash
# Start server
python3 -m http.server 8000

# Open browser console (F12) to check for errors
# Hard-refresh (Cmd+Shift+R / Ctrl+Shift+R) after changes
```

> **Tip:** Use the browser DevTools console to verify your component registered correctly:
> ```js
> typeof window.MyConcept  // should be "function"
> ```

---

## 📋 Checklist for New Concepts

- [ ] Created `js/concepts/XX-name.js` with `window.ComponentName = function ...`
- [ ] Added entry to `CONCEPTS` array in `js/app.js`
- [ ] Added `<script type="text/babel" src="...">` in `index.html` (before `app.js`)
- [ ] Used shared primitives (`SectionTitle`, `Divider`, `Code`, `Tag`, `Btn`)
- [ ] Included equivalent Python/SQL code snippet
- [ ] Tested in browser — no console errors
- [ ] Updated concept count in `Hero` component if desired