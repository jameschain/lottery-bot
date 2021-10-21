require("dotenv").config();

const ethers = require("ethers");
const abi = require("./abi/lottery.json");

const infuraKey = process.env.INFURA_KEY;
const myPrivateKeyHex = process.env.WALLET_PRIVATE_KEY_HEX;

const provider = new ethers.providers.JsonRpcProvider(
  `https://polygon-mainnet.infura.io/v3/${infuraKey}`
);

const wallet = new ethers.Wallet(myPrivateKeyHex, provider);
const address = process.env.CONTRACT_ADDRESS;
const lotteryContract = new ethers.Contract(address, abi, provider).connect(
  wallet
);

console.log(wallet);
console.log(lotteryContract);

const startLottery = () => {
  lotteryContract
    .startLottery(
      1634256000, // Timestamp for future time
      5000000000000000000,
      500,
      [2500, 2000, 1250, 1750, 600, 1900],
      2000
    )
    .then((data) => console.log("success", data))
    .catch((e) => console.log("error", e));
};

startLottery();
