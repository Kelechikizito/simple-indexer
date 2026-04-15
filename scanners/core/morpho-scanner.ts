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

