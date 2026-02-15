```md
# 🪙 Full-Stack ERC-20 Token Faucet DApp

A complete **ERC-20 Token Faucet decentralized application** demonstrating end-to-end Web3 development.  
This project showcases **secure smart contract design**, **wallet integration**, **on-chain rate limiting**, and **production-ready Docker deployment**.

Built using **Solidity, Hardhat, React (Vite), ethers.js, and Docker**.

---

## 🚀 Features

- ERC-20 compliant token with restricted minting
- Faucet contract with:
  - Fixed token amount per claim
  - 24-hour cooldown between claims
  - Lifetime claim limit per wallet
  - Admin-controlled pause/unpause
- MetaMask wallet integration (EIP-1193)
- Real-time balance updates
- Graceful handling of transaction states and errors
- Fully Dockerized frontend
- Health endpoint for container readiness
- Evaluation interface exposed via `window.__EVAL__`

---

## 🏗️ Architecture

```

User Browser + MetaMask
│
▼
React Frontend (Vite)
│
ethers.js
│
▼
Sepolia Testnet
├── ERC-20 Token Contract
└── Faucet Contract

```

---

## 📁 Project Structure

```

.
├── contracts/              # Solidity smart contracts
├── frontend/               # React frontend (Vite)
├── scripts/                # Deployment scripts
├── test/                   # Smart contract tests
├── screenshots/            # Application screenshots
├── docker-compose.yml      # Docker configuration
├── hardhat.config.js       # Hardhat setup
├── .env.example            # Environment variable template
└── README.md

````

---

## 📜 Smart Contracts

### ERC-20 Token
- Fixed maximum supply
- Minting restricted to faucet contract
- Fully ERC-20 compliant
- Emits standard `Transfer` events

### Faucet Contract
- Enforces 24-hour cooldown per address
- Enforces lifetime claim limit
- Tracks:
  - `lastClaimAt(address)`
  - `totalClaimed(address)`
- Admin-only pause functionality
- Emits:
  - `TokensClaimed`
  - `FaucetPaused`

---

## 🖥️ Frontend Functionality

- Connect / disconnect MetaMask wallet
- Display connected address
- Display real-time token balance
- Show claim eligibility and cooldown status
- Loading indicators during transactions
- User-friendly error messages
- Automatic UI refresh after successful claims

---

## 🧪 Evaluation Interface

The frontend exposes the following functions on the global scope:

```js
window.__EVAL__ = {
  connectWallet(),
  requestTokens(),
  getBalance(address),
  canClaim(address),
  getRemainingAllowance(address),
  getContractAddresses()
}
````

* Numeric values are returned as **strings**
* Errors are thrown with descriptive messages

---

## 🌐 Deployment Details

* **Network:** Sepolia Testnet
* **Contracts:** Deployed and verified on Etherscan
* **Frontend:** Docker + Nginx
* **Health Check:** `/health` → HTTP 200

**Contract Addresses**

```
Token Contract:   0xE00C56969F49E2EA077E6ed9e4EbfBa2656160b6
Faucet Contract:  0x7da213aF0F48b233E24B48096a4C6c844aD61484
```

---

## 🐳 Run Locally with Docker

### 1️⃣ Clone the repository

```bash
git clone https://github.com/AmruthaImmidisetti/erc20-faucet-dapp.git
cd token-faucet-dapp
```

### 2️⃣ Configure environment variables

```bash
cp .env.example .env
```

Fill in:

```
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VITE_TOKEN_ADDRESS=YOUR_TOKEN_ADDRESS
VITE_FAUCET_ADDRESS=YOUR_FAUCET_ADDRESS
```

### 3️⃣ Start the application

```bash
docker compose up --build
```

### 4️⃣ Access the app

* Frontend: [http://localhost:3000](http://localhost:3000)
* Health: [http://localhost:3000/health](http://localhost:3000/health)

---

## 📸 Application Screenshots

### Application Loaded

![Application Loaded](screenshots/1-app-loaded.png)

### Wallet Connected

![Wallet Connected](screenshots/2-wallet-connected.png)

### MetaMask Transaction Confirmation

![MetaMask Confirmation](screenshots/3-metamask-confirmation.png)

### Transaction In Progress

![Transaction Pending](screenshots/4-transaction-pending.png)

### Successful Token Claim

![Successful Claim](screenshots/5-successful-claim.png)

### Cooldown / Error State

![Cooldown Error](screenshots/6-cooldown-error.png)

### Health Endpoint

![Health Endpoint](screenshots/7-health-endpoint-ok.png)

### Docker Container Running

![Docker Running](screenshots/8-docker-running.png)

---

## 🔐 Security Considerations

* Checks-effects-interactions pattern followed
* Minting restricted to faucet contract
* Admin-only privileged actions
* Solidity 0.8+ overflow protection
* No secrets committed to the repository

---

## 📌 Known Limitations

* Single-network deployment (Sepolia)
* Minimal UI styling
* No admin dashboard (admin interacts via contract)

---

## ✅ Conclusion

This project demonstrates practical **full-stack Web3 engineering skills**, including:

* Smart contract security
* Frontend blockchain integration
* Dockerized deployment
* Evaluation-friendly interfaces

Suitable for **portfolio showcase**, **technical assessments**, and **learning reference**.

````
