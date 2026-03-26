2. Use a websocket coonection
3. Use Postgres for the Database.
4. Check out the gorm library

2
The biggest beginner mistake is trying to index everything. Start by picking one contract and one event type (e.g. Transfer events on an ERC-20), and build the full pipeline end-to-end for that narrow case first.(What sort of indexer do i want to build?)


The best way to understand all of this concretely is to write a tiny indexer that just tracks ERC-20 Transfer events for a single contract — even 50 lines of JS with viem will touch every one of these steps.
