// The fle creates the connection to each network, i.e, to a node in each 9 networks.

import * as dotenv from "dotenv";
dotenv.config();
import { createPublicClient, http } from "viem";
import {
  mainnet,
  arbitrum,
  optimism,
  base,
  zksync,
  avalanche,
  linea,
  monad,
  polygon,
} from "viem/chains";

const ETH_MAINNET_API_KEY = process.env.ETH_MAINNET_API_KEY;
const ARBITRUM_MAINNET_API_KEY = process.env.ARBITRUM_MAINNET_API_KEY;
const OPTIMISM_MAINNET_API_KEY = process.env.OPTIMISM_MAINNET_API_KEY;
const BASE_MAINNET_API_KEY = process.env.BASE_MAINNET_API_KEY;
const ZKSYNC_MAINNET_API_KEY = process.env.ZKSYNC_MAINNET_API_KEY;
const AVALANCHE_MAINNET_API_KEY = process.env.AVALANCHE_MAINNET_API_KEY;
const LINEA_MAINNET_API_KEY = process.env.LINEA_MAINNET_API_KEY;
const MONAD_MAINNET_API_KEY = process.env.MONAD_MAINNET_API_KEY;
const POLYGON_MAINNET_API_KEY = process.env.POLYGON_MAINNET_API_KEY;

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(`${ETH_MAINNET_API_KEY}`),
});

export const publicClientArbitrum = createPublicClient({
  chain: arbitrum,
  transport: http(`${ARBITRUM_MAINNET_API_KEY}`),
});

export const publicClientOptimism = createPublicClient({
  chain: optimism,
  transport: http(`${OPTIMISM_MAINNET_API_KEY}`),
});

export const publicClientBase = createPublicClient({
  chain: base,
  transport: http(`${BASE_MAINNET_API_KEY}`),
});

export const publicClientZksync = createPublicClient({
  chain: zksync,
  transport: http(`${ZKSYNC_MAINNET_API_KEY}`),
});

export const publicClientAvalanche = createPublicClient({
  chain: avalanche,
  transport: http(`${AVALANCHE_MAINNET_API_KEY}`),
});

export const publicClientLinea = createPublicClient({
  chain: linea,
  transport: http(`${LINEA_MAINNET_API_KEY}`),
});

export const publicClientMonad = createPublicClient({
  chain: monad,
  transport: http(`${MONAD_MAINNET_API_KEY}`),
});

export const publicClientPolygon = createPublicClient({
  chain: polygon,
  transport: http(`${POLYGON_MAINNET_API_KEY}`),
});
