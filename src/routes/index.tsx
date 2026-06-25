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

function Dropdown<T extends string>({
  value,
  options,
  onChange,
  icon,
  className = "filter-select",
  menuAlign = "left",
  minWidth,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  icon?: string;
  className?: string;
  menuAlign?: "left" | "right";
  minWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return (
    <div className="dd-wrap" ref={ref} style={minWidth ? { minWidth } : undefined}>
      <div className={className} onClick={() => setOpen((v) => !v)} role="button" tabIndex={0}>
        {icon && <i className={`ti ${icon}`} />}
        <span>{value}</span>
        <i className="ti ti-chevron-down chevron" />
      </div>
      {open && (
        <div className={`dd-menu ${menuAlign === "right" ? "right" : ""}`}>
          {options.map((o) => (
            <div
              key={o}
              className={`dd-item${o === value ? " active" : ""}`}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
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

const STORES = ["All stores", "Center", "Issy", "Blanche"] as const;
const YEARS = ["2024", "2025", "2026"] as const;
const MONTHS = [
  "All months",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
] as const;
const PRODUCTS = ["All products", "Lunch", "Eco"] as const;

type Year = (typeof YEARS)[number];
type Month = (typeof MONTHS)[number];
type Product = (typeof PRODUCTS)[number];

function Dashboard() {
  const [tab, setTab] = useState<TabId>("sales");
  const [store, setStore] = useState<(typeof STORES)[number]>("All stores");
  const [year, setYear] = useState<Year>("2026");
  const [month, setMonth] = useState<Month>("All months");
  const [product, setProduct] = useState<Product>("All products");
  const [storeOpen, setStoreOpen] = useState(false);
  const storeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!storeOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (storeRef.current && !storeRef.current.contains(e.target as Node)) setStoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [storeOpen]);

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
            <div className="store-select-wrap" ref={storeRef}>
              <div
                className="store-select"
                onClick={() => setStoreOpen((v) => !v)}
                role="button"
                tabIndex={0}
              >
                <span>{store}</span>
                <i
                  className="ti ti-chevron-down"
                  style={{ fontSize: 14, color: "var(--text-tertiary)" }}
                />
              </div>
              {storeOpen && (
                <div className="store-menu">
                  {STORES.map((s) => (
                    <div
                      key={s}
                      className={`store-menu-item${s === store ? " active" : ""}`}
                      onClick={() => {
                        setStore(s);
                        setStoreOpen(false);
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
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
            <Dropdown value={year} options={YEARS} onChange={setYear} icon="ti-calendar" />
            <Dropdown value={month} options={MONTHS} onChange={setMonth} icon="ti-calendar" />
            <div className="filter-right">
              <Dropdown
                value={product}
                options={PRODUCTS}
                onChange={setProduct}
                className="product-select"
                menuAlign="right"
              />
            </div>
          </div>

          {tab === "sales" ? (
            <SalesTab year={year} month={month} product={product} />
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

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] as const;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}
function rand(seed: number, i: number) {
  const x = Math.sin(seed + i * 9301) * 10000;
  return x - Math.floor(x);
}
function fmtEUR(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " EUR";
}

function buildData(year: Year, month: Month, product: Product) {
  const seed = hash(`${year}|${month}|${product}`);
  const yearMult = year === "2024" ? 0.7 : year === "2025" ? 0.85 : 1;
  const productMult =
    product === "All products" ? 1
    : product === "Lunch" ? 0.7
    : 0.3;

  const months = month === "All months" ? [...MONTH_LABELS] : [month];
  const base = months.map((m, i) => {
    const v = 600 + rand(seed, i + 1) * 900;
    return { m, value: Math.round(v * yearMult * productMult) };
  });
  const total = base.reduce((s, b) => s + b.value, 0);

  const employerPool = [
    "FNAC", "Proximus", "BNP", "Carrefour", "Orange", "Engie", "Decathlon", "Total", "L'Oréal",
  ];
  const employers = [0, 1, 2].map((i) => {
    const name = employerPool[Math.floor(rand(seed, 50 + i) * employerPool.length)];
    const clients = 8 + Math.floor(rand(seed, 60 + i) * 25);
    const value = 60 + rand(seed, 70 + i) * 110;
    return { name, clients: `${clients} clients`, value: fmtEUR(value * productMult) };
  });
  // de-dupe names
  const seen = new Set<string>();
  const employersUniq = employers.map((e) => {
    let n = e.name;
    let k = 0;
    while (seen.has(n)) n = employerPool[(employerPool.indexOf(e.name) + ++k) % employerPool.length];
    seen.add(n);
    return { ...e, name: n };
  });

  const newClients = 20 + Math.floor(rand(seed, 11) * 60 * yearMult);
  const knownClients = 90 + Math.floor(rand(seed, 12) * 120 * yearMult);
  const avgBasket = Math.round((15 + rand(seed, 13) * 25) * (productMult * 1.4 + 0.3));

  const mkDelta = (k: number) => {
    const d = (rand(seed, 100 + k) - 0.5) * 40;
    const cls = d > 1 ? "up" : d < -1 ? "down" : "flat";
    const icon = cls === "up" ? "ti-trending-up" : cls === "down" ? "ti-trending-down" : "ti-minus";
    const label = `${Math.abs(d).toFixed(1)}%`;
    return { cls: cls as "up" | "down" | "flat", icon, label: cls === "flat" ? "0%" : label };
  };

  return {
    total,
    months: base,
    employers: employersUniq,
    clients: {
      newClients: { value: String(newClients), delta: mkDelta(1) },
      knownClients: { value: String(knownClients), delta: mkDelta(2) },
      avgBasket: { value: `${avgBasket} EUR`, delta: mkDelta(3) },
    },
  };
}

function SalesTab({ year, month, product }: { year: Year; month: Month; product: Product }) {
  const data = buildData(year, month, product);
  const max = Math.max(...data.months.map((m) => m.value), 1);
  const n = data.months.length;
  const chartW = 680;
  const chartH = 200;
  const left = 48;
  const innerW = chartW - left - 8;
  const slot = innerW / n;
  const barW = Math.min(40, slot * 0.55);
  const topY = 16;
  const baseY = 158;
  const usableH = baseY - topY;

  const ticks = [max, max * 0.66, max * 0.33, 0];

  return (
    <>
      {/* Sales over time */}
      <div className="section">
        <div className="section-title">
          Pluxee sales over time
          <InfoTip text="This shows the total sales made with Pluxee products for the period you have selected. The chart helps you see how your performance evolves. You can use the filter at the top to focus on a specific product or period." />
        </div>
        <div className="section-big-number">{fmtEUR(data.total)}</div>

        <div className="chart-area">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            style={{ width: "100%", height: 200 }}
            role="img"
            aria-label="Bar chart of Pluxee sales"
          >
            <g stroke="rgba(26,31,60,0.08)" strokeWidth="0.5">
              {ticks.map((_, i) => {
                const y = topY + (usableH * i) / 3;
                return <line key={i} x1={left} y1={y} x2={chartW} y2={y} />;
              })}
            </g>
            <g fontSize="9.5" fill="#9B9A95" fontFamily="Inter, sans-serif" textAnchor="end">
              {ticks.map((t, i) => {
                const y = topY + (usableH * i) / 3 + 4;
                return (
                  <text key={i} x={40} y={y}>
                    {Math.round(t).toLocaleString()}
                  </text>
                );
              })}
            </g>
            {data.months.map((m, i) => {
              const h = (m.value / max) * usableH;
              const x = left + slot * i + (slot - barW) / 2;
              const y = baseY - h;
              return (
                <rect key={m.m + i} x={x} y={y} width={barW} height={h} rx={3} fill="var(--navy)" />
              );
            })}
            <g fontSize="10" fill="#5F5E5A" fontFamily="Inter, sans-serif" textAnchor="middle">
              {data.months.map((m, i) => (
                <text key={m.m + i} x={left + slot * i + slot / 2} y={178}>
                  {m.m}
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
          <InfoTip text="These are the three employers most represented among your Pluxee customers. This allows you to understand where your sales come from and identify potential partnerships." />
        </div>
        <div className="employer-grid">
          {data.employers.map((e) => (
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
            value={data.clients.newClients.value}
            icon="ti-user"
            label="New clients"
            deltaClass={data.clients.newClients.delta.cls}
            deltaIcon={data.clients.newClients.delta.icon}
            delta={data.clients.newClients.delta.label}
          />
          <ClientCell
            value={data.clients.knownClients.value}
            icon="ti-users"
            label="Known clients"
            deltaClass={data.clients.knownClients.delta.cls}
            deltaIcon={data.clients.knownClients.delta.icon}
            delta={data.clients.knownClients.delta.label}
          />
          <ClientCell
            value={data.clients.avgBasket.value}
            icon="ti-coin"
            label="Average basket"
            deltaClass={data.clients.avgBasket.delta.cls}
            deltaIcon={data.clients.avgBasket.delta.icon}
            delta={data.clients.avgBasket.delta.label}
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
.store-select-wrap { position: relative; }
.store-select { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--white); border: 0.5px solid var(--border); border-radius: var(--radius-md); font-family: var(--font); font-size: 13px; color: var(--text-primary); cursor: pointer; min-width: 180px; justify-content: space-between; }
.store-menu { position: absolute; top: calc(100% + 6px); right: 0; min-width: 180px; background: var(--white); border: 0.5px solid var(--border); border-radius: var(--radius-md); box-shadow: 0 8px 24px rgba(26,31,60,0.10); padding: 4px; z-index: 40; }
.store-menu-item { padding: 8px 12px; font-size: 13px; color: var(--text-primary); border-radius: 6px; cursor: pointer; font-family: var(--font); }
.store-menu-item:hover { background: var(--page-bg); }
.store-menu-item.active { background: var(--page-bg); font-weight: 500; }

.dd-wrap { position: relative; display: inline-block; }
.dd-menu { position: absolute; top: calc(100% + 6px); left: 0; min-width: 160px; background: var(--white); border: 0.5px solid var(--border); border-radius: var(--radius-md); box-shadow: 0 8px 24px rgba(26,31,60,0.10); padding: 4px; z-index: 40; max-height: 280px; overflow-y: auto; }
.dd-menu.right { left: auto; right: 0; }
.dd-item { padding: 7px 12px; font-size: 12.5px; color: var(--text-primary); border-radius: 6px; cursor: pointer; font-family: var(--font); white-space: nowrap; }
.dd-item:hover { background: var(--bg); }
.dd-item.active { background: var(--bg); font-weight: 500; }

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
.info-wrap { position: relative; display: inline-flex; align-items: center; }
.info-tooltip { position: absolute; top: calc(100% + 8px); left: 0; z-index: 50; width: 320px; background: var(--navy); color: #fff; font-size: 12px; line-height: 1.5; font-weight: 400; padding: 10px 12px; border-radius: 8px; box-shadow: 0 6px 20px rgba(26,31,60,0.18); }
.info-tooltip::before { content: ""; position: absolute; top: -5px; left: 8px; width: 10px; height: 10px; background: var(--navy); transform: rotate(45deg); border-radius: 2px; }
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
