// Import scan functions from each protocol scanner
import { scanAaveOnce } from "./protocol-scanners/aave-scanner.ts";
import { scanCompoundOnce } from "./protocol-scanners/compound-scanner.ts";
import { scanMorphoOnce } from "./protocol-scanners/morpho-scanner.ts";
import { scanSparkOnce } from "./protocol-scanners/spark-scanner.ts";

// Optional: Shared utilities or config
// (e.g., import shared clients or error handlers)

async function unifiedScan() {
  while (true) {
    try {
      // Run scans sequentially to avoid overwhelming RPCs
      await scanAaveOnce();
      await scanCompoundOnce();
      await scanMorphoOnce();
      await scanSparkOnce();

      // Or run concurrently if safe:
      // await Promise.all([
      //   scanAaveOnce(),
      //   scanCompoundOnce(),
      //   scanMorphoOnce(),
      //   scanSparkOnce(),
      // ]);

      console.log("All protocols scanned. Sleeping...");
      await new Promise((resolve) => setTimeout(resolve, 30000)); // Unified sleep
    } catch (error) {
      console.error("Error in unified scan:", error);
      // Optional: Add retry logic or alerting
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
}

// Start the unified scanner
unifiedScan().catch(console.error);
