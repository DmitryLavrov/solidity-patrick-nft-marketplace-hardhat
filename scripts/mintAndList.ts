import {deployments, ethers, network} from 'hardhat'
import {BasicNft, NftMarketplace} from '../typechain-types'
import {developmentChains} from '../hardhat-helper.config'
import {moveBlocks} from '../utils/moveBlocks'

const PRICE = ethers.utils.parseEther('0.2') // 0.2ETH

const mintAndList = async () => {
  // Deploy all modules (No needs if script starts in localhost with running node in another terminal)
  // await deployments.fixture(['all'])

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

  // Another way: https://www.npmjs.com/package/hardhat-deploy-ethers
  // It requires to install "@nomiclabs/hardhat-ethers": "npm:hardhat-deploy-ethers@^0.3.0-beta.13"
  // const contractNftMarketplace = await ethers.getContract('NftMarketplace')
  // const contractBasicNft = await ethers.getContract('BasicNft')

  console.log('Minting NFT...')
  const mintTx = await contractBasicNft.mintNft()
  const mintTxReceipt = await mintTx.wait(1)
  const tokenId = mintTxReceipt.events && mintTxReceipt.events[0].args?.tokenId

  console.log('Approving NFT...')
  const approvalTx = await contractBasicNft.approve(contractNftMarketplace.address, tokenId)
  await approvalTx.wait(1)

  console.log(`Listing NFT with tokenId ${tokenId}...`)
  const listTx = await contractNftMarketplace.listItem(contractBasicNft.address, tokenId, PRICE)
  await listTx.wait(1)
  console.log('NFT Listed!')

  // For local network make mining of some blocks
  if (developmentChains.includes(network.name)) {
    await moveBlocks(2, 500)
  }
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
