"use client";

import { ArrowRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative border-t border-gray-800 bg-gradient-to-b from-slate-900/0 to-slate-900/50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              Liquid
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Scan
              </span>
            </h3>
            <p className="text-gray-400 text-sm">
              Real-time blockchain indexing for Web3 developers.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Documentation", "API Reference", "Pricing", "Status"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-1 group"
                    >
                      {item}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ),
              )}
            </ul>
          </motion.div>

          {/* Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2">
              {["Discord", "Twitter", "Github", "Blog"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-1 group"
                  >
                    {item}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm"
          >
            © {new Date().getFullYear()} LiquidScan. All rights reserved.
          </motion.p>

          {/* FiGithub CTA */}
          <motion.a
            href="https://github.com/Kelechikizito/defi-liquidation-indexer"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-blue-300 hover:border-blue-500/50 transition-all"
          >
            <FiGithub className="w-5 h-5" />
            <span>Github</span>
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
