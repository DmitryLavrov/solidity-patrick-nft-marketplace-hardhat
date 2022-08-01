import {deployments, ethers, network} from 'hardhat'
import {BasicNft, NftMarketplace} from '../typechain-types'
import {developmentChains} from '../hardhat-helper.config'
import {moveBlocks} from '../utils/moveBlocks'

const TOKEN_ID = 4

const buyItem = async () => {
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

  const listing = await contractNftMarketplace.getListing(contractBasicNft.address, TOKEN_ID)
  const price = listing.price.toString()

  const tx = await contractNftMarketplace.buyItem(contractBasicNft.address, TOKEN_ID, {value: price})
  await tx.wait(1)
  console.log('NFT bought!',)

  // For local network make mining of some blocks
  if (developmentChains.includes(network.name)) {
    await moveBlocks(2, 500)
  }
}


buyItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
