import { UNIVERSAL_ROUTER_ADDRESS as URA } from '@uniswap/universal-router-sdk'
import { TENDERLY_CHAIN_FORK_PREFIX } from 'constants/chains'

// Wrap the "UNIVERSAL_ROUTER_ADDRESS" coming from SDK and add mapping
// from tenderly-forked-networks into addresses on the original network where this is deployed
export function UNIVERSAL_ROUTER_ADDRESS(chainId: number) {
  try {
    return URA(chainId)
  } catch (e) {
    switch ('' + chainId) {
      case `${TENDERLY_CHAIN_FORK_PREFIX}1`: // mainnet
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}5`: // goerli
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}11155111`: // sepolia
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}137`: // polygon
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}80001`: // polygon mumbai
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}10`: // optimism
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}420`: // optimism goerli
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}42161`: // arbitrum
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}421613`: // arbitrum goerli
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}42220`: // celo
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}44787`: // celo alfajores
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      case `${TENDERLY_CHAIN_FORK_PREFIX}56`: // binance smart chain
        return '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
      default:
        throw new Error(`Universal Router not deployed on chain ${chainId}`)
    }
  }
}
