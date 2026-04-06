import {
  AaveV3Ethereum,
  AaveV3Avalanche,
  AaveV3Arbitrum,
  AaveV3Optimism,
  AaveV3Base,
  AaveV3ZkSync,
  AaveV3Linea,
  AaveV3Polygon,
} from "@aave-dao/aave-address-book";

export const aaveV3PoolAddresses = {
  1: AaveV3Ethereum.POOL, // Ethereum Mainnet
  42161: AaveV3Arbitrum.POOL, // Arbitrum One
  10: AaveV3Optimism.POOL, // Optimism
  8453: AaveV3Base.POOL, // Base
  324: AaveV3ZkSync.POOL, // zkSync Era
  59144: AaveV3Linea.POOL, // Linea Mainnet
  137: AaveV3Polygon.POOL, // Polygon Mainnet
  43114: AaveV3Avalanche.POOL, // Avalanche Mainnet
} as const;
