// import { useGlobalStore } from "@/store/globalStore";
import { ethers } from "ethers";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import LuckyTokenABI from "@/assets/abi/LuckyToken.json";
// import PrizePoolABI from "@/assets/abi/PrizePool.json";
import PrizeVaultABI from "@/assets/abi/PrizeVault.json";
import { useGlobalStore } from "@/store/globalStore";

// 获取dapp钱包地址
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
  const accounts = await walletProvider.request({ method: "kaia_requestAccounts" }); // 获取钱包地址, 首次运行用户界面会弹出钱包授权请求
  const accountAddress = accounts[0];
  return accountAddress;
};

// dapp 钱包进行授权
export const getDappWalletSignature = async (sdk: any) => {
  const globalStore = useGlobalStore();
  const walletProvider = sdk.getWalletProvider();
  const accounts = await walletProvider.request({ method: "kaia_requestAccounts" }); // 获取钱包地址, 首次运行用户界面会弹出钱包授权请求
  const accountAddress = accounts[0];
  const message = "Welcome to Mini Dapp";
  const signatureWallet = await walletProvider.request({ method: "personal_sign", params: [message, accountAddress] });
  globalStore.setSignatureWallet(signatureWallet); // 保存确权钱包
  return signatureWallet;
};

// 使用dapp钱包进行转账
export const transferWithDappWallet = async (to: string, value: string) => {
  const globalStore = useGlobalStore();
  const sdk = globalStore.dappPortalSDK;
  const walletProvider = sdk.getWalletProvider();
  const accounts = await walletProvider.request({ method: "kaia_requestAccounts" });
  const accountAddress = accounts[0];
  const tx = {
    from: accountAddress,
    to,
    value: ethers.utils.parseEther(value),
    gas: "21000",
  };
  const txResponse = await walletProvider.request({ method: "kaia_sendTransaction", params: [tx] });
  console.log("交易哈希:", txResponse.hash);
  return txResponse.hash;
};

// 使用dapp进行合约示例生成
export const getContractInstanceWithDapp = async (contractABI, contractAddress) => {
  const globalStore = useGlobalStore();
  const sdk = globalStore.dappPortalSDK;
  const walletProvider = sdk.getWalletProvider();
  const accounts = await walletProvider.request({ method: "kaia_requestAccounts" });
  const accountAddress = accounts[0];
  const message = "Welcome to Mini Dapp";
  const signatureWallet = await walletProvider.request({ method: "personal_sign", params: [message, accountAddress] });
  // const contractAddress = "0xd5da3b4ddfb96682b7c3a17fa5080a2d10ba06d9"; // poolInfos[poolCoinType][poolType].address; // 替换为实际的 Prize Pool 地址
  const ABI = contractABI.abi;
  const contract = new ethers.Contract(contractAddress, ABI, signatureWallet);
  return contract;
};

// 使用dapp进行合约转账
export const transferWithContractAndDapp = async (amount: string, contractInfo: any) => {
  // 获取合约实例
  const prizePoolContract: any = getContractInstanceWithDapp(contractInfo.abi, contractInfo.address);
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    // 应根据合约设计实际来调用相应方法以及传递参数，此处简单模拟
    response.tx = await prizePoolContract.stake(amount);
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

// 生成kaia链上钱包
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

// 查询本位币余额
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

// 从当前钱包地址转账到指定钱包地址，默认本位币转账
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

// 生成LuckyToken智能合约实例（非本位币均为合约生成、控制），私钥为空时可执行查询操作，写入操作必须有私钥或其他确权方式
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
  const contractAddress = "0xfa2c65ac67e2b7c8a2829d495c3394c91486d6f5"; // 这是luckyToken的合约地址
  const ABI = LuckyTokenABI.abi;
  // 创建合约实例
  const luckyTokenContract = new ethers.Contract(contractAddress, ABI, wallet);
  return luckyTokenContract;
};

// 查询非本位币链上钱包上的金额，对应合约的币种
export const getWalletBanlanceWithContract = async (address: string) => {
  // 使用私药生成对应的合约实例，已建好的合约钱包私钥：0xf9267a9f70dc239b1efecb595dcccaf74a8cecfb4d92f05f2c5d918aeac4f92e
  const luckyTokenContract = await getContractInstanceForLuckyToken();
  // 0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9 上面私钥的对应地址，这个地址已经有差不多100万的token（即这个合约对应的代币）
  const banlanceAmount = await luckyTokenContract.balanceOf(address);
  console.log(`钱包地址 ${localStorage.getItem("address2")} 的余额：${ethers.utils.formatUnits(banlanceAmount, 18)} token`);
  return banlanceAmount;
};

// 进行合约转账
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

// 使用luckyToken合约进行授权
export const approveWithContract = async (fromPrivateKey: string, address: string, amount) => {
  const amountInUnits = ethers.utils.parseUnits(amount, 18); // erc20标准实现的合约代币的基础单位很小，需要转换，通常和直接看到的代币数量相差10的18次方的倍数
  const luckyTokenContract = await getContractInstanceForLuckyToken(fromPrivateKey);
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    response.tx = await luckyTokenContract.approve(address, amountInUnits);
    console.log("交易已发送，交易哈希:", response.tx.hash);
    const receipt = await response.tx.wait(); // 等待交易确认
    console.log("交易已确认，区块号:", receipt.blockNumber);
    response.status = 0;
  } catch (error) {
    console.log("授权失败", error);
    response.status = 1;
  }
  return response;
};

// 生成LuckyToken智能合约实例（非本位币均为合约生成、控制），私钥为空时可执行查询操作，写入操作必须有私钥或其他确权方式
const getContractInstanceForPrizePool = async (privateKey?: string) => {
  const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_CHAIN_URL);
  let wallet: any = undefined;
  // const privateKey = localStorage.getItem("privateKey2"); // 请替换为您的私钥
  if (privateKey) {
    wallet = new ethers.Wallet(privateKey, provider);
  } else {
    wallet = provider;
  }
  // 合约地址和 ABI
  const contractAddress = "0x4b6ee29aca4c444c534a58cefc97502456dfd8fa"; // 这是PrizePool的合约地址
  const ABI = PrizeVaultABI.abi;
  // 创建合约实例
  const prizePoolContract = new ethers.Contract(contractAddress, ABI, wallet);
  return prizePoolContract;
};
// 使用prizepool合约进行质押
export const stakeWithContract = async (fromPrivateKey: string, address: string, amount) => {
  const amountInUnits = ethers.utils.parseUnits(amount, 18); // erc20标准实现的合约代币的基础单位很小，需要转换，通常和直接看到的代币数量相差10的18次方的倍数
  const prizePoolContract = await getContractInstanceForPrizePool(fromPrivateKey);
  const response = {
    status: 0,
    tx: undefined,
  };
  try {
    // "0xbdfe673de8f2d6a6b7eeded9e726dd9c6841a978"，先计算转账的gas消耗
    // const gasEstimate = await provider.estimateGas({ value: amountInUnits });
    // const gasPrice = await provider.getGasPrice();
    // const transactionFee = gasEstimate.mul(gasPrice);
    // console.log("gasPrice:", gasPrice);
    // console.log("gasEstimate:", ethers.utils.formatEther(gasEstimate));
    // console.log("预计手续费:", ethers.utils.formatEther(transactionFee));
    response.tx = await prizePoolContract.deposit(amountInUnits, address);
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
