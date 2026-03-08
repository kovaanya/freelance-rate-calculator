import { useState, useMemo } from "react";

const formatCurrency = (n) => {
  if (n >= 1000) return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return "$" + n.toFixed(2);
};

const Slider = ({ label, value, onChange, min, max, step = 1, prefix = "", suffix = "", help }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#b0b0c0", letterSpacing: 0.5 }}>{label}</label>
      <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>
        {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
      </span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: "100%", height: 6, borderRadius: 3, appearance: "none", outline: "none",
        background: `linear-gradient(to right, #7c3aed 0%, #06b6d4 ${((value - min) / (max - min)) * 100}%, #1e1e3a ${((value - min) / (max - min)) * 100}%, #1e1e3a 100%)`,
        cursor: "pointer" }} />
    {help && <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>{help}</div>}
  </div>
);

const ResultCard = ({ label, value, sub, accent }) => (
  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, padding: "24px 20px", textAlign: "center", flex: "1 1 140px", minWidth: 140 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: "#777", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -2, lineHeight: 1,
      background: accent || "linear-gradient(135deg, #7c3aed, #06b6d4)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>{sub}</div>}
  </div>
);

export default function App() {
  const [income, setIncome] = useState(80000);
  const [expenses, setExpenses] = useState(12000);
  const [vacation, setVacation] = useState(4);
  const [billable, setBillable] = useState(60);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [tab, setTab] = useState("rates");

  const calc = useMemo(() => {
    const workingWeeks = 52 - vacation;
    const totalHours = workingWeeks * hoursPerWeek;
    const billableHours = totalHours * (billable / 100);
    const totalNeeded = income + expenses;
    const hourly = billableHours > 0 ? totalNeeded / billableHours : 0;
    const daily = hourly * (hoursPerWeek / 5);
    const weekly = hourly * hoursPerWeek * (billable / 100);
    const monthly = totalNeeded / 12;
    const halfDay = daily / 2;
    const projectSmall = hourly * 10;
    const projectMed = hourly * 40;
    const projectLg = hourly * 100;
    const effectiveRate = totalHours > 0 ? totalNeeded / totalHours : 0;
    const nonBillableHrs = totalHours - billableHours;
    return { workingWeeks, totalHours, billableHours, totalNeeded, hourly, daily, weekly, monthly, halfDay, projectSmall, projectMed, projectLg, effectiveRate, nonBillableHrs };
  }, [income, expenses, vacation, billable, hoursPerWeek]);

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
      fontSize: 13, fontWeight: 700, background: tab === id ? "rgba(124,58,237,0.2)" : "transparent",
      color: tab === id ? "#c4b5fd" : "#555", transition: "all 0.2s" }}>{label}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#fff",
      fontFamily: "'Inter',-apple-system,sans-serif", display: "flex", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 880 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)",
            padding: "7px 16px", borderRadius: 50, marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, background: "#7c3aed", borderRadius: "50%" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#c4b5fd", letterSpacing: 2, textTransform: "uppercase" }}>Free Tool</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -2, margin: 0, lineHeight: 1.15 }}>
            Freelance Rate<br />
            <span style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Calculator</span>
          </h1>
          <p style={{ fontSize: 15, color: "#555", marginTop: 12, lineHeight: 1.6 }}>Stop guessing. Know exactly what to charge based on your real numbers.</p>
        </div>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 340px", minWidth: 300, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 2, marginBottom: 28 }}>Your Numbers</h2>
            <Slider label="Desired Annual Income" value={income} onChange={setIncome} min={20000} max={300000} step={5000} prefix="$" help="What you want to take home before tax" />
            <Slider label="Annual Business Expenses" value={expenses} onChange={setExpenses} min={0} max={60000} step={1000} prefix="$" help="Software, tools, insurance, co-working, etc." />
            <Slider label="Vacation Weeks Per Year" value={vacation} onChange={setVacation} min={0} max={12} suffix=" weeks" />
            <Slider label="Billable Hours" value={billable} onChange={setBillable} min={20} max={90} suffix="%" help="% of work time spent on client work" />
            <Slider label="Hours Per Week" value={hoursPerWeek} onChange={setHoursPerWeek} min={10} max={60} suffix=" hrs" />
          </div>
          <div style={{ flex: "1 1 400px", minWidth: 340 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <ResultCard label="Hourly Rate" value={formatCurrency(calc.hourly)} sub="your minimum" />
              <ResultCard label="Day Rate" value={formatCurrency(calc.daily)} sub={`${hoursPerWeek / 5}hr day`} accent="linear-gradient(135deg, #06b6d4, #22d38a)" />
              <ResultCard label="Monthly Target" value={formatCurrency(calc.monthly)} sub="avg per month" accent="linear-gradient(135deg, #22d38a, #7c3aed)" />
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4 }}>
                <TabBtn id="rates" label="Rate Card" />
                <TabBtn id="breakdown" label="Time Breakdown" />
                <TabBtn id="projects" label="Project Pricing" />
              </div>
              {tab === "rates" && (
                <div>
                  {[["Hourly Rate", formatCurrency(calc.hourly)], ["Half-Day Rate", formatCurrency(calc.halfDay)],
                    ["Full-Day Rate", formatCurrency(calc.daily)], ["Weekly Rate", formatCurrency(calc.weekly)],
                    ["Monthly Target", formatCurrency(calc.monthly)]].map(([l, v], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize: 14, color: "#888" }}>{l}</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Pro tip</div>
                    <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>
                      These are your <strong style={{ color: "#c4b5fd" }}>minimum rates</strong>. Many freelancers charge 20-50% above this for specialized work.
                    </div>
                  </div>
                </div>
              )}
              {tab === "breakdown" && (
                <div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 120, padding: 16, borderRadius: 12, background: "rgba(34,211,138,0.06)", border: "1px solid rgba(34,211,138,0.12)", textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: "#22d38a" }}>{Math.round(calc.billableHours)}</div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Billable hrs/yr</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 120, padding: 16, borderRadius: 12, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)", textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: "#ef4444" }}>{Math.round(calc.nonBillableHrs)}</div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Non-billable hrs/yr</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 120, padding: 16, borderRadius: 12, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)", textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: "#c4b5fd" }}>{calc.workingWeeks}</div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Working weeks/yr</div>
                    </div>
                  </div>
                  <div style={{ padding: 16, borderRadius: 12, background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.12)" }}>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Effective hourly rate</div>
                    <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>
                      Counting all hours (including unpaid work), your effective rate is <strong style={{ color: "#67e8f9" }}>{formatCurrency(calc.effectiveRate)}/hr</strong>.
                    </div>
                  </div>
                </div>
              )}
              {tab === "projects" && (
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>Based on {formatCurrency(calc.hourly)}/hr</div>
                  {[["Quick Task", "~10 hours", calc.projectSmall, "Blog post, audit, logo tweak"],
                    ["Standard Project", "~40 hours", calc.projectMed, "Website, brand identity"],
                    ["Large Project", "~100 hours", calc.projectLg, "Full rebrand, app design"]].map(([name, hrs, price, ex], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{name}</div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{ex}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{formatCurrency(price)}</div>
                        <div style={{ fontSize: 11, color: "#555" }}>{hrs}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "rgba(34,211,138,0.06)", border: "1px solid rgba(34,211,138,0.12)" }}>
                    <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>
                      Quote based on <strong style={{ color: "#22d38a" }}>value delivered</strong>, not just hours.
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))",
              border: "1px solid rgba(124,58,237,0.2)", borderRadius: 16, padding: "24px 28px",
              display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Want to earn more in fewer hours?</div>
                <div style={{ fontSize: 13, color: "#777", lineHeight: 1.5 }}>Get 100 AI prompts built for freelancers. Save 10+ hours every week.</div>
              </div>
              <a href="https://kovacreations.gumroad.com/l/wxkqcf" style={{ display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "#fff", padding: "12px 24px",
                borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                Get the Prompt Guide
              </a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 12, color: "#444" }}>Built for freelancers who refuse to undercharge.</p>
        </div>
      </div>
    </div>
  );
}