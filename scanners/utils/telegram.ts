import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import sql from "../backend/database/db.js";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: true, // enabled to receive messages
});

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

// load all subscribers from postgres
async function getSubscribers(): Promise<string[]> {
  const result = await sql`select chat_id from telegram_subscribers`;
  return result.map((row) => row.chat_id);
}

// add a subscriber to postgres
async function addSubscriber(chatId: string): Promise<void> {
  await sql`
    insert into telegram_subscribers (chat_id)
    values (${chatId})
    on conflict (chat_id) do nothing
  `;
}

// remove a subscriber from postgres
async function removeSubscriber(chatId: string): Promise<void> {
  await sql`
    delete from telegram_subscribers
    where chat_id = ${chatId}
  `;
}

// /start — subscribe
bot.onText(/\/start/, async (msg) => {
  const chatId = String(msg.chat.id);
  await addSubscriber(chatId);
  bot.sendMessage(
    chatId,
    "✅ You're subscribed to LiquidScan alerts!\n\nYou'll receive real-time notifications whenever a liquidation is detected across Aave, Compound, Morpho and Spark.\n\nSend /stop to unsubscribe.",
  );
});

// /stop — unsubscribe
bot.onText(/\/stop/, async (msg) => {
  const chatId = String(msg.chat.id);
  await removeSubscriber(chatId);
  bot.sendMessage(
    chatId,
    "❌ You've been unsubscribed from LiquidScan alerts.",
  );
});

// /status — show subscriber count
bot.onText(/\/status/, async (msg) => {
  const chatId = String(msg.chat.id);
  const subscribers = await getSubscribers();
  bot.sendMessage(
    chatId,
    `📊 LiquidScan has ${subscribers.length} active subscribers.`,
  );
});

// send alert to all subscribers
export async function sendLiquidationAlert(
  log: any,
  chain: string,
  protocol: string,
  collateralSymbol: string = "Unknown",
  debtSymbol: string = "Unknown",
) {
  const debtToCover = Number(log.args.debtToCover) / 1e18;
  const explorerBase = EXPLORERS[chain] ?? "https://etherscan.io/tx";
  const txUrl = `${explorerBase}/${log.transactionHash}`;

  const message = `
🚨 *Liquidation Alert*

*Protocol:* ${protocol}
*Chain:* ${chain}
*Collateral:* ${collateralSymbol} \`${log.args.collateralAsset?.slice(0, 8)}...\`
*Debt Asset:* ${debtSymbol} \`${log.args.debtAsset?.slice(0, 8)}...\`
*Borrower:* \`${log.args.user || log.args.borrower}\`
*Debt Covered:* $${debtToCover.toLocaleString()}
*Liquidator:* \`${log.args.liquidator || log.args.caller}\`
*Block:* ${log.blockNumber}
*Tx:* [View on Explorer](${txUrl})
  `.trim();

  const subscribers = await getSubscribers();

  if (subscribers.length === 0) {
    console.log("[Telegram] No subscribers to notify.");
    return;
  }

  await Promise.all(
    subscribers.map((chatId) =>
      bot
        .sendMessage(chatId, message, { parse_mode: "Markdown" })
        .catch((err) =>
          console.error(`[Telegram] Failed to send to ${chatId}:`, err.message),
        ),
    ),
  );

  console.log(`[Telegram] Alert sent to ${subscribers.length} subscribers.`);
}
