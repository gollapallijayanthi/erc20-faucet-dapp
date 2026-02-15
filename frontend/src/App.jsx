import { useEffect, useState } from "react";
import { ethers } from "ethers";

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111

const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;
const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;

const faucetAbi = ["function requestTokens()"];
const tokenAbi = ["function balanceOf(address) view returns (uint256)"];

export default function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [status, setStatus] = useState("");

  async function ensureSepolia() {
    const currentChain = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (currentChain !== SEPOLIA_CHAIN_ID) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    await ensureSepolia();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  }

  async function loadBalance(addr) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);
    const bal = await token.balanceOf(addr);
    setBalance(ethers.formatEther(bal));
  }

  async function requestTokens() {
    try {
      await ensureSepolia();
      setStatus("Requesting tokens...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucet = new ethers.Contract(FAUCET_ADDRESS, faucetAbi, signer);

      const tx = await faucet.requestTokens();
      await tx.wait();

      setStatus(" Tokens received!");
      loadBalance(account);
    } catch (err) {
      console.error(err);
      setStatus(" Transaction failed");
    }
  }

  useEffect(() => {
    if (account) loadBalance(account);
  }, [account]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Token Faucet DApp</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p><b>Wallet:</b> {account}</p>
          <p><b>Token Balance:</b> {balance}</p>
          <button onClick={requestTokens}>Request 100 Tokens</button>
          <p>{status}</p>
        </>
      )}
    </div>
  );
}
