import { parseAbiItem } from 'viem'
import { publicClient } from './client'

const logs = await publicClient.getLogs({
    address: '0xa566b7C2493e1b48363CCE6F862dC83678C86f03',
    event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
    fromBlock: 24755977n,
    toBlock: 24755980n
})

console.log(logs)