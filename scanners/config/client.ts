import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { arbitrum } from "viem/chains";
import { optimism } from "viem/chains";
import { base } from "viem/chains";
import { zksync } from "viem/chains";
import { avalanche } from "viem/chains";
import { linea } from "viem/chains";
import { monad } from "viem/chains";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth-mainnet.g.alchemy.com/v2/17GHtHVS2qieiVAr5wJjZ"),
});

export const publicClientArbitrum = createPublicClient({
  chain: arbitrum,
  transport: http("https://arb-mainnet.g.alchemy.com/v2/17GHtHVS2qieiVAr5wJjZ"),
});

export const publicClientOptimism = createPublicClient({
  chain: optimism,
  transport: http("https://opt-mainnet.g.alchemy.com/v2/17GHtHVS2qieiVAr5wJjZ"),
});

export const publicClientBase = createPublicClient({
  chain: base,
  transport: http(
    "https://base-mainnet.g.alchemy.com/v2/17GHtHVS2qieiVAr5wJjZ",
  ),
});

export const publicClientZksync = createPublicClient({
  chain: zksync,
  transport: http(
    "https://zksync-mainnet.g.alchemy.com/v2/17GHtHVS2qieiVAr5wJjZ",
  ),
});

export const publicClientAvalanche = createPublicClient({
  chain: avalanche,
  transport: http(
    "https://avax-mainnet.g.alchemy.com/v2/17GHtHVS2qieiVAr5wJjZ",
  ),
});

export const publicClientLinea = createPublicClient({
  chain: linea,
  transport: http(
    "https://linea-mainnet.g.alchemy.com/v2/17GHtHVS2qieiVAr5wJjZ",
  ),
});

export const publicClientMonad = createPublicClient({
  chain: monad,
  transport: http(
    "https://monad-mainnet.g.alchemy.com/v2/17GHtHVS2qieiVAr5wJjZ",
  ),
});
