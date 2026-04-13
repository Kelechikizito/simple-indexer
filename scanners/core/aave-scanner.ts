import { parseAbiItem, formatUnits } from "viem";
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
import { latestBlockMainnet } from "../utils/latest-block.ts";
import aaveV3PoolAddresses from "./aave-v3/pool-addresses.ts";
