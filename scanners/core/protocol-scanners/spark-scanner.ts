import { publicClient } from "../../config/client.js";
import { latestBlockMainnet } from "../../utils/latest-block.ts";
import { sparkLendPoolAddresses } from "../spark/addresses.ts";
import { sparkLendLiquidationEventAbi } from "../liquidation-event-abi.ts";

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

export async function scanSparkOnce() {
  const latestBlockMainnetNumber = await latestBlockMainnet();

  if (!latestBlockMainnetNumber) {
    return {
      protocol: "spark",
      mainnet: [],
    };
  }

  const fromBlock = lastIndexedBlock
    ? lastIndexedBlock + 1n
    : latestBlockMainnetNumber - 5n;
  const toBlock =
    latestBlockMainnetNumber - fromBlock > 9n
      ? fromBlock + 9n
      : latestBlockMainnetNumber;

  const logs = await getLiquidateEventMainnet(fromBlock, toBlock);

  lastIndexedBlock = toBlock;

  return {
    protocol: "spark",
    mainnet: logs,
  };
}
