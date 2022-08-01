import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/types'
import {network} from 'hardhat'
import {developmentChains, networkConfig} from '../hardhat-helper.config'
import {verify} from '../utils/verify'
import {BasicNft} from '../typechain-types'

const deployBasicNft: DeployFunction = async function ({getNamedAccounts, deployments}: HardhatRuntimeEnvironment) {
  const {deploy, log} = deployments
  const {deployer} = await getNamedAccounts()
  const chainId = network.config.chainId || 31337

  const args: (string | undefined)[] = []
  const contractBasicNft = await deploy('BasicNft', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[chainId].blockConfirmations || 1
  })
  log("BasicNft deployed!")
  log("------------------------------------------------")

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    console.log('Waiting for block confirmations...')
    await verify(contractBasicNft.address, args)
  }
}

export default deployBasicNft
deployBasicNft.tags = ["all", 'basicNft']
