import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: true,
});

// ====== USER STORAGE ======
const USERS_FILE = "./users.json";

function loadUsers(): number[] {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveUsers(users: number[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Load users into memory
let users = new Set<number>(loadUsers());

// ====== CAPTURE USERS ======
bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (!users.has(chatId)) {
    users.add(chatId);
    saveUsers([...users]);
    console.log("Saved new user:", chatId);
  }
});

// ====== EXPLORERS ======
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

// ====== ALERT FUNCTION ======
export async function sendLiquidationAlert(
  log: any,
  chain: string,
  protocol: string,
) {
  const allUsers = loadUsers(); // ALWAYS fresh load

  if (allUsers.length === 0) {
    console.log("No users to notify.");
    return;
  }

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

  for (const chatId of allUsers) {
    try {
      await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    } catch (err) {
      console.error(`Failed to send to ${chatId}`, err);
    }
  }
}

bot.onText(/\/test/, async (msg) => {
  const chatId = msg.chat.id;

  const fakeLog = {
    args: {
      collateralAsset: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      debtAsset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      user: "0xabc...123",
      debtToCover: 1000000000000000000n,
      liquidator: "0xdef...456",
    },
    transactionHash:
      "0x4e3a3754410177e6937ef1f84bba68ea139e8d1a2bab7c8a6f6f7a5b8e9d7c3b",
    blockNumber: 24000000n,
  };

  await sendLiquidationAlert(fakeLog, "mainnet", "aave");

  bot.sendMessage(chatId, "✅ Test alert sent to all users");
});
