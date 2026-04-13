import { parseAbiItem, formatUnits } from "viem";
import { publicClient } from "./config/client.js";
import { latestBlockMainnet } from "./utils/latest-block.ts";
import sql from "./backend/database/db.js";

const CONTRACT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function getTransfers(fromBlock: bigint, toBlock: bigint) {
  const logs = await publicClient.getLogs({
    address: CONTRACT,
    event: parseAbiItem(
      "event Transfer(address indexed, address indexed, uint256)",
    ),
    fromBlock,
    toBlock,
  });
  return logs;
}

async function insertTransfer({
  blockNumber,
  txHash,
  logIndex,
  from,
  to,
  valueRaw,
  valueDecimal,
  blockTimestamp,
}: {
  blockNumber: number;
  txHash: string;
  logIndex: number;
  from: string;
  to: string;
  valueRaw: string;
  valueDecimal: string;
  blockTimestamp: number;
}) {
  const result = await sql`
    insert into transfers
      (block_number, tx_hash, log_index, from_address, to_address, value_raw, value_decimal, block_timestamp)
    values
      (${blockNumber}, ${txHash}, ${logIndex}, ${from}, ${to}, ${valueRaw}, ${valueDecimal}, ${blockTimestamp})
    on conflict (tx_hash, log_index) do nothing
    returning *
  `;
  return result;
}

// ETH reorgs can cause previously indexed blocks to be removed from the canonical chain. To handle this, we can check if the block of each indexed transfer is still part of the canonical chain. If not, we can delete that transfer from our database.
async function deleteTransfer(txHash: string, logIndex: number) {
  await sql`
    delete from transfers
    where tx_hash = ${txHash}
    and log_index = ${logIndex}
  `;
  console.log(`Reorg detected — deleted tx: ${txHash} log: ${logIndex}`);
}

const decimals = (await publicClient.readContract({
  address: CONTRACT,
  abi: [parseAbiItem("function decimals() returns (uint8)")],
  functionName: "decimals",
})) as number;

let lastIndexedBlock: bigint | null = null;

while (true) {
  const latestBlockMainnetNumber = await latestBlockMainnet();

  if (!latestBlockMainnetNumber) {
    await new Promise((r) => setTimeout(r, 30_000));
    continue;
  }

  const fromBlock = lastIndexedBlock
    ? lastIndexedBlock + 1n
    : latestBlockMainnetNumber - 5n;
  const logs = await getTransfers(fromBlock, latestBlockMainnetNumber);
  console.log(
    `Fetched ${logs.length} logs from block ${fromBlock} to ${latestBlockMainnetNumber}`,
  );

  for (const log of logs) {
    if (log.removed) {
      await deleteTransfer(log.transactionHash, log.logIndex);
      continue;
    }

    const [from, to, value] = log.args as [string, string, bigint];
    await insertTransfer({
      blockNumber: Number(log.blockNumber),
      txHash: log.transactionHash,
      logIndex: log.logIndex,
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      valueRaw: value.toString(),
      valueDecimal: formatUnits(value, decimals),
      blockTimestamp: Number(log.blockTimestamp),
    });
  }

  lastIndexedBlock = latestBlockMainnetNumber;
  console.log(`Done. Sleeping 30 seconds...`);
  await new Promise((r) => setTimeout(r, 30_000));
}
