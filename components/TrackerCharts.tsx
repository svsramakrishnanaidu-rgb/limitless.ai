"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { date: string; label: string; water: number; sleep: number; steps: number };

const grid = "rgba(200,184,138,0.14)";
const text = "var(--muted)";

/**
 * Charts are split into their own chunk so the dashboard, tracker forms and the
 * rest of the app never load the charting library. `ssr: false` at the call site
 * also removes it from server rendering.
 */
export function TrackerCharts({ series }: { series: Point[] }) {
  const litres = series.map((s) => ({ ...s, litres: Number((s.water / 1000).toFixed(2)) }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="liquid-glass card-pad">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="section-title">Water, last 7 days</h2>
          <span className="tiny muted">litres</span>
        </div>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={litres}>
              <CartesianGrid stroke={grid} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: text, fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ background: "var(--panel-strong)", border: "1px solid var(--line)", borderRadius: 12, color: "var(--text)", fontSize: 12 }}
                formatter={(value: number) => [`${value} L`, "Water"]}
              />
              <Bar dataKey="litres" fill="#713B91" radius={[4, 4, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="liquid-glass card-pad">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="section-title">Sleep, last 7 days</h2>
          <span className="tiny muted">hours</span>
        </div>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={series}>
              <CartesianGrid stroke={grid} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 12]} tick={{ fill: text, fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ background: "var(--panel-strong)", border: "1px solid var(--line)", borderRadius: 12, color: "var(--text)", fontSize: 12 }}
                formatter={(value: number) => [`${value} h`, "Sleep"]}
              />
              <Line type="monotone" dataKey="sleep" stroke="#B990DA" strokeWidth={2} dot={{ r: 2.5, fill: "#B990DA" }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default TrackerCharts;
