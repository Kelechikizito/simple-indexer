// Liquidation Event ABI for Aave V3
export const aaveV3LiquidationEventAbi = [
  {
    type: "event",
    name: "LiquidationCall",
    inputs: [
      { name: "collateralAsset", type: "address", indexed: true },
      { name: "debtAsset", type: "address", indexed: true },
      { name: "user", type: "address", indexed: true },
      { name: "debtToCover", type: "uint256", indexed: false },
      { name: "liquidatedCollateralAmount", type: "uint256", indexed: false },
      { name: "liquidator", type: "address", indexed: false },
      { name: "receiveAToken", type: "bool", indexed: false },
    ],
  },
] as const;

// Liquidation Event ABI for Compound V3
export const compoundV3LiquidationEventAbi = [
  {
    type: "event",
    name: "AbsorbCollateral",
    inputs: [
      { name: "absorber", type: "address", indexed: true },
      { name: "borrower", type: "address", indexed: true },
      { name: "asset", type: "address", indexed: true },
      { name: "collateralAbsorbed", type: "uint256", indexed: false },
      { name: "usdValue", type: "uint256", indexed: false },
    ],
  },
] as const;

// Liquidation Event ABI for SparkLend
export const sparkLendLiquidationEventAbi = [
  {
    type: "event",
    name: "LiquidationCall",
    inputs: [
      { name: "collateralAsset", type: "address", indexed: true },
      { name: "debtAsset", type: "address", indexed: true },
      { name: "user", type: "address", indexed: true },
      { name: "debtToCover", type: "uint256", indexed: false },
      { name: "liquidatedCollateralAmount", type: "uint256", indexed: false },
      { name: "liquidator", type: "address", indexed: false },
      { name: "receiveAToken", type: "bool", indexed: false },
    ],
  },
] as const;

// Liquidation Event ABI for Morpho
export const morphoLiquidationEventAbi = [
  {
    type: "event",
    name: "Liquidate",
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "caller", type: "address", indexed: true },
      { name: "borrower", type: "address", indexed: true },
      { name: "repaidAssets", type: "uint256", indexed: false },
      { name: "repaidShares", type: "uint256", indexed: false },
      { name: "seizedAssets", type: "uint256", indexed: false },
      { name: "badDebtAssets", type: "uint256", indexed: false },
      { name: "badDebtShares", type: "uint256", indexed: false },
    ],
  },
] as const;

export const CHAIN_IDS = {
  mainnet: 1,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
  zksync: 324,
  avalanche: 43114,
  linea: 59144,
  monad: 10143,
  polygon: 137,
} as const;
