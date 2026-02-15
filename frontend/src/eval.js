import { ethers } from "ethers";

const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

const tokenAbi = ["function balanceOf(address) view returns (uint256)"];
const faucetAbi = [
  "function requestTokens()",
  "function canClaim(address) view returns (bool)",
  "function remainingAllowance(address) view returns (uint256)",
];

function getProvider() {
  if (!window.ethereum) throw new Error("Wallet not found");
  return new ethers.BrowserProvider(window.ethereum);
}

window.__EVAL__ = {
  connectWallet: async () => {
    const provider = getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0];
  },

  requestTokens: async () => {
    const provider = getProvider();
    const signer = await provider.getSigner();
    const faucet = new ethers.Contract(FAUCET_ADDRESS, faucetAbi, signer);
    const tx = await faucet.requestTokens();
    await tx.wait();
    return tx.hash;
  },

  getBalance: async (address) => {
    const provider = getProvider();
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);
    return (await token.balanceOf(address)).toString();
  },

  canClaim: async (address) => {
    const provider = getProvider();
    const faucet = new ethers.Contract(FAUCET_ADDRESS, faucetAbi, provider);
    return await faucet.canClaim(address);
  },

^G Help          ^O Write Out     ^F Where Is      ^K Cut           ^T Execute       ^C Location      M-U Undo         M-A Set Mark     M-] To Bracket   M-B Previous
^X Exit          ^R Read Fil
