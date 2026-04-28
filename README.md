# DeFi Liquidation Indexer

> **A high-performance, real-time indexer for DeFi liquidation events across 8 EVM networks**

The DeFi Liquidation Indexer monitors and indexes on-chain liquidation events from the major DeFi lending protocols — Aave V3, Compound V3, Morpho, and Spark — across 8 EVM networks. It provides a unified REST API, a real-time dashboard, and a Telegram alert bot for instant liquidation notifications.

🤖 **Telegram Bot:** [@KayKayDLI_bot](https://t.me/KayKayDLI_bot) — Subscribe to receive real-time liquidation alerts

---

## Key Features

- **Multi-Protocol Indexing** — Tracks liquidation events across Aave V3, Compound V3, Morpho, and Spark in a unified pipeline
- **8 EVM Networks** — Ethereum, Arbitrum, Base, Optimism, Polygon, Avalanche, Linea, zkSync
- **Unified Normalizer** — Protocol-agnostic normalization layer that maps different event field names (e.g. `user` vs `borrower`, `caller` vs `liquidator`) into a consistent data shape
- **Real-Time Telegram Alerts** — [@KayKayDLI_bot](https://t.me/KayKayDLI_bot) broadcasts liquidation alerts to all subscribers the moment an event is detected. Anyone can subscribe with `/start`
- **Reorg Handling** — Detects and rolls back `removed: true` logs to keep indexed data accurate
- **REST API** — Hono-powered API serving normalized liquidation data with filtering by protocol and network
- **Live Dashboard** — Next.js frontend with real-time liquidation feed, metrics cards, and per-chain block tracking
- **PostgreSQL Persistence** — All liquidation events persisted with full args, decimal-formatted values, and explorer URLs

---

## Architecture

```
DEFI-LIQUIDATION-INDEXER/
├── scanners/
│   ├── backend/
│   │   ├── api/
│   │   │   └── api.ts                  # Hono REST API server
│   │   ├── database/
│   │   │   ├── db.js                   # postgres.js connection
│   │   │   └── schema.sql              # All table definitions
│   ├── config/
│   │   └── client.ts                   # viem public clients per network
│   ├── core/
│   │   ├── aave-v3/
│   │   │   └── pool-addresses.ts       # Aave V3 Pool addresses per chain
│   │   ├── compound-v3/
│   │   │   └── addresses.ts            # Compound V3 Comet addresses per market
│   │   ├── morpho/
│   │   │   └── addresses.ts            # Morpho Blue contract addresses
│   │   ├── spark/
│   │   │   └── addresses.ts            # SparkLend Pool addresses
│   │   ├── protocol-scanners/
│   │   │   ├── aave-scanner.ts         # Aave V3 getLogs handler
│   │   │   ├── compound-scanner.ts     # Compound V3 getLogs handler
│   │   │   ├── morpho-scanner.ts       # Morpho getLogs handler
│   │   │   └── spark-scanner.ts        # Spark getLogs handler
│   │   ├── liquidation-event-abi.ts    # ABI definitions for all liquidation events
│   │   └── unified-scanner.ts          # Main loop — aggregates all protocols
│   ├── frontend/                        # Next.js dashboard
│   ├── utils/
│   │   ├── token-lookup/               # Per-network token address → symbol maps
│   │   ├── latest-block.ts             # Fetches latest block per network
│   │   └── telegram.ts                 # Telegram bot — alerts + /start /stop
│   └── package.json
```

### How It Works

```
unified-scanner.ts (every 30s)
  ├── scanAaveOnce()     → eth_getLogs on Aave V3 Pool (8 networks)
  ├── scanCompoundOnce() → eth_getLogs on Compound V3 Comet markets
  ├── scanMorphoOnce()   → eth_getLogs on Morpho Blue (multi-network)
  └── scanSparkOnce()    → eth_getLogs on SparkLend Pool (mainnet)
        ↓
  normalizeRow()         → maps protocol-specific fields to common shape
        ↓
  persistLogs()          → INSERT into liquidation_events (ON CONFLICT DO NOTHING)
        ↓
  sendLiquidationAlert() → broadcasts to all Telegram subscribers
```

---

## Supported Protocols & Networks

| Protocol    | Mainnet | Arbitrum | Base | Optimism | Polygon | Avalanche | Linea | zkSync |
| ----------- | ------- | -------- | ---- | -------- | ------- | --------- | ----- | ------ |
| Aave V3     | ✅      | ✅       | ✅   | ✅       | ✅      | ✅        | ✅    | ✅     |
| Compound V3 | ✅      | ✅       | ✅   | ✅       | ✅      | ❌        | ✅    | ❌     |
| Morpho      | ✅      | ✅       | ✅   | ✅       | ✅      | ✅        | ✅    | ❌     |
| Spark       | ✅      | ❌       | ❌   | ❌       | ❌      | ❌        | ❌    | ❌     |

---

## Quick Start

### Prerequisites

- Node.js (latest LTS)
- PostgreSQL 14+
- Alchemy API keys (one per network)
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/defi-liquidation-indexer
cd defi-liquidation-indexer/scanners

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Fill in your API keys
```

### Environment Variables

```bash
# Alchemy RPC keys — one per network
ETH_MAINNET_API_KEY=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ARBITRUM_MAINNET_API_KEY=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
OPTIMISM_MAINNET_API_KEY=https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY
BASE_MAINNET_API_KEY=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
ZKSYNC_MAINNET_API_KEY=https://zksync-mainnet.g.alchemy.com/v2/YOUR_KEY
AVALANCHE_MAINNET_API_KEY=https://avax-mainnet.g.alchemy.com/v2/YOUR_KEY
LINEA_MAINNET_API_KEY=https://linea-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGON_MAINNET_API_KEY=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# Etherscan (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_key

# Telegram bot
TELEGRAM_BOT_TOKEN=your_bot_token
# TELEGRAM_CHAT_ID is not required — the bot uses dynamic subscriber management
# Anyone can subscribe by sending /start to @KayKayDLI_bot
```

### Database Setup

```bash
# Create the database
psql postgres -c 'CREATE DATABASE defi_liquidation_indexer'

# Run the schema
psql defi_liquidation_indexer -f scanners/backend/database/schema.sql
```

---

## Running the Project

Each of these runs in a separate terminal:

```bash
# 1. Start the unified scanner (also starts the Telegram bot listener)
cd scanners/core
npx tsx unified-scanner.ts

# 2. Start the REST API
cd scanners/backend/api
npx tsx api.ts

# 3. Start the frontend dashboard
cd scanners/frontend
npm run dev
```

> The Telegram bot listener starts automatically when the unified scanner runs. No separate process needed.

To prevent your machine from sleeping while the scanner runs:

```bash
caffeinate -i npx tsx core/unified-scanner.ts
```

---

## Telegram Bot

[@KayKayDLI_bot](https://t.me/KayKayDLI_bot) sends real-time liquidation alerts to subscribers.

| Command   | Action                          |
| --------- | ------------------------------- |
| `/start`  | Subscribe to liquidation alerts |
| `/stop`   | Unsubscribe                     |
| `/status` | View current subscriber count   |

Each alert includes: protocol, chain, collateral asset, debt asset, borrower address, debt covered, liquidator address, block number, and a direct link to the transaction on the relevant block explorer.

---

## REST API

The Hono API runs on `http://localhost:3001`.

| Method | Endpoint                    | Description                                                            |
| ------ | --------------------------- | ---------------------------------------------------------------------- |
| GET    | `/api/liquidations`         | All liquidation events (supports `?protocol=`, `?network=`, `?limit=`) |
| GET    | `/api/liquidations/:txHash` | Single event by transaction hash                                       |
| GET    | `/api/borrower/:address`    | All liquidations for a borrower                                        |
| GET    | `/api/liquidator/:address`  | All liquidations by a liquidator                                       |
| GET    | `/api/status`               | Global indexer stats (total events, latest block)                      |
| GET    | `/api/status/:network`      | Per-network stats and latest indexed block                             |
| GET    | `/api/stats/protocol`       | Liquidation count grouped by protocol                                  |
| GET    | `/api/stats/network`        | Liquidation count grouped by network                                   |

---

## Database Schema

### `liquidation_events`

Core table storing all indexed liquidation logs.

| Column            | Type      | Description                                    |
| ----------------- | --------- | ---------------------------------------------- |
| `id`              | BIGSERIAL | Primary key                                    |
| `protocol`        | VARCHAR   | `aave`, `compound`, `morpho`, `spark`          |
| `network`         | VARCHAR   | `mainnet`, `arbitrum`, `base`, etc.            |
| `block_number`    | BIGINT    | Block where the event occurred                 |
| `tx_hash`         | VARCHAR   | Transaction hash                               |
| `log_index`       | INTEGER   | Log index within the transaction               |
| `block_timestamp` | BIGINT    | Unix timestamp of the block                    |
| `args`            | JSONB     | Raw event args (bigints serialized as strings) |
| `args_decimal`    | JSONB     | Human-readable decimal values                  |
| `created_at`      | TIMESTAMP | When the row was inserted                      |

Unique constraint: `(tx_hash, log_index)`

### `indexing_progress`

Tracks the last indexed block per protocol/network for resuming after restarts.

### `telegram_subscribers`

Stores chat IDs, usernames, and subscription status for Telegram alert recipients.

---

## Event Normalization

Each protocol uses different field names for the same concepts. The normalizer maps them to a consistent shape before storage and API delivery:

| Field             | Aave V3                      | Compound V3          | Morpho          | Spark                        |
| ----------------- | ---------------------------- | -------------------- | --------------- | ---------------------------- |
| Borrower          | `user`                       | `borrower`           | `borrower`      | `user`                       |
| Liquidator        | `liquidator`                 | `absorber`           | `caller`        | `liquidator`                 |
| Collateral seized | `liquidatedCollateralAmount` | `collateralAbsorbed` | `seizedAssets`  | `liquidatedCollateralAmount` |
| Debt repaid       | `debtToCover`                | `usdValue`           | `repaidAssets`  | `debtToCover`                |
| Bad debt          | —                            | —                    | `badDebtAssets` | —                            |

---

## License

MIT
