import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import sql from "../database/db.js";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
  }),
);

// get all liquidation events (with optional filters)
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

  return c.json(result);
});

// get a single liquidation by tx hash
app.get("/api/liquidations/:txHash", async (c) => {
  const txHash = c.req.param("txHash").toLowerCase();
  const result = await sql`
    select * from liquidation_events
    where tx_hash = ${txHash}
  `;
  return c.json(result[0] || null);
});

// get liquidations for a specific borrower
app.get("/api/borrower/:address", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const result = await sql`
    select * from liquidation_events
    where args->>'user' = ${address}
    or args->>'borrower' = ${address}
    order by block_number desc
    limit 50
  `;
  return c.json(result);
});

// get liquidations for a specific liquidator
app.get("/api/liquidator/:address", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const result = await sql`
    select * from liquidation_events
    where args->>'liquidator' = ${address}
    or args->>'caller' = ${address}
    order by block_number desc
    limit 50
  `;
  return c.json(result);
});

// get summary stats
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

// get stats broken down by protocol
app.get("/api/stats/protocol", async (c) => {
  const result = await sql`
    select
      protocol,
      count(*) as total_liquidations,
      count(distinct network) as networks
    from liquidation_events
    group by protocol
    order by total_liquidations desc
  `;
  return c.json(result);
});

// get stats broken down by network
app.get("/api/stats/network", async (c) => {
  const result = await sql`
    select
      network,
      count(*) as total_liquidations,
      count(distinct protocol) as protocols
    from liquidation_events
    group by network
    order by total_liquidations desc
  `;
  return c.json(result);
});

// get block number of liquidation
app.get("/api/latest-block", async (c) => {
  const protocol = c.req.query("protocol");
  const network = c.req.query("network");

  const result = await sql`
    select max(block_number) as latest_block
    from liquidation_events
    where 1=1
    ${protocol ? sql`and protocol = ${protocol}` : sql``}
    ${network ? sql`and network = ${network}` : sql``}
  `;

  return c.json({
    latest_block: result[0]?.latest_block ?? null,
  });
});

serve({ fetch: app.fetch, port: 3001 });
console.log("API running on http://localhost:3001");
