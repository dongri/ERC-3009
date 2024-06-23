// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

abstract contract IERC20Transfer {
    function _transferWithAuthorization(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual;
}
