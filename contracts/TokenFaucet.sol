// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FaucetToken.sol";

contract TokenFaucet {
    uint256 public constant FAUCET_AMOUNT = 100 ether;
    uint256 public constant COOLDOWN_TIME = 1 days;

    FaucetToken public token;
    address public admin;
    bool public paused;

    mapping(address => uint256) public lastClaim;

    constructor() {
        admin = msg.sender;
    }

    function setToken(address tokenAddress) external {
        require(msg.sender == admin, "Only admin");
        token = FaucetToken(tokenAddress);
    }

    function setPaused(bool _paused) external {
        require(msg.sender == admin, "Only admin");
        paused = _paused;
    }

    function requestTokens() external {
        require(!paused, "Faucet paused");
        require(
            block.timestamp >= lastClaim[msg.sender] + COOLDOWN_TIME,
            "Cooldown active"
        );

        lastClaim[msg.sender] = block.timestamp;
        token.mint(msg.sender, FAUCET_AMOUNT);
    }
}
