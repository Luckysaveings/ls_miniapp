// import { useGlobalStore } from "@/store/globalStore";
import { ethers } from "ethers";
import LuckyTokenABI from "@/assets/abi/LuckyToken.json";
// import PrizePoolABI from "@/assets/abi/PrizePool.json";
// import PrizeVaultABI from "@/assets/abi/PrizeVault.json";
import { useGlobalStore } from "@/store/globalStore";

// 生成kaia钱包
export const createKaiaWallet = async () => {
  // const mnemonic = "crowd pyramid term floor network nature bounce topic casual roast cluster fly";
  // const address = "0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9";
  // const privateKey = "0xf9267a9f70dc239b1efecb595dcccaf74a8cecfb4d92f05f2c5d918aeac4f92e";
  // const globalStore = useGlobalStore();
  // globalStore.setMnemonic(mnemonic);
  // globalStore.setAddress(address);
  // globalStore.setPrivateKey(privateKey);
  // return {
  //   mnemonic,
  //   address,
  //   privateKey,
  // };
  // 生成随机助记词
  let mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
  // 通过助记词生成钱包
  let wallet = ethers.Wallet.fromMnemonic(mnemonic);
  console.log("地址:", wallet.address);
  console.log("私钥:", wallet.privateKey);
  console.log("助记词:", mnemonic);
  localStorage.setItem("mnemonic", mnemonic);
  localStorage.setItem("address", wallet.address);
  localStorage.setItem("privateKey", wallet.privateKey);
  const globalStore = useGlobalStore();
  globalStore.setMnemonic(mnemonic);
  globalStore.setAddress(wallet.address);
  globalStore.setPrivateKey(wallet.privateKey);
  return wallet;
};

// 查询余额
export const getBalance = async (address: string) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_CHAIN_URL);
    // const globalStore = useGlobalStore();
    // 查询余额（返回的单位是 Wei，需转换为 KAIA）
    const balanceWei = await provider.getBalance(address);
    const balanceKAIA = ethers.utils.formatEther(balanceWei);
    console.log(`地址 ${address} 的余额为: ${balanceKAIA} KAIA`);
    return balanceKAIA;
  } catch (error) {
    console.error("查询余额失败:", error);
  }
};

// 从当前钱包地址转账到指定钱包地址
export const transferInKaia = async (to: string, value: string) => {
  const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_CHAIN_URL);
  try {
    const globalStore = useGlobalStore();
    // 从 localStorage 中获取当前钱包地址和私钥
    const privateKey = globalStore.privateKey;
    // 通过私钥连接钱包
    const wallet = new ethers.Wallet(privateKey, provider);
    // 转账金额（单位是 KAI，需转换为 Wei）
    const valueWei = ethers.utils.parseEther(value);
    // 构建交易
    const tx = {
      to,
      value: valueWei,
    };
    // 获取当前Gas价格
    // const gasPrice: any = await provider.getGasPrice();
    const gasEstimate: any = await provider.estimateGas(tx);
    // const fee = ethers.utils.formatEther(gasEstimate * gasPrice);
    console.log("预计 gas:", gasEstimate.toString());
    // 发送交易
    const txResponse = await wallet.sendTransaction(tx);
    console.log("交易哈希:", txResponse.hash);
    // 等待交易确认
    const receipt = await txResponse.wait();
    console.log("交易已确认，区块高度:", receipt.blockNumber);
  } catch (error) {
    console.error("转账失败:", error);
  }
};

// 生成智能合约实例
const getContractInstance = async () => {
  const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_CHAIN_URL);
  const privateKey = localStorage.getItem("privateKey2"); // 请替换为您的私钥
  const wallet = new ethers.Wallet(privateKey, provider);
  // 合约地址和 ABI
  const contractAddress = "0xd5da3b4ddfb96682b7c3a17fa5080a2d10ba06d9"; // poolInfos[poolCoinType][poolType].address; // 替换为实际的 Prize Pool 地址
  const ABI = LuckyTokenABI.abi;
  // 创建合约实例
  const prizePoolContract = new ethers.Contract(contractAddress, ABI, wallet);
  return prizePoolContract;
};

// 查询钱包上的金额，对应合约的币种
export const getContractInfo = async () => {
  const prizePoolContract = await getContractInstance();
  const stakedAmount = await prizePoolContract.balanceOf(localStorage.getItem("address2"));
  console.log(stakedAmount);
  console.log(`钱包地址 ${localStorage.getItem("address2")} 的质押金额：${ethers.utils.formatUnits(stakedAmount, 18)} token`);
  return stakedAmount;
};

// 进行合约转账
export const transferWithContract = async (to, amount) => {
  const amountInUnits = ethers.utils.parseUnits(amount, 18); // 假设代币有18位小数
  const prizePoolContract = await getContractInstance();
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    // "0xbdfe673de8f2d6a6b7eeded9e726dd9c6841a978"
    const gasEstimate = await prizePoolContract.estimateGas.transfer(to, amountInUnits);
    console.log("预计 gas:", gasEstimate.toString());
    response.tx = await prizePoolContract.transfer(to, amountInUnits);
    console.log("交易已发送，交易哈希:", response.tx.hash);
    const receipt = await response.tx.wait(); // 等待交易确认
    console.log("交易已确认，区块号:", receipt.blockNumber);
    response.status = 0;
  } catch (error) {
    console.log("查询质押金额失败", error);
    response.status = 1;
  }
  return response;
};
