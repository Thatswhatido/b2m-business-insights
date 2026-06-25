import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return (
    <span className="info-wrap" ref={ref}>
      <i
        className="ti ti-info-circle info"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      />
      {open && <span className="info-tooltip">{text}</span>}
    </span>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pluxee SmartView – Business Insights" },
      { name: "description", content: "Pluxee merchant analytics dashboard." },
    ],
  }),
  component: Dashboard,
});

const TABS = [
  { id: "sales", label: "Sales", icon: "ti-chart-line" },
  { id: "benchmark", label: "Benchmark", icon: "ti-chart-bar" },
  { id: "sector", label: "Sector health", icon: "ti-activity" },
  { id: "comparison", label: "Comparison", icon: "ti-arrows-left-right" },
  { id: "forecast", label: "Forecast", icon: "ti-trending-up" },
  { id: "segments", label: "Employer segments", icon: "ti-building" },
  { id: "reports", label: "Reports", icon: "ti-file-export" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Dashboard() {
  const [tab, setTab] = useState<TabId>("sales");

  return (
    <div className="pluxee-app">
      <style>{CSS}</style>

      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-logo">
          plu<span>x</span>ee
        </div>
        <div className="topbar-right">
          <div className="lang-chip">
            <span>EN</span>
            <i className="ti ti-chevron-down" style={{ fontSize: 13 }} />
          </div>
          <div className="user-chip">
            <div className="user-avatar">PA</div>
            <span>My portal</span>
            <i className="ti ti-chevron-down" style={{ fontSize: 13 }} />
          </div>
        </div>
      </header>

      <div className="layout">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="sidebar-item">
            <div className="sidebar-sub">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <i className="ti ti-building-store" />
                <span>Summer Su…</span>
              </div>
              <i className="ti ti-chevron-down" style={{ fontSize: 13 }} />
            </div>
          </div>
          <SideItem icon="ti-building" label="Company" />
          <SideItem icon="ti-map-pin" label="Stores" />
          <SideItem icon="ti-activity" label="Activity" />
          <SideItem icon="ti-chart-bar" label="Insight" active />
        </nav>

        {/* Main */}
        <main className="main">
          <div className="page-header">
            <h1 className="page-title">Business insights</h1>
            <div className="store-select">
              <span>All stores</span>
              <i
                className="ti ti-chevron-down"
                style={{ fontSize: 14, color: "var(--text-tertiary)" }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-row">
            <div className="tabs">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`tab ${tab === t.id ? "active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <i className={`ti ${t.icon}`} />
                  {t.label}
                </button>
              ))}
            </div>
            <div className="tab-badge">B</div>
          </div>

          {/* Filters */}
          <div className="filter-row">
            <div className="filter-select">
              <i className="ti ti-calendar" />
              <span>2026</span>
              <i className="ti ti-chevron-down chevron" />
            </div>
            <div className="filter-select">
              <i className="ti ti-calendar" />
              <span>All months</span>
              <i className="ti ti-chevron-down chevron" />
            </div>
            <div className="filter-right">
              <div className="product-select">
                <span>All products</span>
                <i
                  className="ti ti-chevron-down"
                  style={{ fontSize: 13, color: "var(--text-tertiary)" }}
                />
              </div>
            </div>
          </div>

          {tab === "sales" ? (
            <SalesTab />
          ) : (
            <div className="section" style={{ padding: "48px 24px", textAlign: "center" }}>
              <div className="section-title" style={{ justifyContent: "center" }}>
                {TABS.find((t) => t.id === tab)?.label}
                <i className="ti ti-info-circle info" />
              </div>
              <p
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                Coming next — upload the HTML for this tab.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SideItem({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div className={`sidebar-item${active ? " active" : ""}`}>
      <i className={`ti ${icon}`} />
      <span>{label}</span>
    </div>
  );
}

function SalesTab() {
  return (
    <>
      {/* Sales over time */}
      <div className="section">
        <div className="section-title">
          Pluxee sales over time
          <i className="ti ti-info-circle info" />
        </div>
        <div className="section-big-number">2 500,10 EUR</div>

        <div className="chart-area">
          <svg
            viewBox="0 0 680 200"
            style={{ width: "100%", height: 200 }}
            role="img"
            aria-label="Bar chart of Pluxee sales Jan to Jul 2026"
          >
            <g stroke="rgba(26,31,60,0.08)" strokeWidth="0.5">
              <line x1="48" y1="16" x2="680" y2="16" />
              <line x1="48" y1="58" x2="680" y2="58" />
              <line x1="48" y1="100" x2="680" y2="100" />
              <line x1="48" y1="142" x2="680" y2="142" />
            </g>
            <g
              fontSize="9.5"
              fill="#9B9A95"
              fontFamily="Inter, sans-serif"
              textAnchor="end"
            >
              <text x="40" y="20">1,500</text>
              <text x="40" y="62">1,000</text>
              <text x="40" y="104">500</text>
              <text x="40" y="146">0</text>
            </g>
            <text
              transform="rotate(-90)"
              x="-100"
              y="12"
              fontSize="9"
              fill="#9B9A95"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
            >
              Revenue
            </text>
            {[
              [66, 100, 42],
              [154, 88, 54],
              [242, 94, 48],
              [330, 82, 60],
              [418, 112, 30],
              [506, 78, 64],
              [594, 84, 58],
            ].map(([x, y, h], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width={40}
                height={h}
                rx={3}
                fill="var(--navy)"
              />
            ))}
            <g
              fontSize="10"
              fill="#5F5E5A"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
            >
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m, i) => (
                <text key={m} x={86 + i * 88} y={166}>
                  {m}
                </text>
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Top employer clients */}
      <div className="section">
        <div className="section-title" style={{ marginBottom: 16 }}>
          Top employer clients
          <i className="ti ti-info-circle info" />
        </div>
        <div className="employer-grid">
          {[
            { name: "FNAC", clients: "22 clients", value: "125,00 EUR" },
            { name: "Proximus", clients: "19 clients", value: "120,00 EUR" },
            { name: "BNP", clients: "15 clients", value: "100,00 EUR" },
          ].map((e) => (
            <div className="employer-cell" key={e.name}>
              <div className="employer-name">
                {e.name}
                <i className="ti ti-chart-bar" />
              </div>
              <div className="employer-stat">{e.clients}</div>
              <div className="employer-stat">{e.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* My clients */}
      <div className="section">
        <div className="section-title" style={{ marginBottom: 16 }}>
          My clients
          <InfoTip text="This shows who your customers are and how they behave. You can see new customers and returning customers, as well as the average basket. This helps you better understand your customer base and identify trends that can support your decisions. The trend indicator compares the selected period to the previous period. For example: from the 1st to the 15th of this month compared to the same period of the previous month." />
        </div>
        <div className="clients-grid">
          <ClientCell
            value="45"
            icon="ti-user"
            label="New clients"
            deltaClass="down"
            deltaIcon="ti-trending-down"
            delta="3.6%"
          />
          <ClientCell
            value="145"
            icon="ti-users"
            label="Known clients"
            deltaClass="flat"
            deltaIcon="ti-minus"
            delta="0%"
          />
          <ClientCell
            value="24 EUR"
            icon="ti-coin"
            label="Average basket"
            deltaClass="up"
            deltaIcon="ti-trending-up"
            delta="20%"
          />
        </div>
      </div>
    </>
  );
}

function ClientCell({
  value,
  icon,
  label,
  deltaClass,
  deltaIcon,
  delta,
}: {
  value: string;
  icon: string;
  label: string;
  deltaClass: "up" | "down" | "flat";
  deltaIcon: string;
  delta: string;
}) {
  return (
    <div className="client-cell">
      <div className="client-value-row">
        <span className="client-value">{value}</span>
        <i className={`ti ${icon} client-value-icon`} />
      </div>
      <div className="client-label">{label}</div>
      <div className={`delta ${deltaClass}`}>
        <i className={`ti ${deltaIcon}`} style={{ fontSize: 13 }} />
        {delta}
      </div>
    </div>
  );
}

const CSS = `
.pluxee-app {
  --navy: #1A1F3C;
  --navy-light: #252B4A;
  --green: #1ED760;
  --green-dark: #17B34E;
  --bg: #F2F3F7;
  --white: #FFFFFF;
  --text-primary: #1A1F3C;
  --text-secondary: #5F5E5A;
  --text-tertiary: #9B9A95;
  --border: rgba(26, 31, 60, 0.12);
  --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  font-family: var(--font);
  background: var(--bg);
  color: var(--text-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
}
.pluxee-app * { box-sizing: border-box; }

.topbar {
  background: var(--white);
  border-bottom: 0.5px solid var(--border);
  padding: 0 28px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.topbar-logo { font-size: 20px; font-weight: 600; color: var(--navy); letter-spacing: -0.5px; }
.topbar-logo span { color: var(--green); }
.topbar-right { display: flex; align-items: center; gap: 16px; }
.lang-chip { display: flex; align-items: center; gap: 5px; font-size: 13px; color: var(--text-primary); cursor: pointer; padding: 4px 8px; border-radius: var(--radius-sm); }
.lang-chip:hover { background: var(--bg); }
.user-chip { display: flex; align-items: center; gap: 8px; padding: 5px 10px; background: var(--navy); border-radius: var(--radius-sm); cursor: pointer; }
.user-avatar { width: 22px; height: 22px; border-radius: 50%; background: var(--green); color: var(--navy); font-size: 10px; font-weight: 600; display: flex; align-items: center; justify-content: center; }
.user-chip span { font-size: 13px; color: var(--white); }

.layout { display: flex; flex: 1; }

.sidebar { width: 160px; background: var(--navy); padding: 16px 0; flex-shrink: 0; display: flex; flex-direction: column; gap: 2px; }
.sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 18px; font-size: 13px; color: rgba(255,255,255,0.6); cursor: pointer; border-left: 3px solid transparent; transition: color 0.15s, background 0.15s; }
.sidebar-item i { font-size: 17px; flex-shrink: 0; }
.sidebar-item:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.05); }
.sidebar-item.active { color: var(--white); border-left-color: var(--green); background: rgba(255,255,255,0.06); }
.sidebar-item.active i { color: var(--green); }
.sidebar-sub { display: flex; align-items: center; justify-content: space-between; width: 100%; }

.main { flex: 1; padding: 28px 32px; overflow-y: auto; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 600; color: var(--text-primary); }
.store-select { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--white); border: 0.5px solid var(--border); border-radius: var(--radius-md); font-family: var(--font); font-size: 13px; color: var(--text-primary); cursor: pointer; min-width: 180px; justify-content: space-between; }

.tabs-row { display: flex; align-items: center; justify-content: space-between; border-bottom: 0.5px solid var(--border); margin-bottom: 20px; overflow-x: auto; }
.tabs { display: flex; gap: 0; flex-shrink: 0; }
.tab { display: flex; align-items: center; gap: 5px; padding: 10px 14px; font-size: 12.5px; color: var(--text-secondary); cursor: pointer; border: none; background: none; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color 0.15s; white-space: nowrap; font-family: var(--font); }
.tab i { font-size: 15px; }
.tab.active { color: var(--text-primary); border-bottom-color: var(--text-primary); font-weight: 500; }
.tab:hover:not(.active) { color: var(--text-primary); }
.tab-badge { width: 22px; height: 22px; border-radius: 50%; background: var(--green); color: var(--navy); font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; flex-shrink: 0; margin-left: 12px; }

.filter-row { display: flex; gap: 10px; margin-bottom: 24px; align-items: center; flex-wrap: wrap; }
.filter-select { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: var(--white); border: 0.5px solid var(--border); border-radius: var(--radius-sm); font-family: var(--font); font-size: 12px; color: var(--text-primary); cursor: pointer; }
.filter-select i { font-size: 14px; color: var(--text-secondary); }
.filter-select .chevron { color: var(--text-tertiary); font-size: 13px; }
.filter-right { margin-left: auto; }
.product-select { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: var(--white); border: 0.5px solid var(--border); border-radius: var(--radius-sm); font-family: var(--font); font-size: 12px; color: var(--text-primary); cursor: pointer; min-width: 140px; justify-content: space-between; }

.section { background: var(--white); border: 0.5px solid var(--border); border-radius: var(--radius-lg); padding: 20px 24px; margin-bottom: 16px; }
.section-title { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: var(--text-primary); margin-bottom: 4px; }
.section-title i.info { font-size: 15px; color: var(--text-tertiary); cursor: pointer; }
.section-big-number { font-size: 22px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; }

.chart-area { width: 100%; }

.employer-grid, .clients-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: var(--border); border-radius: var(--radius-md); overflow: hidden; }
.employer-cell, .client-cell { background: var(--white); padding: 16px 18px; }
.employer-name { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
.employer-name i { font-size: 14px; color: var(--text-tertiary); }
.employer-stat { font-size: 12px; color: var(--text-secondary); line-height: 1.6; }

.client-value-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.client-value { font-size: 22px; font-weight: 600; color: var(--text-primary); }
.client-value-icon { font-size: 16px; color: var(--text-tertiary); }
.client-label { font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; }
.delta { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 500; padding: 2px 0; }
.delta.down { color: #C0392B; }
.delta.flat { color: #B07D2A; }
.delta.up   { color: #2E7D32; }
`;
