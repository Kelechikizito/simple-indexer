import postgres from 'postgres'

const sql = postgres('postgres://localhost:5432/simple_indexer')

export default sql