import { formatUnits } from "viem";
import { publicClient } from "../config/client.js";
import { latestBlockMainnet } from "../utils/latest-block.ts";
import { sparkLendPoolAddresses } from "./spark/addresses.ts";
import { sparkLendLiquidationEventAbi } from "./liquidation-event-abi.ts";

let lastIndexedBlock: bigint | null = null;

async function getLiquidateEventMainnet(fromBlock: bigint, toBlock: bigint) {
  const mainnetLogs = await publicClient.getLogs({
    address: sparkLendPoolAddresses[1],
    event: sparkLendLiquidationEventAbi[0],
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
