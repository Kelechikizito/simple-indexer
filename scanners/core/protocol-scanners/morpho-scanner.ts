import {
  publicClient,
  publicClientArbitrum,
  publicClientAvalanche,
  publicClientBase,
  publicClientLinea,
  publicClientOptimism,
  publicClientPolygon,
} from "../../config/client.js";
import {
  latestBlockMainnet,
  latestBlockArbitrum,
  latestBlockOptimism,
  latestBlockAvalanche,
  latestBlockBase,
  latestBlockLinea,
  latestBlockPolygon,
} from "../../utils/latest-block.ts";

import { morphoBlueAddresses } from "../morpho/addresses.ts";
import { morphoLiquidationEventAbi } from "../liquidation-event-abi.ts";

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

async function getLiquidateEventArbitrum(fromBlock: bigint, toBlock: bigint) {
  const arbitrumLogs = await publicClientArbitrum.getLogs({
    address: morphoBlueAddresses[42161],
    event: morphoLiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return arbitrumLogs;
}

async function getLiquidateEventOptimism(fromBlock: bigint, toBlock: bigint) {
  const optimismLogs = await publicClientOptimism.getLogs({
    address: morphoBlueAddresses[10],
    event: morphoLiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return optimismLogs;
}

async function getLiquidateEventAvalanche(fromBlock: bigint, toBlock: bigint) {
  const avalancheLogs = await publicClientAvalanche.getLogs({
    address: morphoBlueAddresses[43114],
    event: morphoLiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return avalancheLogs;
}

async function getLiquidateEventBase(fromBlock: bigint, toBlock: bigint) {
  const baseLogs = await publicClientBase.getLogs({
    address: morphoBlueAddresses[8453],
    event: morphoLiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return baseLogs;
}

async function getLiquidateEventLinea(fromBlock: bigint, toBlock: bigint) {
  const lineaLogs = await publicClientLinea.getLogs({
    address: morphoBlueAddresses[59144],
    event: morphoLiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return lineaLogs;
}

async function getLiquidateEventPolygon(fromBlock: bigint, toBlock: bigint) {
  const polygonLogs = await publicClientPolygon.getLogs({
    address: morphoBlueAddresses[137],
    event: morphoLiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return polygonLogs;
}

export async function scanMorphoOnce() {
  const latestBlockMainnetNumber = await latestBlockMainnet();
  const latestArbitrumBlock = await latestBlockArbitrum();
  const latestOptimismBlock = await latestBlockOptimism();
  const latestAvalancheBlock = await latestBlockAvalanche();
  const latestBaseBlock = await latestBlockBase();
  const latestLineaBlock = await latestBlockLinea();
  const latestPolygonBlock = await latestBlockPolygon();

  if (
    !latestBlockMainnetNumber ||
    !latestArbitrumBlock ||
    !latestOptimismBlock ||
    !latestAvalancheBlock ||
    !latestBaseBlock ||
    !latestLineaBlock ||
    !latestPolygonBlock
  ) {
    return {
      protocol: "morpho",
      mainnet: [],
      arbitrum: [],
      optimism: [],
      avalanche: [],
      base: [],
      linea: [],
      polygon: [],
    };
  }

  const fromBlock = lastIndexedBlock
    ? lastIndexedBlock + 1n
    : latestBlockMainnetNumber - 5n;
  const fromBlockArbitrum = lastIndexedBlockArbitrum
    ? lastIndexedBlockArbitrum + 1n
    : latestArbitrumBlock - 5n;
  const fromBlockOptimism = lastIndexedBlockOptimism
    ? lastIndexedBlockOptimism + 1n
    : latestOptimismBlock - 5n;
  const fromBlockAvalanche = lastIndexedBlockAvalanche
    ? lastIndexedBlockAvalanche + 1n
    : latestAvalancheBlock - 5n;
  const fromBlockBase = lastIndexedBlockBase
    ? lastIndexedBlockBase + 1n
    : latestBaseBlock - 5n;
  const fromBlockLinea = lastIndexedBlockLinea
    ? lastIndexedBlockLinea + 1n
    : latestLineaBlock - 5n;
  const fromBlockPolygon = lastIndexedBlockPolygon
    ? lastIndexedBlockPolygon + 1n
    : latestPolygonBlock - 5n;

  const toBlock =
    latestBlockMainnetNumber - fromBlock > 9n
      ? fromBlock + 9n
      : latestBlockMainnetNumber;
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

  const logs = await getLiquidateEventMainnet(fromBlock, toBlock);
  const arbitrumLogs = await getLiquidateEventArbitrum(
    fromBlockArbitrum,
    toBlockArbitrum,
  );
  const optimismLogs = await getLiquidateEventOptimism(
    fromBlockOptimism,
    toBlockOptimism,
  );
  const avalancheLogs = await getLiquidateEventAvalanche(
    fromBlockAvalanche,
    toBlockAvalanche,
  );
  const baseLogs = await getLiquidateEventBase(fromBlockBase, toBlockBase);
  const lineaLogs = await getLiquidateEventLinea(fromBlockLinea, toBlockLinea);
  const polygonLogs = await getLiquidateEventPolygon(
    fromBlockPolygon,
    toBlockPolygon,
  );

  lastIndexedBlock = toBlock;
  lastIndexedBlockArbitrum = toBlockArbitrum;
  lastIndexedBlockOptimism = toBlockOptimism;
  lastIndexedBlockAvalanche = toBlockAvalanche;
  lastIndexedBlockBase = toBlockBase;
  lastIndexedBlockLinea = toBlockLinea;
  lastIndexedBlockPolygon = toBlockPolygon;

  return {
    protocol: "morpho",
    mainnet: logs,
    arbitrum: arbitrumLogs,
    optimism: optimismLogs,
    avalanche: avalancheLogs,
    base: baseLogs,
    linea: lineaLogs,
    polygon: polygonLogs,
  };
}
