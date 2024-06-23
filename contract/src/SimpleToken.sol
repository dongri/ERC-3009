// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./EIP3009.sol";

contract SimpleToken is ERC20, EIP3009 {
    constructor(string memory name, string memory version, string memory symbol) ERC20(name, symbol) {
        DOMAIN_SEPARATOR = EIP712.makeDomainSeparator(name, version);
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply of 1,000,000 tokens
    }

    function _transferWithAuthorization(
        address sender,
        address recipient,
        uint256 amount
    ) internal override(IERC20Transfer) {
        super._transfer(sender, recipient, amount);
    }
}
