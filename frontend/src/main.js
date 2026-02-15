import { useEffect, useState } from "react";
import { ethers } from "ethers";

const FAUCET_ADDRESS = "0xc74111838bE5505F02dFB74c5e365D6bBCed79AD";
const TOKEN_ADDRESS  = "0x754c8273294596d464c088b816164cCFf23e5581";

const faucetAbi = [
  "function requestTokens()",
  "function canClaim(address) view returns (bool)"
];

const tokenAbi = [
  "function balanceOf(address) view returns (uint256)"
];

export default function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [status, setStatus] = useState("");

  //  Ensure MetaMask + Sepolia
  async function ensureSepolia() {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return false;
    }

    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    if (chainId !== "0xaa36a7") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }]
        });
      } catch (err) {
        alert("Please switch MetaMask to Sepolia");
        return false;
      }
    }
    return true;
  }

  //  Connect wallet
  async function connectWallet() {
    const ok = await ensureSepolia();
    if (!ok) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  }

  //  Load token balance
  async function loadBalance(addr) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);
    const raw = await token.balanceOf(addr);
    setBalance(ethers.formatEther(raw));
  }

  async function requestTokens() {
  try {
    const ok = await ensureSepolia();
    if (!ok) return;

    setStatus("Requesting tokens...");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const faucet = new ethers.Contract(
      FAUCET_ADDRESS,
      faucetAbi,
      signer
    );

    const tx = await faucet.requestTokens();
    await tx.wait();

    setStatus("Tokens claimed successfully");
    await loadBalance(account);

  } catch (err) {
    console.error(err);
    setStatus("Transaction failed");
  }
}
