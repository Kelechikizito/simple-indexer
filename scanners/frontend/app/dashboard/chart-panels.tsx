"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  asset: string;
  value: number;
}

interface ChartPanelsProps {
  collateralData: ChartData[];
  debtData: ChartData[];
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#1e1e2e] bg-[#111118] p-2 text-sm text-white">
        ${(payload[0].value / 1e6).toFixed(1)}M
      </div>
    );
  }
  return null;
}

export function ChartPanels({ collateralData, debtData }: ChartPanelsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Collateral Seized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-lg border border-[#1e1e2e] bg-[#111118] p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">
          Collateral Seized
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={collateralData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" stroke="#666" />
            <YAxis dataKey="asset" type="category" stroke="#666" width={90} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Debt Repaid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-lg border border-[#1e1e2e] bg-[#111118] p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Debt Repaid</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={debtData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" stroke="#666" />
            <YAxis dataKey="asset" type="category" stroke="#666" width={90} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
