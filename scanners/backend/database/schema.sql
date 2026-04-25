-- =============================================================================
-- DEFI LIQUIDATION INDEXER — DATABASE SCHEMA
-- =============================================================================


-- -----------------------------------------------------------------------------
-- LIQUIDATION EVENTS
-- Persists raw liquidation logs from all protocols and networks
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS liquidation_events (
  id              BIGSERIAL PRIMARY KEY,
  protocol        VARCHAR(50)  NOT NULL,
  network         VARCHAR(50)  NOT NULL,
  block_number    BIGINT       NOT NULL,
  tx_hash         VARCHAR(66)  NOT NULL,
  log_index       INTEGER      NOT NULL,
  block_timestamp BIGINT       NOT NULL,
  args            JSONB,
  args_decimal    JSONB,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_tx_log UNIQUE (tx_hash, log_index)
);

CREATE INDEX IF NOT EXISTS idx_protocol          ON liquidation_events (protocol);
CREATE INDEX IF NOT EXISTS idx_network           ON liquidation_events (network);
CREATE INDEX IF NOT EXISTS idx_protocol_network  ON liquidation_events (protocol, network);
CREATE INDEX IF NOT EXISTS idx_block_number      ON liquidation_events (block_number);
CREATE INDEX IF NOT EXISTS idx_block_timestamp   ON liquidation_events (block_timestamp);
CREATE INDEX IF NOT EXISTS idx_tx_hash           ON liquidation_events (tx_hash);


-- -----------------------------------------------------------------------------
-- INDEXING PROGRESS
-- Tracks the last indexed block per protocol/network for resuming after restart
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS indexing_progress (
  id                 SERIAL      PRIMARY KEY,
  protocol           VARCHAR(50) NOT NULL,
  network            VARCHAR(50) NOT NULL,
  last_indexed_block BIGINT,
  last_updated_at    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_protocol_network UNIQUE (protocol, network)
);


-- -----------------------------------------------------------------------------
-- TELEGRAM SUBSCRIBERS
-- Stores chat IDs of users who have subscribed to liquidation alerts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS telegram_subscribers (
  id             SERIAL    PRIMARY KEY,
  chat_id        TEXT      NOT NULL UNIQUE,
  username       TEXT,
  first_name     TEXT,
  is_active      BOOLEAN   DEFAULT TRUE,
  subscribed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_active_subscribers ON telegram_subscribers (is_active);