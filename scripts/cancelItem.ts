import {deployments, ethers, network} from 'hardhat'
import {BasicNft, NftMarketplace} from '../typechain-types'
import {developmentChains} from '../hardhat-helper.config'
import {moveBlocks} from '../utils/moveBlocks'

const TOKEN_ID = 3

const cancelItem = async () => {
// Get contract NftMarketplace
  const nftMarketplaceDeployment = await deployments.get('NftMarketplace')
  const contractNftMarketplace = (await ethers.getContractAt(
    nftMarketplaceDeployment.abi,
    nftMarketplaceDeployment.address)) as NftMarketplace

// Get contract BasicNft
  const basicNftDeployment = await deployments.get('BasicNft')
  const contractBasicNft = (await ethers.getContractAt(
    basicNftDeployment.abi,
    basicNftDeployment.address)) as BasicNft

  const tx = await contractNftMarketplace.cancelListing(contractBasicNft.address, TOKEN_ID)
  await tx.wait(1)
  console.log('NFT cancelled!',)

  // For local network make mining of some blocks
  if (developmentChains.includes(network.name)) {
    await moveBlocks(2, 500)
  }
}


cancelItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
