import {DeployFunction} from 'hardhat-deploy/types'
import {deployments, network} from 'hardhat'
import {NftMarketplace} from '../typechain-types'
import fs from 'fs'

const frontendPath = '../solidity-patrick-nft-marketplace-nextjs-moralis/constants/'
const frontendContractsFile = frontendPath + 'networkMapping.json'
const frontendAbiNftMarketplaceFile = frontendPath + 'abiNftMarketplace.json'
const frontendAbiBasicNftFile = frontendPath + 'abiBasicNft.json'

const updateFrontend: DeployFunction = async () => {
  if (process.env.UPDATE_FRONTEND === 'true') {
    console.log('Updating frontend...')
    await updateContractAddresses()
    await updateAbi()
  }
}

const updateContractAddresses = async () => {
  if (!network.config.chainId) {
    console.log('ChainId is undefined!')
    return
  }

  const chainId = network.config.chainId.toString()

  // Get contract NftMarketplace
  const nftMarketplaceDeployment = await deployments.get('NftMarketplace')

  const contractsAddresses = JSON.parse(fs.readFileSync(frontendContractsFile, 'utf8'))

  if (chainId in contractsAddresses && 'NftMarketplace' in contractsAddresses[chainId]) {
    if (contractsAddresses[chainId].NftMarketplace === nftMarketplaceDeployment.address) {
      console.log(`No need an update for ${frontendContractsFile}`)
      return
    } else {
      contractsAddresses[chainId].NftMarketplace = nftMarketplaceDeployment.address
    }
  } else {
      contractsAddresses[chainId] = {NftMarketplace: nftMarketplaceDeployment.address}
  }

  fs.writeFileSync(frontendContractsFile, JSON.stringify(contractsAddresses, null, 2), 'utf8')
}

const updateAbi = async () => {
  // Get contract NftMarketplace
  const nftMarketplaceDeployment = await deployments.get('NftMarketplace')
  const nftMarketplaceAbi = nftMarketplaceDeployment.abi
  fs.writeFileSync(frontendAbiNftMarketplaceFile, JSON.stringify(nftMarketplaceAbi, null, 2))

  // Get contract BasicNft
  const basicNftDeployment = await deployments.get('BasicNft')
  const basicNftAbi = basicNftDeployment.abi
  fs.writeFileSync(frontendAbiBasicNftFile, JSON.stringify(basicNftAbi, null, 2))
}

export default updateFrontend
updateFrontend.tags = ['all', 'frontend']
