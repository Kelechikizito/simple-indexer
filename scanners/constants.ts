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
