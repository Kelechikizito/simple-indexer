2. Use a websocket coonection
3. Use Postgres for the Database.
4. Check out the gorm library

2
The biggest beginner mistake is trying to index everything. Start by picking one contract and one event type (e.g. Transfer events on an ERC-20), and build the full pipeline end-to-end for that narrow case first.(What sort of indexer do i want to build?)

The best way to understand all of this concretely is to write a tiny indexer that just tracks ERC-20 Transfer events for a single contract — even 50 lines of JS with viem will touch every one of these steps.

=> DeFi liquidation events on ethereum

Hey,

1. I used JSON-RPC as the data source.
2. Yes, the indexing engine is implemented in plain JavaScript.
3. For the API layer, I chose REST to keep the system as simple as possible and to optimize for cost efficiency.
4. Regarding ERC20 Approval events, I included them because approve-related vulnerabilities have been actively exploited in recent incidents, so monitoring them can help identify potentially vulnerable or exploited contracts.
