import { formatUnits } from "viem";
import {
  publicClient,
  publicClientArbitrum,
  publicClientAvalanche,
  publicClientBase,
  publicClientLinea,
  publicClientOptimism,
  publicClientPolygon,
  publicClientZksync,
} from "../config/client.js";
import {
  latestBlockMainnet,
  latestBlockArbitrum,
  latestBlockOptimism,
} from "../utils/latest-block.ts";
import { aaveV3PoolAddresses } from "./aave-v3/pool-addresses.ts";
import { aaveV3LiquidationEventAbi } from "./liquidation-event-abi.ts";

let lastIndexedBlock: bigint | null = null;

async function getLiquidateEventLogs(fromBlock: bigint, toBlock: bigint) {
  const mainnetLogs = await publicClient.getLogs({
    address: aaveV3PoolAddresses[1],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return mainnetLogs;
}

while (true) {
  const latestBlockMainnetNumber = await latestBlockMainnet();
  const latestArbitrumBlock = await latestBlockArbitrum();

  if (!latestBlockMainnetNumber) {
    await new Promise((r) => setTimeout(r, 30_000));
    continue;
  }

  const fromBlock = lastIndexedBlock
    ? lastIndexedBlock + 1n
    : latestBlockMainnetNumber - 5n;
  const logs = await getLiquidateEventLogs(fromBlock, latestBlockMainnetNumber);
  console.log(
    `Fetched ${logs.length} logs from block ${fromBlock} to ${latestBlockMainnetNumber}`,
  );

  lastIndexedBlock = latestBlockMainnetNumber;
  console.log(`Done. Sleeping 30 seconds...`);
  await new Promise((r) => setTimeout(r, 30_000));
}
