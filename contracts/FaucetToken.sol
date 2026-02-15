// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FaucetToken is ERC20, Ownable {
    mapping(address => bool) public minters;

    constructor() ERC20("Faucet Token", "FCT") Ownable(msg.sender) {}

    function setMinter(address minter, bool allowed) external onlyOwner {
        minters[minter] = allowed;
    }

    function mint(address to, uint256 amount) external {
        require(minters[msg.sender], "Not authorized");
        _mint(to, amount);
    }
}
