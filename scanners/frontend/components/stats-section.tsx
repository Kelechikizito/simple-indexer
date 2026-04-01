"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

const stats: Stat[] = [
  { label: "Transfers Indexed", value: 1750, suffix: "+", prefix: "" },
  { label: "Blocks Scanned", value: 501, suffix: "", prefix: "" },
  { label: "Sync Interval", value: 30, suffix: "s", prefix: "" },
];

export function StatsSection() {
  const [displayValues, setDisplayValues] = useState<number[]>(
    stats.map(() => 0),
  );

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      const increment = stat.value / 50;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setDisplayValues((prev) => {
            const newValues = [...prev];
            newValues[index] = stat.value;
            return newValues;
          });
          clearInterval(timer);
        } else {
          setDisplayValues((prev) => {
            const newValues = [...prev];
            newValues[index] = Math.floor(current);
            return newValues;
          });
        }
      }, 30);

      return timer;
    });

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, []);

  return (
    <section className="relative py-16 px-4 md:py-20 border-y border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {/* Stat value with monospace font */}
              <div className="mb-3 font-mono">
                <span className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {displayValues[index].toLocaleString()}
                </span>
                <span className="text-3xl font-bold text-blue-300 ml-1">
                  {stat.suffix}
                </span>
              </div>

              {/* Stat label */}
              <p className="text-gray-400 text-sm md:text-base uppercase tracking-wider">
                {stat.label}
              </p>

              {/* Live indicator */}
              <motion.div
                className="mt-4 flex items-center justify-center gap-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-green-400 font-medium">Live</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
      </div>
    </section>
  );
}
