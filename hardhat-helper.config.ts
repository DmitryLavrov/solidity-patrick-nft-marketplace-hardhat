import { BigNumber } from 'ethers'
import {ethers} from 'hardhat'

export interface NetworkConfigItem {
  ethUsdPriceFeed?: string
  name: string
  blockConfirmations?: number
  vrfCoordinatorV2?: string
  mintFee?: BigNumber
  gasLane?: string
  subscriptionId?: string
  callbackGasLimit?: string
  interval?: string
}

export interface NetworkConfig {
  [key: number | string]: NetworkConfigItem
}

const networkConfig: NetworkConfig = {
  default: {
    name: "hardhat",
  },
  4: {
    name: 'rinkeby',
    blockConfirmations: 6,
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab', // https://docs.chain.link/docs/vrf-contracts/#rinkeby-testnet
    subscriptionId: '6741', // https://vrf.chain.link/rinkeby/6741,
    gasLane: '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
    mintFee: ethers.utils.parseEther('0.01'),
    callbackGasLimit: '500000',
    ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e', // https://docs.chain.link/docs/ethereum-addresses/#Rinkeby%20Testnet
  },
  31337: {
    name: 'localhost',
    blockConfirmations: 1,
    gasLane: '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
    mintFee: ethers.utils.parseEther('0.01'),
    callbackGasLimit: '500000',
  }
}

const developmentChains = ['hardhat', 'localhost', 'ganache']

export {
  networkConfig,
  developmentChains
}
