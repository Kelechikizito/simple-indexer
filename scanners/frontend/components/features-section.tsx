"use client";

import { motion } from "framer-motion";
import { Zap, API, ShieldAlert } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-Time Indexing",
    description:
      "Stream blockchain events as they happen. Stay synchronized with the latest blocks in milliseconds, not hours.",
  },
  {
    icon: API,
    title: "REST API Ready",
    description:
      "Query indexed data with a simple, powerful REST API. Perfect for dashboards, bots, and data pipelines.",
  },
  {
    icon: ShieldAlert,
    title: "Reorg Protected",
    description:
      "Automatically handles blockchain reorganizations. Your data stays consistent and reliable.",
  },
];

export function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-20 px-4 md:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for Web3 Developers
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to index and query blockchain data efficiently.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="relative group"
              >
                {/* Card background with gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Card content */}
                <div className="relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-gray-700 group-hover:border-blue-500/50 rounded-xl p-8 transition-all duration-300 backdrop-blur-sm">
                  {/* Icon */}
                  <div className="mb-6 inline-block">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300 group-hover:text-purple-300 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:from-purple-500/10 transition-colors duration-300" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
