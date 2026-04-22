"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonPulse = {
    scale: [1, 1.05, 1],
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 text-sm font-medium text-purple-200">
            ✨ Powered by on-chain data
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-300 mb-6 leading-tight"
        >
          Index DeFi Protocols.
          <br />
          In Real Time.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Track ERC-20 Transfer and Approval events on-chain. Real-time
          indexing, REST API ready, and reorg protected for Web3 developers.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          {/* Launch App Button - Most Prominent */}
          <motion.button
            animate={buttonPulse}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="px-8 py-4 rounded-lg font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition-all border-2 border-transparent hover:border-blue-300 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch App
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity rounded-lg blur" />
          </motion.button>

          {/* Docs Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-600 text-gray-200 hover:border-blue-500 hover:text-blue-300 transition-all"
          >
            View Docs
          </motion.button>
        </motion.div>

        {/* FiGithub link */}
        <motion.a
          variants={itemVariants}
          href="https://github.com/Kelechikizito/defi-liquidation-indexer"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-300 transition-colors group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiGithub className="w-5 h-5" />
          <span>View on Github</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-blue-500 rounded-full"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
