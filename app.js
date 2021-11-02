require("dotenv").config();

const ethers = require("ethers");
const abi = require("./abi/lottery.json");
const BN = require("bignumber.js");
const schedule = require("node-schedule");

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

const startLottery = async () => {
  const currentDate = new Date();
  const timestamp = Math.round(currentDate.getTime() / 1000) + 24 * 60 * 60;

  console.log(timestamp);

  const result = await lotteryContract.startLottery(
    timestamp, // Timestamp for future time
    "5000000000000000000",
    500,
    [2500, 2000, 1250, 1750, 600, 1900],
    2000
  );

  console.log(result);
};
const getCurrentLotteryId = async () => {
  return (await lotteryContract.currentLotteryId.call()).toString();
};

const closeLottery = async () => {
  const currentLotteryId = await getCurrentLotteryId();

  const result = await lotteryContract.closeLottery(parseInt(currentLotteryId));
  console.log(result);
};

const drawFinalLottery = async () => {
  const currentLotteryId = await getCurrentLotteryId();

  const drawFinalResult =
    await lotteryContract.drawFinalNumberAndMakeLotteryClaimable(
      parseInt(currentLotteryId),
      true
    );

  console.log(drawFinalResult);
};

schedule.scheduleJob(
  { tz: "America/Atikokan", hour: 22, minute: 0 },
  closeLottery
);

schedule.scheduleJob(
  { tz: "America/Atikokan", hour: 22, minute: 5 },
  drawFinalLottery
);

schedule.scheduleJob(
  { tz: "America/Atikokan", hour: 22, minute: 10 },
  startLottery
);
