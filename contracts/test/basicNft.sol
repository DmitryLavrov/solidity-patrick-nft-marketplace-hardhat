//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {
    string public constant TOKEN_URI = "ipfs://QmfSWzZr4ftLoqCdyWbyZicF4vgW1L18JFbeieXdHw7Fuu";
    uint private s_tokenCounter;

    constructor() ERC721("Dogie", "DOG") {
        s_tokenCounter = 0;
    }

    function mintNft() public returns(uint) {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
        return s_tokenCounter;
    }

    function tokenURI(uint tokenId ) public pure override returns(string memory) {
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns(uint) {
        return s_tokenCounter;
    }
}
