import { Hono } from "hono";
import { serve } from "@hono/node-server";
import sql from "../../db.js";

const app = new Hono();

// get all transfers for a specific address
app.get("/transfers/:address", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const transfers = await sql`
    select * from transfers
    where from_address = ${address}
    or to_address = ${address}
    order by block_number desc
    limit 50
  `;
  return c.json(transfers);
});

// get total volume sent from an address
app.get("/volume/:address", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const result = await sql`
    select sum(value_decimal) as total_volume
    from transfers
    where from_address = ${address}
  `;
  return c.json(result[0]);
});

// get latest indexed block
app.get("/status", async (c) => {
  const result = await sql`
    select max(block_number) as latest_block, count(*) as total_transfers
    from transfers
  `;
  return c.json(result[0]);
});

serve({ fetch: app.fetch, port: 3000 });
console.log("API running on http://localhost:3000");
