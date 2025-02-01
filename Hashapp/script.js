let faucetContract,
isWalletConnected = false;
window.onload = init;
function openModal(modalId) {
 closeAllModals();
 const modal = document.getElementById(modalId);
 if (modal) {
  modal.style.display = "block";
 }
 const backdrop = document.querySelector(".backdrop");
 if (backdrop) {
  backdrop.style.display = "block";
 }
}
function closeModal(modalId) {
 const modal = document.getElementById(modalId);
 if (modal) {
  modal.style.display = "none";
 }
 const backdrop = document.querySelector(".backdrop");
 if (backdrop) {
  backdrop.style.display = "none";
 }
}
function closeAllModals() {
 const modals = document.querySelectorAll(".modal");
 modals.forEach((modal) => {
  modal.style.display = "none";
 });
 const backdrop = document.querySelector(".backdrop");
 if (backdrop) {
  backdrop.style.display = "none";
 }
}
function iconClick(page) {
 closeAllModals();
 switch (page) {
  case "Staking":
   openModal("stakingModal");
   break;
  case "HashEx":
   openModal("HashExModal");
   break;
  case "Academy":
   openModal("AcademyModal");
   break;
  case "Arcade":
   openModal("ArcadeModal");
   break;
  case "Support":
   openModal("supportModal");
   break;
  case "Home":
   openModal("homeModal");
   break;
  case "Farming":
   openModal("farmingModal");
   break;
  case "Factory":
   openModal("FactoryModal");
   break;
  case "Mining":
   openModal("miningModal");
   break;
  case "Links":
   openModal("linksModal");
   break;
  case "Quests":
   openModal("questsModal");
   break;
  case "Airdrops":
   openModal("airdropsModal");
   break;
  case "Faucet":
   openModal("faucetModal");
   break;
  case "Settings":
   openModal("settingsModal");
   break;
  default:
   console.warn("No modal found for this page:", page);
   break;
 }
}
(function () {
 const avatarImg = document.getElementById("avatarImg");
 const avatarStyleSelect = document.getElementById("avatarStyle");
 const generateBtn = document.getElementById("generateBtn");
 const createProfileBtn = document.getElementById("createProfileBtn");
 const profileSection = document.getElementById("profileSection");
 const selectedAvatar = document.getElementById("selectedAvatar");
 const userName = document.getElementById("userAddress");
 const nameInput = document.getElementById("nameInput");
 const savedAvatarsSection = document.getElementById("savedAvatars");
 let savedAvatars = [];

 function generateRandomAvatar() {
  const style = avatarStyleSelect.value;
  const randomSeed = Math.floor(Math.random() * 100000);
  const apiURL = `https://api.dicebear.com/9.x/${style}/svg?seed=${randomSeed}`;

  avatarImg.src = apiURL;
  avatarImg.onload = () => {
   if (!avatarImg.complete) return;
   savedAvatars.push(apiURL);
   if (savedAvatars.length > 30) savedAvatars.shift();
   updateThumbnails();
  };
 }

 function updateThumbnails() {
  savedAvatarsSection.innerHTML = "";
  savedAvatars.forEach((avatarUrl) => {
   const thumbnailDiv = document.createElement("div");
   thumbnailDiv.classList.add("thumbnail");
   const thumbnailImg = document.createElement("img");
   thumbnailImg.src = avatarUrl;
   thumbnailDiv.appendChild(thumbnailImg);
   thumbnailDiv.addEventListener("click", () => {
    avatarImg.src = avatarUrl;
   });
   savedAvatarsSection.appendChild(thumbnailDiv);
  });
 }

 window.createProfileBtn.addEventListener("click", () => {
  const userAddress = nameInput.value.trim();
  if (userAddress && avatarImg.src) {
   document.getElementById("newUserScreen").style.display = "none";
   document.getElementById("returningUserScreen").style.display = "none";
   document.getElementById("guestModeScreen").style.display = "none";
   userName.textContent = userAddress;
   selectedAvatar.src = avatarImg.src;
  } else {
   alert("Please enter a name and generate an avatar.");
  }
 });

 generateRandomAvatar();
 generateBtn.addEventListener("click", generateRandomAvatar);
})();
let savedAvatars = [];
newUserScreen.style.display = "none";
returningUserScreen.style.display = "none";
guestModeScreen.style.display = "none";
newUserBtn.addEventListener("click", function () {
 newUserScreen.style.display = "block";
 butcon1.style.display = "none"; 
});
returningUserBtn.addEventListener("click", function () {
 returningUserScreen.style.display = "block";
 butcon1.style.display = "none"; 
});
guestModeBtn.addEventListener("click", function () {
 guestModeScreen.style.display = "block";
 butcon1.style.display = "none"; 
});







const withdrawBtn = document.getElementById("withdrawBtn");
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletStatus = document.getElementById("walletStatus");
const CONFIG = {
 faucetAddress: "0x0CcA8f28b1956462C093bAb61509738f5Cf2b664",
 defaultGasLimit: 70000,
 defaultGasPrice: 5
};
const contractABI = [
 {
  inputs: [],
  name: "TIME_LIMIT",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function"
 },
 {
  inputs: [],
  name: "WITHDRAWAL_AMOUNT",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function"
 },
 {
  inputs: [],
  name: "contractBalance",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function"
 },
 {
  inputs: [],
  name: "withdraw",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function"
 },
 {
  stateMutability: "payable",
  type: "receive"
 }
];
document.getElementById("connectWalletBtn").addEventListener("click", async () => {
            if (window.ethereum) {
                try {
                 
                    await window.ethereum.request({ method: "eth_requestAccounts" });
                    
                    web3 = new Web3(window.ethereum); 
                    const accounts = await web3.eth.getAccounts();
                    userAddress = accounts[0];
                    
                    contract = new web3.eth.Contract(AIRDROP_ABI, AIRDROP_CONTRACT_ADDRESS);
                    
                    document.getElementById("userAddress").innerText = `${userAddress}`;

             
               document.getElementById("expBalance").innerText = `EXP: Fetching...`;
        document.getElementById("hCashBalance").innerText = `$ : Fetching...`;

        await updateBalances(userAddress);
                } catch (error) {
                    console.error(error);
                    alert("Failed to connect wallet.");
                }
            } else {
                alert("Please install MetaMask.");
            }
        });
const statusMessageDiv = document.getElementById("status");
const contractBalanceDiv = document.getElementById("balance");
const claimAirdropBtn = document.getElementById("claimAirdropBtn");
const hashdropContractABI = [
 {
  anonymous: false,
  inputs: [
   {
    indexed: true,
    internalType: "address",
    name: "recipient",
    type: "address"
   },
   {
    indexed: false,
    internalType: "uint256",
    name: "amount",
    type: "uint256"
   }
  ],
  name: "AirdropClaimed",
  type: "event"
 },
 {
  inputs: [],
  name: "claimAirdrop",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function"
 },
 {
  stateMutability: "payable",
  type: "receive"
 },
 {
  inputs: [],
  name: "AMOUNT_TO_SEND",
  outputs: [
   {
    internalType: "uint256",
    name: "",
    type: "uint256"
   }
  ],
  stateMutability: "view",
  type: "function"
 },
 {
  inputs: [
   {
    internalType: "address",
    name: "",
    type: "address"
   }
  ],
  name: "claimed",
  outputs: [
   {
    internalType: "bool",
    name: "",
    type: "bool"
   }
  ],
  stateMutability: "view",
  type: "function"
 },
 {
  inputs: [],
  name: "contractBalance",
  outputs: [
   {
    internalType: "uint256",
    name: "",
    type: "uint256"
   }
  ],
  stateMutability: "view",
  type: "function"
 },
 {
  inputs: [],
  name: "sender",
  outputs: [
   {
    internalType: "address",
    name: "",
    type: "address"
   }
  ],
  stateMutability: "view",
  type: "function"
 }
];
const hashdropContractAddress = "0x4Be070791B505CB0bbc2C65713F06193CFEb40E6"; //
let web3Instance = new Web3(window.ethereum);
let hashdropContractInstance;
const AIRDROP_CONTRACT_ADDRESS = "0x4Be070791B505CB0bbc2C65713F06193CFEb40E6";
const AIRDROP_ABI = [
 {
  anonymous: false,
  inputs: [
   {
    indexed: true,
    internalType: "address",
    name: "recipient",
    type: "address"
   },
   {
    indexed: false,
    internalType: "uint256",
    name: "amount",
    type: "uint256"
   }
  ],
  name: "AirdropClaimed",
  type: "event"
 },
 {
  inputs: [],
  name: "claimAirdrop",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function"
 },
 {
  stateMutability: "payable",
  type: "receive"
 },
 {
  inputs: [],
  name: "AMOUNT_TO_SEND",
  outputs: [
   {
    internalType: "uint256",
    name: "",
    type: "uint256"
   }
  ],
  stateMutability: "view",
  type: "function"
 },
 {
  inputs: [
   {
    internalType: "address",
    name: "",
    type: "address"
   }
  ],
  name: "claimed",
  outputs: [
   {
    internalType: "bool",
    name: "",
    type: "bool"
   }
  ],
  stateMutability: "view",
  type: "function"
 },
 {
  inputs: [],
  name: "contractBalance",
  outputs: [
   {
    internalType: "uint256",
    name: "",
    type: "uint256"
   }
  ],
  stateMutability: "view",
  type: "function"
 },
 {
  inputs: [],
  name: "sender",
  outputs: [
   {
    internalType: "address",
    name: "",
    type: "address"
   }
  ],
  stateMutability: "view",
  type: "function"
 }
];
let web3, contract, userAddress;
async function updateContractBalance() {
  try {
    const balance = await faucetContract.methods.contractBalance().call();
    const balanceInEther = web3.utils.fromWei(balance, "ether");
    document.getElementById("balance").textContent = `Contract Balance: ${balanceInEther} HASH`;
  } catch (error) {
    console.error("Error fetching balance:", error);
    document.getElementById("balance").textContent = "Error fetching balance";
  }
}
window.onload = updateBalances;
async function requestHash() {
  // Ensure the contract is initialized before proceeding
  if (!faucetContract) {
    console.error("Faucet contract is not initialized");
    document.getElementById("balance").textContent = "Contract not initialized";
    return;
  }

  try {
    // Estimate gas and send the transaction
    const gasEstimate = await faucetContract.methods.withdraw().estimateGas({ from: userAddress });
    await faucetContract.methods.withdraw().send({ from: userAddress, gas: gasEstimate });

    document.getElementById("balance").textContent = "Withdrawal Successful!";
    setTimeout(() => {
      updateContractBalance();
    }, 3000);
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("balance").textContent = "Error: " + error.message;
  }
}
async function initHashdropContract() {
  hashdropContract = new web3.eth.Contract(hashdropContractABI, hashdropContractAddress);

  // Add event listener to claim airdrop button
  const claimAirdropBtn = document.getElementById("claimAirdropBtn");
  claimAirdropBtn.addEventListener("click", async () => {
    await claimAirdrop();
  });
}
async function init() {
  if (window.ethereum) {
    web3 = new Web3(Web3.givenProvider);
    await initFaucetContract();
   
 levelUpContract = new web3.eth.Contract(levelUpContractABI, levelUpContractAddress);
   if (accounts && accounts.length > 0) {
                    document.getElementById("status").innerText = "Connected: " + accounts[0];
                    document.getElementById("levelUpSection").style.display = "block";
  } else {
    alert("Please install MetaMask to use this feature.");
  }
}
}
async function initFaucetContract() {

  faucetContract = new web3.eth.Contract(contractABI, CONFIG.faucetAddress);


  if (!faucetContract) {
    console.error("Faucet contract not initialized");
    return;
  }

  const withdrawBtn = document.getElementById("withdrawBtn");
  withdrawBtn.addEventListener("click", async () => {
    await requestHash();
  });
}
async function claimAirdrop() {
  if (!hashdropContract) {
    console.error("Hashdrop contract is not initialized");
    document.getElementById("status").textContent = "Airdrop contract not initialized";
    return;
  }

  try {
    const gasEstimate = await hashdropContract.methods.claimAirdrop().estimateGas({ from: userAddress });
    await hashdropContract.methods.claimAirdrop().send({ from: userAddress, gas: gasEstimate });

    document.getElementById("status").textContent = "Airdrop Claimed Successfully!";
    setTimeout(() => {
      updateContractBalance(); // Optionally, update balance after airdrop
    }, 3000);
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("status").textContent = "Error: " + error.message;
  }
}
document.getElementById("connectWalletBtn").addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      userAddress = accounts[0];
      levelUpContract = new web3.eth.Contract(levelUpContractABI, levelUpContractAddress);
      document.getElementById("userAddress").innerText = ` ${userAddress}`;
      await initFaucetContract();  // Initialize faucet contract after wallet connection
      await initHashdropContract();  // Initialize hashdrop contract after wallet connection

    } catch (error) {
      console.error(error);
      alert("Failed to connect wallet.");
    }
  } else {
    alert("Please install MetaMask.");
  }
});
function autoFillGasFields() {
 // Set default values for gas limit and gas price
 document.getElementById("gas-limit").value = defaultGasLimit;
 document.getElementById("gas-price").value = defaultGasPrice;

 // Hide the input fields
 document.getElementById("gas-limit").style.display = "none";
 document.getElementById("gas-price").style.display = "none";
}
async function getEXPBalance(userAddress) {
    const expToken = new web3.eth.Contract(erc20Abi, expTokenAddress);
    const decimals = await expToken.methods.decimals().call();
    const balance = await expToken.methods.balanceOf(userAddress).call();
    document.getElementById("expBalance").innerText = `EXP: ${balance / 10 ** decimals}`;
}
async function getHCashBalance(userAddress) {
    const hCashToken = new web3.eth.Contract(erc20Abi, hCashTokenAddress);
    const decimals = await hCashToken.methods.decimals().call();
    const balance = await hCashToken.methods.balanceOf(userAddress).call();
    document.getElementById("hCashBalance").innerText = `$: ${balance / 10 ** decimals}`;
}
async function getUserLevel(userAddress) {
    let levels = [];
    for (const contractData of levelContracts) {
        const contract = new web3.eth.Contract(contractData.abi, contractData.address);
        const level = await contract.methods.getLevel(userAddress).call();
        levels.push(level);
    }
    document.getElementById("userLevel").innerText = `Levels: ${levels.join(", ")}`;
}
async function updateBalances() {
    try {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];

            // Fetch EXP token balance
            const expToken = new web3.eth.Contract(erc20Abi, expTokenAddress);
            const expBalance = await expToken.methods.balanceOf(userAddress).call();
            const expDecimals = await expToken.methods.decimals().call();
            document.getElementById("expBalance").innerText = `EXP: ${(expBalance / 10 ** expDecimals).toFixed(2)}`;

            // Fetch H-Cash token balance
            const hCashToken = new web3.eth.Contract(erc20Abi, hCashTokenAddress);
            const hCashBalance = await hCashToken.methods.balanceOf(userAddress).call();
            const hCashDecimals = await hCashToken.methods.decimals().call();
            document.getElementById("hCashBalance").innerText = `$: ${(hCashBalance / 10 ** hCashDecimals).toFixed(2)}`;
        } else {
            alert("Please install MetaMask!");
        }
    } catch (error) {
        console.error("Error fetching balances:", error);
        document.getElementById("expBalance").innerText = "EXP: Error";
        document.getElementById("hCashBalance").innerText = "$: Error";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("expBalance").innerText = "EXP: Connecting...";
    getEXPBalance();
    document.getElementById("hCashBalance").innerText = "$: Connecting...";
    getHCashBalance();
    document.getElementById("userLevel").innerText = "Level: Connecting...";
    getUserLevel();
});
async function sendTransaction() {
 const amount = document.getElementById("amount").value;
 const toAddress = document.getElementById("to-address").value;

 const gasLimit = defaultGasLimit;
 const gasPrice = defaultGasPrice;

 if (!amount || !toAddress) {
  alert("Please fill out all fields.");
  return;
 }

 try {
  const tx = {
   from: userAddress,
   to: toAddress,
   value: web3.utils.toWei(amount, "ether"),
   gas: gasLimit,
   gasPrice: web3.utils.toWei(gasPrice.toString(), "gwei")
  };

  const receipt = await web3.eth.sendTransaction(tx);
  addTransactionHistory(receipt);
  displayWalletInfo();
  alert("Transaction successful!");
 } catch (error) {
  console.error(error);
  alert("Transaction failed: " + error.message);
 }
}
function addTransactionHistory(receipt) {
 const transactionHistoryDiv = document.getElementById("transaction-history");
 const historyItem = document.createElement("div");
 historyItem.innerHTML = `
        <p><strong>Tx Hash:</strong> <a href="https://etherscan.io/tx/${
         receipt.transactionHash
        }" target="_blank">${receipt.transactionHash}</a></p>
        <p><strong>Amount Sent:</strong> ${web3.utils.fromWei(
         receipt.value,
         "ether"
        )} HASH</p>
      `;
 transactionHistoryDiv.appendChild(historyItem);
}
const expTokenAddress = "0xA42360D4e562755B4769e601f5539843D6B7EBF6"; 
const hCashTokenAddress = "0x87F6218b2bc608A7b66202824D4c9b7d842dBBE6";  
 const erc20Abi = [
    {
        "constant": true,
        "inputs": [{ "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
let accounts;
let levelUpContract;
let levelUpContractAddress = "0xE011110bB7023132FAdf12E88333C77345b07555"; 
let levelUpContractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_expAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_levelTokenAddress",
				"type": "address"
			}
		],
		"name": "levelUp",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_expToken",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_levelToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "expAmount",
				"type": "uint256"
			}
		],
		"name": "LevelUpEvent",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "EXP_COST",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "expAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "expToken",
		"outputs": [
			{
				"internalType": "contract ICustomToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "levelToken",
		"outputs": [
			{
				"internalType": "contract ICustomToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
document.getElementById("levelUpButton").addEventListener("click", async () => {
    // Fetch the accounts from MetaMask
    let accounts = await web3.eth.getAccounts();
    
    if (accounts.length === 0) {
        document.getElementById("status").innerText = "Please connect your wallet!";
        return;
    }

    let expAmount = 10 * (10 ** 18); // EXP Amount (adjusting for decimals, assuming 18 decimals)
    let levelTokenAddress = expTokenAddress; // Assuming the level token is the same as the EXP token for now

    try {
        // Approve the contract to spend the EXP tokens
        await expToken.methods.approve(levelUpContractAddress, expAmount).send({ from: accounts[0] });

        // Now, interact with your LevelUp contract
        const levelUpContract = new web3.eth.Contract(levelUpABI, levelUpContractAddress);
        await levelUpContract.methods.levelUp(expAmount, levelTokenAddress).send({ from: accounts[0] });

        // Update status
        document.getElementById("status").innerText = "Level Up Successful! You received 1 Level 1 Token.";
    } catch (error) {
        console.error(error);
        document.getElementById("status").innerText = "Transaction failed!";
    }
}); 
