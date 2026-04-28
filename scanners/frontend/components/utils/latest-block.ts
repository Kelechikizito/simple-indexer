// This file fetches the latest block numbers for 9 various EVM networks.

import {
  publicClient,
  publicClientArbitrum,
  publicClientOptimism,
  publicClientBase,
  publicClientZksync,
  publicClientAvalanche,
  publicClientLinea,
  publicClientMonad,
  publicClientPolygon,
} from "./client.js";

let latestBlockNumber: bigint | undefined;

// ======================
// Mainnet
// ======================
async function latestBlockMainnet(): Promise<bigint | undefined> {
  try {
    const latestBlock = await publicClient.getBlockNumber();
    latestBlockNumber = latestBlock;
    return latestBlock;
  } catch (error: unknown) {
    console.error(
      "❌ Failed to fetch Mainnet latest block:",
      error instanceof Error ? error.message : String(error),
    );
    return undefined;
  }
}

// ======================
// Arbitrum
// ======================
async function latestBlockArbitrum(): Promise<bigint | undefined> {
  try {
    const latestBlock = await publicClientArbitrum.getBlockNumber();
    latestBlockNumber = latestBlock;
    return latestBlock;
  } catch (error: unknown) {
    console.error(
      "❌ Failed to fetch Arbitrum latest block:",
      error instanceof Error ? error.message : String(error),
    );
    return undefined;
  }
}

// ======================
// Optimism
// ======================
async function latestBlockOptimism(): Promise<bigint | undefined> {
  try {
    const latestBlock = await publicClientOptimism.getBlockNumber();
    latestBlockNumber = latestBlock;
    return latestBlock;
  } catch (error: unknown) {
    console.error(
      "❌ Failed to fetch Optimism latest block:",
      error instanceof Error ? error.message : String(error),
    );
    return undefined;
  }
}

// ======================
// Base
// ======================
async function latestBlockBase(): Promise<bigint | undefined> {
  try {
    const latestBlock = await publicClientBase.getBlockNumber();
    latestBlockNumber = latestBlock;
    return latestBlock;
  } catch (error: unknown) {
    console.error(
      "❌ Failed to fetch Base latest block:",
      error instanceof Error ? error.message : String(error),
    );
    return undefined;
  }
}

// ======================
// zkSync
// ======================
async function latestBlockZksync(): Promise<bigint | undefined> {
  try {
    const latestBlock = await publicClientZksync.getBlockNumber();
    latestBlockNumber = latestBlock;
    return latestBlock;
  } catch (error: unknown) {
    console.error(
      "❌ Failed to fetch zkSync latest block:",
      error instanceof Error ? error.message : String(error),
    );
    return undefined;
  }
}

// ======================
// Avalanche
// ======================
async function latestBlockAvalanche(): Promise<bigint | undefined> {
  try {
    const latestBlock = await publicClientAvalanche.getBlockNumber();
    latestBlockNumber = latestBlock;
    return latestBlock;
  } catch (error: unknown) {
    console.error(
      "❌ Failed to fetch Avalanche latest block:",
      error instanceof Error ? error.message : String(error),
    );
    return undefined;
  }
}

// ======================
// Linea
// ======================
async function latestBlockLinea(): Promise<bigint | undefined> {
  try {
    const latestBlock = await publicClientLinea.getBlockNumber();
    latestBlockNumber = latestBlock;
    return latestBlock;
  } catch (error: unknown) {
    console.error(
      "❌ Failed to fetch Linea latest block:",
      error instanceof Error ? error.message : String(error),
    );
    return undefined;
  }
}

// ======================
// Monad
// ======================
async function latestBlockMonad(): Promise<bigint | undefined> {
  try {
    const latestBlock = await publicClientMonad.getBlockNumber();
    latestBlockNumber = latestBlock;
    return latestBlock;
  } catch (error: unknown) {
    console.error(
      "❌ Failed to fetch Monad latest block:",
      error instanceof Error ? error.message : String(error),
    );
    return undefined;
  }
}

// ======================
// Polygon
// ======================
async function latestBlockPolygon(): Promise<bigint | undefined> {
  try {
    const latestBlock = await publicClientPolygon.getBlockNumber();
    latestBlockNumber = latestBlock;
    return latestBlock;
  } catch (error: unknown) {
    console.error(
      "❌ Failed to fetch Polygon latest block:",
      error instanceof Error ? error.message : String(error),
    );
    return undefined;
  }
}

export {
  latestBlockMainnet,
  latestBlockArbitrum,
  latestBlockOptimism,
  latestBlockBase,
  latestBlockZksync,
  latestBlockAvalanche,
  latestBlockLinea,
  latestBlockMonad,
  latestBlockPolygon,
};
