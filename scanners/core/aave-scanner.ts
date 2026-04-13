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
let lastIndexedBlockArb: bigint | null = null;

const latestBlock = await latestBlockMainnet();
const latestArbitrumBlock = await latestBlockArbitrum();
const latestOptimismBlock = await latestBlockOptimism();
