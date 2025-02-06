import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Web3 from "web3";
import dexAbi from "./dexAbi.json";

const DEX_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
const web3 = new Web3(Web3.givenProvider);
const dexContract = new web3.eth.Contract(dexAbi, DEX_ADDRESS);

export default function OrderBook() {
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const orderCount = await dexContract.methods.nextOrderId().call();
    let fetchedOrders = [];
    for (let i = 0; i < orderCount; i++) {
      const order = await dexContract.methods.orders(i).call();
      if (!order.isFilled) fetchedOrders.push(order);
    }
    setOrders(fetchedOrders);
    formatChartData(fetchedOrders);
  };

  const formatChartData = (orders) => {
    const data = orders.map((order, index) => ({
      name: `Order ${index + 1}`,
      price: parseFloat(order.price),
      volume: parseFloat(order.amount),
    }));
    setChartData(data);
  };

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Order Book</h2>
          <div className="mt-2">
            {orders.map((order, index) => (
              <div key={index} className="flex justify-between p-2 border-b">
                <span>{order.isBuyOrder ? "Buy" : "Sell"}</span>
                <span>{order.amount} Tokens</span>
                <span>@ {order.price} ETH</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Price & Volume Chart</h2>
          <LineChart width={400} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
            <Line type="monotone" dataKey="volume" stroke="#82ca9d" />
          </LineChart>
        </CardContent>
      </Card>
    </div>
  );
}
