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
  latestBlockAvalanche,
  latestBlockBase,
  latestBlockLinea,
  latestBlockPolygon,
  latestBlockZksync,
} from "../utils/latest-block.ts";

import { morphoBlueAddresses } from "./morpho/addresses.ts";
import { morphoLiquidationEventAbi } from "./liquidation-event-abi.ts";

let lastIndexedBlock: bigint | null = null;
let lastIndexedBlockArbitrum: bigint | null = null;
let lastIndexedBlockOptimism: bigint | null = null;
let lastIndexedBlockAvalanche: bigint | null = null;
let lastIndexedBlockBase: bigint | null = null;
let lastIndexedBlockLinea: bigint | null = null;
let lastIndexedBlockPolygon: bigint | null = null;

async function getLiquidateEventMainnet(fromBlock: bigint, toBlock: bigint) {
  const mainnetLogs = await publicClient.getLogs({
    address: morphoBlueAddresses[1],
    event: morphoLiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return mainnetLogs;
}

while (true) {
  const latestBlockMainnetNumber = await latestBlockMainnet();

  if (!latestBlockMainnetNumber) {
    await new Promise((r) => setTimeout(r, 30_000));
    continue;
  }

  const fromBlock = lastIndexedBlock
    ? lastIndexedBlock + 1n
    : latestBlockMainnetNumber - 5n;

  const toBlock =
    latestBlockMainnetNumber - fromBlock > 9n
      ? fromBlock + 9n
      : latestBlockMainnetNumber;

  const logs = await getLiquidateEventMainnet(fromBlock, toBlock);

  console.log(
    `Fetched ${logs.length} logs from block ${fromBlock} to ${latestBlockMainnetNumber}`,
  );

  lastIndexedBlock = toBlock;

  console.log(`Done. Sleeping 30 seconds...`);
  await new Promise((r) => setTimeout(r, 30_000));
}
