import { Hono } from "hono";
import sql from "/../utils/db.js";
const app = new Hono();

app.get("/", (c) => c.text("Hono!"));

export default app;
