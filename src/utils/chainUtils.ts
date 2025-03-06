// import { useGlobalStore } from "@/store/globalStore";
import { ethers } from "ethers";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import LuckyTokenABI from "@/assets/abi/LuckyToken.json";
import KaiaPrizePoolABI from "@/assets/abi/PrizeVault.json";
import PrizeVaultABI from "@/assets/abi/PrizeVault.json";
import { useGlobalStore } from "@/store/globalStore";
import { bindWallet } from "@/api/index";

// 获取dapp钱包示例以及地址
export const getDappWallet = async () => {
  const globalStore = useGlobalStore();
  let sdk: any = undefined;
  if (globalStore.dappPortalSDK) {
    sdk = globalStore.dappPortalSDK;
  } else {
    // 初始化SDK
    sdk = await DappPortalSDK.init({
      clientId: import.meta.env.VITE_CLIENT_ID,
      chainId: import.meta.env.VITE_PUBLIC_CHAIN_ID,
    });
  }
  globalStore.setSdk(sdk); // 保存sdk实例
  const walletProvider = sdk.getWalletProvider();
  globalStore.setProvider(walletProvider);
  const accounts = await walletProvider.request({ method: "kaia_requestAccounts" }); // 获取钱包地址, 首次运行用户界面会弹出钱包授权请求
  const accountAddress = accounts[0];
  globalStore.setAddress(accountAddress);
  console.log("accountAddress:", accountAddress);
  bindWallet({ wallet: accountAddress });
  return accountAddress;
};
// dapp 钱包进行代币授权
export const approveTokenForDeposit = async (tokenContractAddress: string, depositContractAddress: string, amount: string) => {
  const globalStore = useGlobalStore();
  const walletProvider = globalStore.walletProvider;
  const provider = new ethers.providers.Web3Provider(walletProvider);
  const amountInUnits = ethers.utils.parseUnits(amount, 18);
  const luckyTokenContract = new ethers.Contract(tokenContractAddress, LuckyTokenABI.abi, provider.getSigner());
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    response.tx = await luckyTokenContract.approve(depositContractAddress, amountInUnits);
    console.log("授权交易已发送，交易哈希:", response.tx.hash);
    const receipt = await response.tx.wait();
    console.log("授权交易已确认，区块号:", receipt.blockNumber);
    response.status = 0;
  } catch (error) {
    console.log("授权失败", error);
    response.status = 1;
  }
  return response;
};
// 使用dapp查询质押合约的质押金额
export const getDpositAmount = async (address: string, type: string) => {
  const globalStore = useGlobalStore();
  const walletProvider = globalStore.walletProvider;
  const provider = new ethers.providers.Web3Provider(walletProvider);
  let contract: any = undefined;
  if (type === "USDT") {
    contract = new ethers.Contract(import.meta.env.VITE_TOKEN_PRIZE_POOL_ADDRESS, PrizeVaultABI.abi, provider);
  } else {
    contract = new ethers.Contract(import.meta.env.VITE_KAIA_PRIZE_POOL_ADDRESS, KaiaPrizePoolABI.abi, provider);
  }
  const balanceWei = await contract.balanceOf(address);
  const balanceToken = ethers.utils.formatUnits(balanceWei, 18);
  console.log("质押金额Token:", balanceToken);
  if (type === "USDT") {
    globalStore.setUsdtBalance({savings: balanceToken});
  } else {
    globalStore.setKaiaBalance({savings: balanceToken});
  }
  return balanceToken;
};
// 使用dapp查询质押合约的质押金额
export const getPoolAmount = async (type: string) => {
  const globalStore = useGlobalStore();
  const walletProvider = globalStore.walletProvider;
  const provider = new ethers.providers.Web3Provider(walletProvider);
  let contract: any = undefined;
  if (type === "USDT") {
    contract = new ethers.Contract(import.meta.env.VITE_TOKEN_PRIZE_POOL_ADDRESS, PrizeVaultABI.abi, provider);
  } else {
    contract = new ethers.Contract(import.meta.env.VITE_KAIA_PRIZE_POOL_ADDRESS, KaiaPrizePoolABI.abi, provider);
  }
  const balanceWei = await contract.totalAssets();
  const balanceToken = ethers.utils.formatUnits(balanceWei, 18);
  console.log("质押金额Token:", balanceToken);
  if (type === "USDT") {
    globalStore.setUsdtBalance({allAmount: balanceToken});
  } else {
    globalStore.setKaiaBalance({allAmount: balanceToken});
  }
  return balanceToken;
};
// dapp钱包进行已授权的代币质押
export const depositWithDepositContract = async (depositContractAddress: string, walletAddress: string, amount: string) => {
  const globalStore = useGlobalStore();
  const walletProvider = globalStore.walletProvider;
  const provider = new ethers.providers.Web3Provider(walletProvider);
  const depositContract = new ethers.Contract(depositContractAddress, PrizeVaultABI.abi, provider.getSigner());
  const amountInUnits = ethers.utils.parseUnits(amount, 18);
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    response.tx = await depositContract.deposit(amountInUnits, walletAddress);
    console.log("质押转账交易已发送，交易哈希:", response.tx.hash);
    const receipt = await response.tx.wait();
    console.log("质押转账交易已确认，区块号:", receipt.blockNumber);
    response.status = 0;
  } catch (error) {
    console.log("质押转账失败", error);
    response.status = 1;
  }
  return response;
}
// dapp钱包进行提现
export const withdrawWithDepositContract = async (depositContractAddress: string, walletAddress: string, amount: string) => {
  const globalStore = useGlobalStore();
  const walletProvider = globalStore.walletProvider;
  const provider = new ethers.providers.Web3Provider(walletProvider);
  const depositContract = new ethers.Contract(depositContractAddress, PrizeVaultABI.abi, provider.getSigner());
  const amountInUnits = ethers.utils.parseUnits(amount, 18);
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    response.tx = await depositContract.withdraw(amountInUnits, walletAddress, walletAddress);
    console.log("质押转账交易已发送，交易哈希:", response.tx.hash);
    const receipt = await response.tx.wait();
    console.log("质押转账交易已确认，区块号:", receipt.blockNumber);
    response.status = 0;
  } catch (error) {
    console.log("质押转账失败", error);
    response.status = 1;
  }
  return response;
}
// 使用dapp sdk查询本位币余额
export const getBalanceWithDapp = async (address: string) => {
  const globalStore = useGlobalStore();
  const walletProvider = globalStore.walletProvider;
  const balanceWei = await walletProvider.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  });
  const balanceKAIA = ethers.utils.formatEther(balanceWei);
  globalStore.setKaiaBalance({balance: balanceKAIA});
  console.log("钱包余额Kaia:", balanceKAIA);
  return balanceKAIA;
};
// 使用dapp sdk查询合约代币余额
export const getTokenBalanceWithDapp = async (address: string, tokenAddress: string) => {
  const globalStore = useGlobalStore();
  const walletProvider = globalStore.walletProvider;
  const provider = new ethers.providers.Web3Provider(walletProvider);
  const contract = new ethers.Contract(tokenAddress, LuckyTokenABI.abi, provider);
  const balanceWei = await contract.balanceOf(address);
  const balanceToken = ethers.utils.formatUnits(balanceWei, 18);
  globalStore.setUsdtBalance({balance: balanceToken});
  console.log("合约代币余额Token:", balanceToken);
  return balanceToken;
};
// 直接生成kaia链上钱包
export const createKaiaWallet = async () => {
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
// 直接查询本位币余额
export const getBalance = async (address: string) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_CHAIN_URL);
    const globalStore = useGlobalStore();
    // 查询余额（返回的单位是 Wei，需转换为 KAIA）
    const balanceWei = await provider.getBalance(address);
    const balanceKAIA = ethers.utils.formatEther(balanceWei);
    console.log(`地址 ${address} 的余额为: ${balanceKAIA} KAIA`);
    globalStore.setKaiaBalance({balance: balanceKAIA});
    return balanceKAIA;
  } catch (error) {
    console.error("查询余额失败:", error);
  }
};
// 从当前钱包地址转账到指定钱包地址，默认本位币转账，使用私钥操作，无需互动确认，不通过dapp钱包
export const transferInKaia = async (fromPrivateKey: string, to: string, value: string) => {
  const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_CHAIN_URL);
  try {
    const privateKey = fromPrivateKey; // globalStore.privateKey;
    // 通过私钥构建钱包，可进行签名确权
    const wallet = new ethers.Wallet(privateKey, provider);
    // 转账金额（单位是 KAIA，需转换为 Wei，即乘以10的18次方）
    const valueWei = ethers.utils.parseEther(value);
    // 构建交易
    const tx = {
      to,
      value: valueWei,
    };
    // 计算当前gas消耗
    const gasEstimate: any = await provider.estimateGas(tx);
    // 获取当前Gas价格
    const gasPrice = await provider.getGasPrice();
    // 计算总Gas费用
    const totalGasCost = gasEstimate.mul(gasPrice);
    console.log("gasEstimate:", ethers.utils.formatEther(gasEstimate));
    // 对gas费用转换单位为kaia
    const totalGasCostKAIA = ethers.utils.formatEther(totalGasCost);
    console.log("预计 totalGasCost(转换):", totalGasCostKAIA);
    // 实际交易中需要先计算当前钱包是否有充足的余额，钱包余额需要 > 转账金额 + gas费用
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
// 生成LuckyToken智能合约实例（非本位币均为合约生成、控制），私钥为空时可执行查询操作，写入操作必须有私钥或其他确权方式，使用私钥操作，无需互动确认，不通过dapp钱包
const getContractInstanceForLuckyToken = async (privateKey?: string) => {
  const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_CHAIN_URL);
  let wallet: any = undefined;
  // const privateKey = localStorage.getItem("privateKey2"); // 请替换为您的私钥
  if (privateKey) {
    wallet = new ethers.Wallet(privateKey, provider);
  } else {
    wallet = provider;
  }
  // 合约地址和 ABI
  const contractAddress = import.meta.env.VITE_TOKEN_ADDRESS; // 这是luckyToken的合约地址
  const ABI = LuckyTokenABI.abi;
  // 创建合约实例
  const luckyTokenContract = new ethers.Contract(contractAddress, ABI, wallet);
  return luckyTokenContract;
};
// 查询非本位币链上钱包上的金额，对应合约的币种，不通过dapp钱包
export const getWalletBanlanceWithContract = async (address: string) => {
  const globalStore = useGlobalStore();
  // 使用私药生成对应的合约实例，已建好的合约钱包私钥：0xf9267a9f70dc239b1efecb595dcccaf74a8cecfb4d92f05f2c5d918aeac4f92e
  const luckyTokenContract = await getContractInstanceForLuckyToken();
  // 0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9 上面私钥的对应地址，这个地址已经有差不多100万的token（即这个合约对应的代币）
  const banlanceAmount = await luckyTokenContract.balanceOf(address);
  console.log(`钱包地址 ${localStorage.getItem("address2")} 的余额：${ethers.utils.formatUnits(banlanceAmount, 18)} token`);
  globalStore.setUsdtBalance({balance: ethers.utils.formatUnits(banlanceAmount, 18)});
  return banlanceAmount;
};
// 进行合约转账，使用私钥操作，无需互动确认，不通过dapp钱包
export const transferWithContract = async (fromPrivateKey: string, to: string, amount) => {
  const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_CHAIN_URL);
  const amountInUnits = ethers.utils.parseUnits(amount, 18); // erc20标准实现的合约代币的基础单位很小，需要转换，通常和直接看到的代币数量相差10的18次方的倍数
  const luckyTokenContract = await getContractInstanceForLuckyToken(fromPrivateKey);
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    // "0xbdfe673de8f2d6a6b7eeded9e726dd9c6841a978"，先计算转账的gas消耗
    const gasEstimate = await provider.estimateGas({ to, value: amountInUnits });
    const gasPrice = await provider.getGasPrice();
    const transactionFee = gasEstimate.mul(gasPrice);
    console.log("gasPrice:", gasPrice);
    console.log("gasEstimate:", ethers.utils.formatEther(gasEstimate));
    console.log("预计手续费:", ethers.utils.formatEther(transactionFee));
    response.tx = await luckyTokenContract.transfer(to, amountInUnits);
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
// 钱包地址处理方法
export function formatWalletAddress(value: any, startLength:number = 6, endLength: number = 4) {
  if (!value) return ''
  const startChar = value.toString().substr(0, startLength)
  const endChar = value.toString().substr(value.toString().length - endLength)
  return `${startChar}...${endChar}`
};
// 一个金额处理方法，数字不超过10000时原样显示，数字超过10000除以1000，保留2位小数，单位为k
export const formatAmount = (amount: number): string => {
  amount = Math.floor(Number(amount) * 100) / 100;
  if (amount <= 10000) {
    return amount.toString();
  }
  const formattedAmount = Math.floor(amount / 10) / 100;
  return `${formattedAmount}K`;
};
