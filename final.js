const { ethers } = require('ethers');
const express = require("express");
const app = express();
const port = 3000; // Change if needed
const PORT = 3000;

let lastScannedBlock = 0;
const transactions = new Map();
const miningData = new Map();
const contracts = new Map();
const networkStats = {};
const monitoredAddress = "0xCfC11BB9BBd7aAE2B34025f9A282e3850edd2A40";
const minerStats = new Map();
const blockRewards = new Map();
const feeData = new Map();
const orphanBlocks = new Map();
const tokenTransfers = new Map();
const users = new Map();

const apiRoutes = {
    '/api/mining': 'Retrieve all miners, their hashrates, blocks won, orphan blocks, and block rewards.',
    '/api/network': 'Get network-related data such as difficulty, average block time, gas prices, total transactions, total blocks, network hashrate, and more.',
    '/api/contracts': 'Retrieve all smart contracts categorized by type: ERC20, NFTs, DeFi, governance, staking, bridges, gaming, derivatives, stablecoins, and others.',
    '/api/address/:address': 'Fetch data for a specific address including balance, nonce, transactions, and token transfers.',
    '/api/users/:user': 'Retrieve user-specific data including balances, transactions, and contracts owned or interacted with by the user.',
    '/api/users/:user/balances': 'Get the balance of a user in both hash units and wei.',
    '/api/users/:user/transactions': 'Retrieve all transactions linked to a user.',
    '/api/users/:user/contracts': 'Fetch all smart contracts owned or interacted with by a user.',
    '/api/minerStats': 'Retrieve detailed miner statistics including hashrates, blocks won, and hash per share.',
    '/api/blockRewards': 'Retrieve block rewards issued to miners for successfully mining blocks.',
    '/api/tokenTransfers': 'Retrieve token transfers for specific addresses, including ERC20 transfers and NFTs.',
    '/api/health': 'Get the status of the API and blockchain node connection, along with the last sync timestamp.'
};

app.get('/api', (req, res) => {
    res.json(apiRoutes);
});

app.listen(port, '93.188.164.74', () => {
    console.log(apiRoutes);
});
// Set up Ethers.js provider (replace with your Infura or Alchemy URL)
const provider = new ethers.JsonRpcProvider('http://145.223.103.175:30311');

// Initialize Maps to store transactions and mining data
const transactionMap = new Map(); // To store transaction details indexed by hash
const miningDataMap = new Map(); // To store mining data indexed by block number

// logTransactions function to log and store transaction\
async function logTransactions(block) {
    // Check if the block has transactions
    if (block.transactions && block.transactions.length > 0) {
        // Iterate over all transactions in the block
        for (let tx of block.transactions) {
            try {
                // Example: Extract and format the transaction value from Wei to Ether
                if (tx.value) {
                    const valueInEther = ethers.utils.formatEther(tx.value);
                    console.log(`Transaction Hash: ${tx.hash}`);
                    console.log(`Transaction Value: ${valueInEther} ETH`);
                } else {
                    console.log(`Transaction ${tx.hash} has no value.`);
                }
            } catch (error) {
                // Log any errors encountered while processing a transaction
                console.error(`Error processing transaction ${tx.hash}:`, error);
            }
        }
    } else {
        console.log("No transactions found in this block.");
    }
}
// logMiningData function to log and store mining data
// logMiningData function to log and store mining data
function logMiningData(block) {
    if (block && block.number && block.miner) {
        const blockData = {
            blockNumber: block.number,
            miner: block.miner,
            timestamp: new Date().toISOString(),
        };

        // Log the mining data scanning
        console.log(`Scanning Block: ${block.number}, Miner: ${block.miner}`);

        // Store mining data in the Map indexed by block number
        miningDataMap.set(block.number, blockData);
    } else {
        console.error('Mining data is incomplete:', block);
    }
}

// Fetch transactions from the blockchain and log them
async function deepScan() {
    try {
        // Fetch the latest block number
        const latestBlockNumber = await provider.getBlockNumber();
        console.log(`Starting deep scan from block number ${lastScannedBlock || latestBlockNumber}`);

        // Iterate through a number of blocks (e.g., 10 blocks)
        const blocksToScan = 500010;  // Scan the latest 10 blocks (you can adjust this)
        const startingBlock = lastScannedBlock || latestBlockNumber;

        for (let i = startingBlock; i > startingBlock - blocksToScan && i >= 0; i--) {
            if (miningDataMap.has(i)) {
                // Skip the block if it has already been logged
                console.log(`Block ${i} has already been scanned.`);
                continue;
            }

            console.log(`Scanning Block ${i}...`);
            const block = await provider.getBlock(i);  // Fetch block details without transactions

            if (block && block.transactions && block.transactions.length > 0) {
                // Fetch and log transactions in the block
                console.log(`Found ${block.transactions.length} transactions in Block ${i}`);
                for (let txHash of block.transactions) {
                    const tx = await provider.getTransaction(txHash);
                    if (tx) {
                        logTransactions(tx);  // Log and store each transaction
                    }
                }
            } else {
                console.log(`No transactions found in Block ${i}`);
            }

            // Log and store mining data for this block
            logMiningData(block);
        }
// Update last scanned block to the current one (for the next cycle)
        lastScannedBlock = startingBlock - blocksToScan;

        // Example: Log all transactions stored in the Map
        console.log('All logged transactions:');
        transactionMap.forEach((value, key) => {
            console.log(`Hash: ${key}, From: ${value.from}, To: ${value.to}, Value: ${value.value} ETH`);
        });

        // Example: Log all mining data stored in the Map
        console.log('All logged mining data:');
        miningDataMap.forEach((value, key) => {
            console.log(`Block: ${key}, Miner: ${value.miner}`);
        });

    } catch (error) {
        console.error('Error during deep scan:', error);
    }
}

// Fetch the mining data (block rewards and miner details)
async function fetchMiningData() {
    try {
        // Get the latest block number
        const latestBlockNumber = await provider.getBlockNumber();
        const block = await provider.getBlock(latestBlockNumber);

        if (block && block.miner) {
            // Log block mining data
            console.log(`Scanning Latest Block for Mining Data: Block ${block.number}, Miner: ${block.miner}`);
            logMiningData(block);
        }
    } catch (error) {
        console.error('Error fetching mining data:', error);
    }
}
async function monitorAddress() {
    provider.on('pending', async (txHash) => {
        const tx = await provider.getTransaction(txHash);
        if (tx && tx.to === monitoredAddress) {
            console.log(`Monitoring transaction to ${monitoredAddress}:`, tx);
            if (['0.01', '0.05', '0.1'].includes(ethers.utils.formatEther(tx.value))) {
                console.log('Triggering backend process for hash coin send.');
            }
        }
    });
    provider.on('block', async (blockNumber) => {
        const block = await provider.getBlock(blockNumber, true);
        if (block) {
            block.transactions.forEach(tx => {
                if (tx.to === monitoredAddress && tx.confirmations >= 6) {
                    console.log('Confirmed transaction detected. Triggering action.');
                }
            });
        }
    });
}
monitorAddress();



// Start live scanning of transactions and mining data
async function start() {
    // Scan the blockchain periodically
    setInterval(async () => {
        console.log('Starting new scan cycle...');
        await deepScan(); 
     await monitorAddress();
         await lightScan();// Scan for new transactions
        await fetchMiningData();  // Fetch mining data for the latest block
    }, 10000);  // Every 10 seconds
}

// Start the live scan
start();

// Deep scan function for blocks and transactions
async function lightScan() {
    try {
        const latestBlockNumber = await provider.getBlockNumber();
        const blocksToScan = 100000;
        const startingBlock = lastScannedBlock || latestBlockNumber;

        for (let i = startingBlock; i > startingBlock - blocksToScan && i >= 0; i--) {
            if (miningData.has(i)) continue;
            
            const block = await provider.getBlock(i, true);
            if (block) {
                miningData.set(block.number, { 
                    blockNumber: block.number, 
                    miner: block.miner, 
                    timestamp: block.timestamp, 
                    gasUsed: block.gasUsed, 
                    gasLimit: block.gasLimit, 
                    size: block.size, 
                    transactions: block.transactions.length
                });
                block.transactions.forEach(tx => transactions.set(tx.hash, tx));
            }
        }
        lastScannedBlock = startingBlock - blocksToScan;
    } catch (error) {
        console.error('Error in light scan:', error);
    }
}

setInterval(lightScan, 5000);


// Block Data
// Get details of the latest block on the chain
app.get('/api/blocks', async (req, res) => {
    const latestBlock = await provider.getBlock('latest');
    res.json({ 
        blockNumber: latestBlock.number, 
        miner: latestBlock.miner, 
        timestamp: latestBlock.timestamp, 
        gasUsed: latestBlock.gasUsed, 
        gasLimit: latestBlock.gasLimit, 
        size: latestBlock.size, 
        transactions: latestBlock.transactions.length 
    });
});

// Block Data by Block Number
// Get block details by specifying block number
app.get('/api/blocks/:blockNumber', async (req, res) => {
    const blockNumber = parseInt(req.params.blockNumber);
    const block = await provider.getBlock(blockNumber, true);
    block ? res.json(block) : res.status(404).json({ error: 'Block not found' });
});

// Transaction Data
// Get a list of confirmed and unconfirmed transactions
app.get('/api/transactions', (req, res) => {
    res.json({
        confirmed: Array.from(transactions.values()).filter(tx => tx.confirmations >= 6),
        unconfirmed: Array.from(transactions.values()).filter(tx => tx.confirmations < 6)
    });
});

// Transaction Data by Hash
// Get transaction details by providing transaction hash
app.get('/api/transactions/:hash', (req, res) => {
    const tx = transactions.get(req.params.hash);
    tx ? res.json(tx) : res.status(404).json({ error: 'Transaction not found' });
});

// Mining Data
// Get a list of all miners and mining statistics (hashrates, blocks, etc.)
app.get('/api/mining', (req, res) => {
    res.json({ 
        miners: Array.from(miningData.values()), 
        minerStats: Array.from(minerStats.values()), 
        orphanBlocks: Array.from(orphanBlocks.values()),
        blocks: Array.from(blocks.values()),
        hashrate: Array.from(hashrate.values()), // Ensure hashrate is in hash units, not ether
        blockRewards: Array.from(blockRewards.values()), // Block rewards in hash units
        miningDifficulty: networkStats.difficulty,  // Mining difficulty
        avgBlockTime: networkStats.averageBlockTime // Average block time
    });
});


// Network Stats
// Get overall network statistics such as difficulty, gas price, and total blocks
app.get('/api/network', async (req, res) => {
    const latestBlock = await provider.getBlock('latest');
    networkStats.difficulty = latestBlock.difficulty;
    networkStats.averageBlockTime = '12s';  // Placeholder average block time
    networkStats.gasPrice = await provider.getGasPrice();
    networkStats.totalTransactions = transactions.size;
    networkStats.totalBlocks = lastScannedBlock;
    networkStats.networkHashrate = latestBlock.difficulty / 12;  // Placeholder network hashrate calculation
    networkStats.blockRewards = Array.from(blockRewards.values());
    networkStats.feeData = Array.from(feeData.values());
    res.json(networkStats);
});

// Smart Contract Categories
// Get a list of smart contracts by their types (ERC20, NFT, etc.)
app.get('/api/contracts', (req, res) => {
    res.json({
        erc20: [],
        nft: [],
        defi: [],
        governance: [],
        staking: [],
        bridges: [],
        gaming: [],
        derivatives: [],
        stablecoins: [],
        others: []
    });
});

// Contract Details by Token Address and Type
// Fetch specific contract details by token address and type (e.g., ERC20)
app.get('/api/contracts/:tokenType/:tokenAddress', (req, res) => {
    const { tokenType, tokenAddress } = req.params;
    // Logic to fetch contract details based on type and address
    res.json({ tokenType, tokenAddress, details: "contract details here" });
});

// Address Data
// Get information for a specific address (balance, nonce, token transfers, etc.)
app.get('/api/address/:address', async (req, res) => {
    const { address } = req.params;
    const balance = await web3.eth.getBalance(address);
    const nonce = await web3.eth.getTransactionCount(address);
    const transactionsByAddress = Array.from(transactions.values()).filter(tx => tx.from === address || tx.to === address);
    res.json({ 
        address, 
        balance, 
        balanceInEther: web3.utils.fromWei(balance, 'ether'), 
        nonce, 
        transactions: transactionsByAddress, 
        tokenTransfers: Array.from(tokenTransfers.values()) 
    });
});

// Address Token Balance by Token Type and Token Address
// Get a specific token balance for an address
app.get('/api/address/:address/tokens/:tokenType/:tokenAddress', async (req, res) => {
    const { address, tokenType, tokenAddress } = req.params;
    // Logic to fetch token balance by address and token type/address
    res.json({ 
        address, 
        tokenType, 
        tokenAddress, 
        balance: "token balance here" 
    });
});

// User Data
// Get detailed user-specific data (balances, transactions, etc.)
app.get('/api/users/:user', async (req, res) => {
    const { user } = req.params;
    if (!users.has(user)) {
        return res.status(404).json({ error: 'User not found' });
    }
    const userData = users.get(user);
    res.json(userData);
});

// User Balances
// Get a user’s balance in both wei and ether
app.get('/api/users/:user/balances', async (req, res) => {
    const { user } = req.params;
    if (!users.has(user)) {
        return res.status(404).json({ error: 'User not found' });
    }
    const balance = await web3.eth.getBalance(user);
    res.json({ address: user, balance, balanceInEther: web3.utils.fromWei(balance, 'ether') });
});

// User Transactions
// Get all transactions associated with a specific user
app.get('/api/users/:user/transactions', async (req, res) => {
    const { user } = req.params;
    const transactionsByUser = Array.from(transactions.values()).filter(tx => tx.from === user || tx.to === user);
    res.json(transactionsByUser);
});

// User Contracts
// Get all contracts associated with a specific user
app.get('/api/users/:user/contracts', async (req, res) => {
    const { user } = req.params;
    const userContracts = Array.from(contracts.values()).filter(contract => contract.owner === user);
    res.json(userContracts);
});



// Block Health Check
// Get the health of the blockchain, including sync status and node status
app.get('/api/health', (req, res) => {
    res.json({
        status: "ok",
        blockchainNode: "connected",
        lastSync: new Date().toISOString()
    });
});
