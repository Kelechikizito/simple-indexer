import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import sql from "../database/db.js";

const app = new Hono();

app.use("/*", cors({ origin: "http://localhost:3000" }));

const EXPLORERS: Record<string, string> = {
  mainnet: "https://etherscan.io/tx",
  arbitrum: "https://arbiscan.io/tx",
  optimism: "https://optimistic.etherscan.io/tx",
  base: "https://basescan.org/tx",
  polygon: "https://polygonscan.com/tx",
  avalanche: "https://snowtrace.io/tx",
  linea: "https://lineascan.build/tx",
  zksync: "https://explorer.zksync.io/tx",
};

function normalizeRow(row: any) {
  const args =
    typeof row.args === "string" ? JSON.parse(row.args) : (row.args ?? {});
  const argsDecimal =
    typeof row.args_decimal === "string"
      ? JSON.parse(row.args_decimal)
      : (row.args_decimal ?? {});

  const explorerBase = EXPLORERS[row.network] ?? "https://etherscan.io/tx";

  const fieldMap: Record<string, any> = {
    aave: {
      borrower: args.user,
      liquidator: args.liquidator,
      collateralAsset: args.collateralAsset,
      debtAsset: args.debtAsset,
      debtRepaid: argsDecimal.debtToCover,
      collateralSeized: argsDecimal.liquidatedCollateralAmount,
      badDebt: "0",
    },
    morpho: {
      borrower: args.borrower,
      liquidator: args.caller,
      collateralAsset: args.id ?? "Morpho Market",
      debtAsset: "N/A",
      debtRepaid: argsDecimal.repaidAssets,
      collateralSeized: argsDecimal.seizedAssets,
      badDebt: argsDecimal.badDebtAssets ?? "0",
    },
    compound: {
      borrower: args.borrower,
      liquidator: args.absorber,
      collateralAsset: args.asset,
      debtAsset: "Base Asset",
      debtRepaid: argsDecimal.usdValue,
      collateralSeized: argsDecimal.collateralAbsorbed,
      badDebt: "0",
    },
    spark: {
      borrower: args.user,
      liquidator: args.liquidator,
      collateralAsset: args.collateralAsset,
      debtAsset: args.debtAsset,
      debtRepaid: argsDecimal.debtToCover,
      collateralSeized: argsDecimal.liquidatedCollateralAmount,
      badDebt: "0",
    },
  };

  const mapped = fieldMap[row.protocol] ?? {};

  return {
    id: String(row.id),
    protocol: row.protocol,
    network: row.network,
    blockNumber: Number(row.block_number),
    txHash: row.tx_hash,
    timestamp: row.block_timestamp,
    borrower: mapped.borrower ?? "unknown",
    liquidator: mapped.liquidator ?? "unknown",
    collateralAsset: mapped.collateralAsset ?? "N/A",
    debtAsset: mapped.debtAsset ?? "N/A",
    debtRepaid: mapped.debtRepaid ?? "0",
    collateralSeized: mapped.collateralSeized ?? "0",
    badDebt: mapped.badDebt ?? "0",
    explorerUrl: `${explorerBase}/${row.tx_hash}`,
    createdAt: row.created_at,
  };
}

app.get("/api/liquidations", async (c) => {
  const protocol = c.req.query("protocol");
  const network = c.req.query("network");
  const limit = Number(c.req.query("limit") || 100);

  const result = await sql`
    select * from liquidation_events
    where 1=1
    ${protocol ? sql`and protocol = ${protocol}` : sql``}
    ${network ? sql`and network = ${network}` : sql``}
    order by block_number desc
    limit ${limit}
  `;

  return c.json(result.map(normalizeRow));
});

app.get("/api/liquidations/:txHash", async (c) => {
  const txHash = c.req.param("txHash").toLowerCase();
  const result = await sql`
    select * from liquidation_events
    where tx_hash = ${txHash}
  `;
  return c.json(result[0] ? normalizeRow(result[0]) : null);
});

app.get("/api/borrower/:address", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const result = await sql`
    select * from liquidation_events
    where args->>'user' = ${address}
    or args->>'borrower' = ${address}
    order by block_number desc
    limit 50
  `;
  return c.json(result.map(normalizeRow));
});

app.get("/api/liquidator/:address", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const result = await sql`
    select * from liquidation_events
    where args->>'liquidator' = ${address}
    or args->>'caller' = ${address}
    order by block_number desc
    limit 50
  `;
  return c.json(result.map(normalizeRow));
});

// ↓ specific route BEFORE general route
app.get("/api/status/:network", async (c) => {
  const network = c.req.param("network").toLowerCase();
  const result = await sql`
    select
      max(block_number) as latest_block,
      count(*) as total_liquidations
    from liquidation_events
    where network = ${network}
  `;
  return c.json(result[0]);
});

app.get("/api/status", async (c) => {
  const result = await sql`
    select
      count(*) as total_liquidations,
      count(distinct protocol) as protocols_monitored,
      count(distinct network) as networks_monitored,
      max(block_number) as latest_block,
      max(created_at) as last_updated
    from liquidation_events
  `;
  return c.json(result[0]);
});

app.get("/api/stats/protocol", async (c) => {
  const result = await sql`
    select protocol, count(*) as total_liquidations
    from liquidation_events
    group by protocol
    order by total_liquidations desc
  `;
  return c.json(result);
});

app.get("/api/stats/network", async (c) => {
  const result = await sql`
    select network, count(*) as total_liquidations
    from liquidation_events
    group by network
    order by total_liquidations desc
  `;
  return c.json(result);
});

serve({ fetch: app.fetch, port: 3001 });
console.log("API running on http://localhost:3001");
