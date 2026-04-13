import { aaveV3PoolAddresses } from "./aave-v3/pool-addresses.ts";
import { aaveV3LiquidationEventAbi } from "./liquidation-event-abi.ts";

import {
  publicClient,
  publicClientArbitrum,
  publicClientOptimism,
  publicClientAvalanche,
  publicClientBase,
  publicClientLinea,
  publicClientZksync,
  publicClientPolygon,
} from "../config/client.js";

import {
  latestBlockMainnet,
  latestBlockArbitrum,
  latestBlockOptimism,
  latestBlockAvalanche,
  latestBlockBase,
  latestBlockLinea,
  latestBlockZksync,
  latestBlockPolygon,
} from "../utils/latest-block.ts";

const MAX_BLOCK_RANGE = 10n; // Safe for Alchemy free tier
const POLL_INTERVAL = 30_000; // 30 seconds

// ==================== CONFIGURATION ====================

// Add new chains here easily
const SUPPORTED_CHAINS = [
  {
    id: 1,
    name: "Ethereum",
    client: publicClient,
    latestBlockFn: latestBlockMainnet,
  },
  {
    id: 42161,
    name: "Arbitrum",
    client: publicClientArbitrum,
    latestBlockFn: latestBlockArbitrum,
  },
  {
    id: 10,
    name: "Optimism",
    client: publicClientOptimism,
    latestBlockFn: latestBlockOptimism,
  },
  {
    id: 43114,
    name: "Avalanche",
    client: publicClientAvalanche,
    latestBlockFn: latestBlockAvalanche,
  },
  {
    id: 8453,
    name: "Base",
    client: publicClientBase,
    latestBlockFn: latestBlockBase,
  },
  {
    id: 59144,
    name: "Linea",
    client: publicClientLinea,
    latestBlockFn: latestBlockLinea,
  },
  {
    id: 324,
    name: "zkSync",
    client: publicClientZksync,
    latestBlockFn: latestBlockZksync,
  },
  {
    id: 137,
    name: "Polygon",
    client: publicClientPolygon,
    latestBlockFn: latestBlockPolygon,
  },
] as const;

// Keep track of last indexed block per chain
const lastIndexedBlocks: Record<number, bigint | null> = {
  1: null,
  42161: null,
  10: null,
  43114: null,
  8453: null,
  59144: null,
  324: null,
  137: null,
};

// ==================== CORE FUNCTION ====================

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchLogsInChunks(
  chainConfig: (typeof SUPPORTED_CHAINS)[number],
) {
  const { id, name, client, latestBlockFn } = chainConfig;
  const poolAddress =
    aaveV3PoolAddresses[id as keyof typeof aaveV3PoolAddresses];

  if (!poolAddress) {
    console.warn(`⚠️ No Aave V3 Pool address found for chain ${name} (${id})`);
    return { chainId: id, name, logs: [] };
  }

  const latestBlock = await latestBlockFn();
  if (!latestBlock) {
    console.warn(`⚠️ Could not fetch latest block for ${name}`);
    return { chainId: id, name, logs: [] };
  }

  let fromBlock = lastIndexedBlocks[id]
    ? lastIndexedBlocks[id]! + 1n
    : latestBlock - 5n;

  const allLogs: any[] = [];

  while (fromBlock <= latestBlock) {
    const toBlock =
      fromBlock + MAX_BLOCK_RANGE - 1n > latestBlock
        ? latestBlock
        : fromBlock + MAX_BLOCK_RANGE - 1n;

    const logs = await client.getLogs({
      address: poolAddress,
      event: aaveV3LiquidationEventAbi[0],
      fromBlock,
      toBlock,
    });

    allLogs.push(...logs);

    if (logs.length > 0) {
      console.log(
        `✅ [Aave V3] ${name} → Fetched ${logs.length} liquidations | Blocks ${fromBlock}–${toBlock}`,
      );
    }

    fromBlock = toBlock + 1n;
  }

  lastIndexedBlocks[id] = latestBlock;

  return { chainId: id, name, logs: allLogs };
}

// ====================== MAIN LOOP ======================
async function main() {
  console.log(
    "🚀 Aave V3 Liquidation Scanner started across",
    SUPPORTED_CHAINS.length,
    "chains...\n",
  );

  while (true) {
    try {
      const results = await Promise.all(
        SUPPORTED_CHAINS.map((chain) => fetchLogsInChunks(chain)),
      );

      const totalLogs = results.reduce((sum, r) => sum + r.logs.length, 0);

      if (totalLogs === 0) {
        console.log("ℹ️ No new liquidations found in this cycle.");
      } else {
        console.log(`📊 Total liquidations fetched this cycle: ${totalLogs}`);
      }

      // TODO: Save to database
      // const allLogs = results.flatMap(r => r.logs);
      // await saveLiquidationsToDB(allLogs);
    } catch (error) {
      console.error("❌ Critical error in scanning cycle:", error);
    }

    console.log(`\n⏳ Sleeping for ${POLL_INTERVAL / 1000} seconds...\n`);
    await sleep(POLL_INTERVAL);
  }
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
