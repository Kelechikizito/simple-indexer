import TelegramBot from "node-telegram-bot-api";

import * as dotenv from "dotenv";
dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: false,
});
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

const EXPLORERS: Record<string, string> = {
  mainnet: "https://etherscan.io/tx",
  arbitrum: "https://arbiscan.io/tx",
  optimism: "https://optimistic.etherscan.io/tx",
  base: "https://basescan.org/tx",
  polygon: "https://polygonscan.com/tx",
  avalanche: "https://snowtrace.io/tx",
  linea: "https://lineascan.build/tx",
  zksync: "https://explorer.zksync.io/tx",
};

export async function sendLiquidationAlert(
  log: any,
  chain: string,
  protocol: string,
) {
  const debtToCover = Number(log.args.debtToCover) / 1e18;
  const explorerBase = EXPLORERS[chain] ?? "https://etherscan.io/tx";
  const txUrl = `${explorerBase}/${log.transactionHash}`;

  const message = `
🚨 *Liquidation Alert*

*Protocol:* ${protocol}
*Chain:* ${chain}
*Collateral:* \`${log.args.collateralAsset}\`
*Debt Asset:* \`${log.args.debtAsset}\`
*Borrower:* \`${log.args.user}\`
*Debt Covered:* $${debtToCover.toLocaleString()}
*Liquidator:* \`${log.args.liquidator}\`
*Block:* ${log.blockNumber}
*Tx:* [View on Explorer](${txUrl})
  `.trim();

  await bot.sendMessage(CHAT_ID, message, { parse_mode: "Markdown" });
}

// await sendLiquidationAlert(
//   {
//     args: {
//       collateralAsset: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
//       debtAsset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//       user: "0xabc...123",
//       debtToCover: 1000000000000000000n,
//       liquidator: "0xdef...456",
//     },
//     transactionHash:
//       "0x4e3a3754410177e6937ef1f84bba68ea139e8d1a2bab7c8a6f6f7a5b8e9d7c3b",
//     blockNumber: 24000000n,
//   },
//   "mainnet",
//   "aave",
// );
