import { mainnetTokens } from "./mainnet-tokens.ts";
import { arbitrumTokens } from "./arbitrum-tokens.ts";
import { baseTokens } from "./base-tokens.ts";
import { optimismTokens } from "./optimism-tokens.ts";
import { polygonTokens } from "./polygon-tokens.ts";
import { avalancheTokens } from "./avalanche-tokens.ts";
import { lineaTokens } from "./linea-tokens.ts";
import { zksyncTokens } from "./zksync-tokens.ts";

const TOKEN_LOOKUP: Record<string, Record<string, string>> = {
  mainnet: mainnetTokens,
  arbitrum: arbitrumTokens,
  base: baseTokens,
  optimism: optimismTokens,
  polygon: polygonTokens,
  avalanche: avalancheTokens,
  linea: lineaTokens,
  zksync: zksyncTokens,
};

export function resolveTokenSymbol(address: string, network: string): string {
  if (!address || address === "N/A") return "N/A";
  const networkMap = TOKEN_LOOKUP[network.toLowerCase()] ?? {};
  return networkMap[address.toLowerCase()] ?? shortenAddress(address);
}

function shortenAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
