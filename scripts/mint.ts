import {deployments, ethers, network} from 'hardhat'
import {BasicNft, NftMarketplace} from '../typechain-types'
import {developmentChains} from '../hardhat-helper.config'
import {moveBlocks} from '../utils/moveBlocks'

const mint = async () => {
  // Get contract BasicNft
  const basicNftDeployment = await deployments.get('BasicNft')
  const contractBasicNft = (await ethers.getContractAt(
    basicNftDeployment.abi,
    basicNftDeployment.address)) as BasicNft

  console.log('Minting NFT...')
  const mintTx = await contractBasicNft.mintNft()
  const mintTxReceipt = await mintTx.wait(1)
  const tokenId = mintTxReceipt.events && mintTxReceipt.events[0].args?.tokenId

  console.log('Got tokenId', tokenId.toString())
  console.log('NFT address', contractBasicNft.address)

  // For local network make mining of some blocks
  if (developmentChains.includes(network.name)) {
    await moveBlocks(2, 500)
  }
}

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
