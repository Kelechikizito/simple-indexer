**✅ Got it — you want to upgrade your Ethereum indexer to catch liquidation events.**

### Top 5 DeFi protocols on Ethereum (for liquidations) in 2026

These are the dominant **lending/money-market protocols** where most liquidations happen (ranked roughly by TVL and liquidation volume on Ethereum mainnet):

| Rank | Protocol                | Type                  | Approx. TVL (Ethereum) | Liquidation Event Name            | Notes                                            |
| ---- | ----------------------- | --------------------- | ---------------------- | --------------------------------- | ------------------------------------------------ |
| 1    | **Aave V3**             | Lending               | ~$18–23B+              | `LiquidationCall`                 | By far the biggest & most liquidations           |
| 2    | **Morpho**              | Lending (vaults/blue) | ~$6–7B+                | `Liquidate` (from EventsLib)      | Fastest growing, very active                     |
| 3    | **SparkLend**           | Lending (Sky/Maker)   | ~$2.5B+                | `LiquidationCall`                 | Aave fork → same event                           |
| 4    | **Compound V3 (Comet)** | Lending               | ~$2B+                  | `AbsorbCollateral` + `AbsorbDebt` | Different mechanism (no classic LiquidateBorrow) |
| 5    | **Summer.fi** / Fluid   | Lending/CDP           | Lower but relevant     | Protocol-specific                 | Smaller but still worth indexing                 |

These five cover **the vast majority** of liquidation volume on Ethereum (and their L2 deployments).

### Is there one universal liquidation event across EVM, L1, and L2?

**Short answer: No.**

There is **no ERC-standard or universal “Liquidation” event** like `Transfer` or `Approval`.

Every protocol defines its own custom event.  
However, the **top protocols are consistent** across chains:

- Aave V3 and SparkLend use the **exact same** `LiquidationCall` event on Ethereum, Arbitrum, Base, Optimism, etc.
- Morpho uses the same `Liquidate` event signature on all its deployments.
- Compound V3 uses the same `Absorb*` events everywhere.

→ So you **can** listen to the same event signatures on L1 + all major L2s (you just change the contract address + RPC per chain).

### Exact events you should index right now

1. **Aave V3 + SparkLend** (same event)

   ```solidity
   event LiquidationCall(
       address indexed collateralAsset,
       address indexed debtAsset,
       address indexed borrower,
       uint256 debtToCover,
       uint256 liquidatedCollateralAmount,
       address liquidator,
       bool receiveAToken
   );
   ```

2. **Morpho** (current version)

   ```solidity
   event Liquidate(
       Id indexed id,
       address indexed liquidator,
       address indexed borrower,
       uint256 repaidAssets,
       uint256 repaidShares,
       uint256 seizedAssets,
       uint256 badDebtAssets,
       uint256 badDebtShares
   );
   ```

3. **Compound V3**
   - `AbsorbCollateral(address indexed absorber, address indexed account, address asset, uint256 seizeAmount, uint256 value)`
   - `AbsorbDebt(address indexed absorber, address indexed account, uint256 basePaidOut, uint256 valueOfBasePaidOut)`

### How to upgrade your indexer (practical steps)

Since you already have an event-based indexer (Postgres + probably `eth_getLogs` or a listener):

1. **Add a new table** (or enrich your existing `logs` table):

   ```sql
   CREATE TABLE liquidations (
       id SERIAL PRIMARY KEY,
       chain_id INT NOT NULL,
       block_number BIGINT NOT NULL,
       tx_hash TEXT NOT NULL,
       protocol TEXT NOT NULL,           -- 'aave', 'morpho', 'spark', 'compound'
       collateral_asset TEXT,
       debt_asset TEXT,
       borrower TEXT,
       liquidator TEXT,
       debt_to_cover NUMERIC(78,0),
       liquidated_collateral NUMERIC(78,0),
       timestamp TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. **In your ingestion service**, add these topic0 filters (or use ABI decoding):
   - Compute the topic0 once (or hardcode them):
     - Aave/Spark `LiquidationCall` → `0xe413a321e8681d831f4dbccbca790d2952b56f977908e45be37335533e005286`
     - Morpho `Liquidate` → you can get it from their contract or compute with `keccak256`

3. **Best long-term approach** (recommended for you):
   - Make your indexer **protocol-aware** (store contract address → protocol mapping).
   - When you get a log, decode it using the correct ABI for that protocol.
   - This way you can easily add new protocols later.

Would you like me to give you:

- The exact topic0 hashes for all 5 protocols?
- A ready-to-copy TypeScript snippet (using `viem` or `ethers`) to filter + decode these events?
- The SQL + schema updates tailored to your current indexer?

Just tell me your tech stack details (e.g. are you using `viem`, `ethers`, `web3.js`?) and I’ll give you the exact code you need to add.

This upgrade will make your indexer extremely valuable for security researchers and DeFi dashboards. 🚀
