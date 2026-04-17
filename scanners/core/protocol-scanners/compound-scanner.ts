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

import {
  compoundV3AddressesMainnet,
  compoundV3AddressesArbitrum,
  compoundV3AddressesOptimism,
  compoundV3AddressesBase,
  compoundV3AddressesLinea,
  compoundV3AddressesPolygon,
} from "../compound-v3/addresses.ts";
import { compoundV3LiquidationEventAbi } from "../liquidation-event-abi.ts";

let lastIndexedBlock: bigint | null = null;
let lastIndexedBlockArbitrum: bigint | null = null;
let lastIndexedBlockOptimism: bigint | null = null;
let lastIndexedBlockBase: bigint | null = null;
let lastIndexedBlockLinea: bigint | null = null;
let lastIndexedBlockPolygon: bigint | null = null;

async function getLiquidateEventMainnet(fromBlock: bigint, toBlock: bigint) {
  const mainnetLogs = await publicClient.getLogs({
    address: [
      compoundV3AddressesMainnet.USDC,
      compoundV3AddressesMainnet.USDT,
      compoundV3AddressesMainnet.WETH,
    ],
    event: compoundV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return mainnetLogs;
}

async function getLiquidateEventArbitrum(fromBlock: bigint, toBlock: bigint) {
  const arbitrumLogs = await publicClientArbitrum.getLogs({
    address: [
      compoundV3AddressesArbitrum.USDC,
      compoundV3AddressesArbitrum.USDT,
      compoundV3AddressesArbitrum.WETH,
    ],
    event: compoundV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return arbitrumLogs;
}

async function getLiquidateEventOptimism(fromBlock: bigint, toBlock: bigint) {
  const optimismLogs = await publicClientOptimism.getLogs({
    address: [
      compoundV3AddressesOptimism.USDC,
      compoundV3AddressesOptimism.USDT,
      compoundV3AddressesOptimism.WETH,
    ],
    event: compoundV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return optimismLogs;
}

async function getLiquidateEventBase(fromBlock: bigint, toBlock: bigint) {
  const baseLogs = await publicClientBase.getLogs({
    address: [compoundV3AddressesBase.USDC, compoundV3AddressesBase.WETH],
    event: compoundV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return baseLogs;
}

async function getLiquidateEventLinea(fromBlock: bigint, toBlock: bigint) {
  const lineaLogs = await publicClientLinea.getLogs({
    address: [compoundV3AddressesLinea.USDC, compoundV3AddressesLinea.WETH],
    event: compoundV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return lineaLogs;
}

async function getLiquidateEventPolygon(fromBlock: bigint, toBlock: bigint) {
  const polygonLogs = await publicClientPolygon.getLogs({
    address: [compoundV3AddressesPolygon.USDC, compoundV3AddressesPolygon.USDT],
    event: compoundV3LiquidationEventAbi[0],
    fromBlock,
    toBlock,
  });
  return polygonLogs;
}

export async function scanCompoundOnce() {
  const latestBlockMainnetNumber = await latestBlockMainnet();
  const latestArbitrumBlock = await latestBlockArbitrum();
  const latestOptimismBlock = await latestBlockOptimism();
  const latestBaseBlock = await latestBlockBase();
  const latestLineaBlock = await latestBlockLinea();
  const latestPolygonBlock = await latestBlockPolygon();

  if (
    !latestBlockMainnetNumber ||
    !latestArbitrumBlock ||
    !latestOptimismBlock ||
    !latestBaseBlock ||
    !latestLineaBlock ||
    !latestPolygonBlock
  ) {
    return {
      protocol: "compound",
      mainnet: [],
      arbitrum: [],
      optimism: [],
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

  const logsMainnetUSDC = await getLiquidateEventMainnet(fromBlock, toBlock);
  const logsArbitrumUSDC = await getLiquidateEventArbitrum(
    fromBlockArbitrum,
    toBlockArbitrum,
  );
  const logsOptimismUSDC = await getLiquidateEventOptimism(
    fromBlockOptimism,
    toBlockOptimism,
  );
  const logsBaseUSDC = await getLiquidateEventBase(fromBlockBase, toBlockBase);
  const logsLineaUSDC = await getLiquidateEventLinea(
    fromBlockLinea,
    toBlockLinea,
  );
  const logsPolygonUSDC = await getLiquidateEventPolygon(
    fromBlockPolygon,
    toBlockPolygon,
  );

  lastIndexedBlock = toBlock;
  lastIndexedBlockArbitrum = toBlockArbitrum;
  lastIndexedBlockOptimism = toBlockOptimism;
  lastIndexedBlockBase = toBlockBase;
  lastIndexedBlockLinea = toBlockLinea;
  lastIndexedBlockPolygon = toBlockPolygon;

  return {
    protocol: "compound",
    mainnet: logsMainnetUSDC,
    arbitrum: logsArbitrumUSDC,
    optimism: logsOptimismUSDC,
    base: logsBaseUSDC,
    linea: logsLineaUSDC,
    polygon: logsPolygonUSDC,
  };
}
