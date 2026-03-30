import { parseAbiItem, formatUnits } from 'viem'
import { publicClient } from './client.js'
import latestBlock from './utils/latest-block.js' 
import sql from './db.js'

const CONTRACT = '0xa566b7C2493e1b48363CCE6F862dC83678C86f03'

// same as getUsersOver but for transfers
async function getTransfers(fromBlock: bigint, toBlock: bigint) {
  const logs = await publicClient.getLogs({
    address: CONTRACT,
    event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
    fromBlock,
    toBlock
  })
  return logs
}

// same as insertUser but for a transfer log
async function insertTransfer({ blockNumber, txHash, logIndex, from, to, valueRaw, valueDecimal, blockTimestamp }: { blockNumber: number; txHash: string; logIndex: number; from: string; to: string; valueRaw: string; valueDecimal: string; blockTimestamp: number }) {
  const result = await sql`
    insert into transfers
      (block_number, tx_hash, log_index, from_address, to_address, value_raw, value_decimal, block_timestamp)
    values
      (${blockNumber}, ${txHash}, ${logIndex}, ${from}, ${to}, ${valueRaw}, ${valueDecimal}, ${blockTimestamp})
    on conflict (tx_hash, log_index) do nothing
    returning *
  `
  return result
}

// main
const decimals = await publicClient.readContract({
  address: CONTRACT,
  abi: [parseAbiItem('function decimals() returns (uint8)')],
  functionName: 'decimals'
}) as number

const latestBlockNumber = await latestBlock();
if (!latestBlockNumber) {
  throw new Error('Failed to fetch latest block number');
}
const logs = await getTransfers(latestBlockNumber - 5n, latestBlockNumber);
console.log(`Fetched ${logs.length} logs, writing to DB...`)

for (const log of logs) {
  const [from, to, value] = log.args as [string, string, bigint]

  await insertTransfer({
    blockNumber: Number(log.blockNumber),
    txHash: log.transactionHash,
    logIndex: log.logIndex,
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    valueRaw: value.toString(),
    valueDecimal: formatUnits(value, decimals),
    blockTimestamp: Number(log.blockTimestamp)
  })
}

console.log('Done.')
await sql.end()