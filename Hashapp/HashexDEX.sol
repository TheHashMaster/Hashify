// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HashifyDEX is ReentrancyGuard, Ownable {
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
    
    event OrderPlaced(uint256 orderId, address indexed maker, address token, uint256 amount, uint256 price, bool isBuyOrder);
    event OrderCancelled(uint256 orderId, address indexed maker);
    event OrderFilled(uint256 orderId, address indexed taker);

    function placeOrder(address token, uint256 amount, uint256 price, bool isBuyOrder) external nonReentrant {
        require(amount > 0, "Invalid amount");
        require(price > 0, "Invalid price");
        
        if (isBuyOrder) {
            require(msg.value == amount * price, "Incorrect ETH sent");
        } else {
            require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");
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
            require(IERC20(order.token).transfer(order.maker, order.amount), "Refund failed");
        }
        
        order.isFilled = true;
        emit OrderCancelled(orderId, msg.sender);
    }
    
    function fillOrder(uint256 orderId) external payable nonReentrant {
        Order storage order = orders[orderId];
        require(!order.isFilled, "Order already filled");
        
        if (order.isBuyOrder) {
            require(IERC20(order.token).transfer(msg.sender, order.amount), "Token transfer failed");
            payable(order.maker).transfer(order.amount * order.price);
        } else {
            require(msg.value == order.amount * order.price, "Incorrect ETH sent");
            require(IERC20(order.token).transfer(msg.sender, order.amount), "Token transfer failed");
            payable(order.maker).transfer(msg.value);
        }
        
        order.isFilled = true;
        emit OrderFilled(orderId, msg.sender);
    }
    
    function getAllOrders() external view returns (Order[] memory) {
        Order[] memory allOrders = new Order[](nextOrderId);
        for (uint256 i = 0; i < nextOrderId; i++) {
            allOrders[i] = orders[i];
        }
        return allOrders;
    }
}

