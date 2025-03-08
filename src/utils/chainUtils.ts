// import { useGlobalStore } from "@/store/globalStore";
import Web3 from 'web3';
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import LuckyTokenABI from "@/assets/abi/LuckyToken.json";
import KaiaPrizePoolABI from "@/assets/abi/PrizeVault.json";
import PrizeVaultABI from "@/assets/abi/PrizeVault.json";
import { useGlobalStore } from "@/store/globalStore";
import { bindWallet } from "@/api/index";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

/**
 * @dewscription 获取dapp钱包示例以及地址
 */
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
  // 绑定钱包
  bindWallet({ wallet: accountAddress });
};
/**
 * @description: 使用Web3生成智能合约实例（非本位币均为合约生成、控制），私钥为空时可执行查询操作，写入操作必须有私钥或其他确权方式，使用私钥操作，无需互动确认，不通过dapp钱包
 * @param getPrizepoolContract 
 * @param contractType type: string, "1": luckyToken contract, "2": kaia prize pool contract, "3": usdt prize pool contract, default: "1"
 * @returns 
 */
const getContractInstanceWithWeb3 = (contractType: string = "1") => {
  let web3: any = undefined;
  if (import.meta.env.VITE_ENV === "PROD") {
    const globalStore = useGlobalStore();
    const walletProvider = globalStore.walletProvider;
    web3 = new Web3(walletProvider);
  } else {
    web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
    const account = web3.eth.accounts.privateKeyToAccount(localStorage.getItem("privateKey2"));
    web3.eth.accounts.wallet.add(account);
  }
  let contractAddress: any = undefined;
  let ABI: any = undefined;
  // 合约地址和 ABI
  if (contractType === "1") {
    contractAddress = import.meta.env.VITE_TOKEN_ADDRESS; // 这是luckyToken的合约地址
    ABI = LuckyTokenABI.abi;
  } else if (contractType === "2") {
    contractAddress = import.meta.env.VITE_KAIA_PRIZE_POOL_ADDRESS; // 这是prizepool的合约地址
    ABI = KaiaPrizePoolABI.abi;
  } else {
    contractAddress = import.meta.env.VITE_TOKEN_PRIZE_POOL_ADDRESS; // 这是prizepool的合约地址
    ABI = PrizeVaultABI.abi;
  }
  // 创建合约实例
  const contractInstance = new web3.eth.Contract(ABI, contractAddress);
  return contractInstance;
};
/**
 * @description 钱包进行代币授权的gas消耗预估
 * @param depositContractAddress 授权的地址
 * @param amount 授权的金额
 */
export const gasForApproveTokenForDeposit = async (depositContractAddress: string, amount: string) => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const luckyTokenContract = getContractInstanceWithWeb3("1");
  const amountInUnits = web3.utils.toWei(amount, 'ether');
  // const gasEstimate = await luckyTokenContract.estimateGas.approve(depositContractAddress, amountInUnits);
  const gasEstimate = await luckyTokenContract.methods.approve(
    depositContractAddress, 
    amountInUnits
  ).estimateGas({
    from: globalStore.address,
  });
  const gasPrice = await web3.eth.getGasPrice();
  const totalGasCost = BigInt(gasEstimate) * BigInt(gasPrice);
  const totalGasCostFormatted = web3.utils.fromWei(totalGasCost.toString(), 'ether');
  console.log("预计代币 approve 交易 gas 费用:", totalGasCostFormatted);
  return totalGasCostFormatted;
};
/**
 * @description 钱包进行代币授权
 * @param depositContractAddress 授权的地址
 * @param amount 授权的金额
 */
export const approveTokenForDeposit = async (depositContractAddress: string, amount: string) => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const luckyTokenContract = getContractInstanceWithWeb3("1");
  const amountInUnits = web3.utils.toWei(amount, 'ether');
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    // 发送approve交易
    response.tx = await luckyTokenContract.methods.approve(
      depositContractAddress,
      amountInUnits
    ).send({
      from: globalStore.address,
      gas: '500000', // 设置合理gas limit
      gasPrice: await web3.eth.getGasPrice()
    });
    console.log("授权交易已发送，交易哈希:", response.tx.transactionHash);
    const receipt = await web3.eth.getTransactionReceipt(response.tx.transactionHash);
    console.log(`授权交易已确认，区块高度:`, receipt.blockNumber);
  } catch (error) {
    console.log("授权失败", error);
    response.status = 1;
  }
  return response;
};
/**
 * @description: 查询合约质押存款余额，合约地址和ABI根据合约类型自动获取
 * @param address 钱包地址
 * @param type 奖池类型，"KAIA": kaia prize pool, "USDT": usdt prize pool, default: "USDT"
 */
export const getDpositAmount = async (address: string, type: string) => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  // 使用Web3合约实例
  const contract = getContractInstanceWithWeb3(type === "USDT"? "3" : "2");
  const balanceWei = await contract.methods.balanceOf(address).call();
  const balanceToken = web3.utils.fromWei(balanceWei, 'ether');
  if (type === "USDT") {
    console.log("质押金额USDT:", balanceToken);
    globalStore.setUsdtBalance({savings: balanceToken});
    globalStore.setUSDTPrizePoolInfo({ticket: balanceToken});
  } else {
    console.log("质押金额KAIA:", balanceToken);
    globalStore.setKaiaBalance({savings: balanceToken});
    globalStore.setKaiaPrizePoolInfo({ticket: balanceToken});
  }
  return balanceToken;
};
/**
 * @description: 查询合约代币余额，合约地址和ABI根据合约类型自动获取
 * @param type 奖池类型，"KAIA": kaia prize pool, "USDT": usdt prize pool, default: "USDT"
 * @returns 
 */
export const getPoolAmount = async (type: string = "USDT") => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  // 使用Web3合约实例
  const contract = getContractInstanceWithWeb3(type === "USDT"? "3" : "2");
  const balanceWei = await contract.methods.totalAssets().call();
  const balanceToken = web3.utils.fromWei(balanceWei, 'ether');
  if (type === "USDT") {
    console.log("全部质押金额USDT:", balanceToken);
    globalStore.setUsdtBalance({allAmount: balanceToken});
    globalStore.setUSDTPrizePoolInfo({allAmount: balanceToken});
  } else {
    console.log("全部质押金额KAIA:", balanceToken);
    globalStore.setKaiaBalance({allAmount: balanceToken});
    globalStore.setKaiaPrizePoolInfo({allAmount: balanceToken});
  }
  return balanceToken;
};
/**
 * @description: 查询合约代币余额
 * @param address 钱包地址
 * @returns
 */
export const getTokenBalance = async (address: string) => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  // 使用Web3合约实例
  const contract = getContractInstanceWithWeb3("1");
  try {
    // 调用合约方法获取余额
    const balanceWei = await contract.methods.balanceOf(address).call();
    const balanceToken = web3.utils.fromWei(balanceWei, 'ether');
    // 更新全局存储
    globalStore.setUsdtBalance({ balance: balanceToken });
    console.log("合约代币余额Token:", balanceToken);
    return balanceToken;
  } catch (error) {
    console.error("查询代币余额失败:", error);
    throw error;
  }
};
/**
 * @description: 查询钱包kaia余额
 * @param address 
 * @returns 
 */
export const getKaiaBalance = async (address: string) => {
  if (import.meta.env.VITE_ENV === "PROD") {
    return getBalanceWithDapp(address);
  } else {
    return getBalance(address);
  }
};
/**
 * @description: 使用dapp查询钱包kaia余额
 * @param address 
 * @returns 
 */
const getBalanceWithDapp = async (address: string) => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(globalStore.walletProvider);
  try {
    const balanceWei = await web3.eth.getBalance(address);
    const balanceKAIA = web3.utils.fromWei(balanceWei, 'ether');
    
    globalStore.setKaiaBalance({ balance: balanceKAIA });
    console.log("钱包余额Kaia:", balanceKAIA);
    return balanceKAIA;
  } catch (error) {
    console.error("DApp查询余额失败:", error);
    throw error;
  }
};
/**
 * @description: 本地直接查询钱包kaia余额
 * @param address 
 * @returns 
 */
const getBalance = async (address: string) => {
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const globalStore = useGlobalStore();
  try {
    const balanceWei = await web3.eth.getBalance(address);
    const balanceKAIA = web3.utils.fromWei(balanceWei, 'ether');
    console.log(`余额为: ${balanceKAIA} KAIA`);
    globalStore.setKaiaBalance({ balance: balanceKAIA });
    return balanceKAIA;
  } catch (error) {
    console.error("本地查询余额失败:", error);
    throw error;
  }
};
/**
 * @description 对已授权的代币进行质押的gas消耗计算,type 1是KAIA，2是USDT
 * @param walletAddress 
 * @param amount 
 * @param type 1是KAIA，2是USDT
 */
export const gasForDepositWithDepositContract = async (walletAddress: string, amount: string, type: string) => {
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const contract = getContractInstanceWithWeb3(type === "1" ? "2" : "3");
  try {
    const amountInWei = web3.utils.toWei(amount, 'ether');
    const gasEstimate = await contract.methods.deposit(amountInWei, walletAddress).estimateGas({
      from: walletAddress
    });
    const gasPrice = await web3.eth.getGasPrice();
    const totalGasCost = BigInt(gasEstimate) * BigInt(gasPrice);
    const totalGasCostFormatted = web3.utils.fromWei(totalGasCost.toString(), 'ether');
    console.log("预计本次质押 gas 费用:", totalGasCostFormatted);
    return totalGasCostFormatted;
  } catch (error) {
    console.error("质押Gas估算失败:", error);
    throw error;
  }
}
/**
 * @description 对已授权的代币进行质押,type 1是KAIA，2是USDT
 * @param walletAddress 
 * @param amount 
 * @param type 1是KAIA，2是USDT
 */
export const depositWithDepositContract = async (walletAddress: string, amount: string, type: string) => {
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const contract = getContractInstanceWithWeb3(type === "1" ? "2" : "3");
  const response = { status: 0, tx: undefined };
  try {
    const amountInWei = web3.utils.toWei(amount, 'ether');
    // 获取 gas 估算
    const gasEstimate = await contract.methods.deposit(amountInWei, walletAddress, walletAddress).estimateGas({ 
      from: walletAddress
    });
    const gasPrice = await web3.eth.getGasPrice();  // 获取当前gas价格（单位：wei）
    const gasCost = BigInt(gasEstimate) * BigInt(gasPrice);
    console.log(gasEstimate, gasPrice);
    console.log('预计质押总gas费用:', web3.utils.fromWei(gasCost.toString(), 'ether'), 'KAIA');
    response.tx = await contract.methods.deposit(amountInWei, walletAddress).send({
      from: walletAddress,
      gas: (BigInt(gasEstimate) * BigInt(12) / BigInt(10)).toString()
    });
    
    console.log("质押交易已发送，交易哈希:", response.tx.transactionHash);
    const receipt = await web3.eth.getTransactionReceipt(response.tx.transactionHash);
    console.log("交易已确认，区块高度:", receipt.blockNumber);
    return response;
  } catch (error) {
    console.error("质押操作失败:", error);
    response.status = 1;
    return response;
  }
}
/**
 * @description 存款提现的gas消耗计算,type 1是KAIA，2是USDT
 * @param walletAddress 
 * @param amount 
 * @param type 1是KAIA，2是USDT
 */
export const gasForWithdrawWithDepositContract = async (walletAddress: string, amount: string, type: string) => {
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const depositContract = getContractInstanceWithWeb3(type === "1"? "2": "3");
  const amountInWei = web3.utils.toWei(amount, 'ether');
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    // 获取 gas 估算
    const gasEstimate = await depositContract.methods.withdraw(amountInWei, walletAddress, walletAddress).estimateGas({ 
        from: walletAddress
    });
    const gasPrice = await web3.eth.getGasPrice();
    const totalGasCost = BigInt(gasEstimate) * BigInt(gasPrice);
    const totalGasCostFormatted = web3.utils.fromWei(totalGasCost.toString(), 'ether');
    console.log("预计本次质押 gas 费用:", totalGasCostFormatted);
  } catch (error) {
    console.error("质押Gas估算失败:", error);
    throw error;
  }
  return response;
};
/**
 * @description 存款提现,type 1是KAIA，2是USDT
 * @param walletAddress 
 * @param amount 
 * @param type 1是KAIA，2是USDT
 */
export const withdrawWithDepositContract = async (walletAddress: string, amount: string, type: string) => {
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const depositContract = getContractInstanceWithWeb3(type === "1"? "2": "3");
  const amountInWei = web3.utils.toWei(amount, 'ether');
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    // 获取 gas 估算
    const gasEstimate = await depositContract.methods.withdraw(amountInWei, walletAddress, walletAddress).estimateGas({ 
        from: walletAddress
    });
    const gasPrice = await web3.eth.getGasPrice();  // 获取当前gas价格（单位：wei）
    const gasCost = BigInt(gasEstimate) * BigInt(gasPrice);
    console.log('预计提现总gas费用:', web3.utils.fromWei(gasCost.toString(), 'ether'), 'KAIA');
    response.tx = await depositContract.methods.withdraw(amountInWei, walletAddress, walletAddress).send({
        from: walletAddress,
        gas: (BigInt(gasEstimate) * BigInt(12) / BigInt(10)).toString()
    });;
    console.log('Transaction hash:', response.tx.transactionHash);
    const receipt = await web3.eth.getTransactionReceipt(response.tx.transactionHash);
    console.log("交易已确认，区块高度:", receipt.blockNumber);
    response.status = 0;
    return response;
  } catch (error) {
    console.log("提现失败", error);
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
/**
 * @description 计算当前时间点距指定 UTC 小时数的时间差
 * @param utcHours 指定的 UTC 小时数，距离现在不超过一天
 * @returns 时间差（毫秒）
 */
export const calculateTimeDifference = (utcHours: number): number => {
  dayjs.extend(utc);
  const now = dayjs();
  let target = dayjs.utc().hour(utcHours).minute(0).second(0).millisecond(0);

  // 确保目标时间在当前时间之后
  if (target.isBefore(now)) {
      target = target.add(1, 'day');
  }
  // 计算时间差
  return target.diff(now);
};
/**
 * @description 直接生成kaia链上钱包
 */
export const createKaiaWallet = async () => {
  const web3 = new Web3();
  try {
    // 生成随机账户
    const account = web3.eth.accounts.create();
    // 将私钥转换为校验格式
    const privateKey = web3.utils.toChecksumAddress(account.privateKey);
    console.log("地址:", account.address);
    console.log("私钥:", privateKey);
    // 存储到本地
    localStorage.setItem("address", account.address);
    localStorage.setItem("privateKey", privateKey);
    // 更新全局状态
    const globalStore = useGlobalStore();
    globalStore.setAddress(account.address);
    globalStore.setPrivateKey(privateKey);
    return {
      address: account.address,
      privateKey: privateKey,
      signTransaction: account.signTransaction
    };
  } catch (error) {
    console.error("钱包创建失败:", error);
    throw error;
  }
};
/**
 * @description 从当前钱包地址转账到指定钱包地址，使用私钥操作
 * @param address 目标钱包地址
 * @param amount 转账金额
 * @returns
 */
export const transferInKaia = async (address: string, amount: string) => {
  let web3: any = undefined;
  const globalStore = useGlobalStore();
  if (import.meta.env.VITE_ENV === "DEV") {
    web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
    const account = web3.eth.accounts.privateKeyToAccount(globalStore.privateKey);
    web3.eth.accounts.wallet.add(account);
  }
  // 转换金额单位
  const amountInWei = web3.utils.toWei(amount, 'ether');
  // 构建交易对象
  const txObject = {
    from: globalStore.address,
    to: address,
    value: amountInWei,
    gasPrice: await web3.eth.getGasPrice(),
    gas: ""
  };
  const response = { status: 0, tx: undefined };
  try {
    // 估算Gas并发送交易
    const gasEstimate = await web3.eth.estimateGas(txObject);
    if (import.meta.env.VITE_ENV === "PROD") {
      const walletProvider = globalStore.walletProvider;
      txObject.gas = gasEstimate;
      const txHash = await walletProvider.request({method: 'kaia_sendTransaction', params: [txObject]});
      response.tx = txHash;
      console.log("交易哈希:", txHash);
      return response;
    } else {
      response.tx = await web3.eth.sendTransaction({
        ...txObject,
        gas: gasEstimate
      });
      console.log("交易哈希:", response.tx.transactionHash);
      const receipt = await web3.eth.getTransactionReceipt(response.tx.transactionHash);
      console.log("交易已确认，区块高度:", receipt.blockNumber);
      return response;
    }
  } catch (error) {
    console.error("转账失败:", error);
    response.status = 1;
    return response;
  }
};
