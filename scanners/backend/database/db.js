import postgres from "postgres";

const sql = postgres("postgres://localhost:5432/defi_liquidation_indexer");

export default sql;
