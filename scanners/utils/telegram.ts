import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: false,
});
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function sendLiquidationAlert(log: any, chain: string) {
  const debtToCover = Number(log.args.debtToCover) / 1e6; // adjust for decimals

  // only alert on high value liquidations
  if (debtToCover < 10_000) return;

  const message = `
🚨 *Liquidation Alert*

*Chain:* ${chain}
*Collateral:* \`${log.args.collateralAsset}\`
*Debt Asset:* \`${log.args.debtAsset}\`
*Borrower:* \`${log.args.user}\`
*Debt Covered:* $${debtToCover.toLocaleString()}
*Liquidator:* \`${log.args.liquidator}\`
*Tx:* \`${log.transactionHash}\`
*Block:* ${log.blockNumber}
  `.trim();

  await bot.sendMessage(CHAT_ID, message, { parse_mode: "Markdown" });
}
