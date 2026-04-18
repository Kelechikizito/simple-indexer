-- Liquidation events table for persisting logs from all protocols
CREATE TABLE IF NOT EXISTS liquidation_events (
  id BIGSERIAL PRIMARY KEY,
  protocol VARCHAR(50) NOT NULL,
  network VARCHAR(50) NOT NULL,
  block_number BIGINT NOT NULL,
  tx_hash VARCHAR(66) NOT NULL,
  log_index INTEGER NOT NULL,
  block_timestamp BIGINT NOT NULL,
  args JSONB,
  args_decimal JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure uniqueness per transaction and log index
  CONSTRAINT unique_tx_log UNIQUE (tx_hash, log_index)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_protocol ON liquidation_events (protocol);
CREATE INDEX IF NOT EXISTS idx_network ON liquidation_events (network);
CREATE INDEX IF NOT EXISTS idx_protocol_network ON liquidation_events (protocol, network);
CREATE INDEX IF NOT EXISTS idx_block_number ON liquidation_events (block_number);
CREATE INDEX IF NOT EXISTS idx_block_timestamp ON liquidation_events (block_timestamp);
CREATE INDEX IF NOT EXISTS idx_tx_hash ON liquidation_events (tx_hash);

-- Optional: Track the last indexed block per protocol/network for resuming
CREATE TABLE IF NOT EXISTS indexing_progress (
  id SERIAL PRIMARY KEY,
  protocol VARCHAR(50) NOT NULL,
  network VARCHAR(50) NOT NULL,
  last_indexed_block BIGINT,
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_protocol_network UNIQUE (protocol, network)
);
