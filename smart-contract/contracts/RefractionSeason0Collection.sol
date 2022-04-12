// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 

/*
 
                                                                                                                                                                                                
                                                                                                                                                             
*/

contract RefractionSeason0Collection is ERC1155, Ownable, ReentrancyGuard {

    using SafeMath for uint256;
    using Strings for uint256;
    uint256 public totalSupply;
    uint256 public totalMinted = 0;
    mapping(uint => string) public tokenURI;
    string public tokenName;
    string public tokenSymbol;
    bool public paused = true;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _totalSupply
        
        
    ) ERC1155("") {
            tokenName = _tokenName;
            tokenSymbol = _tokenSymbol;
            totalSupply = _totalSupply;           
    }  


    /**
     * @notice Allow owner to send `mintNumber` tokens without cost to multiple addresses
     */
    function gift(address[] calldata receivers, uint256 mintNumber) external onlyOwner {
        require((getTotalMinted() + (receivers.length * mintNumber)) <= totalSupply, "MINT_TOO_LARGE");
        require(!paused, 'CONTRACT_PAUSED');
         // not possible to cast between fixed sized arrays and dynamic size arrays so we need to create a temp dynamic array and then copy the elements
        uint256[] memory ids  = new uint256[](7);
        ids[0] = 1; ids[1] = 2; ids[2] = 3; ids[3] = 4; ids[4] = 5; ids[5] = 6; ids[6] = 7; 
        uint256[] memory amounts  = new uint256[](7);
        amounts[0] = mintNumber; amounts[1] = mintNumber; amounts[2] = mintNumber; amounts[3] = mintNumber; amounts[4] = mintNumber; amounts[5] = mintNumber; amounts[6] = mintNumber;
        for (uint256 i = 0; i < receivers.length; i++) {
            totalMinted += mintNumber;
             _mintBatch(receivers[i], ids, amounts, "");
        }
        
    }

    function setURI(uint _id, string memory _uri) external onlyOwner {
        tokenURI[_id] = _uri;
        emit URI(_uri, _id);
    }

    function uri(uint _id) public override view returns (string memory) {
        return tokenURI[_id];
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
 
    function setPaused(bool _state) public onlyOwner {
        paused = _state;
    }

    function withdraw() public onlyOwner nonReentrant {  
        (bool os, ) = payable(owner()).call{value: address(this).balance}('');
        require(os);
    }
}