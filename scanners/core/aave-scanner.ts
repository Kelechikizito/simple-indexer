import { formatUnits } from "viem";
import {
  publicClient,
  publicClientArbitrum,
  publicClientAvalanche,
  publicClientBase,
  publicClientLinea,
  publicClientOptimism,
  publicClientPolygon,
  publicClientZksync,
} from "../config/client.ts";
import {
  latestBlockMainnet,
  latestBlockArbitrum,
  latestBlockOptimism,
} from "../utils/latest-block.ts";
import { aaveV3PoolAddresses } from "./aave-v3/pool-addresses.ts";
import { aaveV3LiquidationEventAbi } from "./liquidation-event-abi.ts";

let lastIndexedMainnet: bigint | null = null;
let lastIndexedArbitrum: bigint | null = null;
let lastIndexedOptimism: bigint | null = null;

while (true) {
  const latestBlock = await latestBlockMainnet();
  const latestBlockArb = await latestBlockArbitrum();
  const latestBlockOpt = await latestBlockOptimism();

  if (!latestBlock || !latestBlockArb || !latestBlockOpt) {
    await new Promise((r) => setTimeout(r, 50_000));
    continue;
  }

  const fromMainnet = lastIndexedMainnet
    ? lastIndexedMainnet + 1n
    : latestBlock - 8n;
  const fromArbitrum = lastIndexedArbitrum
    ? lastIndexedArbitrum + 1n
    : latestBlockArb - 4n;
  const fromOptimism = lastIndexedOptimism
    ? lastIndexedOptimism + 1n
    : latestBlockOpt - 4n;

  const logsMainnet = await publicClient.getLogs({
    address: aaveV3PoolAddresses[1],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock: fromMainnet,
    toBlock: latestBlock,
  });

  const logsArbitrum = await publicClientArbitrum.getLogs({
    address: aaveV3PoolAddresses[42161],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock: fromArbitrum,
    toBlock: latestBlockArb,
  });

  const logsOptimism = await publicClientOptimism.getLogs({
    address: aaveV3PoolAddresses[10],
    event: aaveV3LiquidationEventAbi[0],
    fromBlock: fromOptimism,
    toBlock: latestBlockOpt,
  });

  console.log(
    `Mainnet: ${logsMainnet.length} liquidations — blocks ${fromMainnet} to ${latestBlock}`,
  );
  console.log(
    `Arbitrum: ${logsArbitrum.length} liquidations — blocks ${fromArbitrum} to ${latestBlockArb}`,
  );
  console.log(
    `Optimism: ${logsOptimism.length} liquidations — blocks ${fromOptimism} to ${latestBlockOpt}`,
  );

  lastIndexedMainnet = latestBlock;
  lastIndexedArbitrum = latestBlockArb;
  lastIndexedOptimism = latestBlockOpt;

  await new Promise((r) => setTimeout(r, 50_000));
}
