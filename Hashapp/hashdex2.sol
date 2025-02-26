// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HashDEX is ReentrancyGuard, Ownable {
    struct Order {
        address maker;
        address token;
        uint256 amount;
        uint256 price; // Price in another token (e.g., ETH/USDC)
        bool isBuyOrder;
        bool isFilled;
    }

    mapping(uint256 => Order) public orders;
    uint256 public nextOrderId;
    mapping(address => mapping(address => uint256)) public userBalances;
    mapping(address => bool) public supportedChains;
    
    event OrderPlaced(uint256 orderId, address indexed maker, address token, uint256 amount, uint256 price, bool isBuyOrder);
    event OrderCancelled(uint256 orderId, address indexed maker);
    event OrderFilled(uint256 orderId, address indexed taker);
    event Deposited(address indexed user, address token, uint256 amount);
    event Withdrawn(address indexed user, address token, uint256 amount);
    event BridgeTransferInitiated(address indexed user, address token, uint256 amount, uint256 targetChainId);

    function placeOrder(address token, uint256 amount, uint256 price, bool isBuyOrder) external nonReentrant {
        require(amount > 0, "Invalid amount");
        require(price > 0, "Invalid price");
        
        if (isBuyOrder) {
            require(msg.value == amount * price, "Incorrect ETH sent");
        } else {
            require(userBalances[msg.sender][token] >= amount, "Insufficient balance");
            userBalances[msg.sender][token] -= amount;
        }
        
        orders[nextOrderId] = Order(msg.sender, token, amount, price, isBuyOrder, false);
        emit OrderPlaced(nextOrderId, msg.sender, token, amount, price, isBuyOrder);
        nextOrderId++;
    }
    
    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(order.maker == msg.sender, "Not your order");
        require(!order.isFilled, "Order already filled");

        if (!order.isBuyOrder) {
            userBalances[msg.sender][order.token] += order.amount;
        }
        
        order.isFilled = true;
        emit OrderCancelled(orderId, msg.sender);
    }
    
    function fillOrder(uint256 orderId) external payable nonReentrant {
        Order storage order = orders[orderId];
        require(!order.isFilled, "Order already filled");
        
        if (order.isBuyOrder) {
            require(userBalances[order.maker][order.token] >= order.amount, "Insufficient seller balance");
            userBalances[order.maker][order.token] -= order.amount;
            userBalances[msg.sender][order.token] += order.amount;
            payable(order.maker).transfer(order.amount * order.price);
        } else {
            require(msg.value == order.amount * order.price, "Incorrect ETH sent");
            userBalances[order.maker][order.token] += order.amount;
            payable(order.maker).transfer(msg.value);
        }
        
        order.isFilled = true;
        emit OrderFilled(orderId, msg.sender);
    }
    
    function deposit(address token, uint256 amount) external nonReentrant {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        userBalances[msg.sender][token] += amount;
        emit Deposited(msg.sender, token, amount);
    }
    
    function withdraw(address token, uint256 amount) external nonReentrant {
        require(userBalances[msg.sender][token] >= amount, "Insufficient balance");
        userBalances[msg.sender][token] -= amount;
        require(IERC20(token).transfer(msg.sender, amount), "Withdrawal failed");
        emit Withdrawn(msg.sender, token, amount);
    }
    
    function getAllOrders() external view returns (Order[] memory) {
        Order[] memory allOrders = new Order[](nextOrderId);
        for (uint256 i = 0; i < nextOrderId; i++) {
            allOrders[i] = orders[i];
        }
        return allOrders;
    }
    
    function initiateBridgeTransfer(address token, uint256 amount, uint256 targetChainId) external nonReentrant {
        require(supportedChains[token], "Chain not supported");
        require(userBalances[msg.sender][token] >= amount, "Insufficient balance");
        userBalances[msg.sender][token] -= amount;
        emit BridgeTransferInitiated(msg.sender, token, amount, targetChainId);
    }
}
