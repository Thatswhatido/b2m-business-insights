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
const YEARS = ["2023", "2024", "2025", "2026"] as const;
const MONTHS = [
  "All months",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
] as const;
const PRODUCTS = ["All products", "Lunch", "Eco"] as const;

type Year = (typeof YEARS)[number];
type Month = (typeof MONTHS)[number];
type Product = (typeof PRODUCTS)[number];
type Store = (typeof STORES)[number];
const STORE_WEIGHTS: Record<Store, number> = {
  "All stores": 1,
  Center: 0.45,
  Issy: 0.30,
  Blanche: 0.25,
};

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
        <div className="topbar-logo">Logo</div>
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
                onClick={() => { if (tab !== "sector") setStoreOpen((v) => !v); }}
                role="button"
                tabIndex={tab === "sector" ? -1 : 0}
                aria-disabled={tab === "sector"}
                style={tab === "sector" ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
              >
                <span>{store}</span>
                <i
                  className="ti ti-chevron-down"
                  style={{ fontSize: 14, color: "var(--text-tertiary)" }}
                />
              </div>
              {storeOpen && tab !== "sector" && (
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

          <div className="filter-row">
            <Dropdown value={year} options={YEARS} onChange={setYear} icon="ti-calendar" />
            <Dropdown value={month} options={MONTHS} onChange={setMonth} icon="ti-calendar" />
            {tab !== "sector" && tab !== "forecast" && (
              <div className="filter-right">
                <Dropdown
                  value={product}
                  options={PRODUCTS}
                  onChange={setProduct}
                  className="product-select"
                  menuAlign="right"
                />
              </div>
            )}
          </div>

          {tab === "sales" ? (
            <SalesTab year={year} month={month} product={product} store={store} />
          ) : tab === "benchmark" ? (
            <BenchmarkTab year={year} month={month} product={product} store={store} />
          ) : tab === "sector" ? (
            <SectorHealthTab year={year} month={month} product={product} />
          ) : tab === "forecast" ? (
            <ForecastTab year={year} month={month} store={store} />
          ) : tab === "comparison" ? (
            <ComparisonTab year={year} month={month} store={store} />
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

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

// "Today" reference for filtering future periods out of the chart.
const TODAY_YEAR = 2026;
const TODAY_MONTH_IDX = 5; // June (0-indexed)
const TODAY_DAY = 25;

function daysInMonth(yearNum: number, monthIdx: number) {
  return new Date(yearNum, monthIdx + 1, 0).getDate();
}

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
  return Math.round(n).toLocaleString("fr-FR") + " EUR";
}

function buildData(year: Year, month: Month, product: Product, store: Store) {
  const seed = hash(`${year}|${month}|${product}|${store}`);
  const yearMult = year === "2023" ? 0.55 : year === "2024" ? 0.7 : year === "2025" ? 0.85 : 1;
  const productMult =
    product === "All products" ? 1
    : product === "Lunch" ? 0.7
    : 0.3;
  const storeMult = STORE_WEIGHTS[store];

  const yearNum = parseInt(year, 10);
  const isCurrentYear = yearNum === TODAY_YEAR;

  // Build bars: monthly when no month selected, daily when a month is selected.
  let bars: { label: string; value: number }[];
  let mode: "monthly" | "daily";

  if (month === "All months") {
    mode = "monthly";
    const lastIdx = isCurrentYear ? TODAY_MONTH_IDX - 1 : 11; // d-1 month for current year
    const monthsArr = MONTH_LABELS.slice(0, Math.max(0, lastIdx + 1));
    bars = monthsArr.map((m, i) => {
      const v = 600 + rand(seed, i + 1) * 900;
      return { label: m, value: Math.round(v * yearMult * productMult * storeMult) };
    });
  } else {
    mode = "daily";
    const monthIdx = MONTH_LABELS.indexOf(month as (typeof MONTH_LABELS)[number]);
    const total = daysInMonth(yearNum, monthIdx);
    const lastDay = isCurrentYear && monthIdx === TODAY_MONTH_IDX
      ? Math.max(0, TODAY_DAY - 1)
      : total;
    bars = Array.from({ length: lastDay }, (_, i) => {
      const v = 20 + rand(seed, i + 1) * 60;
      return { label: String(i + 1), value: Math.round(v * yearMult * productMult * storeMult) };
    });
  }
  const total = bars.reduce((s, b) => s + b.value, 0);

  const employerPool = [
    "FNAC", "Proximus", "BNP", "Carrefour", "Orange", "Engie", "Decathlon", "Total", "L'Oréal",
  ];
  const employers = [0, 1, 2].map((i) => {
    const name = employerPool[Math.floor(rand(seed, 50 + i) * employerPool.length)];
    const clients = Math.max(1, Math.round((8 + Math.floor(rand(seed, 60 + i) * 25)) * storeMult));
    const value = 60 + rand(seed, 70 + i) * 110;
    return { name, clients: `${clients} clients`, value: fmtEUR(value * productMult * storeMult) };
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

  const newClients = Math.max(1, Math.round((20 + Math.floor(rand(seed, 11) * 60 * yearMult)) * storeMult));
  const knownClients = Math.max(1, Math.round((90 + Math.floor(rand(seed, 12) * 120 * yearMult)) * storeMult));
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
    bars,
    mode,
    employers: employersUniq,
    clients: {
      newClients: { value: String(newClients), delta: mkDelta(1) },
      knownClients: { value: String(knownClients), delta: mkDelta(2) },
      avgBasket: { value: `${avgBasket} EUR`, delta: mkDelta(3) },
    },
  };
}

function SalesTab({ year, month, product, store }: { year: Year; month: Month; product: Product; store: Store }) {
  const data = buildData(year, month, product, store);
  const [hover, setHover] = useState<number | null>(null);
  const bars = data.bars;
  const max = Math.max(...bars.map((b) => b.value), 1);
  const n = Math.max(bars.length, 1);
  const chartW = 680;
  const chartH = 200;
  const left = 48;
  const innerW = chartW - left - 8;
  const slot = innerW / n;
  const barW = data.mode === "monthly" ? Math.min(40, slot * 0.55) : Math.max(2, slot * 0.7);
  const topY = 24;
  const baseY = 158;
  const usableH = baseY - topY;

  const ticks = [max, max * 0.66, max * 0.33, 0];

  // For daily mode, sample label every Nth bar to avoid crowding.
  const labelStride =
    data.mode === "monthly" ? 1 : n <= 16 ? 1 : n <= 24 ? 3 : 5;

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
            onMouseLeave={() => setHover(null)}
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
            {bars.map((b, i) => {
              const h = (b.value / max) * usableH;
              const x = left + slot * i + (slot - barW) / 2;
              const y = baseY - h;
              const isHover = hover === i;
              return (
                <g key={b.label + i}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={h}
                    rx={3}
                    fill={isHover ? "#C7EBF7" : "var(--navy)"}
                  />
                  {/* invisible wider hit area for hover */}
                  <rect
                    x={left + slot * i}
                    y={topY}
                    width={slot}
                    height={baseY - topY}
                    fill="transparent"
                    onMouseEnter={() => setHover(i)}
                  />
                </g>
              );
            })}
            <g fontSize="10" fill="#5F5E5A" fontFamily="Inter, sans-serif" textAnchor="middle">
              {bars.map((b, i) =>
                i % labelStride === 0 ? (
                  <text key={b.label + i} x={left + slot * i + slot / 2} y={178}>
                    {b.label}
                  </text>
                ) : null
              )}
            </g>
            {hover !== null && bars[hover] && (() => {
              const b = bars[hover];
              const h = (b.value / max) * usableH;
              const cx = left + slot * hover + slot / 2;
              const label = data.mode === "daily" ? `${b.label} — ${fmtEUR(b.value)}` : fmtEUR(b.value);
              const th = 26;
              const padX = 12;
              const tw = Math.max(70, label.length * 6.8 + padX * 2);
              const tipH = 6; // triangle pointer height
              const barTopY = baseY - h;
              const ty = Math.max(2, barTopY - tipH - th - 4);
              const tx = Math.min(Math.max(cx - tw / 2, 2), chartW - tw - 2);
              const triBaseY = ty + th;
              const triCx = Math.min(Math.max(cx, tx + 12), tx + tw - 12);
              return (
                <g pointerEvents="none">
                  {/* shadow */}
                  <rect x={tx + 3} y={ty + 4} width={tw} height={th} rx={4} fill="rgba(26,31,60,0.18)" />
                  <polygon
                    points={`${triCx - 6 + 3},${triBaseY + 4} ${triCx + 6 + 3},${triBaseY + 4} ${triCx + 3},${triBaseY + tipH + 4}`}
                    fill="rgba(26,31,60,0.18)"
                  />
                  {/* tooltip body */}
                  <rect x={tx} y={ty} width={tw} height={th} rx={4} fill="var(--navy)" />
                  <polygon
                    points={`${triCx - 6},${triBaseY} ${triCx + 6},${triBaseY} ${triCx},${triBaseY + tipH}`}
                    fill="var(--navy)"
                  />
                  <text
                    x={tx + tw / 2}
                    y={ty + th / 2 + 5}
                    fontSize="13"
                    fontWeight="700"
                    fill="#FFFFFF"
                    fontFamily="Inter, sans-serif"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                </g>
              );
            })()}
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

function BenchmarkTab({ year, month, product, store }: { year: Year; month: Month; product: Product; store: Store }) {
  const seed = hash(`bench|${year}|${month}|${product}|${store}`);
  const yearMult = year === "2023" ? 0.55 : year === "2024" ? 0.7 : year === "2025" ? 0.85 : 1;
  const productMult = product === "All products" ? 1 : product === "Lunch" ? 0.7 : 0.3;
  const storeMult = STORE_WEIGHTS[store];

  const yearNum = parseInt(year, 10);
  const isCurrentYear = yearNum === TODAY_YEAR;

  // Build pairs: monthly when no month selected, daily when a month is selected.
  let pairs: { label: string; mine: number; peers: number }[];
  let mode: "monthly" | "daily";

  if (month === "All months") {
    mode = "monthly";
    const lastIdx = isCurrentYear ? TODAY_MONTH_IDX - 1 : 11;
    const monthsArr = MONTH_LABELS.slice(0, Math.max(0, lastIdx + 1));
    pairs = monthsArr.map((m, i) => {
      const mine = Math.round((500 + rand(seed, i + 1) * 900) * yearMult * productMult * storeMult);
      const peerBase = Math.round((500 + rand(seed, i + 1) * 900) * yearMult * productMult);
      const peers = Math.round(peerBase * (0.75 + rand(seed, 80 + i) * 0.5));
      return { label: m, mine, peers };
    });
  } else {
    mode = "daily";
    const monthIdx = MONTH_LABELS.indexOf(month as (typeof MONTH_LABELS)[number]);
    const total = daysInMonth(yearNum, monthIdx);
    const lastDay = isCurrentYear && monthIdx === TODAY_MONTH_IDX
      ? Math.max(0, TODAY_DAY - 1)
      : total;
    pairs = Array.from({ length: lastDay }, (_, i) => {
      const mine = Math.round((20 + rand(seed, i + 1) * 60) * yearMult * productMult * storeMult);
      const peerBase = Math.round((20 + rand(seed, i + 1) * 60) * yearMult * productMult);
      const peers = Math.round(peerBase * (0.75 + rand(seed, 80 + i) * 0.5));
      return { label: String(i + 1), mine, peers };
    });
  }

  const totalMine = pairs.reduce((s, p) => s + p.mine, 0);
  const totalPeers = pairs.reduce((s, p) => s + p.peers, 0);

  const [hover, setHover] = useState<number | null>(null);

  const max = Math.max(...pairs.flatMap((p) => [p.mine, p.peers]), 1);
  const n = Math.max(pairs.length, 1);
  const chartW = 680;
  const chartH = 220;
  const left = 48;
  const innerW = chartW - left - 8;
  const slot = innerW / n;
  const barW = mode === "monthly" ? Math.min(14, slot * 0.32) : Math.max(2, slot * 0.38);
  const topY = 24;
  const baseY = 170;
  const usableH = baseY - topY;
  const ticks = [max, max * 0.66, max * 0.33, 0];

  const labelStride = mode === "monthly" ? 1 : n <= 16 ? 1 : n <= 24 ? 3 : 5;

  const peersCount = 40 + Math.floor(rand(seed, 200) * 10);
  const mkKpi = (k: number, baseMine: number, basePeer: number, suffix = "", scaleMine = true) => {
    const mineRaw = baseMine * (0.9 + rand(seed, 300 + k) * 0.3) * (scaleMine ? storeMult : 1);
    const mine = Math.max(1, Math.round(mineRaw));
    const peer = Math.round(basePeer * (0.9 + rand(seed, 400 + k) * 0.3));
    const dMine = (rand(seed, 500 + k) - 0.3) * 30;
    const dPeer = (rand(seed, 600 + k) - 0.4) * 20;
    const fmt = (d: number) => {
      const cls = d > 1 ? "up" : d < -1 ? "down" : "flat";
      return { cls: cls as "up" | "down" | "flat", label: `${d >= 0 ? "↗" : "↘"} ${Math.abs(d).toFixed(0)}%` };
    };
    return {
      mine: `${mine}${suffix}`, peer: `${peer}${suffix}`,
      dMine: fmt(dMine), dPeer: fmt(dPeer),
    };
  };
  const newC = mkKpi(1, 45, 38);
  const knownC = mkKpi(2, 145, 132);
  const basket = mkKpi(3, 15, 19, " EUR", false);

  return (
    <>
      <div className="section">
        <div className="section-title" style={{ justifyContent: "space-between" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            Revenue vs peers
            <InfoTip text={`Benchmark based on ${peersCount} peers within a 2 km radius and the same average basket bracket. Bars compare your revenue to the peer average so you can see how you trend against similar stores.`} />
          </span>
          <span className="bench-legend">
            <span><span className="legend-dot" style={{ background: "var(--navy)" }} />Your store</span>
            <span><span className="legend-dot" style={{ background: "var(--green)" }} />Peers (avg)</span>
          </span>
        </div>
        <div className="section-subtle">{peersCount} peers · 2 km radius · same avg basket bracket</div>
        <div className="bench-totals">
          <div>
            <div className="bench-total-value">{fmtEUR(totalMine)}</div>
            <div className="bench-total-caption">Your store</div>
          </div>
          <div>
            <div className="bench-total-value muted">{fmtEUR(totalPeers)}</div>
            <div className="bench-total-caption">Peers (avg)</div>
          </div>
        </div>

        <div className="chart-area">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            style={{ width: "100%", height: 220 }}
            role="img"
            aria-label="Revenue vs peers"
            onMouseLeave={() => setHover(null)}
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
                return <text key={i} x={40} y={y}>{Math.round(t).toLocaleString()}</text>;
              })}
            </g>
            {pairs.map((p, i) => {
              const hMine = (p.mine / max) * usableH;
              const hPeer = (p.peers / max) * usableH;
              const cx = left + slot * i + slot / 2;
              const xMine = cx - barW - 1;
              const xPeer = cx + 1;
              const isHover = hover === i;
              return (
                <g key={p.label + i}>
                  <rect x={xMine} y={baseY - hMine} width={barW} height={hMine} rx={3}
                    fill={isHover ? "#C7EBF7" : "var(--navy)"} />
                  <rect x={xPeer} y={baseY - hPeer} width={barW} height={hPeer} rx={3}
                    fill={isHover ? "#A8E8B8" : "var(--green)"} opacity={isHover ? 1 : 0.85} />
                  {/* invisible hit area */}
                  <rect
                    x={left + slot * i}
                    y={topY}
                    width={slot}
                    height={baseY - topY}
                    fill="transparent"
                    onMouseEnter={() => setHover(i)}
                  />
                </g>
              );
            })}
            <g fontSize="10" fill="#5F5E5A" fontFamily="Inter, sans-serif" textAnchor="middle">
              {pairs.map((p, i) =>
                i % labelStride === 0 ? (
                  <text key={p.label + i} x={left + slot * i + slot / 2} y={190}>{p.label}</text>
                ) : null
              )}
            </g>
            {hover !== null && pairs[hover] && (() => {
              const p = pairs[hover];
              const hMine = (p.mine / max) * usableH;
              const hPeer = (p.peers / max) * usableH;
              const cx = left + slot * hover + slot / 2;
              const labelPrefix = mode === "daily" ? `${p.label} — ` : "";
              const line1 = `You ${fmtEUR(p.mine)}`;
              const line2 = `Peers ${fmtEUR(p.peers)}`;
              const headLen = labelPrefix.length;
              const tw = Math.max(120, (Math.max(line1.length, line2.length) + headLen) * 6.6 + 24);
              const th = mode === "daily" ? 56 : 44;
              const tipH = 6;
              const topBar = baseY - Math.max(hMine, hPeer);
              const ty = Math.max(2, topBar - tipH - th - 4);
              const tx = Math.min(Math.max(cx - tw / 2, 2), chartW - tw - 2);
              const triBaseY = ty + th;
              const triCx = Math.min(Math.max(cx, tx + 12), tx + tw - 12);
              return (
                <g pointerEvents="none">
                  <rect x={tx + 3} y={ty + 4} width={tw} height={th} rx={4} fill="rgba(26,31,60,0.18)" />
                  <polygon
                    points={`${triCx - 6 + 3},${triBaseY + 4} ${triCx + 6 + 3},${triBaseY + 4} ${triCx + 3},${triBaseY + tipH + 4}`}
                    fill="rgba(26,31,60,0.18)"
                  />
                  <rect x={tx} y={ty} width={tw} height={th} rx={4} fill="var(--navy)" />
                  <polygon
                    points={`${triCx - 6},${triBaseY} ${triCx + 6},${triBaseY} ${triCx},${triBaseY + tipH}`}
                    fill="var(--navy)"
                  />
                  {mode === "daily" && (
                    <text x={tx + 12} y={ty + 16} fontSize="11" fontWeight="500" fill="#C7EBF7" fontFamily="Inter, sans-serif">
                      {p.label}
                    </text>
                  )}
                  <text x={tx + 12} y={ty + (mode === "daily" ? 32 : 18)} fontSize="12" fontWeight="600" fill="#FFFFFF" fontFamily="Inter, sans-serif">
                    <tspan fill="#C7EBF7">You </tspan>{fmtEUR(p.mine)}
                  </text>
                  <text x={tx + 12} y={ty + (mode === "daily" ? 48 : 34)} fontSize="12" fontWeight="600" fill="#FFFFFF" fontFamily="Inter, sans-serif">
                    <tspan fill="#A8E8B8">Peers </tspan>{fmtEUR(p.peers)}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      <div className="bench-kpi-grid">
        <BenchKpi label="New clients" mine={newC.mine} peer={newC.peer} dMine={newC.dMine} dPeer={newC.dPeer} />
        <BenchKpi label="Known clients" mine={knownC.mine} peer={knownC.peer} dMine={knownC.dMine} dPeer={knownC.dPeer} />
        <BenchKpi label="Average basket" mine={basket.mine} peer={basket.peer} dMine={basket.dMine} dPeer={basket.dPeer} />
      </div>

      <div className="info-banner">
        <i className="ti ti-info-circle" />
        <p>Benchmark based on {peersCount} peers within 2 km, same average basket range. High confidence.</p>
      </div>
    </>
  );
}

function BenchKpi({
  label, mine, peer, dMine, dPeer,
}: {
  label: string;
  mine: string; peer: string;
  dMine: { cls: "up" | "down" | "flat"; label: string };
  dPeer: { cls: "up" | "down" | "flat"; label: string };
}) {
  return (
    <div className="section bench-kpi">
      <div className="bench-kpi-label">{label}</div>
      <div className="bench-kpi-split">
        <div className="bench-kpi-block">
          <div className="bench-kpi-value">{mine}</div>
          <div className="bench-kpi-caption">Your store</div>
          <div className={`delta ${dMine.cls}`}>{dMine.label}</div>
        </div>
        <div className="bench-kpi-block divider">
          <div className="bench-kpi-value muted">{peer}</div>
          <div className="bench-kpi-caption">Peer avg</div>
          <div className={`delta ${dPeer.cls}`}>{dPeer.label}</div>
        </div>
      </div>
    </div>
  );
}

function SectorHealthTab({ year, month, product }: { year: Year; month: Month; product: Product }) {
  const seed = hash(`sector|${year}|${month}|${product}`);
  const yearMult = year === "2023" ? 0.55 : year === "2024" ? 0.7 : year === "2025" ? 0.85 : 1;

  // Build 4-quarter rolling trend (you vs sector avg)
  const quarters = ["Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026"];
  const trend = quarters.map((q, i) => {
    const mine = Math.round((95 + rand(seed, i + 1) * 25) * yearMult);
    const sector = Math.round((100 - i * 8 + rand(seed, 30 + i) * 6) * yearMult);
    return { label: q, mine, sector };
  });

  // Sector volume change (current vs previous) — drives the banner
  const sectorChange = Math.round((-4 - rand(seed, 80) * 8) * (product === "Eco" ? 0.5 : 1));
  const yourChange = Math.round(sectorChange + 4 + rand(seed, 81) * 6); // outperform
  const gapPts = yourChange - sectorChange;

  const rank = 8 + Math.floor(rand(seed, 90) * 25);
  const rankMoved = 2 + Math.floor(rand(seed, 91) * 6);
  const merchants = 1100 + Math.floor(rand(seed, 92) * 300);
  const merchantsChange = -(1 + Math.floor(rand(seed, 93) * 5));
  const avgBasket = 14 + Math.floor(rand(seed, 94) * 7);
  const basketChange = (rand(seed, 95) * 3).toFixed(1);

  const sectors = [
    { name: "Restaurants", delta: sectorChange },
    { name: "Pharmacy", delta: -1 },
    { name: "Coffee shops", delta: 4 },
    { name: "Grocery", delta: 11 },
    { name: "Books and media", delta: 2 },
  ];
  const maxAbs = Math.max(...sectors.map((s) => Math.abs(s.delta)), 1);

  const regions = [
    { name: "Antwerp", caption: "Restaurants sector", delta: -6 },
    { name: "Ghent", caption: "Restaurants sector", delta: -4 },
    { name: "Liège", caption: "Restaurants sector", delta: 2 },
    { name: "Charleroi", caption: "Restaurants sector", delta: 0 },
  ];

  const max = Math.max(...trend.flatMap((t) => [t.mine, t.sector]), 1);
  const min = Math.min(...trend.flatMap((t) => [t.mine, t.sector]), 0);
  const chartW = 680;
  const chartH = 220;
  const left = 48;
  const topY = 50;
  const baseY = 175;
  const usableH = baseY - topY;
  const innerW = chartW - left - 16;
  const xAt = (i: number) => left + (innerW / (trend.length - 1)) * i;
  const yAt = (v: number) => baseY - ((v - min) / (max - min || 1)) * usableH;
  const ticks = [max, max * 0.66 + min * 0.34, max * 0.33 + min * 0.67, min];

  const pointsMine = trend.map((t, i) => `${xAt(i)},${yAt(t.mine)}`).join(" ");
  const pointsSector = trend.map((t, i) => `${xAt(i)},${yAt(t.sector)}`).join(" ");

  const sign = (n: number) => (n > 0 ? `+${n}%` : `${n}%`);
  const deltaCls = (n: number) => (n > 0 ? "up" : n < 0 ? "down" : "flat");

  return (
    <>
      {/* Sector contraction banner */}
      <div className="sector-banner danger">
        <div className="sector-banner-icon"><i className="ti ti-trending-down" /></div>
        <div className="sector-banner-body">
          <div className="sector-banner-title">
            Restaurant voucher volume in Brussels is down {Math.abs(sectorChange)}% this quarter
          </div>
          <div className="sector-banner-desc">
            The sector is contracting. Your performance should be read in that context.
          </div>
        </div>
        <div className="sector-banner-metric">
          <div className="sector-banner-value">{sectorChange}%</div>
          <div className="sector-banner-caption">vs previous quarter</div>
        </div>
      </div>

      {/* 4 KPI cards */}
      <div className="sector-kpi-grid">
        <div className="section sector-kpi">
          <div className="bench-kpi-label">Your volume change</div>
          <div className="bench-kpi-value">{sign(yourChange)}</div>
          <div className="bench-kpi-caption">vs last quarter</div>
          <div className="delta up" style={{ marginTop: 6 }}>Outperforming sector by {gapPts} pts</div>
        </div>
        <div className="section sector-kpi">
          <div className="bench-kpi-label">Your volume rank</div>
          <div className="bench-kpi-value">Top {rank}%</div>
          <div className="bench-kpi-caption">Brussels restaurants</div>
          <div className="delta up" style={{ marginTop: 6 }}>↗ Up {rankMoved} places</div>
        </div>
        <div className="section sector-kpi">
          <div className="bench-kpi-label">Active merchants</div>
          <div className="bench-kpi-value">{merchants.toLocaleString("fr-FR")}</div>
          <div className="bench-kpi-caption">In your sector</div>
          <div className="delta down" style={{ marginTop: 6 }}>↘ {merchantsChange}% vs prev. quarter</div>
        </div>
        <div className="section sector-kpi">
          <div className="bench-kpi-label">Sector avg basket</div>
          <div className="bench-kpi-value">{avgBasket} EUR</div>
          <div className="bench-kpi-caption">Brussels restaurants</div>
          <div className="delta up" style={{ marginTop: 6 }}>↗ +{basketChange}%</div>
        </div>
      </div>

      {/* Trend chart */}
      <div className="section">
        <div className="section-title" style={{ justifyContent: "space-between" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            Voucher volume trend
            <InfoTip text="4 quarters rolling. Compares your store's volume index against the sector average for Brussels restaurants. Baseline = 100." />
          </span>
          <span className="bench-legend">
            <span><span className="legend-dot" style={{ background: "var(--navy)" }} />Your store</span>
            <span><span className="legend-dot legend-dot-dashed" />Sector avg</span>
          </span>
        </div>
        <div className="section-subtle">Your store vs sector average · 4 quarters rolling</div>

        <div className="chart-area" style={{ marginTop: 12 }}>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: 220 }} role="img" aria-label="Voucher volume trend">
            <g stroke="rgba(26,31,60,0.08)" strokeWidth="0.5">
              {ticks.map((_, i) => {
                const y = topY + (usableH * i) / 3;
                return <line key={i} x1={left} y1={y} x2={chartW - 8} y2={y} />;
              })}
            </g>
            <g fontSize="9.5" fill="#9B9A95" fontFamily="Inter, sans-serif" textAnchor="end">
              {ticks.map((t, i) => {
                const y = topY + (usableH * i) / 3 + 4;
                return <text key={i} x={40} y={y}>{Math.round(t)}</text>;
              })}
            </g>

            {/* Sector line (dashed, red/amber) */}
            <polyline fill="none" stroke="#C0392B" strokeWidth="2" strokeDasharray="5 4" points={pointsSector} />
            {trend.map((t, i) => (
              <circle key={`s${i}`} cx={xAt(i)} cy={yAt(t.sector)} r={3.5} fill="#C0392B" />
            ))}

            {/* Your line (navy solid) */}
            <polyline fill="none" stroke="var(--navy)" strokeWidth="2.5" points={pointsMine} />
            {trend.map((t, i) => (
              <circle key={`m${i}`} cx={xAt(i)} cy={yAt(t.mine)} r={4} fill="var(--navy)" />
            ))}

            <g fontSize="10" fill="#5F5E5A" fontFamily="Inter, sans-serif" textAnchor="middle">
              {trend.map((t, i) => (
                <text key={t.label} x={xAt(i)} y={baseY + 22}>{t.label}</text>
              ))}
            </g>

            {/* Outperform badge near last point */}
            {(() => {
              const last = trend[trend.length - 1];
              const x = Math.min(xAt(trend.length - 1) - 110, chartW - 8 - 104);
              const y = Math.max(2, yAt(last.mine) - 44);
              return (
                <g>
                  <rect x={x} y={y} width={104} height={36} rx={6}
                    fill="rgba(30,215,96,0.14)" stroke="var(--green-dark)" strokeWidth="0.5" />
                  <text x={x + 52} y={y + 15} fontSize="10.5" fontWeight="600" fill="#176A2C" fontFamily="Inter, sans-serif" textAnchor="middle">
                    You: {sign(yourChange)}
                  </text>
                  <text x={x + 52} y={y + 28} fontSize="10" fill="#176A2C" fontFamily="Inter, sans-serif" textAnchor="middle">
                    Sector: {sign(sectorChange)}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Two-column: sector breakdown + neighbouring regions */}
      <div className="sector-two-col">
        <div className="section">
          <div className="section-title" style={{ marginBottom: 12 }}>
            <i className="ti ti-list-details" style={{ fontSize: 16, color: "var(--text-secondary)" }} />
            Sector breakdown · Brussels
          </div>
          {sectors.map((s) => (
            <div className="sector-row" key={s.name}>
              <span className="sector-name">{s.name}</span>
              <div className="sector-bar-wrap">
                <div
                  className={`sector-bar ${s.delta >= 0 ? "pos" : "neg"}`}
                  style={{ width: `${Math.max(6, (Math.abs(s.delta) / maxAbs) * 100)}%` }}
                />
              </div>
              <span className={`sector-delta ${deltaCls(s.delta)}`}>{sign(s.delta)}</span>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="section-title" style={{ marginBottom: 12 }}>
            <i className="ti ti-map-pin" style={{ fontSize: 16, color: "var(--text-secondary)" }} />
            Neighbouring regions
          </div>
          {regions.map((r) => (
            <div className="region-row" key={r.name}>
              <div>
                <div className="region-name">{r.name}</div>
                <div className="region-caption">{r.caption}</div>
              </div>
              <div className={`region-delta ${deltaCls(r.delta)}`}>{sign(r.delta)}</div>
            </div>
          ))}
          <div className="region-row last">
            <div>
              <div className="region-name">National average</div>
              <div className="region-caption">Belgium · all restaurants</div>
            </div>
            <div className="region-delta down">-3%</div>
          </div>
        </div>
      </div>

      {/* Insight card */}
      <div className="insight-card">
        <div className="insight-icon"><i className="ti ti-bulb" /></div>
        <div>
          <div className="insight-title">You are outperforming your sector</div>
          <div className="insight-desc">
            While Brussels restaurants lost {Math.abs(sectorChange)}% in volume, you only changed by {sign(yourChange)}.
            You are gaining relative share in a contracting market. Consider locking in loyal customers
            before the sector recovers and competition tightens.
          </div>
        </div>
      </div>

      <div className="info-banner">
        <i className="ti ti-info-circle" />
        <p>Sector data aggregated from {merchants.toLocaleString("fr-FR")} active merchants in the Brussels restaurants sector. Updated weekly.</p>
      </div>
    </>
  );
}

function ForecastTab({ year, month, store }: { year: string; month: string; store: Store }) {
  const [scenario, setScenario] = useState<"Conservative" | "Base" | "Optimistic">("Base");
  const [horizon, setHorizon] = useState<"4 weeks" | "8 weeks" | "12 weeks">("8 weeks");

  // Deterministic mock based on filters
  const seed = (year + "|" + month + "|" + store + "|" + horizon).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (i: number, lo: number, hi: number) => {
    const x = Math.sin(seed * 9301 + i * 49297) * 23380;
    const f = x - Math.floor(x);
    return Math.round(lo + f * (hi - lo));
  };
  const scenarioMult = scenario === "Optimistic" ? 1.12 : scenario === "Conservative" ? 0.88 : 1;
  const storeMult = STORE_WEIGHTS[store];
  const thisWeek = Math.round(r(1, 7400, 9800) * scenarioMult * storeMult);
  const peak = Math.round(r(2, 10400, 12600) * scenarioMult * storeMult);
  const peakWk = r(3, 1, 4);
  const trough = Math.round(r(4, 5800, 7400) * scenarioMult * storeMult);
  const troughWk = r(5, 5, 8);
  const projected = Math.round(r(6, 95000, 145000) * scenarioMult * storeMult);
  const horizonWeeks = horizon === "4 weeks" ? 4 : horizon === "12 weeks" ? 12 : 8;
  const fmt = (n: number) => `${n.toLocaleString("fr-FR").replace(/\u202f/g, " ")} EUR`;

  // ----- Build chart points procedurally based on horizonWeeks -----
  const PAST = 5;
  const totalPts = PAST + 1 + horizonWeeks; // past + now + forecast
  const X0 = 44;
  const X1 = 758;
  const step = (X1 - X0) / (totalPts - 1);
  const xAt = (i: number) => X0 + i * step;
  // y mapping: value EUR -> y in [14..212]
  const yAt = (v: number) => 212 - ((v - 4000) / 9000) * 198;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // Deterministic noise per (seed, horizon)
  const noise = (i: number, amp: number) => {
    const x = Math.sin(seed * 131 + i * 977) * 10000;
    return (x - Math.floor(x) - 0.5) * 2 * amp;
  };

  // Actuals: 5 past + now (index 0..5)
  const actualVals: number[] = [];
  for (let i = 0; i <= PAST; i++) {
    actualVals.push(clamp(8800 + noise(i, 700) + i * 60, 5500, 12500));
  }
  const nowVal = actualVals[PAST];

  // Forecast central curve (one point per future week), with gentle wave
  const baseFc: number[] = [];
  for (let i = 1; i <= horizonWeeks; i++) {
    const wave = Math.sin(i / Math.max(2, horizonWeeks / 3)) * 1400;
    baseFc.push(clamp(nowVal + wave + noise(100 + i, 600) + i * 20, 4800, 12800));
  }
  // Band half-width grows with horizon
  const bandHalf = (i: number) => 600 + i * 110;

  // Scenario offset on the dotted center line
  const scenShift = scenario === "Optimistic" ? 1 : scenario === "Conservative" ? -1 : 0;
  const centerVals = baseFc.map((v, idx) => v + scenShift * bandHalf(idx + 1));

  // Build SVG paths
  const toPath = (pts: [number, number][]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

  const actualPts: [number, number][] = actualVals.map((v, i) => [xAt(i), yAt(v)]);
  const forecastPts: [number, number][] = [
    [xAt(PAST), yAt(nowVal)],
    ...centerVals.map((v, i) => [xAt(PAST + 1 + i), yAt(v)] as [number, number]),
  ];
  const forecastDots: [number, number][] = centerVals.map((v, i) => [xAt(PAST + 1 + i), yAt(v)]);

  // Confidence band polygon
  const upperPts: [number, number][] = [
    [xAt(PAST), yAt(nowVal)],
    ...baseFc.map((v, i) => [xAt(PAST + 1 + i), yAt(v + bandHalf(i + 1))] as [number, number]),
  ];
  const lowerPtsAsc: [number, number][] = [
    [xAt(PAST), yAt(nowVal)],
    ...baseFc.map((v, i) => [xAt(PAST + 1 + i), yAt(v - bandHalf(i + 1))] as [number, number]),
  ];
  const lowerPts: [number, number][] = [...lowerPtsAsc].reverse();
  const bandPath = `${toPath(upperPts)} ${toPath(lowerPts).replace(/^M/, "L")} Z`;

  const actualPath = toPath(actualPts);
  const forecastPath = toPath(forecastPts);
  const todayX = xAt(PAST);

  // X axis labels
  const xLabels: { x: number; label: string }[] = [];
  for (let i = 0; i < totalPts; i++) {
    const offset = i - PAST;
    const label = offset === 0 ? "Now" : offset < 0 ? `Wk ${offset}` : `Wk +${offset}`;
    xLabels.push({ x: xAt(i), label });
  }

  // Signal zones (proportional to horizon)
  const sigGreen1 = horizonWeeks >= 2 ? { x: xAt(PAST + 1) - step / 2, w: step * Math.min(2, horizonWeeks) } : null;
  const sigRed = horizonWeeks >= 6 ? { x: xAt(PAST + 5) - step / 2, w: step * Math.min(2, horizonWeeks - 4) } : null;
  const sigGreen2 = horizonWeeks >= 8 ? { x: xAt(PAST + 7) - step / 2, w: step * Math.min(2, horizonWeeks - 6) } : null;

  return (
    <>
      {/* Filter row */}
      <div className="forecast-filter-row">
        <div className="forecast-filter-group">
          <span className="forecast-filter-label">Horizon</span>
          <Dropdown
            value={horizon}
            options={["4 weeks", "8 weeks", "12 weeks"] as const}
            onChange={(v) => setHorizon(v as typeof horizon)}
            icon="ti-calendar"
          />
        </div>
        <div className="forecast-filter-group">
          <span className="forecast-filter-label">Scenario</span>
          <div className="scenario-toggle">
            {(["Conservative", "Base", "Optimistic"] as const).map((s) => (
              <button
                key={s}
                type="button"
                className={scenario === s ? "active" : ""}
                onClick={() => setScenario(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }} />
      </div>

      {/* KPI cards */}
      <div className="kpi-grid-4">
        <div className="kpi-card">
          <p className="kpi-label">This week actual</p>
          <p className="kpi-value">{fmt(thisWeek)}</p>
          <p className="kpi-caption">Wk 18 · in progress</p>
        </div>
        <div className="kpi-card highlight-success">
          <p className="kpi-label">Forecast peak</p>
          <p className="kpi-value text-success">{fmt(peak)}</p>
          <p className="kpi-caption">Wk +{peakWk} · budget load</p>
        </div>
        <div className="kpi-card highlight-danger">
          <p className="kpi-label">Forecast trough</p>
          <p className="kpi-value text-danger">{fmt(trough)}</p>
          <p className="kpi-caption">Wk +{troughWk} · sector contraction</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Projected total</p>
          <p className="kpi-value">{fmt(projected)}</p>
          <p className="kpi-caption">Next {horizonWeeks} weeks · {store}{month !== "All months" ? ` · ${month} ${year}` : ` · ${year}`}</p>
        </div>
      </div>

      {/* Revenue projection chart */}
      <div className="forecast-chart-card">
        <div className="forecast-chart-header">
          <div>
            <p className="forecast-chart-title">Revenue projection</p>
            <p className="forecast-chart-subtitle">Actual + {horizonWeeks}-week forecast · {scenario.toLowerCase()} scenario · {store}</p>
          </div>
          <div className="forecast-legend">
            <span><span className="legend-line" />Actual</span>
            <span><span className="legend-line dashed" />Forecast</span>
            <span><span className="legend-swatch" style={{ background: "rgba(79,195,217,0.25)" }} />Range</span>
            <span><span className="legend-swatch" style={{ background: "rgba(30,215,96,0.25)" }} />Signal</span>
          </div>
        </div>

        <svg viewBox="0 0 760 240" style={{ width: "100%", height: 240 }} role="img" aria-label="Revenue projection">
          <defs>
            <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4FC3D9" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#4FC3D9" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="sigGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1ED760" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#1ED760" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="sigRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D0312D" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#D0312D" stopOpacity="0.02" />
            </linearGradient>
            <clipPath id="chartClip">
              <rect x="44" y="10" width="714" height="205" />
            </clipPath>
          </defs>

          {/* Y axis labels */}
          <g fontSize="9" fill="#8A8AAA" fontFamily="Inter,sans-serif" textAnchor="end">
            {["€13k","€12k","€11k","€10k","€9k","€8k","€7k","€6k","€5k","€4k"].map((l, i) => (
              <text key={l} x={40} y={22 + i * 21}>{l}</text>
            ))}
          </g>

          {/* Grid */}
          <g stroke="#EBEBF5" strokeWidth="0.5">
            {Array.from({ length: 10 }, (_, i) => (
              <line key={i} x1="44" y1={21 + i * 21} x2="758" y2={21 + i * 21} />
            ))}
          </g>

          {/* Signal zones */}
          {sigGreen1 && <rect x={sigGreen1.x} y="14" width={sigGreen1.w} height="198" fill="url(#sigGreen)" clipPath="url(#chartClip)" />}
          {sigRed && <rect x={sigRed.x} y="14" width={sigRed.w} height="198" fill="url(#sigRed)" clipPath="url(#chartClip)" />}
          {sigGreen2 && <rect x={sigGreen2.x} y="14" width={sigGreen2.w} height="198" fill="url(#sigGreen)" clipPath="url(#chartClip)" />}

          {/* Confidence band */}
          <path clipPath="url(#chartClip)" d={bandPath} fill="url(#bandFill)" />

          {/* Today line */}
          <line x1={todayX} y1="14" x2={todayX} y2="212" stroke="#1A1D3B" strokeWidth="1" strokeDasharray="4 3" />
          <text x={todayX + 4} y="12" fontSize="9" fill="#1A1D3B" fontFamily="Inter,sans-serif" fontWeight="600">today</text>

          {/* Actual line (navy solid) */}
          <path
            fill="none"
            stroke="#1A1D3B"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            d={actualPath}
          />
          {actualPts.map(([x, y], i) => (
            <circle key={`a${i}`} cx={x} cy={y} r="3.5" fill="#1A1D3B" stroke="white" strokeWidth="1.5" />
          ))}

          {/* Forecast line (cyan dashed) */}
          <path
            fill="none"
            stroke="#4FC3D9"
            strokeWidth="2.2"
            strokeDasharray="6 3"
            strokeLinecap="round"
            d={forecastPath}
          />
          {forecastDots.map(([x, y], i) => (
            <rect key={`f${i}`} x={x - 4} y={y - 4} width="8" height="8" rx="2" fill="#4FC3D9" stroke="white" strokeWidth="1.5" />
          ))}

          {/* X axis labels */}
          <g fontSize="9.5" fill="#4A4A6A" fontFamily="Inter,sans-serif" textAnchor="middle">
            {xLabels.map((l) => (
              <text key={l.label} x={l.x} y="225">{l.label}</text>
            ))}
          </g>
        </svg>
      </div>



      {/* Signals + Scenarios */}
      <div className="two-col-forecast">
        <div className="fcard">
          <div className="fcard-title"><i className="ti ti-calendar-event" />Upcoming signals</div>

          <div className="signal-item">
            <div className="signal-icon up"><i className="ti ti-trending-up" /></div>
            <div style={{ flex: 1 }}>
              <p className="signal-week">Wk +2 · Budget load week</p>
              <p className="signal-desc">Top employers in your area typically load meal vouchers this week. Expect +20-30% footfall.</p>
              <div className="signal-tags">
                <span className="signal-tag positive">+27% historical lift</span>
                <span className="signal-away">10 days away</span>
              </div>
            </div>
          </div>

          <div className="signal-item">
            <div className="signal-icon down"><i className="ti ti-trending-down" /></div>
            <div style={{ flex: 1 }}>
              <p className="signal-week">Wk +6 · Sector contraction</p>
              <p className="signal-desc">Restaurant voucher volume in Brussels typically dips this period. Sector down ~9% historically.</p>
              <div className="signal-tags">
                <span className="signal-tag negative">-9% sector pattern</span>
                <span className="signal-away">38 days away</span>
              </div>
            </div>
          </div>

          <div className="signal-item">
            <div className="signal-icon up"><i className="ti ti-trending-up" /></div>
            <div style={{ flex: 1 }}>
              <p className="signal-week">Wk +8 · End of month payroll</p>
              <p className="signal-desc">Mid-cycle voucher reload from primary employers in your catchment area.</p>
              <div className="signal-tags">
                <span className="signal-tag positive">+12% historical lift</span>
                <span className="signal-away">52 days away</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fcard">
          <div className="fcard-title"><i className="ti ti-adjustments-horizontal" />Scenarios</div>

          {([
            { name: "Conservative", color: "#D0312D", desc: "Assumes weak budget load, stronger contraction", value: "108 200 EUR" },
            { name: "Base", color: "#1A1D3B", desc: "Based on 12 months of your trends and sector patterns", value: "120 940 EUR" },
            { name: "Optimistic", color: "#1ED760", desc: "Strong budget load, mild contraction", value: "134 500 EUR" },
          ] as const).map((s) => {
            const selected = scenario === s.name;
            return (
              <div
                key={s.name}
                className="scenario-item"
                style={selected ? { background: "rgba(26,29,59,0.04)", margin: "0 -8px", padding: "10px 8px", borderRadius: 6 } : undefined}
              >
                <div className="scenario-left">
                  <div className="scenario-dot" style={{ background: s.color }} />
                  <div>
                    <div className="scenario-name">
                      {s.name}
                      {selected && <span className="selected-badge">Selected</span>}
                    </div>
                    <p className="scenario-desc">{s.desc}</p>
                  </div>
                </div>
                <div className="scenario-value">{s.value}</div>
              </div>
            );
          })}

          <div className="scenario-note">
            <i className="ti ti-info-circle" />
            Confidence band shown on chart (±8% at week +1, ±18% at week +8).
          </div>
        </div>
      </div>

      {/* Insight banner */}
      <div className="insight-card">
        <div className="insight-icon"><i className="ti ti-bulb" /></div>
        <div>
          <div className="insight-title">Plan ahead for next month</div>
          <div className="insight-desc">
            Your peak is in 10 days (budget load week). Ensure stock and staff are ready. After that, expect a 4-week soft period before recovery. This is the right window to plan a promotion or run a campaign to smooth the trough.
          </div>
        </div>
      </div>

      <div className="footer-note">
        <i className="ti ti-info-circle" />
        Forecast based on 12 months of your store history, Brussels restaurants sector patterns, and known employer benefit cycles. Confidence widens with horizon.
      </div>
    </>
  );
}

// ============================================================
// Comparison tab
// ============================================================
const PERIOD_OPTIONS = [
  "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025",
  "Q1 2026", "Q2 2026",
] as const;
type PeriodOpt = (typeof PERIOD_OPTIONS)[number];

function ComparisonTab({ year, month, store }: { year: string; month: string; store: Store }) {
  const [periodA, setPeriodA] = useState<PeriodOpt>("Q3 2025");
  const [periodB, setPeriodB] = useState<PeriodOpt>("Q4 2025");
  const [quick, setQuick] = useState<"Last quarter" | "Year over year" | "Custom">("Custom");

  const handleQuick = (q: typeof quick) => {
    setQuick(q);
    if (q === "Last quarter") { setPeriodA("Q3 2025"); setPeriodB("Q4 2025"); }
    else if (q === "Year over year") { setPeriodA("Q1 2025"); setPeriodB("Q1 2026"); }
  };

  const storeMult = STORE_WEIGHTS[store];
  const seed = hash(`cmp|${year}|${month}|${store}|${periodA}|${periodB}`);
  const r = (i: number, lo: number, hi: number) => {
    const v = rand(seed, i);
    return lo + v * (hi - lo);
  };

  const revA = Math.round(r(1, 44000, 52000) * storeMult);
  const revB = Math.round(r(2, 38000, 46000) * storeMult);
  const diff = revB - revA;
  const pct = (diff / revA) * 100;
  const sectorPct = -9 + (r(3, -1.5, 1.5));

  const txA = Math.round(r(4, 2900, 3400) * storeMult);
  const txB = Math.round(r(5, 2600, 3100) * storeMult);
  const basketA = revA / Math.max(1, txA);
  const basketB = revB / Math.max(1, txB);
  const newA = Math.round(r(6, 120, 165) * storeMult);
  const newB = Math.round(r(7, 80, 120) * storeMult);
  const knownA = Math.round(r(8, 380, 440) * storeMult);
  const knownB = Math.round(r(9, 400, 460) * storeMult);

  const pctDelta = (a: number, b: number) => ((b - a) / Math.max(1, a)) * 100;
  const fmtPct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

  // Build chart values per week (Wk1..Wk6) for A and B
  const weeksA = Array.from({ length: 6 }, (_, i) => r(20 + i, 5800, 9200) * storeMult);
  const weeksB = Array.from({ length: 6 }, (_, i) => r(30 + i, 5000, 8200) * storeMult);
  const all = [...weeksA, ...weeksB];
  const vMin = Math.min(...all) * 0.9;
  const vMax = Math.max(...all) * 1.05;
  const yAt = (v: number) => 20 + ((vMax - v) / (vMax - vMin)) * 135;
  const xAt = (i: number) => 100 + i * 100;
  const ptsA = weeksA.map((v, i) => `${xAt(i)},${yAt(v).toFixed(1)}`).join(" ");
  const ptsB = weeksB.map((v, i) => `${xAt(i)},${yAt(v).toFixed(1)}`).join(" ");

  return (
    <>
      {/* Period selector */}
      <div className="period-selector">
        <div className="period-block period-a">
          <p className="period-label">Period A</p>
          <Dropdown value={periodA} options={PERIOD_OPTIONS} onChange={(v) => { setPeriodA(v as PeriodOpt); setQuick("Custom"); }} icon="ti-calendar" />
        </div>
        <div className="period-vs">vs</div>
        <div className="period-block period-b">
          <p className="period-label">Period B</p>
          <Dropdown value={periodB} options={PERIOD_OPTIONS} onChange={(v) => { setPeriodB(v as PeriodOpt); setQuick("Custom"); }} icon="ti-calendar" />
        </div>
        <div className="period-quick">
          {(["Last quarter", "Year over year", "Custom"] as const).map((q) => (
            <button key={q} type="button" className={`quick-btn${quick === q ? " active" : ""}`} onClick={() => handleQuick(q)}>{q}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid-4">
        <div className="kpi-card">
          <p className="kpi-label">Period A total</p>
          <p className="kpi-value">{fmtEUR(revA)}</p>
          <p className="kpi-caption">{periodA}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Period B total</p>
          <p className="kpi-value">{fmtEUR(revB)}</p>
          <p className="kpi-caption">{periodB}</p>
        </div>
        <div className={`kpi-card ${pct < 0 ? "highlight-danger" : "highlight-success"}`}>
          <p className="kpi-label">Your change</p>
          <p className={`kpi-value ${pct < 0 ? "text-danger" : "text-success"}`}>{fmtPct(pct)}</p>
          <p className="kpi-caption">{diff > 0 ? "+" : ""}{fmtEUR(diff)}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Sector change</p>
          <p className="kpi-value kpi-value-muted">{fmtPct(sectorPct)}</p>
          <p className="kpi-caption">Brussels restaurants</p>
        </div>
      </div>

      {/* Weekly revenue chart */}
      <div className="cmp-card">
        <div className="cmp-card-header">
          <div>
            <p className="cmp-card-title">Weekly revenue</p>
            <p className="cmp-card-subtitle">Period A vs Period B · sector event marked</p>
          </div>
          <div className="cmp-legend">
            <span><span className="legend-dot" style={{ background: "var(--navy)" }} />Period A</span>
            <span><span className="legend-dot dashed" style={{ borderColor: "var(--green-dark)" }} />Period B</span>
            <span><span className="legend-dot" style={{ background: "#E5A53A" }} />Sector event</span>
          </div>
        </div>

        <svg viewBox="0 0 640 220" style={{ width: "100%", height: 220 }} role="img" aria-label="Weekly revenue comparison">
          <g stroke="var(--border-light)" strokeWidth="0.5">
            {[20, 65, 110, 155].map((y) => <line key={y} x1="40" y1={y} x2="640" y2={y} />)}
          </g>
          <g fontSize="9" fill="var(--text-tertiary)" fontFamily="Inter,sans-serif" textAnchor="end">
            <text x="32" y="23">{Math.round(vMax / 1000)}k</text>
            <text x="32" y="68">{Math.round((vMax + vMin) / 2 / 1000 + 1)}k</text>
            <text x="32" y="113">{Math.round((vMax + vMin) / 2 / 1000)}k</text>
            <text x="32" y="158">{Math.round(vMin / 1000)}k</text>
          </g>

          {/* Sector event band Wk 4-5 */}
          <rect x="350" y="20" width="100" height="135" fill="#E5A53A" fillOpacity="0.16" />
          <line x1="350" y1="20" x2="350" y2="155" stroke="#BA7517" strokeWidth="0.5" strokeDasharray="3 2" />
          <line x1="450" y1="20" x2="450" y2="155" stroke="#BA7517" strokeWidth="0.5" strokeDasharray="3 2" />
          <text x="400" y="35" textAnchor="middle" fontSize="10" fill="#854F0B" fontWeight="500" fontFamily="Inter,sans-serif">Sector event</text>

          {/* Period A */}
          <polyline fill="none" stroke="var(--navy)" strokeWidth="2.2" points={ptsA} />
          {weeksA.map((v, i) => (
            <circle key={`a${i}`} cx={xAt(i)} cy={yAt(v)} r="4" fill="var(--navy)" />
          ))}

          {/* Period B */}
          <polyline fill="none" stroke="var(--green-dark)" strokeWidth="2.2" strokeDasharray="5 3" points={ptsB} />
          {weeksB.map((v, i) => (
            <circle key={`b${i}`} cx={xAt(i)} cy={yAt(v)} r="4" fill="var(--green-dark)" />
          ))}

          <g fontSize="9.5" fill="var(--text-secondary)" fontFamily="Inter,sans-serif" textAnchor="middle">
            {["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"].map((l, i) => (
              <text key={l} x={xAt(i)} y="180">{l}</text>
            ))}
          </g>
        </svg>
      </div>

      {/* Metric breakdown + Sector context */}
      <div className="cmp-two-col">
        <div className="cmp-card">
          <div className="section-title" style={{ marginBottom: 12 }}>
            <i className="ti ti-list-numbers" />Metric breakdown
          </div>
          <div className="cmp-metric-row cmp-metric-header">
            <span>Metric</span><span>Period A</span><span>Period B</span><span style={{ textAlign: "right" }}>Change</span>
          </div>
          {[
            { name: "Revenue", a: fmtEUR(revA), b: fmtEUR(revB), d: pctDelta(revA, revB) },
            { name: "Transactions", a: txA.toLocaleString("fr-FR"), b: txB.toLocaleString("fr-FR"), d: pctDelta(txA, txB) },
            { name: "Avg basket", a: `${basketA.toFixed(2)} EUR`, b: `${basketB.toFixed(2)} EUR`, d: pctDelta(basketA, basketB) },
            { name: "New clients", a: String(newA), b: String(newB), d: pctDelta(newA, newB) },
            { name: "Known clients", a: String(knownA), b: String(knownB), d: pctDelta(knownA, knownB) },
          ].map((m) => (
            <div className="cmp-metric-row" key={m.name}>
              <span className="cmp-metric-name">{m.name}</span>
              <span>{m.a}</span>
              <span>{m.b}</span>
              <span className={`cmp-metric-delta ${m.d < 0 ? "danger" : "success"}`}>{fmtPct(m.d)}</span>
            </div>
          ))}
        </div>

        <div className="cmp-card">
          <div className="section-title" style={{ marginBottom: 12 }}>
            <i className="ti ti-calendar-event" />Sector context
          </div>
          <div className="cmp-event-row">
            <div className="cmp-event-dot" style={{ background: "#BA7517" }} />
            <div>
              <p className="cmp-event-title">Wk 5 · Sector contraction</p>
              <p className="cmp-event-desc">Restaurant voucher volume in Brussels dropped 12% in week 3 of {periodB}. Sector-wide pattern, not isolated to your store.</p>
            </div>
          </div>
          <div className="cmp-event-row">
            <div className="cmp-event-dot" style={{ background: "var(--navy)" }} />
            <div>
              <p className="cmp-event-title">Wk 2 · Budget load week</p>
              <p className="cmp-event-desc">Top employers in your area loaded meal vouchers. Your Period B sales rose, but less than typical (+8% vs usual +20-30%).</p>
            </div>
          </div>
          <div className="cmp-event-row last">
            <div className="cmp-event-dot" style={{ background: "var(--green-dark)" }} />
            <div>
              <p className="cmp-event-title">Period B · Public holiday</p>
              <p className="cmp-event-desc">One additional bank holiday in Period B vs Period A. Likely contributes 2-3% of the revenue gap.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning insight */}
      {pct < sectorPct && (
        <div className="insight-card warning">
          <div className="insight-icon warning"><i className="ti ti-alert-triangle" /></div>
          <div>
            <div className="insight-title warning">Your decline outpaces the sector by {(sectorPct - pct).toFixed(1)} points</div>
            <div className="insight-desc warning">
              Brussels restaurants are down {Math.abs(sectorPct).toFixed(1)}% on average. You are down {Math.abs(pct).toFixed(1)}%. The bank holiday explains 2-3 points. The remaining gap is yours to investigate. New client acquisition ({fmtPct(pctDelta(newA, newB))}) is the largest contributor.
            </div>
          </div>
        </div>
      )}

      <div className="info-banner">
        <i className="ti ti-info-circle" />
        <p>Comparison is calculated on equivalent calendar weeks. Sector data sourced from 1,240 Brussels restaurants.</p>
      </div>
    </>
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

.section-subtle { font-size: 11.5px; color: var(--text-secondary); margin-top: 2px; }
.bench-legend { display: inline-flex; gap: 14px; font-size: 11.5px; color: var(--text-secondary); font-weight: 400; }
.bench-totals { display: flex; gap: 32px; margin: 12px 0 8px; }
.bench-total-value { font-size: 22px; font-weight: 600; color: var(--text-primary); line-height: 1.1; }
.bench-total-value.muted { color: var(--text-secondary); font-weight: 500; }
.bench-total-caption { font-size: 11.5px; color: var(--text-secondary); margin-top: 2px; }
.legend-dot { display: inline-block; width: 9px; height: 9px; border-radius: 2px; margin-right: 5px; vertical-align: middle; }

.bench-kpi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.bench-kpi { margin-bottom: 0; padding: 16px 18px; }
.bench-kpi-label { font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; }
.bench-kpi-split { display: flex; gap: 14px; }
.bench-kpi-block { flex: 1; }
.bench-kpi-block.divider { border-left: 0.5px solid var(--border); padding-left: 14px; }
.bench-kpi-value { font-size: 22px; font-weight: 600; color: var(--text-primary); line-height: 1.1; }
.bench-kpi-value.muted { color: var(--text-secondary); font-weight: 500; }
.bench-kpi-caption { font-size: 11.5px; color: var(--text-secondary); margin-top: 2px; }
.bench-kpi-block .delta { margin-top: 6px; }

.info-banner { display: flex; gap: 10px; align-items: flex-start; background: rgba(30,215,96,0.10); border: 0.5px solid rgba(30,215,96,0.30); border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 16px; }
.info-banner i { font-size: 16px; color: var(--green-dark); margin-top: 1px; }
.info-banner p { margin: 0; font-size: 12.5px; color: var(--navy); line-height: 1.5; }

/* Sector health */
.sector-banner { display: flex; gap: 14px; align-items: center; padding: 16px 18px; border-radius: var(--radius-lg); margin-bottom: 16px; }
.sector-banner.danger { background: rgba(208,49,45,0.08); border: 0.5px solid rgba(208,49,45,0.30); }
.sector-banner-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--white); display: flex; align-items: center; justify-content: center; color: #A32D2D; flex-shrink: 0; }
.sector-banner-icon i { font-size: 20px; }
.sector-banner-body { flex: 1; }
.sector-banner-title { font-size: 14px; font-weight: 600; color: #A32D2D; }
.sector-banner-desc { font-size: 12px; color: #791F1F; margin-top: 2px; }
.sector-banner-metric { text-align: right; flex-shrink: 0; }
.sector-banner-value { font-size: 22px; font-weight: 600; color: #A32D2D; line-height: 1.1; }
.sector-banner-caption { font-size: 11px; color: #791F1F; }

.sector-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.sector-kpi { margin-bottom: 0; padding: 16px 18px; }

.legend-dot-dashed { width: 18px !important; height: 0 !important; border-top: 2px dashed #C0392B; border-radius: 0 !important; margin-right: 5px; vertical-align: middle; }

.sector-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.sector-row { display: grid; grid-template-columns: 110px 1fr 52px; gap: 10px; align-items: center; padding: 9px 0; border-bottom: 0.5px solid var(--border); }
.sector-row:last-child { border-bottom: none; }
.sector-name { font-size: 12.5px; color: var(--text-primary); }
.sector-bar-wrap { height: 8px; background: rgba(26,31,60,0.06); border-radius: 999px; overflow: hidden; }
.sector-bar { height: 100%; border-radius: 999px; }
.sector-bar.pos { background: var(--green-dark); }
.sector-bar.neg { background: #C0392B; }
.sector-delta { font-size: 12px; font-weight: 600; text-align: right; }
.sector-delta.up { color: #2E7D32; }
.sector-delta.down { color: #C0392B; }
.sector-delta.flat { color: var(--text-secondary); }

.region-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 0.5px solid var(--border); }
.region-row.last { border-top: 0.5px solid rgba(26,31,60,0.18); border-bottom: none; margin-top: 4px; padding-top: 14px; }
.region-name { font-size: 13px; font-weight: 500; color: var(--text-primary); }
.region-caption { font-size: 11px; color: var(--text-secondary); margin-top: 1px; }
.region-delta { font-size: 14px; font-weight: 600; }
.region-delta.up { color: #2E7D32; }
.region-delta.down { color: #C0392B; }
.region-delta.flat { color: var(--text-secondary); }

.insight-card { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; border-radius: var(--radius-lg); margin-bottom: 16px; background: rgba(30,215,96,0.10); border: 0.5px solid rgba(30,215,96,0.35); }
.insight-icon { width: 32px; height: 32px; border-radius: 50%; background: var(--white); display: flex; align-items: center; justify-content: center; color: var(--green-dark); flex-shrink: 0; }
.insight-icon i { font-size: 18px; }
.insight-title { font-size: 13px; font-weight: 600; color: #176A2C; }
.insight-desc { font-size: 12px; color: #1F4A14; line-height: 1.6; margin-top: 4px; }

/* Forecast tab */
.forecast-filter-row { display: flex; align-items: center; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
.forecast-filter-group { display: flex; align-items: center; gap: 10px; }
.forecast-filter-label { font-size: 12px; color: var(--text-secondary); font-weight: 500; }
.scenario-toggle { display: inline-flex; background: var(--white); border: 0.5px solid var(--border); border-radius: 8px; padding: 3px; gap: 2px; }
.scenario-toggle > button { font-family: inherit; border: none; background: transparent; padding: 6px 12px; font-size: 12px; font-weight: 500; color: var(--text-secondary); border-radius: 6px; cursor: pointer; }
.scenario-toggle > button.active { background: var(--navy); color: #fff; }
.btn-alert { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 8px; border: 0.5px solid var(--border); background: var(--white); font-family: inherit; font-size: 12px; font-weight: 500; color: var(--text-primary); cursor: pointer; }
.btn-alert i { font-size: 14px; }

.kpi-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.kpi-card { background: var(--white); border: 0.5px solid var(--border); border-radius: var(--radius-lg); padding: 14px 16px; }
.kpi-card.highlight-success { border-color: rgba(30,215,96,0.4); background: rgba(30,215,96,0.05); }
.kpi-card.highlight-danger { border-color: rgba(208,49,45,0.35); background: rgba(208,49,45,0.04); }
.kpi-label { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.4px; font-weight: 500; }
.kpi-value { font-size: 22px; font-weight: 600; color: var(--navy); margin-top: 6px; }
.kpi-value.text-success { color: #176A2C; }
.kpi-value.text-danger { color: #A32D2D; }
.kpi-caption { font-size: 11px; color: var(--text-tertiary); margin-top: 4px; }

.forecast-chart-card { background: var(--white); border: 0.5px solid var(--border); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 16px; }
.forecast-chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 16px; flex-wrap: wrap; }
.forecast-chart-title { font-size: 14px; font-weight: 600; color: var(--navy); }
.forecast-chart-subtitle { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
.forecast-legend { display: flex; gap: 14px; font-size: 11px; color: var(--text-secondary); align-items: center; flex-wrap: wrap; }
.forecast-legend span { display: inline-flex; align-items: center; gap: 5px; }
.legend-line { width: 16px; height: 2px; background: var(--navy); border-radius: 1px; }
.legend-line.dashed { background: transparent; border-top: 2px dashed #4FC3D9; }
.legend-swatch { width: 14px; height: 8px; border-radius: 2px; }

.two-col-forecast { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; margin-bottom: 16px; }
.fcard { background: var(--white); border: 0.5px solid var(--border); border-radius: var(--radius-lg); padding: 16px; }
.fcard-title { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--navy); margin-bottom: 12px; }
.fcard-title i { font-size: 16px; color: var(--text-secondary); }

.signal-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 0.5px solid var(--border-light); }
.signal-item:last-child { border-bottom: none; }
.signal-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.signal-icon.up { background: rgba(30,215,96,0.12); color: #176A2C; }
.signal-icon.down { background: rgba(208,49,45,0.10); color: #A32D2D; }
.signal-icon i { font-size: 15px; }
.signal-week { font-size: 12px; font-weight: 600; color: var(--navy); }
.signal-desc { font-size: 12px; color: var(--text-secondary); margin-top: 3px; line-height: 1.5; }
.signal-tags { display: flex; gap: 8px; margin-top: 6px; align-items: center; flex-wrap: wrap; }
.signal-tag { font-size: 10.5px; font-weight: 600; padding: 2px 7px; border-radius: 4px; }
.signal-tag.positive { background: rgba(30,215,96,0.14); color: #176A2C; }
.signal-tag.negative { background: rgba(208,49,45,0.12); color: #A32D2D; }
.signal-away { font-size: 10.5px; color: var(--text-tertiary); }

.scenario-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; }
.scenario-left { display: flex; align-items: center; gap: 10px; }
.scenario-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.scenario-name { font-size: 12.5px; font-weight: 600; color: var(--navy); display: flex; align-items: center; gap: 6px; }
.scenario-desc { font-size: 11.5px; color: var(--text-secondary); margin-top: 2px; }
.scenario-value { font-size: 13px; font-weight: 600; color: var(--navy); }
.selected-badge { font-size: 9.5px; font-weight: 600; padding: 1px 6px; border-radius: 3px; background: var(--navy); color: #fff; text-transform: uppercase; letter-spacing: 0.3px; }
.scenario-note { display: flex; gap: 6px; align-items: flex-start; font-size: 11px; color: var(--text-tertiary); margin-top: 10px; padding-top: 10px; border-top: 0.5px solid var(--border-light); }
.scenario-note i { font-size: 13px; margin-top: 1px; }
.footer-note { display: flex; gap: 8px; align-items: flex-start; font-size: 11.5px; color: var(--text-tertiary); padding: 8px 4px; }
.footer-note i { font-size: 14px; margin-top: 1px; }
`;
