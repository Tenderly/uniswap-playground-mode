import { JsonRpcProvider } from '@ethersproject/providers'
import axios, { AxiosResponse } from 'axios'

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

const { REACT_APP_TENDERLY_PROJECT_SLUG, REACT_APP_TENDERLY_ACCESS_KEY, REACT_APP_TENDERLY_USERNAME } = process.env

const somewhereInTenderly = (where: string = REACT_APP_TENDERLY_PROJECT_SLUG || '') =>
  axios.create({
    baseURL: `https://api.tenderly.co/api/v1/${where}`,
    headers: {
      'X-Access-Key': REACT_APP_TENDERLY_ACCESS_KEY || '',
      'Content-Type': 'application/json',
    },
  })

const inProject = (...path: any[]) =>
  [`account/${REACT_APP_TENDERLY_USERNAME}/project/${REACT_APP_TENDERLY_PROJECT_SLUG}`, ...path]
    .join('/')
    .replace('//', '')

const anAxiosOnTenderly = () => somewhereInTenderly('')
const axiosOnTenderly = anAxiosOnTenderly()

// todo: cache these poor axioses
const axiosInProject = somewhereInTenderly(inProject())

const removeFork = async (forkId: string) => {
  console.log('Removing test fork', forkId)
  return await axiosOnTenderly.delete(inProject(`fork/${forkId}`))
}

export async function shareFork(uuid: string) {
  const forkUrl = `https://api.tenderly.co/api/v1/account/${REACT_APP_TENDERLY_USERNAME}/project/${REACT_APP_TENDERLY_PROJECT_SLUG}/fork/${uuid}/share`
  return axiosOnTenderly.post(forkUrl, null)
}

// export async function unshareFork(uuid: string) {}

export async function aTenderlyFork(fork: TenderlyForkRequest): Promise<TenderlyForkProvider> {
  console.log('Forking', fork)
  const forkResponse = await axiosInProject.post(`/fork`, fork)
  // console.log(JSON.stringify(forkResponse.data, null, 2));
  const forkId = forkResponse.data.root_transaction.fork_id

  const rpcUrl = `https://rpc.tenderly.co/fork/${forkId}`
  const forkProvider = new JsonRpcProvider(rpcUrl)

  const blockNumberStr = (forkResponse.data.root_transaction.receipt.blockNumber as string).replace('0x', '')
  const blockNumber: number = Number.parseInt(blockNumberStr, 16)

  console.info(`\nForked with fork id ${forkId} at block number ${blockNumber}`)

  console.info(`https://dashboard.tenderly.co/${inProject('fork', forkId)}`)
  console.info('JSON-RPC:', rpcUrl)

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
