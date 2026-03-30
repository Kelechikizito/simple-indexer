import { publicClient } from '../client.js'

let latestBlockNumber: bigint | undefined;

async function latestBlock(): Promise<bigint | undefined> {
    try {
        const latestBlock: bigint = await publicClient.getBlockNumber();
        console.log("The latest block number is", latestBlock);
        latestBlockNumber = latestBlock;
    } catch (error: unknown) {
        console.error('Request failed:', error instanceof Error ? error.message : String(error));
    }
    return latestBlockNumber;
}

export default latestBlock;