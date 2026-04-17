import { formatUnits } from "viem";
import { scanAaveOnce } from "./protocol-scanners/aave-scanner.ts";
import { scanCompoundOnce } from "./protocol-scanners/compound-scanner.ts";
import { scanMorphoOnce } from "./protocol-scanners/morpho-scanner.ts";
import { scanSparkOnce } from "./protocol-scanners/spark-scanner.ts";
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
  while (true) {
    try {
      // Run scans sequentially to avoid overwhelming RPCs
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
      }

      // TODO: Process/persist logs here
      // Example: await persistLogs(allLogs);
      // Example: await sendAlert(allLogs);

      console.log("All protocols scanned. Sleeping 30 seconds...");
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
