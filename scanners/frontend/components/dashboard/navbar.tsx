"use client";

import { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  selectedChain: string;
  onChainChange: (chain: string) => void;
  latestBlock: number;
}

const CHAINS = [
  "All chains",
  "Ethereum",
  "Arbitrum",
  "Base",
  "Optimism",
  "Polygon",
  "Avalanche",
  "Linea",
];

export function Navbar({
  selectedChain,
  onChainChange,
  latestBlock,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-bold text-white">
            Liquid<span className="text-[#00d9ff]">Scan</span>
          </div>
        </Link>

        {/* Chain Filters */}
        <div className="hidden flex-1 justify-center gap-2 md:flex">
          {CHAINS.map((chain) => (
            <button
              key={chain}
              onClick={() => onChainChange(chain)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                selectedChain === chain
                  ? "bg-[#00d9ff] text-[#0a0a0f]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {chain}
            </button>
          ))}
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/30" />
            <div className="relative h-2 w-2 rounded-full bg-green-500" />
          </div>
          <div className="text-sm text-gray-400">
            Block <span className="font-mono text-white">{latestBlock}</span>
          </div>
        </div>
      </div>

      {/* Mobile Chain Filter */}
      <div className="border-t border-[#1e1e2e] px-6 py-3 md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CHAINS.map((chain) => (
            <button
              key={chain}
              onClick={() => onChainChange(chain)}
              className={`whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-all ${
                selectedChain === chain
                  ? "bg-[#00d9ff] text-[#0a0a0f]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {chain}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
