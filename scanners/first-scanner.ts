import { parseAbiItem } from 'viem'
import { publicClient } from './client'

const logs = await publicClient.getLogs({  
  address: '0xa566b7C2493e1b48363CCE6F862dC83678C86f03',
  event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
  args: [
    '0x5a4Fc9Dd7b390a0F9b2909a0C34CE55CEDC42377',
    '0xb6e9b27668184217F91ae6EBF4E2B087F9fF01Df'
  ],
  fromBlock: 24755977n,
  toBlock: 24755980n
})

console.log(logs)