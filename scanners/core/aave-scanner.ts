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
import { aaveV3PoolAddresses } from "./aave-v3/pool-addresses.ts";
import { aaveV3LiquidationEventAbi } from "./liquidation-event-abi.ts";

let lastIndexedBlock: bigint | null = null;
let lastIndexedBlockArbitrum: bigint | null = null;
let lastIndexedBlockOptimism: bigint | null = null;
let lastIndexedBlockAvalanche: bigint | null = null;
let lastIndexedBlockBase: bigint | null = null;
let lastIndexedBlockLinea: bigint | null = null;
let lastIndexedBlockPolygon: bigint | null = null;
let lastIndexedBlockZksync: bigint | null = null;

async function getLiquidateEventLogs(fromBlock: bigint, toBlock: bigint) {
  const mainnetLogs = await publicClient.getLogs({
    address: aaveV3PoolAddresses[1],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return mainnetLogs;
}

async function getLiquidateEventLogsArbitrum(
  fromBlock: bigint,
  toBlock: bigint,
) {
  const arbitrumLogs = await publicClientArbitrum.getLogs({
    address: aaveV3PoolAddresses[42161],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return arbitrumLogs;
}

async function getLiquidateEventLogsOptimism(
  fromBlock: bigint,
  toBlock: bigint,
) {
  const optimismLogs = await publicClientOptimism.getLogs({
    address: aaveV3PoolAddresses[10],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return optimismLogs;
}

async function getLiquidateEventLogsAvalanche(
  fromBlock: bigint,
  toBlock: bigint,
) {
  const avalancheLogs = await publicClientAvalanche.getLogs({
    address: aaveV3PoolAddresses[43114],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return avalancheLogs;
}

async function getLiquidateEventLogsBase(fromBlock: bigint, toBlock: bigint) {
  const baseLogs = await publicClientBase.getLogs({
    address: aaveV3PoolAddresses[8453],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return baseLogs;
}

async function getLiquidateEventLogsLinea(fromBlock: bigint, toBlock: bigint) {
  const lineaLogs = await publicClientLinea.getLogs({
    address: aaveV3PoolAddresses[59144],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return lineaLogs;
}

async function getLiquidateEventLogsPolygon(
  fromBlock: bigint,
  toBlock: bigint,
) {
  const polygonLogs = await publicClientPolygon.getLogs({
    address: aaveV3PoolAddresses[137],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return polygonLogs;
}

async function getLiquidateEventLogsZksync(fromBlock: bigint, toBlock: bigint) {
  const zksyncLogs = await publicClientZksync.getLogs({
    address: aaveV3PoolAddresses[324],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return zksyncLogs;
}

while (true) {
  const latestBlockMainnetNumber = await latestBlockMainnet();
  const latestArbitrumBlock = await latestBlockArbitrum();
  const latestOptimismBlock = await latestBlockOptimism();
  const latestAvalancheBlock = await latestBlockAvalanche();
  const latestBaseBlock = await latestBlockBase();
  const latestLineaBlock = await latestBlockLinea();
  const latestPolygonBlock = await latestBlockPolygon();
  const latestZksyncBlock = await latestBlockZksync();

  if (
    !latestBlockMainnetNumber ||
    !latestArbitrumBlock ||
    !latestOptimismBlock ||
    !latestAvalancheBlock ||
    !latestBaseBlock ||
    !latestLineaBlock ||
    !latestPolygonBlock ||
    !latestZksyncBlock
  ) {
    await new Promise((r) => setTimeout(r, 10_000));
    continue;
  }

  const fromBlock = lastIndexedBlock
    ? lastIndexedBlock + 1n
    : latestBlockMainnetNumber - 5n;
  const fromBlockArbitrum = lastIndexedBlockArbitrum
    ? lastIndexedBlockArbitrum + 1n
    : latestArbitrumBlock - 3n;
  const fromBlockOptimism = lastIndexedBlockOptimism
    ? lastIndexedBlockOptimism + 1n
    : latestOptimismBlock - 3n;
  const fromBlockAvalanche = lastIndexedBlockAvalanche
    ? lastIndexedBlockAvalanche + 1n
    : latestAvalancheBlock - 3n;
  const fromBlockBase = lastIndexedBlockBase
    ? lastIndexedBlockBase + 1n
    : latestBaseBlock - 3n;
  const fromBlockLinea = lastIndexedBlockLinea
    ? lastIndexedBlockLinea + 1n
    : latestLineaBlock - 3n;
  const fromBlockPolygon = lastIndexedBlockPolygon
    ? lastIndexedBlockPolygon + 1n
    : latestPolygonBlock - 3n;
  const fromBlockZksync = lastIndexedBlockZksync
    ? lastIndexedBlockZksync + 1n
    : latestZksyncBlock - 3n;

  // clamp to max 9 blocks ahead
  const toBlockArbitrum =
    latestArbitrumBlock - fromBlockArbitrum > 9n
      ? fromBlockArbitrum + 9n
      : latestArbitrumBlock;
  const toBlockOptimism =
    latestOptimismBlock - fromBlockOptimism > 9n
      ? fromBlockOptimism + 9n
      : latestOptimismBlock;
  const toBlockAvalanche =
    latestAvalancheBlock - fromBlockAvalanche > 9n
      ? fromBlockAvalanche + 9n
      : latestAvalancheBlock;
  const toBlockBase =
    latestBaseBlock - fromBlockBase > 9n ? fromBlockBase + 9n : latestBaseBlock;
  const toBlockLinea =
    latestLineaBlock - fromBlockLinea > 9n
      ? fromBlockLinea + 9n
      : latestLineaBlock;
  const toBlockPolygon =
    latestPolygonBlock - fromBlockPolygon > 9n
      ? fromBlockPolygon + 9n
      : latestPolygonBlock;
  const toBlockZksync =
    latestZksyncBlock - fromBlockZksync > 9n
      ? fromBlockZksync + 9n
      : latestZksyncBlock;

  const logs = await getLiquidateEventLogs(fromBlock, latestBlockMainnetNumber);
  const arbitrumLogs = await getLiquidateEventLogsArbitrum(
    fromBlockArbitrum,
    toBlockArbitrum,
  );
  const optimismLogs = await getLiquidateEventLogsOptimism(
    fromBlockOptimism,
    toBlockOptimism,
  );
  const avalancheLogs = await getLiquidateEventLogsAvalanche(
    fromBlockAvalanche,
    toBlockAvalanche,
  );
  const baseLogs = await getLiquidateEventLogsBase(fromBlockBase, toBlockBase);
  const lineaLogs = await getLiquidateEventLogsLinea(
    fromBlockLinea,
    toBlockLinea,
  );
  const polygonLogs = await getLiquidateEventLogsPolygon(
    fromBlockPolygon,
    toBlockPolygon,
  );
  const zksyncLogs = await getLiquidateEventLogsZksync(
    fromBlockZksync,
    toBlockZksync,
  );

  console.log(
    `Fetched ${logs.length} logs from block ${fromBlock} to ${latestBlockMainnetNumber}`,
  );
  console.log(
    `Fetched ${arbitrumLogs.length} logs from block ${fromBlockArbitrum} to ${latestArbitrumBlock}`,
  );
  console.log(
    `Fetched ${optimismLogs.length} logs from block ${fromBlockOptimism} to ${latestOptimismBlock}`,
  );
  console.log(
    `Fetched ${avalancheLogs.length} logs from block ${fromBlockAvalanche} to ${latestAvalancheBlock}`,
  );
  console.log(
    `Fetched ${baseLogs.length} logs from block ${fromBlockBase} to ${latestBaseBlock}`,
  );
  console.log(
    `Fetched ${lineaLogs.length} logs from block ${fromBlockLinea} to ${latestLineaBlock}`,
  );
  console.log(
    `Fetched ${polygonLogs.length} logs from block ${fromBlockPolygon} to ${latestPolygonBlock}`,
  );
  console.log(
    `Fetched ${zksyncLogs.length} logs from block ${fromBlockZksync} to ${latestZksyncBlock}`,
  );

  lastIndexedBlock = latestBlockMainnetNumber;
  lastIndexedBlockArbitrum = toBlockArbitrum;
  lastIndexedBlockOptimism = toBlockOptimism;
  lastIndexedBlockAvalanche = toBlockAvalanche;
  lastIndexedBlockBase = toBlockBase;
  lastIndexedBlockLinea = toBlockLinea;
  lastIndexedBlockPolygon = toBlockPolygon;
  lastIndexedBlockZksync = toBlockZksync;

  console.log(`Done. Sleeping 10 seconds...`);
  await new Promise((r) => setTimeout(r, 10_000));
}
