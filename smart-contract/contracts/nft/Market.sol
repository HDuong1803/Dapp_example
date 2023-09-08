// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract Market {
    struct NFTMarket {
        address seller;
        uint256 price;
        string uri;
    }

    bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    mapping(address => mapping(uint256 => NFTMarket)) _listedNFT;

    function list(
        address nft,
        uint256 tokenId,
        uint256 price
    ) external returns (bool) {
        require(IERC721(nft).ownerOf(tokenId) == msg.sender, "Not owner");
        require(
            IERC721(nft).getApproved(tokenId) == address(this),
            "Must be approved"
        );
        NFTMarket storage nftMarket = _listedNFT[nft][tokenId];
        nftMarket.seller = msg.sender;
        nftMarket.price = price;
        nftMarket.uri = IERC721Metadata(nft).tokenURI(tokenId);
        return true;
    }

    function buy(
        address nft,
        uint256 tokenId
    ) external payable noReentrant returns (bool) {
        NFTMarket storage nftMarket = _listedNFT[nft][tokenId];
        require(nftMarket.seller != address(0), "Not listed yet");
        require(nftMarket.price == msg.value, "Invalid price");
        (bool success, ) = nftMarket.seller.call{value: msg.value}("");
        require(success, "Transfer ETH fail");
        IERC721(nft).safeTransferFrom(nftMarket.seller, msg.sender, tokenId);
        // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721Receiver.sol
        delete _listedNFT[nft][tokenId];
        return true;
    }

    // listWithERC20
    // cancelList
    // buyWithERC20
    // https://solidity-by-example.org/app/english-auction/
}
