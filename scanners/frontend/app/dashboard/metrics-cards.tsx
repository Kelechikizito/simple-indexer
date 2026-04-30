"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MetricsCardsProps {
  totalLiquidations: number;
  volumeLiquidated: number;
  uniqueBorrowers: number;
  protocolsMonitored: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId: NodeJS.Timeout;
    const startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplayValue(Math.floor(value * progress));

      if (progress < 1) {
        animationFrameId = setTimeout(animate, 16);
      }
    };

    animate();

    return () => clearTimeout(animationFrameId);
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
}

export function MetricsCards({
  totalLiquidations,
  volumeLiquidated,
  uniqueBorrowers,
  protocolsMonitored,
}: MetricsCardsProps) {
  const metrics = [
    {
      title: "Total Liquidations",
      value: totalLiquidations,
      subtitle: "Events detected",
      accentColor: "from-red-500/20 to-red-500/0",
      borderColor: "border-red-500/30",
    },
    {
      title: "Volume Liquidated",
      value: volumeLiquidated,
      subtitle: "collateral seized (token units)",
      accentColor: "from-white/20 to-white/0",
      borderColor: "border-white/20",
      format: (val: number) => {
        if (val === 0) return "—";
        if (val < 0.0001) return val.toExponential(4);
        if (val < 1) return val.toFixed(6);
        if (val < 1000) return val.toFixed(4);
        return `${(val / 1000).toFixed(2)}K`;
      },
    },
    {
      title: "Unique Borrowers",
      value: uniqueBorrowers,
      subtitle: "Affected",
      accentColor: "from-purple-500/20 to-purple-500/0",
      borderColor: "border-purple-500/30",
    },
    {
      title: "Protocols Monitored",
      value: protocolsMonitored,
      subtitle: "Active",
      accentColor: "from-cyan-500/20 to-cyan-500/0",
      borderColor: "border-cyan-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, idx) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          className={`group relative overflow-hidden rounded-lg border ${metric.borderColor} bg-gradient-to-br ${metric.accentColor} bg-[#111118] p-6 transition-all hover:border-opacity-60`}
        >
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-400">{metric.title}</p>
            <div className="mt-4 text-3xl font-bold text-white">
              {metric.format ? (
                metric.format(metric.value)
              ) : (
                <AnimatedNumber value={metric.value} />
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">{metric.subtitle}</p>
          </div>

          {/* Hover effect */}
          <div
            className="absolute inset-0 translate-x-full transition-transform duration-500 group-hover:translate-x-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
