import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChartDataPoint {
  month: string;
  visits: number;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

export const CHART_DATA: ChartDataPoint[] = [
  { month: 'Jan', visits: 8200 },
  { month: 'Fév', visits: 9100 },
  { month: 'Mar', visits: 10500 },
  { month: 'Avr', visits: 11200 },
  { month: 'Mai', visits: 12400 },
  { month: 'Juin', visits: 12847 },
];

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="rounded-lg px-4 py-3 border"
      style={{
        background: 'var(--surface)',
        borderColor: 'rgba(255,255,255,0.1)',
      }}
    >
      <p className="text-xs text-[rgba(255,255,255,0.5)] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </p>
      <p className="text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {payload[0].value.toLocaleString('fr-FR')} visites
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminChart() {
  const [accent1, setAccent1] = useState('#ff3333');
  const [animated, setAnimated] = useState(false);

  // Read current accent color from CSS variable
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const accent = root.getPropertyValue('--accent1').trim() || '#ff3333';
    setAccent1(accent);

    // Trigger animation after mount
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Listen for palette changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const root = getComputedStyle(document.documentElement);
      const accent = root.getPropertyValue('--accent1').trim() || '#ff3333';
      setAccent1(accent);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full h-[320px] md:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={CHART_DATA}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent1} stopOpacity={0.3} />
              <stop offset="100%" stopColor={accent1} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: 'rgba(255,255,255,0.5)',
              fontSize: 12,
              fontFamily: 'Inter, sans-serif',
            }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: 'rgba(255,255,255,0.5)',
              fontSize: 11,
              fontFamily: 'Inter, sans-serif',
            }}
            tickFormatter={(value: number) =>
              value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
            }
            dx={-5}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="visits"
            stroke={accent1}
            strokeWidth={2}
            fill="url(#areaGradient)"
            dot={{
              r: animated ? 5 : 0,
              fill: accent1,
              stroke: '#050505',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 7,
              fill: accent1,
              stroke: '#050505',
              strokeWidth: 2,
            }}
            animationDuration={1500}
            animationEasing="ease-out"
            isAnimationActive={animated}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
