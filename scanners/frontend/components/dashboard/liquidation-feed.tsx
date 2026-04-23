"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface Liquidation {
  id: string;
  protocol: string;
  network: string;
  blockNumber: number;
  txHash: string;
  timestamp: string;
  borrower: string;
  liquidator: string;
  debtRepaid: number;
  collateralSeized: number;
  badDebt?: string;
  explorerUrl: string;
  collateralAsset?: string;
  debtAsset?: string;
}

interface LiquidationFeedProps {
  liquidations: Liquidation[];
  isLoading: boolean;
}

const PROTOCOL_STYLES: Record<string, { bg: string; text: string }> = {
  "Aave V3": { bg: "bg-purple-500/20", text: "text-purple-400" },
  "Compound V3": { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  Morpho: { bg: "bg-orange-500/20", text: "text-orange-400" },
  Spark: { bg: "bg-amber-500/20", text: "text-amber-400" },
};

const NETWORK_COLORS: Record<string, string> = {
  Ethereum: "text-blue-400",
  Arbitrum: "text-blue-300",
  Base: "text-blue-500",
  Optimism: "text-red-400",
  Polygon: "text-purple-400",
  Avalanche: "text-red-300",
  Linea: "text-blue-200",
};

function truncateAddress(address: string) {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function LiquidationFeed({
  liquidations,
  isLoading,
}: LiquidationFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [protocolFilter, setProtocolFilter] = useState("All protocols");
  const [chainFilter, setChainFilter] = useState("All chains");

  const protocols = useMemo(
    () => ["All protocols", ...new Set(liquidations.map((l) => l.protocol))],
    [liquidations],
  );

  const chains = useMemo(
    () => ["All chains", ...new Set(liquidations.map((l) => l.network))],
    [liquidations],
  );

  const filtered = useMemo(() => {
    return liquidations.filter((liq) => {
      const matchesSearch =
        !searchQuery ||
        liq.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
        liq.liquidator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        liq.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (liq.collateralAsset
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false) ||
        (liq.debtAsset?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);

      const matchesProtocol =
        protocolFilter === "All protocols" || liq.protocol === protocolFilter;
      const matchesChain =
        chainFilter === "All chains" || liq.network === chainFilter;

      return matchesSearch && matchesProtocol && matchesChain;
    });
  }, [liquidations, searchQuery, protocolFilter, chainFilter]);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3 rounded-lg border border-[#1e1e2e] bg-[#111118] p-4">
        <input
          type="text"
          placeholder="Search by address, tx hash, or asset..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#00d9ff] focus:outline-none"
        />

        <div className="flex gap-3">
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="flex-1 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-4 py-2 text-sm text-white focus:border-[#00d9ff] focus:outline-none"
          >
            {protocols.map((p) => (
              <option key={p} value={p}>
                Protocol: {p}
              </option>
            ))}
          </select>

          <select
            value={chainFilter}
            onChange={(e) => setChainFilter(e.target.value)}
            className="flex-1 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-4 py-2 text-sm text-white focus:border-[#00d9ff] focus:outline-none"
          >
            {chains.map((c) => (
              <option key={c} value={c}>
                Chain: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg border border-[#1e1e2e] bg-[#111118] py-12">
          <div className="text-gray-400">Loading liquidations...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-[#1e1e2e] bg-[#111118] py-12">
          <div className="text-gray-400">No liquidations found</div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#1e1e2e] bg-[#111118]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] bg-[#0a0a0f]/50">
                <th className="px-6 py-3 text-left font-semibold text-gray-400">
                  Block
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-400">
                  Borrower
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-400">
                  Collateral → Debt
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-400">
                  Liquidator
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-400">
                  Protocol
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((liq, idx) => {
                const protocolStyle = PROTOCOL_STYLES[liq.protocol] || {
                  bg: "bg-gray-500/20",
                  text: "text-gray-400",
                };
                const isLargeAmount = liq.collateralSeized > 10000;
                const isBadDebt = liq.badDebt && liq.badDebt !== "0";

                return (
                  <motion.tr
                    key={liq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => window.open(liq.explorerUrl, "_blank")}
                    className="cursor-pointer border-b border-[#1e1e2e] transition-colors hover:bg-[#1a1a22]"
                  >
                    <td className="px-6 py-4 font-mono text-gray-300">
                      {liq.blockNumber}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-300">
                      {truncateAddress(liq.borrower)}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {liq.collateralAsset || "N/A"} → {liq.debtAsset || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-mono ${isLargeAmount ? "text-red-400" : "text-white"}`}
                    >
                      ${(liq.collateralSeized / 1e6).toFixed(2)}M
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-300">
                      {truncateAddress(liq.liquidator)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-medium ${protocolStyle.bg} ${protocolStyle.text}`}
                        >
                          {liq.protocol}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs ${NETWORK_COLORS[liq.network] || "text-gray-400"}`}
                          >
                            {liq.network}
                          </span>
                          {isBadDebt && (
                            <span className="inline-block rounded bg-orange-500/30 px-2 py-0.5 text-xs text-orange-400">
                              Bad Debt
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        Showing {filtered.length} of {liquidations.length} liquidations
      </div>
    </div>
  );
}
