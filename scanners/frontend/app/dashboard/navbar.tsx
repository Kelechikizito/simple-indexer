"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps {
  selectedChain: string;
  onChainChange: (chain: string) => void;
}

const CHAINS = [
  "All chains",
  "Mainnet",
  "Arbitrum",
  "Base",
  "Optimism",
  "Polygon",
  "Avalanche",
  "Linea",
  "ZkSync",
];

const CHAIN_TO_NETWORK: Record<string, string> = {
  "All chains": "",
  Mainnet: "mainnet",
  Arbitrum: "arbitrum",
  Base: "base",
  Optimism: "optimism",
  Polygon: "polygon",
  Avalanche: "avalanche",
  Linea: "linea",
  ZkSync: "zksync",
};

export function Navbar({ selectedChain, onChainChange }: NavbarProps) {
  const [latestBlock, setLatestBlock] = useState<number | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const network = CHAIN_TO_NETWORK[selectedChain];
        const url = network
          ? `http://localhost:3001/api/status/${network}`
          : `http://localhost:3001/api/status`;

        const res = await fetch(url);
        const data = await res.json();
        setLatestBlock(Number(data.latest_block));
      } catch (err) {
        console.error("Failed to fetch status:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30_000);
    return () => clearInterval(interval);
  }, [selectedChain]);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-bold text-white">
            Liquid<span className="text-[#00d9ff]">Scan</span>
          </div>
        </Link>

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

        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/30" />
            <div className="relative h-2 w-2 rounded-full bg-green-500" />
          </div>
          <div className="text-sm text-gray-400">
            Block{" "}
            <span className="font-mono text-white">
              {latestBlock?.toLocaleString() ?? "..."}
            </span>
          </div>
        </div>
      </div>

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
