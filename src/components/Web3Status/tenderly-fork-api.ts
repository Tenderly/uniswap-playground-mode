import { JsonRpcProvider } from '@ethersproject/providers'
import axios, { AxiosResponse } from 'axios'

const { REACT_APP_TENDERLY_PROJECT_SLUG, REACT_APP_TENDERLY_ACCESS_KEY, REACT_APP_TENDERLY_USERNAME } = process.env

function somewhereInTenderly(where: string = REACT_APP_TENDERLY_PROJECT_SLUG || '') {
  return axios.create({
    baseURL: `https://api.tenderly.co/api/v1/${where}`,
    headers: {
      'X-Access-Key': REACT_APP_TENDERLY_ACCESS_KEY || '',
      'Content-Type': 'application/json',
    },
  })
}

function inTenderlyProject(...path: any[]) {
  return [`account/${REACT_APP_TENDERLY_USERNAME}/project/${REACT_APP_TENDERLY_PROJECT_SLUG}`, ...path]
    .join('/')
    .replace('//', '')
}

const axiosOnTenderly = somewhereInTenderly('')

const removeFork = async (forkId: string) => {
  console.log('Removing test fork', forkId)
  return await axiosOnTenderly.delete(inTenderlyProject(`fork/${forkId}`))
}

export async function shareFork(uuid: string) {
  const forkUrl = `https://api.tenderly.co/api/v1/account/${REACT_APP_TENDERLY_USERNAME}/project/${REACT_APP_TENDERLY_PROJECT_SLUG}/fork/${uuid}/share`
  return axiosOnTenderly.post(forkUrl, null)
}

export async function aTenderlyFork(fork: TenderlyForkRequest): Promise<TenderlyForkProvider> {
  console.log('Forking', fork)
  const forkResponse = await somewhereInTenderly(inTenderlyProject()).post(`/fork`, fork)

  const forkId = forkResponse.data.root_transaction.fork_id

  const rpcUrl = `https://rpc.tenderly.co/fork/${forkId}`
  const forkProvider = new JsonRpcProvider(rpcUrl)

  const blockNumberStr = (forkResponse.data.root_transaction.receipt.blockNumber as string).replace('0x', '')
  const blockNumber: number = Number.parseInt(blockNumberStr, 16)

  console.info(
    `\nForked ${fork.network_id} with fork id ${forkId} at block number ${blockNumber} giving it chain ID ${fork.chain_config?.chain_id}`
  )

  console.info(`https://dashboard.tenderly.co/${inTenderlyProject('fork', forkId)}`)

  const publicUrl = `https://dashboard.tenderly.co/shared/fork/${forkId}/transactions`

  return {
    rpcUrl,
    provider: forkProvider,
    blockNumber,
    forkUUID: forkId,
    removeFork: () => removeFork(forkId),
    networkId: fork.network_id as any,
    publicUrl,
    chainId: forkResponse.data.simulation_fork.chain_config.chain_id,
    baseChainId: fork.network_id,
  }
}

type TenderlyForkRequest = {
  block_number?: number
  network_id: string
  transaction_index?: number
  initial_balance?: number
  alias?: string
  description?: string
  chain_config?: {
    chain_id?: number
    homestead_block?: number
    dao_fork_support?: boolean
    eip_150_block?: number
    eip_150_hash?: string
    eip_155_block?: number
    eip_158_block?: number
    byzantium_block?: number
    constantinople_block?: number
    petersburg_block?: number
    istanbul_block?: number
    berlin_block?: number
  }
}

export type TenderlyForkProvider = {
  rpcUrl: string
  provider: JsonRpcProvider
  forkUUID: string
  blockNumber: number
  chainId: number
  networkId: number
  publicUrl: string
  baseChainId: string
  /**
   * map from address to given address' balance
   */
  removeFork: () => Promise<AxiosResponse<any>>
}
