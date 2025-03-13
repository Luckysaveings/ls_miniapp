// import { useGlobalStore } from "@/store/globalStore";
import Web3 from 'web3';
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import { closeToast } from "vant";
import LuckyTokenABI from "@/assets/abi/LuckyToken.json";
import KaiaPrizePoolABI from "@/assets/abi/PrizeVault.json";
import PrizeVaultABI from "@/assets/abi/PrizeVault.json";
import { useGlobalStore } from "@/store/globalStore";
import { bindWallet } from "@/api/index";
import {   showToastBeforeRequest,
} from "@/utils/common";

/**
 * @dewscription 获取dapp钱包示例以及地址
 */
export const getDappWallet = async () => {
  const globalStore = useGlobalStore();
  let sdk: any = undefined;
  if (globalStore.dappPortalSDK) {
    sdk = globalStore.dappPortalSDK;
    return;
  }
  // 初始化SDK
  sdk = await DappPortalSDK.init({
    clientId: import.meta.env.VITE_CLIENT_ID,
    chainId: import.meta.env.VITE_PUBLIC_CHAIN_ID,
  });
  globalStore.setSdk(sdk); // 保存sdk实例
  const walletProvider = sdk.getWalletProvider();
  globalStore.setProvider(walletProvider);
  if (localStorage.getItem("address")) {
    globalStore.setAddress(localStorage.getItem("address")!);
    return;
  }
  closeToast();
  const accounts = await walletProvider.request({ method: "kaia_requestAccounts" }); // 获取钱包地址, 首次运行用户界面会弹出钱包授权请求
  showToastBeforeRequest();
  const accountAddress = accounts[0];
  // const signature = await walletProvider.request({method: 'personal_sign', params: ["", accountAddress]});
  globalStore.setAddress(accountAddress);
  const walletType = walletProvider.getWalletType();
  if (walletType) {
    globalStore.setWalletType(walletType);
  }
  localStorage.setItem("address", accountAddress);
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
  const globalStore = useGlobalStore();
  if (import.meta.env.VITE_ENV === "PROD") {
    const walletProvider = globalStore.walletProvider;
    web3 = new Web3(walletProvider);
  } else {
    web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
    const account = web3.eth.accounts.privateKeyToAccount(globalStore.privateKey);
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
export const gasForApproveTokenForDeposit = (depositContractAddress: string, amount: string) => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const luckyTokenContract = getContractInstanceWithWeb3("1");
  const amountInUnits = web3.utils.toWei(amount, 'ether');
  
  return luckyTokenContract.methods.approve(
    depositContractAddress, 
    amountInUnits
  ).estimateGas({
    from: globalStore.address,
  }).then(gasEstimate => {
    return web3.eth.getGasPrice().then(gasPrice => {
      const totalGasCost = BigInt(gasEstimate) * BigInt(gasPrice);
      const totalGasCostFormatted = web3.utils.fromWei(totalGasCost.toString(), 'ether');
      console.log("预计代币 approve 交易 gas 费用:", totalGasCostFormatted);
      return totalGasCostFormatted;
    });
  });
};
/**
 * @description 钱包进行代币授权
 * @param depositContractAddress 授权的地址
 * @param amount 授权的金额
 */
export const approveTokenForDeposit = (depositContractAddress: string, amount: string) => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const luckyTokenContract = getContractInstanceWithWeb3("1");
  const amountInUnits = web3.utils.toWei(amount, 'ether');
  const response = {
    status: 0,
    tx: undefined,
  };
  
  return web3.eth.getGasPrice().then(gasPrice => {
    return luckyTokenContract.methods.approve(
      depositContractAddress,
      amountInUnits
    ).send({
      from: globalStore.address,
      gas: '500000', // 设置合理gas limit
      gasPrice: gasPrice
    });
  }).then(tx => {
    response.tx = tx;
    console.log("授权交易已发送，交易哈希:", response.tx.transactionHash);
    return web3.eth.getTransactionReceipt(response.tx.transactionHash);
  }).then(receipt => {
    console.log(`授权交易已确认，区块高度:`, receipt.blockNumber);
    return response;
  }).catch(error => {
    console.log("授权失败", error);
    response.status = 1;
    return response;
  });
};
/**
 * @description: 查询合约质押存款余额，合约地址和ABI根据合约类型自动获取
 * @param address 钱包地址
 * @param type 奖池类型，"KAIA": kaia prize pool, "USDT": usdt prize pool, default: "USDT"
 */
export const getDepositAmount = (address: string, type: string) => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  // 使用Web3合约实例
  const contract = getContractInstanceWithWeb3(type === "USDT"? "3" : "2");
  
  return contract.methods.balanceOf(address).call().then(balanceWei => {
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
  });
};
/**
 * @description: 查询合约代币余额，合约地址和ABI根据合约类型自动获取
 * @param type 奖池类型，"KAIA": kaia prize pool, "USDT": usdt prize pool, default: "USDT"
 * @returns 
 */
export const getPoolAmount = (type: string = "USDT") => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  // 使用Web3合约实例
  const contract = getContractInstanceWithWeb3(type === "USDT"? "3" : "2");
  return contract.methods.totalAssets().call()
    .then(balanceWei => {
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
    })
    .catch(error => {
      console.error("查询奖池总额失败:", error);
      throw error;
    });
};
/**
 * @description: 查询合约代币余额
 * @param address 钱包地址
 * @returns
 */
export const getTokenBalance = (address: string) => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  // 使用Web3合约实例
  const contract = getContractInstanceWithWeb3("1");
  return contract.methods.balanceOf(address).call()
    .then(balanceWei => {
      const balanceToken = web3.utils.fromWei(balanceWei, 'ether');
      // 更新全局存储
      globalStore.setUsdtBalance({ balance: balanceToken });
      console.log("合约代币余额Token:", balanceToken);
      return balanceToken;
    })
    .catch(error => {
      console.error("查询代币余额失败:", error);
      throw error;
    });
};
/**
 * @description: 查询钱包kaia余额
 * @param address 
 * @returns 
 */
export const getKaiaBalance = async (address: string) => {
  if (import.meta.env.VITE_ENV === "PROD") {
    return getBalanceWithDapp(address).then((res) => {
      return res;
    });
  } else {
    return getBalance(address).then((res) => {
      return res;
    });
  }
};
/**
 * @description: 使用dapp查询钱包kaia余额
 * @param address 
 * @returns 
 */
const getBalanceWithDapp = (address: string) => {
  const globalStore = useGlobalStore();
  const web3 = new Web3(globalStore.walletProvider);
  
  return web3.eth.getBalance(address).then(balanceWei => {
    const balanceKAIA = web3.utils.fromWei(balanceWei, 'ether');
    globalStore.setKaiaBalance({ balance: balanceKAIA });
    console.log("钱包余额Kaia:", balanceKAIA);
    return balanceKAIA;
  }).catch(error => {
    console.error("DApp查询余额失败:", error);
    throw error;
  });
};
/**
 * @description: 本地直接查询钱包kaia余额
 * @param address 
 * @returns 
 */
const getBalance = (address: string) => {
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const globalStore = useGlobalStore();
  
  return web3.eth.getBalance(address).then(balanceWei => {
    const balanceKAIA = web3.utils.fromWei(balanceWei, 'ether');
    console.log(`余额为: ${balanceKAIA} KAIA`);
    globalStore.setKaiaBalance({ balance: balanceKAIA });
    return balanceKAIA;
  }).catch(error => {
    console.error("本地查询余额失败:", error);
    throw error;
  });
};
/**
 * @description 对已授权的代币进行质押的gas消耗计算,type 1是KAIA，2是USDT
 * @param walletAddress 
 * @param amount 
 * @param type 1是KAIA，2是USDT
 */
export const gasForDepositWithDepositContract = (walletAddress: string, amount: string, type: string) => {
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const contract = getContractInstanceWithWeb3(type === "1" ? "2" : "3");
  const amountInWei = web3.utils.toWei(amount, 'ether');
  
  return contract.methods.deposit(amountInWei, walletAddress).estimateGas({
    from: walletAddress
  }).then(gasEstimate => {
    return web3.eth.getGasPrice().then(gasPrice => {
      const totalGasCost = BigInt(gasEstimate) * BigInt(gasPrice);
      const totalGasCostFormatted = web3.utils.fromWei(totalGasCost.toString(), 'ether');
      console.log("预计本次质押 gas 费用:", totalGasCostFormatted);
      return totalGasCostFormatted;
    });
  }).catch(error => {
    console.error("质押Gas估算失败:", error);
    throw error;
  });
};
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
export const gasForWithdrawWithDepositContract = (walletAddress: string, amount: string, type: string) => {
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const depositContract = getContractInstanceWithWeb3(type === "1"? "2": "3");
  const amountInWei = web3.utils.toWei(amount, 'ether');
  let totalGasCostFormatted: any = undefined;
  
  return depositContract.methods.withdraw(amountInWei, walletAddress, walletAddress).estimateGas({ 
    from: walletAddress
  }).then(gasEstimate => {
    return web3.eth.getGasPrice().then(gasPrice => {
      const totalGasCost = BigInt(gasEstimate) * BigInt(gasPrice);
      totalGasCostFormatted = web3.utils.fromWei(totalGasCost.toString(), 'ether');
      console.log("预计本次质押 gas 费用:", totalGasCostFormatted);
      return totalGasCostFormatted;
    });
  }).catch(error => {
    console.error("质押Gas估算失败:", error);
    throw error;
  });
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
/**
 * @description 直接生成kaia链上钱包
 */
export const createKaiaWallet = async () => {
  const web3 = new Web3();
  try {
    // 生成随机账户
    const account = web3.eth.accounts.create();
    const privateKey = account.privateKey;
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
  web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const globalStore = useGlobalStore();
  // 转换金额单位
  const amountInWei = web3.utils.toWei(amount, 'ether');
  const response = { status: 0, tx: undefined };
  if (import.meta.env.VITE_ENV === "DEV") {
    const account = web3.eth.accounts.privateKeyToAccount(globalStore.privateKey);
    web3.eth.accounts.wallet.add(account);
    // 构建交易对象
    const txObject = {
      from: globalStore.address,
      to: address,
      value: amountInWei,
      gasPrice: await web3.eth.getGasPrice(),
      gas: ""
    };
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
  } else {
    // PROD环境使用DApp钱包进行转账
    const sdk = globalStore.dappPortalSDK;
    const walletProvider = sdk.getWalletProvider();
    // 构建DApp交易参数
    const txParams = {
      from: globalStore.address,
      to: address,
      value: Web3.utils.numberToHex(amountInWei),
      gasPrice: await walletProvider.request({ method: 'kaia_gasPrice' }),
      gas: ""
    };
    // 估算Gas并发送交易
    txParams.gas = await walletProvider.request({ 
      method: 'kaia_estimateGas',
      params: [txParams]
    });
    response.tx = await walletProvider.request({
      method: 'kaia_sendTransaction',
      params: [txParams]
    });
    console.log("DApp交易哈希:", response.tx);
  }
};

// 从当前钱包转账token到制定钱包地址
/**
 * @description 从当前钱包转账token到制定钱包地址
 * @param address 目标钱包地址
 * @param amount 转账金额
 * @returns
 */
export const transferInLuckytoken = async (address: string, amount: string) => {
  const web3 = new Web3(import.meta.env.VITE_CHAIN_URL);
  const globalStore = useGlobalStore();
  const amountInWei = web3.utils.toWei(amount, 'ether');
  // 使用Web3合约实例
  const contract = getContractInstanceWithWeb3("1");
  const response = { status: 0, tx: undefined };
  
  try {
    // 获取 gas 估算
    const gasEstimate = await contract.methods.transfer(address, amountInWei).estimateGas({
      from: globalStore.address
    });
    const gasPrice = await web3.eth.getGasPrice();
    console.log('预计转账总gas费用:', web3.utils.fromWei((BigInt(gasEstimate) * BigInt(gasPrice)).toString(), 'ether'), 'KAIA');
    
    response.tx = await contract.methods.transfer(address, amountInWei).send({
      from: globalStore.address,
      gas: (BigInt(gasEstimate) * BigInt(12) / BigInt(10)).toString()
    });
    
    console.log("转账交易已发送，交易哈希:", response.tx.transactionHash);
    const receipt = await web3.eth.getTransactionReceipt(response.tx.transactionHash);
    console.log("交易已确认，区块高度:", receipt.blockNumber);
    return response;
  } catch (error) {
    console.error("代币转账失败:", error);
    response.status = 1;
    return response;
  }
};