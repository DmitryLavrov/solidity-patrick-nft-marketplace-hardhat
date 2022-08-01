import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/types'
import {network} from 'hardhat'
import {developmentChains, networkConfig} from '../hardhat-helper.config'
import {verify} from '../utils/verify'
import {NftMarketplace} from '../typechain-types'


const deployNftMarketplace: DeployFunction = async function ({getNamedAccounts, deployments}: HardhatRuntimeEnvironment) {
  const {deploy, log} = deployments
  const {deployer} = await getNamedAccounts()
  const chainId = network.config.chainId || 31337

  log("------------------------------------------------")
  const args: (string | undefined)[] = []
  const contractNftMarketplace = await deploy('NftMarketplace', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[chainId].blockConfirmations || 1
  })
  log("NftMarketplace deployed!")
  log("------------------------------------------------")

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    console.log('Waiting for block confirmations...')
    await verify(contractNftMarketplace.address, args)
  }
}

export default deployNftMarketplace
deployNftMarketplace.tags = ["all", 'nftMarketplace']
