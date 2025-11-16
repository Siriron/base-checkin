// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Ownable {
    address public owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() { 
        owner = msg.sender; 
        emit OwnershipTransferred(address(0), msg.sender); 
    }

    modifier onlyOwner() { 
        require(msg.sender == owner, "Ownable: caller is not the owner"); 
        _; 
    }

    function transferOwnership(address newOwner) public onlyOwner { 
        require(newOwner != address(0), "Ownable: new owner is zero address"); 
        emit OwnershipTransferred(owner, newOwner); 
        owner = newOwner; 
    }
}

contract CheckinLedger is Ownable {
    mapping(address => uint256) public totals;
    event TotalsUpdated(address indexed user, uint256 newTotal);
    event BatchTotalsUpdated(address[] users, uint256[] newTotals);

    function updateTotal(address user, uint256 newTotal) external onlyOwner {
        totals[user] = newTotal;
        emit TotalsUpdated(user, newTotal);
    }

    function batchUpdate(address[] calldata users, uint256[] calldata newTotals) external onlyOwner {
        require(users.length == newTotals.length, "length mismatch");
        for (uint256 i = 0; i < users.length; ++i) { 
            totals[users[i]] = newTotals[i]; 
        }
        emit BatchTotalsUpdated(users, newTotals);
    }
}
