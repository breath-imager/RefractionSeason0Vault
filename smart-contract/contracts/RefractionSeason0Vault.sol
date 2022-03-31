// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/*
                                                                                                                                                                 
*/

 // to verify that the sender posseses the season 0 NFT at time of mint
 interface IToken {
        function balanceOf(address, uint256) external view returns (uint256);
 }      

contract RefractionSeason0Vault is ERC1155, Ownable, ReentrancyGuard {

    using SafeMath for uint256;

    uint256 public cost;
    uint256 public maxMintAmountPerTx;
    uint256 public totalSupply;
    uint256 public maxPerWallet;
    uint256 public reserveSize;
    uint256 public totalMinted = 0;
    string public hiddenMetadataUri;
    mapping(address => uint256) private totalMintedPerWallet;
    
    string public tokenName;
    string public tokenSymbol;

    bytes32 public merkleRoot;
    mapping(address => bool) public greenlistClaimed;

    bool public paused = true;
    bool public greenlistMintEnabled = false;
    bool public revealed = true;
    address season0NFT;

    mapping(address => bool) public artClaimed;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _cost,
        uint256 _totalSupply,
        uint256 _maxPerWallet,
        uint256 _reserveSize,
        uint256 _maxMintAmountPerTx,
        string memory _metadataUri,
        string memory _hiddenMetadataUri
        address _season0NFT
        
    ) ERC1155(_metadataUri) {
            tokenName = _tokenName;
            tokenSymbol = _tokenSymbol;
            cost = _cost;
            totalSupply = _totalSupply;
            maxPerWallet = _maxPerWallet;
            reserveSize = _reserveSize;
            maxMintAmountPerTx = _maxMintAmountPerTx; 
            hiddenMetadataUri = _hiddenMetadataUri; 
            season0NFT = _season0NFT;                
    }  

   

    modifier mintCompliance(uint256 _mintAmount) {
        require(_mintAmount > 0 && _mintAmount <= maxMintAmountPerTx, 'Invalid mint amount!');
        require(totalMinted + _mintAmount <= (totalSupply - reserveSize), 'Max supply exceeded!');
        _;
    }

    modifier mintPriceCompliance(uint256 _mintAmount) {
        require(msg.value >= cost * _mintAmount, 'Insufficient funds!');
        _;
    }

    function greenlistMint(uint256 _mintAmount, bytes32[] calldata _merkleProof) public payable mintCompliance(_mintAmount) mintPriceCompliance(_mintAmount) nonReentrant {
        // Verify greenlist requirements
        require(greenlistMintEnabled, 'The greenlistist sale is not enabled!');
        require(tx.origin == msg.sender && msg.sender != address(0), "No contracts!");
        require(!greenlistClaimed[_msgSender()], 'Address already claimed.');
        bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), 'Invalid proof.');
        greenlistClaimed[_msgSender()] = true;
        totalMintedPerWallet[_msgSender()] += _mintAmount;
        totalMinted += _mintAmount;
        _mint(msg.sender, 1, _mintAmount,"" );  
    }

    function mint(uint256 _mintAmount) public payable mintCompliance(_mintAmount) mintPriceCompliance(_mintAmount) nonReentrant {
        require(!paused, 'The contract is paused!');
        require(tx.origin == msg.sender && msg.sender != address(0), "No contracts.");
        require(totalMintedPerWallet[msg.sender] < maxPerWallet, "Wallet has minted too many.");
        //address season0NFT = 0xa6D1269A2aFaa445D39172B17D8829f762e58584;
        //require(IToken(season0NFT).balanceOf(msg.sender, uint256(1)),"NO_SEASON_0_NFT");

        // not possible to cast between fixed sized arrays and dynamic size arrays so we need to create a temp dynamic array and then copy the elements
        uint256[] memory ids  = new uint256[](7);
        ids[0] = 1; ids[1] = 2; ids[2] = 3; ids[3] = 4; ids[4] = 5; ids[5] = 6; ids[6] = 7; 
        uint256[] memory amounts  = new uint256[](7);
        amounts[0] = 1; amounts[1] = 1; amounts[2] = 1; amounts[3] = 1; amounts[4] = 1; amounts[5] = 1; amounts[6] = 1;
        
        artClaimed[msg.sender] = true;
        totalMinted += _mintAmount;
        _mintBatch(msg.sender, ids, amounts, "");
    }

    /**
     * @notice Allow owner to send `mintNumber` tokens without cost to multiple addresses
     */
    function gift(address[] calldata receivers, uint256 mintNumber) external onlyOwner {
        require((totalSupply() + (receivers.length * mintNumber)) <= totalSupply, "MINT_TOO_LARGE");
        // make sure they have a season 0 NFT
        //address season0NFT = 0xa6D1269A2aFaa445D39172B17D8829f762e58584;
        //require(IToken(season0NFT).balanceOf(msg.sender, uint256(1)),"NO_SEASON_0_NFT");

         // not possible to cast between fixed sized arrays and dynamic size arrays so we need to create a temp dynamic array and then copy the elements
        uint256[] memory ids  = new uint256[](7);
        ids[0] = 1; ids[1] = 2; ids[2] = 3; ids[3] = 4; ids[4] = 5; ids[5] = 6; ids[6] = 7; 
        uint256[] memory amounts  = new uint256[](7);
        amounts[0] = mintNumber; amounts[1] = mintNumber; amounts[2] = mintNumber; amounts[3] = mintNumber; amounts[4] = mintNumber; amounts[5] = mintNumber; amounts[6] = mintNumber;
        for (uint256 i = 0; i < receivers.length; i++) {
             _mintBatch(receivers[i], ids, amounts, "");
        }
        
    }

    function reserve(uint _mintAmount, address _receiver ) public onlyOwner {    
        require(_receiver != address(0), "Don't mint to zero address.");
        require((reserveSize - _mintAmount) >= 0, "Not enough reserve.");
        require(totalMinted + _mintAmount <= totalSupply, "No more editions left.");        
        reserveSize -= _mintAmount;
        totalMinted += _mintAmount;
        _mint(_receiver, 1, _mintAmount, "");
    }

    function setBaseURI(string memory newUri) public onlyOwner {
        _setURI(newUri);
    }

    function getTotalMinted() public view returns(uint256){
        return totalMinted;
    }
    
    function getTotalSupply() public view returns(uint256){
        return totalSupply;
    }

    function name() public view returns (string memory) {
        return tokenName;
    }

    function symbol() public view returns (string memory) {
        return tokenSymbol;
    }

    function setRevealed(bool _state) public onlyOwner {
        revealed = _state;
    }

    function setCost(uint256 _cost) public onlyOwner {
        require(_cost != cost, 'New price is identical to old price.');
        cost = _cost;
    } 

    function setPaused(bool _state) public onlyOwner {
        paused = _state;
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function setGreenlistMintEnabled(bool _state) public onlyOwner {
        greenlistMintEnabled = _state;
    }

    function setMaxMintAmountPerTx(uint256 _maxMintAmountPerTx) public onlyOwner {
        maxMintAmountPerTx = _maxMintAmountPerTx;
    }

    function setHiddenMetadataUri(string memory _hiddenMetadataUri) public onlyOwner {
        hiddenMetadataUri = _hiddenMetadataUri;
    }

    function withdraw() public onlyOwner nonReentrant {  
        (bool os, ) = payable(owner()).call{value: address(this).balance}('');
        require(os);
    }
}