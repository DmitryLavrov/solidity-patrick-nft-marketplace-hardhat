import {network} from 'hardhat'

export function sleep(msec: number) {
  return new Promise(resolve => setTimeout(resolve, msec))
}

export const moveBlocks = async (amount: number, sleepAmount = 0) => {
  console.log('Moving blocks...',)

  for (let i = 0; i < amount; i++) {
    await network.provider.request({
      method: 'evm_mine',
      params: []
    })

    if (sleepAmount) {
      console.log(`Slipping for ${sleepAmount}...`,)
      await sleep(sleepAmount)
    }
  }
}

// export {
//   moveBlocks,
//   sleep
// }
