import {network} from 'hardhat'
import {developmentChains} from '../hardhat-helper.config'
import {moveBlocks} from '../utils/moveBlocks'

const TOKEN_ID = 3

const mine = async () => {
  // For local network make mining of some blocks
  if (developmentChains.includes(network.name)) {
    await moveBlocks(2, 500)
  }
}


mine()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
