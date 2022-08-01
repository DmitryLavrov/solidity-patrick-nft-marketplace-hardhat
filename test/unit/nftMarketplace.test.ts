import {beforeEach} from 'mocha'
import {assert, expect} from 'chai'
import {developmentChains} from '../../hardhat-helper.config'
import {deployments, ethers, getNamedAccounts, network} from 'hardhat'
import {BasicNft, NftMarketplace} from '../../typechain-types'
import {Signer} from 'ethers'

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Marketplace', () => {
    let contractNftMarketplace: NftMarketplace
    let contractNftMarketplaceConnectedDeployer: NftMarketplace
    let contractBasicNft: BasicNft
    let deployerAddress: string
    let playerAddress: string
    let deployerSigner: Signer
    let playerSigner: Signer
    const PRICE = ethers.utils.parseEther('0.2') // 0.2ETH
    const TOKEN_ID = 0

    beforeEach(async () => {
      const signers = await ethers.getSigners()

      // Get accountZero
      // deployerAddress = (await getNamedAccounts()).deployer
      deployerSigner = signers[0]
      deployerAddress = await deployerSigner.getAddress()

      // Get accountOne
      // playerAddress = (await getNamedAccounts()).player
      playerSigner = signers[1]
      playerAddress = await playerSigner.getAddress()

      // Deploy all modules (No needs if script starts in localhost with running node in another terminal)
      await deployments.fixture(['all'])

      // Get contract NftMarketplace
      const nftMarketplaceDeployment = await deployments.get('NftMarketplace')
      contractNftMarketplace = (await ethers.getContractAt(
        nftMarketplaceDeployment.abi,
        nftMarketplaceDeployment.address,
        deployerSigner)) as NftMarketplace
      contractNftMarketplaceConnectedDeployer = contractNftMarketplace.connect(deployerSigner)

      // Get contract BasicNft
      const basicNftDeployment = await deployments.get('BasicNft')
      contractBasicNft = (await ethers.getContractAt(
        basicNftDeployment.abi,
        basicNftDeployment.address,
        deployerSigner)) as BasicNft

      // Mint and approve BasicNft (call functions from deployer)
      await contractBasicNft.mintNft()
      await contractBasicNft.approve(contractNftMarketplace.address, TOKEN_ID)
    })

    describe('listItem', () => {
      it('emits an event after listing an item', async () => {
        await expect(contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE))
          .to.emit(contractNftMarketplace, 'ItemListed')
          .withArgs(deployerAddress, contractBasicNft.address, TOKEN_ID, PRICE)
      })

      it('throws error when lists the same NFT', async () => {
        await contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        await expect(
          contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        ).to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__AlreadyListed')
          .withArgs(contractBasicNft.address, TOKEN_ID)
      })

      it('exclusively allows owners to list', async () => {
        const contractNftMarketplaceConnectedPlayer = contractNftMarketplace.connect(playerSigner)
        await contractBasicNft.approve(playerAddress, TOKEN_ID)
        await expect(contractNftMarketplaceConnectedPlayer.listItem(contractBasicNft.address, TOKEN_ID, PRICE))
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__NotOwner')
      })

      it('throws error when list with price = 0', async () => {
        await expect(contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, 0))
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__PriceMustBeAboveZero')
      })

      it('throws error when BasicNft is not approved', async () => {
        // Minting another one BasicNft
        await contractBasicNft.mintNft()
        const tokenId = '1'

        // await contractBasicNft.approve(contractNftMarketplace.address, tokenId)
        await expect(contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, tokenId, PRICE))
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__NotApprovedForMarketplace')
      })

      it('updates listing with seller and price', async () => {
        await contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        const listing = await contractNftMarketplace.getListing(contractBasicNft.address, TOKEN_ID)
        assert(listing.price.toString() === PRICE.toString())
        assert(listing.seller.toString() === deployerAddress)
      })
    })


    describe('cancelListing', () => {
      it('reverts if there is no listing', async function () {
        await expect(contractNftMarketplaceConnectedDeployer.cancelListing(contractBasicNft.address, TOKEN_ID))
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__NotListed')
          .withArgs(contractBasicNft.address, TOKEN_ID)
      })

      it('reverts if anyone but the owner tries to call', async function () {
        await contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        const contractNftMarketplaceConnectedPlayer = contractNftMarketplace.connect(playerSigner)
        await contractBasicNft.approve(playerAddress, TOKEN_ID)
        await expect(contractNftMarketplaceConnectedPlayer.cancelListing(contractBasicNft.address, TOKEN_ID))
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__NotOwner')
      })

      it('emits event and removes listing', async function () {
        await contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        await expect(contractNftMarketplaceConnectedDeployer.cancelListing(contractBasicNft.address, TOKEN_ID))
          .to.emit(contractNftMarketplace, 'ItemCanceled')
          .withArgs(deployerAddress, contractBasicNft.address, TOKEN_ID)

        const listing = await contractNftMarketplace.getListing(contractBasicNft.address, TOKEN_ID)
        assert(listing.price.toString() == '0')
      })
    })


    describe('buyItem', () => {
      it('reverts if the item isn\'t listed', async () => {
        await expect(contractNftMarketplaceConnectedDeployer.buyItem(contractBasicNft.address, TOKEN_ID))
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__NotListed')
          .withArgs(contractBasicNft.address, TOKEN_ID)
      })

      it('reverts if the price isn\'t met', async () => {
        await contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        await expect(contractNftMarketplace.buyItem(contractBasicNft.address, TOKEN_ID))
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__PriceNotMet')
          .withArgs(contractBasicNft.address, TOKEN_ID, PRICE)
      })

      it('lists and can be bought', async () => {
        await contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        const contractNftMarketplaceConnectedPlayer = contractNftMarketplace.connect(playerSigner)

        await expect(contractNftMarketplaceConnectedPlayer.buyItem(contractBasicNft.address, TOKEN_ID, {value: PRICE}))
          .to.emit(contractNftMarketplace, 'ItemBought')
          .withArgs(playerAddress, contractBasicNft.address, TOKEN_ID, PRICE)

        const newOwner = await contractBasicNft.ownerOf(TOKEN_ID)
        assert(newOwner.toString() === playerAddress)

        const deployerProceeds = await contractNftMarketplaceConnectedDeployer.getProceeds(deployerAddress)
        assert(deployerProceeds.toString() === PRICE.toString())
      })
    })


    describe('updateListing', () => {
      it('must be owner and listed', async () => {
        const newPrice = ethers.utils.parseEther('0.23') // 0.23ETH
        await expect(contractNftMarketplaceConnectedDeployer.updateListing(contractBasicNft.address, TOKEN_ID, newPrice))
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__NotListed')
          .withArgs(contractBasicNft.address, TOKEN_ID)

        await contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        const contractNftMarketplaceConnectedPlayer = contractNftMarketplace.connect(playerSigner)
        await expect(contractNftMarketplaceConnectedPlayer.updateListing(contractBasicNft.address, TOKEN_ID, newPrice))
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__NotOwner')
      })

      it('updates the price of the item', async () => {
        const newPrice = ethers.utils.parseEther('0.23') // 0.23ETH
        await contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        expect(await contractNftMarketplaceConnectedDeployer.updateListing(contractBasicNft.address, TOKEN_ID, newPrice))
          .to.emit(contractNftMarketplace, 'ItemListed')
          .withArgs(deployerAddress, contractBasicNft.address, TOKEN_ID, PRICE)

        const listing = await contractNftMarketplace.getListing(contractBasicNft.address, TOKEN_ID)
        assert(listing.price.toString() == newPrice.toString())
      })

      it('reverts if price <= 0', async () => {
        const newPrice = ethers.utils.parseEther('0') // 0ETH
        await contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        await expect(contractNftMarketplaceConnectedDeployer.updateListing(contractBasicNft.address, TOKEN_ID, newPrice))
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__PriceMustBeAboveZero')
      })
    })


    describe('withdrawProceeds', () => {
      it("doesn't allow 0 proceed withdrawals", async () => {
        await expect(contractNftMarketplaceConnectedDeployer.withdrawProceeds())
          .to.be.revertedWithCustomError(contractNftMarketplace, 'NftMarketplace__NoProceeds')
      })

      it('withdraws proceeds', async () => {
        await contractNftMarketplaceConnectedDeployer.listItem(contractBasicNft.address, TOKEN_ID, PRICE)
        const contractNftMarketplaceConnectedPlayer = contractNftMarketplace.connect(playerSigner)
        await contractNftMarketplaceConnectedPlayer.buyItem(contractBasicNft.address, TOKEN_ID, {value: PRICE})

        const deployerProceedsBefore = await contractNftMarketplace.getProceeds(deployerAddress)
        const deployerBalanceBefore = await deployerSigner.getBalance()
        const txResponse = await contractNftMarketplaceConnectedDeployer.withdrawProceeds()
        const txReceipt = await txResponse.wait(1)
        const {gasUsed, effectiveGasPrice} = txReceipt
        const gasCost = gasUsed.mul(effectiveGasPrice)
        const deployerBalanceAfter = await deployerSigner.getBalance()

        assert(deployerBalanceAfter.add(gasCost).toString() ===
          deployerProceedsBefore.add(deployerBalanceBefore).toString())
      })
    })


  })
