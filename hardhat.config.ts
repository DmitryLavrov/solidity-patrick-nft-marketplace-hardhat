import {HardhatUserConfig} from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-deploy'
// import '@nomiclabs/hardhat-waffle'
import 'dotenv/config'


const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || ''
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || ''
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ''
const REPORT_GAS = process.env.REPORT_GAS === 'true' ?? false

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
      chainId: 4
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0 // let's make deployer as accountZero
    },
    player: {
      default: 1 // let's make player as accountOne
    }
  },
}
export default config
