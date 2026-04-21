import { formatUnits } from "viem";
import { scanAaveOnce } from "./protocol-scanners/aave-scanner.ts";
import { scanCompoundOnce } from "./protocol-scanners/compound-scanner.ts";
import { scanMorphoOnce } from "./protocol-scanners/morpho-scanner.ts";
import { scanSparkOnce } from "./protocol-scanners/spark-scanner.ts";
import { sendLiquidationAlert } from "../utils/telegram.ts";
import sql from "../backend/database/db.js";

export interface AggregatedLogs {
  protocol: string;
  mainnet: any[];
  arbitrum?: any[];
  optimism?: any[];
  avalanche?: any[];
  base?: any[];
  linea?: any[];
  polygon?: any[];
  zksync?: any[];
}

export interface AllProtocolLogs {
  aave: AggregatedLogs | null;
  compound: AggregatedLogs | null;
  morpho: AggregatedLogs | null;
  spark: AggregatedLogs | null;
  totalLogsCollected: number;
  timestamp: Date;
}

/**
 * Optional: Format event logs using viem's formatUnits
 * Pass this to unified scan if you want formatted values
 */
export function formatLogValues(logs: any[], decimals: number = 18): any[] {
  return logs.map((log) => {
    if (log.args) {
      return {
        ...log,
        args: {
          ...log.args,
          // Format common liquidation event args (example)
          repayAmount: log.args.repayAmount
            ? formatUnits(log.args.repayAmount, decimals)
            : undefined,
          collateralAmount: log.args.collateralAmount
            ? formatUnits(log.args.collateralAmount, decimals)
            : undefined,
        },
      };
    }
    return log;
  });
}

/**
 * Aggregate logs from all protocol scans
 */
async function unifiedScan() {
  console.log(`[${new Date().toISOString()}] Starting unified scanner...`);
  while (true) {
    try {
      // This step scans sequentially to avoid overwhelming RPCs
      const aaveLogs = await scanAaveOnce();
      const compoundLogs = await scanCompoundOnce();
      const morphoLogs = await scanMorphoOnce();
      const sparkLogs = await scanSparkOnce();

      // Aggregate all logs
      const allLogs: AllProtocolLogs = {
        aave: aaveLogs,
        compound: compoundLogs,
        morpho: morphoLogs,
        spark: sparkLogs,
        totalLogsCollected:
          (aaveLogs?.mainnet?.length || 0) +
          (aaveLogs?.arbitrum?.length || 0) +
          (aaveLogs?.optimism?.length || 0) +
          (aaveLogs?.avalanche?.length || 0) +
          (aaveLogs?.base?.length || 0) +
          (aaveLogs?.linea?.length || 0) +
          (aaveLogs?.polygon?.length || 0) +
          (aaveLogs?.zksync?.length || 0) +
          (compoundLogs?.mainnet?.length || 0) +
          (compoundLogs?.arbitrum?.length || 0) +
          (compoundLogs?.optimism?.length || 0) +
          (compoundLogs?.base?.length || 0) +
          (compoundLogs?.linea?.length || 0) +
          (compoundLogs?.polygon?.length || 0) +
          (morphoLogs?.mainnet?.length || 0) +
          (morphoLogs?.arbitrum?.length || 0) +
          (morphoLogs?.optimism?.length || 0) +
          (morphoLogs?.avalanche?.length || 0) +
          (morphoLogs?.base?.length || 0) +
          (morphoLogs?.linea?.length || 0) +
          (morphoLogs?.polygon?.length || 0) +
          (sparkLogs?.mainnet?.length || 0),
        timestamp: new Date(),
      };

      // Log summary
      if (allLogs.totalLogsCollected > 0) {
        console.log(
          `[${new Date().toISOString()}] Collected ${allLogs.totalLogsCollected} total logs`,
        );
        if (aaveLogs) {
          console.log(
            `  Aave - Mainnet: ${aaveLogs.mainnet?.length || 0}, Arbitrum: ${aaveLogs.arbitrum?.length || 0}, Optimism: ${aaveLogs.optimism?.length || 0}, Avalanche: ${aaveLogs.avalanche?.length || 0}, Base: ${aaveLogs.base?.length || 0}, Linea: ${aaveLogs.linea?.length || 0}, Polygon: ${aaveLogs.polygon?.length || 0}, Zksync: ${aaveLogs.zksync?.length || 0}`,
          );
        }
        if (compoundLogs) {
          console.log(
            `  Compound - Mainnet: ${compoundLogs.mainnet?.length || 0}, Arbitrum: ${compoundLogs.arbitrum?.length || 0}, Optimism: ${compoundLogs.optimism?.length || 0}, Base: ${compoundLogs.base?.length || 0}, Linea: ${compoundLogs.linea?.length || 0}, Polygon: ${compoundLogs.polygon?.length || 0}`,
          );
        }
        if (morphoLogs) {
          console.log(
            `  Morpho - Mainnet: ${morphoLogs.mainnet?.length || 0}, Arbitrum: ${morphoLogs.arbitrum?.length || 0}, Optimism: ${morphoLogs.optimism?.length || 0}, Avalanche: ${morphoLogs.avalanche?.length || 0}, Base: ${morphoLogs.base?.length || 0}, Linea: ${morphoLogs.linea?.length || 0}, Polygon: ${morphoLogs.polygon?.length || 0}`,
          );
        }
        if (sparkLogs) {
          console.log(`  Spark - Mainnet: ${sparkLogs.mainnet?.length || 0}`);
        }

        // Persist logs to database
        console.log(
          `[${new Date().toISOString()}] Persisting ${allLogs.totalLogsCollected} logs to database...`,
        );
        await persistLogs(allLogs);
      } else {
        console.log(
          `[${new Date().toISOString()}] No liquidation events found. Sleeping 30 seconds...`,
        );
      }

      console.log("All protocols scanned.");
      await new Promise((resolve) => setTimeout(resolve, 30000)); // Unified sleep
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error in unified scan:`,
        error,
      );
      // Optional: Add retry logic or alerting
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
}

// Start the unified scanner
unifiedScan().catch(console.error);

/**
 * Fetch the last indexed block for a specific protocol and network
 */
async function getLastIndexedBlock(protocol: string, network: string) {
  const result = await sql`
    select max(block_number) as last_block
    from liquidation_events
    where protocol = ${protocol}
    and network = ${network}
  `;
  return result[0]?.last_block ? BigInt(result[0].last_block) : null;
}

/**
 * Insert liquidation event logs into Postgres
 */
async function insertLiquidatedLogs({
  protocol,
  network,
  blockNumber,
  txHash,
  logIndex,
  blockTimestamp,
  args,
  argsDecimal,
}: {
  protocol: string;
  network: string;
  blockNumber: number;
  txHash: string;
  logIndex: number;
  blockTimestamp: number;
  args: Record<string, any>;
  argsDecimal: Record<string, string>;
}) {
  const result = await sql`
    insert into liquidation_events
      (protocol, network, block_number, tx_hash, log_index, block_timestamp, args, args_decimal)
    values
      (${protocol}, ${network}, ${blockNumber}, ${txHash}, ${logIndex}, ${blockTimestamp}, ${JSON.stringify(args)}, ${JSON.stringify(argsDecimal)})
    on conflict (tx_hash, log_index) do nothing
    returning *
  `;
  return result;
}

// send telegram alert after successful insert

/**
 * Delete liquidation event logs (handles reorgs)
 */
async function deleteLiquidatedLogs(txHash: string, logIndex: number) {
  await sql`
    delete from liquidation_events
    where tx_hash = ${txHash}
    and log_index = ${logIndex}
  `;
  console.log(`[Reorg] Deleted event: tx: ${txHash} log: ${logIndex}`);
}

/**
 * Process and persist logs from all protocols
 */
async function persistLogs(allLogs: AllProtocolLogs) {
  const protocols = [
    { name: "aave", logs: allLogs.aave },
    { name: "compound", logs: allLogs.compound },
    { name: "morpho", logs: allLogs.morpho },
    { name: "spark", logs: allLogs.spark },
  ];

  for (const { name, logs } of protocols) {
    if (!logs) continue;

    const networks = [
      { key: "mainnet", id: 1 },
      { key: "arbitrum", id: 42161 },
      { key: "optimism", id: 10 },
      { key: "avalanche", id: 43114 },
      { key: "base", id: 8453 },
      { key: "linea", id: 59144 },
      { key: "polygon", id: 137 },
      { key: "zksync", id: 324 },
    ];

    for (const { key, id } of networks) {
      const networkLogs = (logs as any)[key];
      if (!networkLogs || networkLogs.length === 0) continue;

      for (const log of networkLogs) {
        if (log.removed) {
          // Handle reorg: delete this log
          await deleteLiquidatedLogs(log.transactionHash, log.logIndex);
          continue;
        }

        try {
          // Convert args to serializable format (BigInt -> string)
          const argsRaw: Record<string, any> = {};
          const argsDecimal: Record<string, string> = {};

          if (log.args) {
            for (const [key, value] of Object.entries(log.args)) {
              if (typeof value === "bigint") {
                // Store raw value as string
                argsRaw[key] = value.toString();
                // Store formatted decimal
                argsDecimal[key] = formatUnits(value, 18); // Adjust decimals as needed per protocol
              } else {
                argsRaw[key] = String(value);
                argsDecimal[key] = String(value);
              }
            }
          }

          await insertLiquidatedLogs({
            protocol: name,
            network: key,
            blockNumber: Number(log.blockNumber),
            txHash: log.transactionHash,
            logIndex: log.logIndex,
            blockTimestamp: Number(log.blockTimestamp),
            args: argsRaw,
            argsDecimal,
          });
          await sendLiquidationAlert(log, key, name);
        } catch (error) {
          console.error(`Failed to insert ${name} log from ${key}:`, error);
        }
      }

      console.log(`  [${name}/${key}] Persisted ${networkLogs.length} logs`);
    }
  }
}
