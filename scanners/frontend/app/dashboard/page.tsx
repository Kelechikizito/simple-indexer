"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/app/dashboard/navbar";
import { MetricsCards } from "@/app/dashboard/metrics-cards";
import { ChartPanels } from "@/app/dashboard/chart-panels";
import { LiquidationFeed } from "@/app/dashboard/liquidation-feed";

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

export default function DashboardPage() {
  const [liquidations, setLiquidations] = useState<Liquidation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChain, setSelectedChain] = useState("All chains");
  const [latestBlock, setLatestBlock] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          "http://localhost:3001/api/liquidations?limit=200",
        );
        const data = await res.json();
        console.log("API response sample:", data[0]); // add this to debug
        setLiquidations(data);
        if (data.length > 0) {
          setLatestBlock(
            Math.max(...data.map((l: any) => Number(l.blockNumber))),
          );
        }
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, []);

  const filtered =
    selectedChain === "All chains"
      ? liquidations
      : liquidations.filter(
          (l) => l.network.toLowerCase() === selectedChain.toLowerCase(),
        );

  const totalLiquidations = filtered.length;
  const volumeLiquidated = filtered.reduce(
    (sum, l) => sum + (l.collateralSeized || 0),
    0,
  );
  const uniqueBorrowers = new Set(filtered.map((l) => l.borrower)).size;
  const protocolsMonitored = new Set(filtered.map((l) => l.protocol)).size;

  const collateralData = Object.entries(
    filtered.reduce((acc: Record<string, number>, l) => {
      const asset = l.collateralAsset || "Unknown";
      acc[asset] = (acc[asset] || 0) + (l.collateralSeized || 0);
      return acc;
    }, {}),
  )
    .map(([asset, value]) => ({ asset, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const debtData = Object.entries(
    filtered.reduce((acc: Record<string, number>, l) => {
      const asset = l.debtAsset || "Unknown";
      acc[asset] = (acc[asset] || 0) + (l.debtRepaid || 0);
      return acc;
    }, {}),
  )
    .map(([asset, value]) => ({ asset, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <Navbar
        selectedChain={selectedChain}
        onChainChange={setSelectedChain}
        latestBlock={latestBlock}
      />
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <MetricsCards
          totalLiquidations={totalLiquidations}
          volumeLiquidated={volumeLiquidated}
          uniqueBorrowers={uniqueBorrowers}
          protocolsMonitored={protocolsMonitored}
        />
        <ChartPanels collateralData={collateralData} debtData={debtData} />
        <LiquidationFeed liquidations={filtered} isLoading={isLoading} />
      </div>
    </main>
  );
}
