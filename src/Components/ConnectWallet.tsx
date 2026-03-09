// import { useState } from "react";
// import { ethers } from "ethers";

// const ConnectWallet = () => {
//   const [mnemonic, setMnemonic] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [address, setAddress] = useState("");

//   const handleVerify = () => {
//     try {
//       let wallet;

//       if (mnemonic.trim()) {
//         wallet = ethers.Wallet.fromPhrase(mnemonic.trim());
//       } else if (privateKey.trim()) {
//         wallet = new ethers.Wallet(privateKey.trim());
//       } else {
//         alert("Enter mnemonic or private key");
//         return;
//       }

//       setAddress(wallet.address);
//     } catch (err) {
//       alert("Invalid mnemonic or private key");
//       setAddress("");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Connect Wallet</h2>

//       <textarea
//         placeholder="Enter mnemonic"
//         value={mnemonic}
//         onChange={(e) => setMnemonic(e.target.value)}
//         rows={3}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="OR Enter private key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button onClick={handleVerify}>
//         Verify & Connect
//       </button>

//       {address && (
//         <p><strong>Wallet Address:</strong> {address}</p>
//       )}
//     </div>
//   );
// };

// export default ConnectWallet;



// import { useState } from "react";
// import {
//   Client,
//   AccountBalanceQuery,
//   PrivateKey,
//   AccountId
// } from "@hashgraph/sdk";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);

//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       // Validate inputs
//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery()
//         .setAccountId(parsedAccountId);

//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//     } catch (err) {
//       console.error(err);
//       alert("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button onClick={connectAccount} disabled={loading}>
//         {loading ? "Connecting..." : "Connect"}
//       </button>

//       {balance && (
//         <p><strong>Balance:</strong> {balance}</p>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;

// works


// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate } from "react-router-dom";
// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   // --- Save only account ID for hot reload ---
//   const saveAccountId = (id: string) => {
//     localStorage.setItem("hedera_account_id", id);
//   };

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     navigate("/")
//   };

//   // --- Connect account & fetch balance ---
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         alert("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//       // Save account ID for hot reload
//       saveAccountId(accountId);

//     } catch (err) {
//       console.error(err);
//       alert("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Disconnect ---
//   const disconnect = () => {
//     clearAccountId();
//     alert("Disconnected from account.");
//   };

//   // --- Hot reload: restore account ID ---
//   useEffect(() => {
//     const savedId = localStorage.getItem("hedera_account_id");
//     if (savedId) {
//       setAccountId(savedId);
//     }
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button onClick={connectAccount} disabled={loading}>
//         {loading ? "Connecting..." : "Connect"}
//       </button>

//       <button
//         onClick={disconnect}
//         style={{
//           marginLeft: 10,
//           backgroundColor: "#f44336",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer"
//         }}
//       >
//         Disconnect
//       </button>

//       {balance && (
//         <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;



// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate } from "react-router-dom";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   // --- Save account ID to localStorage for hot reload ---
//   const saveAccountId = (id: string) => {
//     localStorage.setItem("hedera_account_id", id);
//   };

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     navigate("/");
//   };

//   // --- Connect account & fetch balance ---
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         alert("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//       // Save account ID for hot reload
//       saveAccountId(accountId);

//     } catch (err) {
//       console.error(err);
//       alert("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Disconnect ---
//   const disconnect = () => {
//     clearAccountId();
//     alert("Disconnected from account.");
//   };

//   // --- Hot reload: check for changes in localStorage every 3 seconds ---
//   useEffect(() => {
//     // Set an interval to check the localStorage value periodically
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) {
//         setAccountId(savedId);
//       }
//     }, 3000); // Check every 3 seconds

//     // Cleanup on unmount
//     return () => clearInterval(intervalId);
//   }, [accountId]); // Rerun the effect only if `accountId` changes

//   // --- Hot reload: listen for storage event to sync across tabs ---
//   useEffect(() => {
//     // Listen for changes to `localStorage` in other tabs/windows
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") {
//         setAccountId(e.newValue || ""); // Update state with new accountId
//       }
//     };

//     // Attach the listener
//     window.addEventListener("storage", onStorageChange);

//     // Cleanup the event listener on unmount
//     return () => {
//       window.removeEventListener("storage", onStorageChange);
//     };
//   }, []);

//   // --- Hot reload: Fetch balance when accountId changes ---
//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (accountId) {
//         try {
//           setLoading(true);

//           const parsedAccountId = AccountId.fromString(accountId);

//           const client =
//             import.meta.env.VITE_NETWORK === "mainnet"
//               ? Client.forMainnet()
//               : Client.forTestnet();

//           const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//           const accountBalance = await balanceQuery.execute(client);

//           setBalance(accountBalance.hbars.toString());
//         } catch (err) {
//           console.error(err);
//           setBalance("Error fetching balance");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     // Fetch balance when accountId changes
//     fetchBalance();
//   }, [accountId]);

//   return (
//     <div >
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button onClick={connectAccount} disabled={loading}>
//         {loading ? "Connecting..." : "Connected"}
//       </button>

//       <button
//         onClick={disconnect}
//         style={{
//           marginLeft: 10,
//           backgroundColor: "#f44336",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer"
//         }}
//       >
//         Disconnect
//       </button>

//       {balance && (
//         <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;


// working


// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate } from "react-router-dom";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   // --- Save account ID to localStorage for hot reload ---
//   const saveAccountId = (id: string) => {
//     localStorage.setItem("hedera_account_id", id);
//   };

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     navigate("/"); // Optionally navigate elsewhere after disconnect
//   };

//   // --- Connect account & fetch balance ---
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         alert("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//       // Save account ID for hot reload
//       saveAccountId(accountId);

//     } catch (err) {
//       console.error(err);
//       alert("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Disconnect ---
//   const disconnect = () => {
//     clearAccountId();
//     alert("Disconnected from account.");
//   };

//   // --- Hot reload: check for changes in localStorage every 3 seconds ---
//   useEffect(() => {
//     // Set an interval to check the localStorage value periodically
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) {
//         setAccountId(savedId);
//       } else if (!savedId && accountId) {
//         // Clear account and balance if localStorage doesn't contain account ID
//         disconnect();
//       }
//     }, 3000); // Check every 3 seconds

//     // Cleanup on unmount
//     return () => clearInterval(intervalId);
//   }, [accountId]); // Rerun the effect only if `accountId` changes

//   // --- Hot reload: listen for storage event to sync across tabs ---
//   useEffect(() => {
//     // Listen for changes to `localStorage` in other tabs/windows
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") {
//         setAccountId(e.newValue || ""); // Update state with new accountId
//       }
//     };

//     // Attach the listener
//     window.addEventListener("storage", onStorageChange);

//     // Cleanup the event listener on unmount
//     return () => {
//       window.removeEventListener("storage", onStorageChange);
//     };
//   }, []);

//   // --- Hot reload: Fetch balance when accountId changes ---
//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (accountId) {
//         try {
//           setLoading(true);

//           const parsedAccountId = AccountId.fromString(accountId);

//           const client =
//             import.meta.env.VITE_NETWORK === "mainnet"
//               ? Client.forMainnet()
//               : Client.forTestnet();

//           const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//           const accountBalance = await balanceQuery.execute(client);

//           setBalance(accountBalance.hbars.toString());
//         } catch (err) {
//           console.error(err);
//           setBalance("Error fetching balance");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     // Fetch balance when accountId changes
//     fetchBalance();
//   }, [accountId]);

//   return (
//     <div >
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button
//         onClick={connectAccount}
//         disabled={loading || !!localStorage.getItem("hedera_account_id")}
//       >
//         {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//       </button>

//       <button
//         onClick={disconnect}
//         style={{
//           marginLeft: 10,
//           backgroundColor: "#f44336",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer"
//         }}
//         disabled={!localStorage.getItem("hedera_account_id")}
//       >
//         Disconnect
//       </button>

//       {balance && (
//         <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;


// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate } from "react-router-dom";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [ethAddress, setEthAddress] = useState("");
//   const navigate = useNavigate();

//   // --- Save account ID to localStorage for hot reload ---
//   const saveAccountId = (id: string) => {
//     localStorage.setItem("hedera_account_id", id);
//   };

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEthAddress(""); // Clear the ETH address when disconnecting
//     navigate("/"); // Optionally navigate elsewhere after disconnect
//   };

//   // --- Fetch ETH Address from HashScan ---
//   const fetchEthAddress = async (accountId: string) => {
//     try {
//       const response = await fetch(`https://api.hashscan.io/v1/account/${accountId}/address`);
//       const data = await response.json();
//       setEthAddress(data?.address || "Address not found");
//     } catch (err) {
//       console.error("Error fetching ETH address:", err);
//     }
//   };

//   // --- Connect account & fetch balance ---
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         alert("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//       // Save account ID for hot reload
//       saveAccountId(accountId);

//       // Fetch the ETH address from HashScan
//       fetchEthAddress(accountId);

//     } catch (err) {
//       console.error(err);
//       alert("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Disconnect ---
//   const disconnect = () => {
//     clearAccountId();
//     alert("Disconnected from account.");
//   };

//   // --- Hot reload: check for changes in localStorage every 3 seconds ---
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) {
//         setAccountId(savedId);
//       } else if (!savedId && accountId) {
//         disconnect();
//       }
//     }, 3000); // Check every 3 seconds

//     // Cleanup on unmount
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // --- Hot reload: listen for storage event to sync across tabs ---
//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") {
//         setAccountId(e.newValue || "");
//       }
//     };

//     window.addEventListener("storage", onStorageChange);

//     return () => {
//       window.removeEventListener("storage", onStorageChange);
//     };
//   }, []);

//   // --- Hot reload: Fetch balance when accountId changes ---
//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (accountId) {
//         try {
//           setLoading(true);

//           const parsedAccountId = AccountId.fromString(accountId);

//           const client =
//             import.meta.env.VITE_NETWORK === "mainnet"
//               ? Client.forMainnet()
//               : Client.forTestnet();

//           const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//           const accountBalance = await balanceQuery.execute(client);

//           setBalance(accountBalance.hbars.toString());
//         } catch (err) {
//           console.error(err);
//           setBalance("Error fetching balance");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchBalance();
//   }, [accountId]);

//   // --- Masking the Account ID and Private Key ---
//   const maskAccountId = (id: string) => {
//     if (!id) return "";
//     return `${id.slice(0, 8)}...${id.slice(-4)}`;
//   };

//   const maskPrivateKey = (key: string) => {
//     if (!key) return "";
//     return `${key.slice(0, 8)}...${key.slice(-4)}`;
//   };

//   return (
//     <div>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button
//         onClick={connectAccount}
//         disabled={loading || !!localStorage.getItem("hedera_account_id")}
//       >
//         {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//       </button>

//       <button
//         onClick={disconnect}
//         style={{
//           marginLeft: 10,
//           backgroundColor: "#f44336",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer"
//         }}
//         disabled={!localStorage.getItem("hedera_account_id")}
//       >
//         Disconnect
//       </button>

//       {accountId && (
//         <div>
//           <p><strong>Account ID:</strong> {maskAccountId(accountId)}</p>
//           <p><strong>Private Key:</strong> {maskPrivateKey(privateKey)}</p>
//         </div>
//       )}

//       {balance && (
//         <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>
//       )}

//       {ethAddress && (
//         <p style={{ marginTop: 10 }}><strong>ETH Address:</strong> {ethAddress.slice(0, 6)}...{ethAddress.slice(-4)}</p>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;


// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {Link} from "react-router-dom";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");  // For the EVM Address
//   const navigate = useNavigate();

//   // --- Save account ID to localStorage for hot reload ---
//   const saveAccountId = (id: string) => {
//     localStorage.setItem("hedera_account_id", id);
//   };

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress(""); // Clear the EVM address when disconnecting
//     navigate("/"); // Optionally navigate elsewhere after disconnect
//   };

//   // --- Fetch EVM Address from a Service (like HashScan) ---
//   const fetchEvmAddress = async (accountId: string) => {
//     try {
//       // This is an example request to the HashScan API. Adjust as needed.
//       const response = await fetch(`https://api.hashscan.io/v1/account/${accountId}/evm-address`);
//       const data = await response.json();
      
//       // Assuming HashScan returns an object with `evm_address`
//       if (data && data.evm_address) {
//         setEvmAddress(data.evm_address);
//       } else {
//         setEvmAddress("EVM address not found");
//       }
//     } catch (err) {
//       console.error("Error fetching EVM address:", err);
//     }
//   };

//   // --- Connect account & fetch balance ---
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());

//       // Save account ID for hot reload
//       saveAccountId(accountId);

//       // Fetch the EVM address from HashScan or relevant API
//       fetchEvmAddress(accountId);

//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Disconnect ---
//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   // --- Hot reload: check for changes in localStorage every 3 seconds ---
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) {
//         setAccountId(savedId);
//       } else if (!savedId && accountId) {
//         disconnect();
//       }
//     }, 3000); // Check every 3 seconds

//     // Cleanup on unmount
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // --- Hot reload: listen for storage event to sync across tabs ---
//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") {
//         setAccountId(e.newValue || "");
//       }
//     };

//     window.addEventListener("storage", onStorageChange);

//     return () => {
//       window.removeEventListener("storage", onStorageChange);
//     };
//   }, []);

//   // --- Hot reload: Fetch balance when accountId changes ---
//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (accountId) {
//         try {
//           setLoading(true);

//           const parsedAccountId = AccountId.fromString(accountId);

//           const client =
//             import.meta.env.VITE_NETWORK === "mainnet"
//               ? Client.forMainnet()
//               : Client.forTestnet();

//           const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//           const accountBalance = await balanceQuery.execute(client);

//           setBalance(accountBalance.hbars.toString());
//         } catch (err) {
//           console.error(err);
//           setBalance("Error fetching balance");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchBalance();
//   }, [accountId]);

//   // --- Masking the Account ID and Private Key ---
//   const maskAccountId = (id: string) => {
//     if (!id) return "";
//     return `${id.slice(0, 8)}...${id.slice(-4)}`;
//   };

//   const maskPrivateKey = (key: string) => {
//     if (!key) return "";
//     return `${key.slice(0, 8)}...${key.slice(-4)}`;
//   };

//   const maskEvmAddress = (address: string) => {
//     if (!address) return "";
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   const AddTodo = () => {
    
//   }

//   return (
//     <div>
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         style={{ width: "100%" }}
//       />

//       <br /><br />

//       <button
//         onClick={connectAccount}
//         disabled={loading || !!localStorage.getItem("hedera_account_id")}
//       >
//         {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//       </button>

//       <button
//         onClick={disconnect}
//         style={{
//           marginLeft: 10,
//           backgroundColor: "#f44336",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer"
//         }}
//         disabled={!localStorage.getItem("hedera_account_id")}
//       >
//         Disconnect
//       </button>

//       {accountId && (
//         <div>
//           <p><strong>Account ID:</strong> {maskAccountId(accountId)}</p>
//           <p><strong>Private Key:</strong> {maskPrivateKey(privateKey)}</p>
//         </div>
//       )}

//       {balance && (
//         <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>
//       )}

//       {evmAddress && (
//         <p style={{ marginTop: 10 }}><strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}</p>
//       )}

//       <div className="todo_container">
//             <button type="submit" onClick={AddTodo}>
//                   Add
//             </button>
//       </div>
//     </div>
//   );
// };

// export default ConnectHederaAccount;

// works

// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";

// type Status = "Active" | "Completed" | "Expired";



// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<{ title: string; description: string; status: Status }[]>([]);
  
//   const navigate = useNavigate();

//   const saveAccountId = (id: string) => localStorage.setItem("hedera_account_id", id);
//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   const fetchEvmAddress = async (accountId: string) => {
//     try {
//       const response = await fetch(`https://api.hashscan.io/v1/account/${accountId}/evm-address`);
//       const data = await response.json();
//       if (data && data.evm_address) setEvmAddress(data.evm_address);
//       else setEvmAddress("EVM address not found");
//     } catch (err) {
//       console.error("Error fetching EVM address:", err);
//     }
//   };

//   const connectAccount = async () => {
//     try {
//       setLoading(true);
//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());
//       saveAccountId(accountId);
//       fetchEvmAddress(accountId);
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

  
//   useEffect(() => {
//   if (!accountId) return;

//   const fetchBalance = async () => {
//     try {
//       setLoading(true);
//       const parsedAccountId = AccountId.fromString(accountId);
//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();
//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);
//       setBalance(accountBalance.hbars.toString());
//     } catch (err) {
//       console.error(err);
//       setBalance("Error fetching balance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   fetchBalance();

//   // Poll every 5 seconds
//   const intervalId = setInterval(fetchBalance, 5000);

//   return () => clearInterval(intervalId);
// }, [accountId]);

//   const maskAccountId = (id: string) => (!id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`);
//   const maskPrivateKey = (key: string) => (!key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`);
//   const maskEvmAddress = (address: string) => (!address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`);



//   const CONTRACT_ADDRESS = "0xe307fd0518faab84bec309f4206591ee5a6179f0";

//   const AddTodo = async () => {
//   if (!todoTitle) {
//     toast.error("Title is required");
//     return;
//   }

//   if (!evmAddress) {
//     toast.error("EVM Address not available");
//     return;
//   }

//   try {
//     // Connect to Hedera-compatible EVM wallet (via window.ethereum)
//     //@ts-ignore
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();

//     const contract = new ethers.Contract(CONTRACT_ADDRESS, TODOLISTABI.abi, signer);

//     // Example: set dueDate 24h from now
//     const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//     const tx = await contract.addTodo(todoTitle, todoDescription, dueDate);
//     await tx.wait();

//     // Update local state UI
//     setTodos([...todos, { title: todoTitle, description: todoDescription, status: "Active" }]);
//     setTodoTitle("");
//     setTodoDescription("");
//     setTodoStatus("Active");
//     setShowModal(false);

//     toast.success("Todo added on chain!");
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to add Todo on chain");
//   }
// };

//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input type="text" placeholder="Account ID (0.0.x)" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="input" />
//       <input type="text" placeholder="Private Key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} className="input" />

//       <div className="button-group">
//         <button onClick={connectAccount} disabled={loading || !!localStorage.getItem("hedera_account_id")} className="btn">
//           {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//         </button>
//         <button onClick={disconnect} disabled={!localStorage.getItem("hedera_account_id")} className="btn disconnect">
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p><strong>Account ID:</strong> {maskAccountId(accountId)}</p>
//           <p><strong>Private Key:</strong> {maskPrivateKey(privateKey)}</p>
//         </div>
//       )}
//       {balance && <p className="info"><strong>Balance:</strong> {balance} HBAR</p>}
//       {evmAddress && <p className="info"><strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}</p>}

//       <div className="todo_container">
//         <button type="button" onClick={() => setShowModal(true)} className="btn">Add Todo</button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>
//             <input type="text" placeholder="Title" value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} className="input" />
//             <textarea placeholder="Description" value={todoDescription} onChange={(e) => setTodoDescription(e.target.value)} className="textarea" />
//             <select value={todoStatus} onChange={(e) => setTodoStatus(e.target.value as Status)} className="select">
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">Add</button>
//               <button onClick={() => setShowModal(false)} className="btn disconnect">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>
//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p><strong>Title:</strong> {todo.title}</p>
//               <p><strong>Description:</strong> {todo.description}</p>
//               <p><strong>Status:</strong> {todo.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;

// works magnifico

// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import {
//   Client,
//   AccountBalanceQuery,
//   PrivateKey,
//   AccountId,
// } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";
// import { ContractExecuteTransaction, ContractFunctionParameters } from "@hashgraph/sdk";


// type Status = "Active" | "Completed" | "Expired";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<
//     { title: string; description: string; status: Status }[]
//   >([]);

//   const navigate = useNavigate();

//   const CONTRACT_ID = "0.0.8028090";

//   const saveAccountId = (id: string) =>
//     localStorage.setItem("hedera_account_id", id);

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   // ✅ Correct Hedera EVM address conversion
//   const getEvmAddressFromAccountId = (id: string): string => {
//     try {
//       const parsed = AccountId.fromString(id);
//       return "0x" + parsed.toSolidityAddress();
//     } catch (err) {
//       console.error("Error converting to EVM address:", err);
//       return "";
//     }
//   };

//   // -------------------- Connect Hedera account --------------------
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(
//         parsedAccountId
//       );
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());
//       saveAccountId(accountId);

//       // ✅ Use AccountId → Solidity address conversion
//       const evm = getEvmAddressFromAccountId(accountId);
//       setEvmAddress(evm);
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   // -------------------- Polling for accountId changes --------------------
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id")
//         setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

//   // -------------------- Balance polling --------------------
//   useEffect(() => {
//     if (!accountId) return;

//     const fetchBalance = async () => {
//       try {
//         setLoading(true);
//         const parsedAccountId = AccountId.fromString(accountId);

//         const client =
//           import.meta.env.VITE_NETWORK === "mainnet"
//             ? Client.forMainnet()
//             : Client.forTestnet();

//         const balanceQuery = new AccountBalanceQuery().setAccountId(
//           parsedAccountId
//         );

//         const accountBalance = await balanceQuery.execute(client);
//         setBalance(accountBalance.hbars.toString());
//       } catch (err) {
//         console.error(err);
//         setBalance("Error fetching balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//     const intervalId = setInterval(fetchBalance, 5000);
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // -------------------- Masking helpers --------------------
//   const maskAccountId = (id: string) =>
//     !id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`;

//   const maskPrivateKey = (key: string) =>
//     !key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`;

//   const maskEvmAddress = (address: string) =>
//     !address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`;

//   // const CONTRACT_ADDRESS =
//   //   "0xe307fd0518faab84bec309f4206591ee5a6179f0";

//   // -------------------- Add Todo --------------------
//   // const AddTodo = async () => {
//   //   if (!todoTitle) {
//   //     toast.error("Title is required");
//   //     return;
//   //   }

//   //   if (!evmAddress) {
//   //     toast.error("EVM Address not available");
//   //     return;
//   //   }

//   //   try {
//   //     //@ts-ignore
//   //     const provider = new ethers.providers.Web3Provider(window.ethereum);
//   //     const signer = provider.getSigner();

//   //     const contract = new ethers.Contract(
//   //       CONTRACT_ADDRESS,
//   //       TODOLISTABI.abi,
//   //       signer
//   //     );

//   //     const dueDate =
//   //       Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//   //     const tx = await contract.addTodo(
//   //       todoTitle,
//   //       todoDescription,
//   //       dueDate
//   //     );

//   //     await tx.wait();

//   //     setTodos([
//   //       ...todos,
//   //       {
//   //         title: todoTitle,
//   //         description: todoDescription,
//   //         status: "Active",
//   //       },
//   //     ]);

//   //     setTodoTitle("");
//   //     setTodoDescription("");
//   //     setTodoStatus("Active");
//   //     setShowModal(false);

//   //     toast.success("Todo added on chain!");
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Failed to add Todo on chain");
//   //   }
//   // };

//   const AddTodo = async () => {
//   if (!todoTitle) {
//     toast.error("Title is required");
//     return;
//   }

//   try {
//     if (!accountId || !privateKey) {
//       toast.error("Wallet not connected");
//       return;
//     }

//     const parsedAccountId = AccountId.fromString(accountId);
//     const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//     const client =
//       import.meta.env.VITE_NETWORK === "mainnet"
//         ? Client.forMainnet()
//         : Client.forTestnet();

//     client.setOperator(parsedAccountId, parsedPrivateKey);

//     const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//     // Execute the contract function directly via Hedera SDK
//     const tx = await new ContractExecuteTransaction()
//       .setContractId(CONTRACT_ID)
//       .setGas(500000) // adjust if needed
//       .setFunction(
//         "addTodo",
//         new ContractFunctionParameters()
//           .addString(todoTitle)
//           .addString(todoDescription)
//           .addUint256(dueDate)
//       )
//       .execute(client);

//     const receipt = await tx.getReceipt(client);

//     console.log("Transaction status:", receipt.status.toString());

//     toast.success("Todo added on Hedera Testnet!");

//     setTodos([
//       ...todos,
//       {
//         title: todoTitle,
//         description: todoDescription,
//         status: "Active",
//       },
//     ]);

//     setTodoTitle("");
//     setTodoDescription("");
//     setTodoStatus("Active");
//     setShowModal(false);
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to add Todo on Hedera");
//   }
// };

//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         className="input"
//       />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         className="input"
//       />

//       <div className="button-group">
//         <button
//           onClick={connectAccount}
//           disabled={
//             loading ||
//             !!localStorage.getItem("hedera_account_id")
//           }
//           className="btn"
//         >
//           {loading
//             ? "Connecting..."
//             : localStorage.getItem("hedera_account_id")
//             ? "Connected"
//             : "Connect"}
//         </button>

//         <button
//           onClick={disconnect}
//           disabled={
//             !localStorage.getItem("hedera_account_id")
//           }
//           className="btn disconnect"
//         >
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p>
//             <strong>Account ID:</strong>{" "}
//             {maskAccountId(accountId)}
//           </p>
//           <p>
//             <strong>Private Key:</strong>{" "}
//             {maskPrivateKey(privateKey)}
//           </p>
//         </div>
//       )}

//       {balance && (
//         <p className="info">
//           <strong>Balance:</strong> {balance} HBAR
//         </p>
//       )}

//       {evmAddress && (
//         <p className="info">
//           <strong>EVM Address:</strong>{" "}
//           {maskEvmAddress(evmAddress)}
//         </p>
//       )}

//       <div className="todo_container">
//         <button
//           type="button"
//           onClick={() => setShowModal(true)}
//           className="btn"
//         >
//           Add Todo
//         </button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>

//             <input
//               type="text"
//               placeholder="Title"
//               value={todoTitle}
//               onChange={(e) =>
//                 setTodoTitle(e.target.value)
//               }
//               className="input"
//             />

//             <textarea
//               placeholder="Description"
//               value={todoDescription}
//               onChange={(e) =>
//                 setTodoDescription(e.target.value)
//               }
//               className="textarea"
//             />

//             <select
//               value={todoStatus}
//               onChange={(e) =>
//                 setTodoStatus(e.target.value as Status)
//               }
//               className="select"
//             >
//               <option value="Active">Active</option>
//               <option value="Completed">
//                 Completed
//               </option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button
//                 onClick={AddTodo}
//                 className="btn"
//               >
//                 Add
//               </button>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="btn disconnect"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>

//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p>
//                 <strong>Title:</strong> {todo.title}
//               </p>
//               <p>
//                 <strong>Description:</strong>{" "}
//                 {todo.description}
//               </p>
//               <p>
//                 <strong>Status:</strong> {todo.status}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;

// test brasla works


// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import {
//   Client,
//   AccountBalanceQuery,
//   PrivateKey,
//   AccountId,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   ContractExecuteTransaction
// } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";

// type Status = "Active" | "Completed" | "Expired";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<
//     { title: string; description: string; status: Status }[]
//   >([]);

//   const navigate = useNavigate();

//   const CONTRACT_ID = "0.0.8028090";

//   const saveAccountId = (id: string) =>
//     localStorage.setItem("hedera_account_id", id);

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   const getEvmAddressFromAccountId = (id: string): string => {
//     try {
//       const parsed = AccountId.fromString(id);
//       return "0x" + parsed.toSolidityAddress();
//     } catch (err) {
//       console.error("Error converting to EVM address:", err);
//       return "";
//     }
//   };

//   // -------------------- Connect Hedera account --------------------
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(
//         parsedAccountId
//       );
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());
//       saveAccountId(accountId);

//       const evm = getEvmAddressFromAccountId(accountId);
//       setEvmAddress(evm);

//       // ✅ Fetch all todos on login
//       fetchTodos(client);
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   // -------------------- Polling for accountId changes --------------------
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id")
//         setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

//   // -------------------- Balance polling --------------------
//   useEffect(() => {
//     if (!accountId) return;

//     const fetchBalance = async () => {
//       try {
//         setLoading(true);
//         const parsedAccountId = AccountId.fromString(accountId);

//         const client =
//           import.meta.env.VITE_NETWORK === "mainnet"
//             ? Client.forMainnet()
//             : Client.forTestnet();

//         const balanceQuery = new AccountBalanceQuery().setAccountId(
//           parsedAccountId
//         );

//         const accountBalance = await balanceQuery.execute(client);
//         setBalance(accountBalance.hbars.toString());
//       } catch (err) {
//         console.error(err);
//         setBalance("Error fetching balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//     const intervalId = setInterval(fetchBalance, 5000);
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // -------------------- Masking helpers --------------------
//   const maskAccountId = (id: string) =>
//     !id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`;

//   const maskPrivateKey = (key: string) =>
//     !key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`;

//   const maskEvmAddress = (address: string) =>
//     !address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`;

//   // -------------------- Fetch Todos --------------------
//   // const fetchTodos = async (clientOverride?: Client) => {
//   //   if (!accountId || !privateKey) return;

//   //   const client =
//   //     clientOverride ??
//   //     (import.meta.env.VITE_NETWORK === "mainnet"
//   //       ? Client.forMainnet()
//   //       : Client.forTestnet());

//   //   const parsedAccountId = AccountId.fromString(accountId);
//   //   const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);
//   //   client.setOperator(parsedAccountId, parsedPrivateKey);

//   //   try {
//   //     // 1️⃣ Get total todos
//   //     const totalTodosTx = await new ContractCallQuery()
//   //       .setContractId(CONTRACT_ID)
//   //       .setGas(100000)
//   //       .setFunction("getTotalTodos")
//   //       .execute(client);

//   //     const totalTodos = totalTodosTx.getUint256(0);

//   //     const allTodos: { title: string; description: string; status: Status }[] = [];

//   //     // 2️⃣ Fetch each todo
//   //     for (let i = 1; i <= totalTodos; i++) {
//   //       const todoRes = await new ContractCallQuery()
//   //         .setContractId(CONTRACT_ID)
//   //         .setGas(200000)
//   //         .setFunction(
//   //           "getTodo",
//   //           new ContractFunctionParameters().addUint256(i)
//   //         )
//   //         .execute(client);

//   //       const title = todoRes.getString(0);
//   //       const description = todoRes.getString(1);
//   //       const statusIndex = todoRes.getUint256(3); // 0 = Active, 1 = Completed, 2 = Expired

//   //       const status: Status =
//   //         statusIndex === 0
//   //           ? "Active"
//   //           : statusIndex === 1
//   //           ? "Completed"
//   //           : "Expired";

//   //       allTodos.push({ title, description, status });
//   //     }

//   //     setTodos(allTodos);
//   //   } catch (err) {
//   //     console.error("Error fetching todos:", err);
//   //   }
//   // };

//   // -------------------- Fetch Todos --------------------
// const fetchTodos = async (clientOverride?: Client) => {
//   if (!accountId || !privateKey) return;

//   const client =
//     clientOverride ??
//     (import.meta.env.VITE_NETWORK === "mainnet"
//       ? Client.forMainnet()
//       : Client.forTestnet());

//   const parsedAccountId = AccountId.fromString(accountId);
//   const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);
//   client.setOperator(parsedAccountId, parsedPrivateKey);

//   try {
//     // 1️⃣ Get total todos
//     const totalTodosTx = await new ContractCallQuery()
//       .setContractId(CONTRACT_ID)
//       .setGas(100000)
//       .setFunction("getTotalTodos")
//       .execute(client);

//     // const totalTodos = totalTodosTx.getUint256(0);
//     const totalTodosBig = totalTodosTx.getUint256(0);
//     const totalTodos = Number(totalTodosBig);

//     const allTodos: { title: string; description: string; status: Status }[] = [];

//     // 2️⃣ Fetch each todo
//     for (let i = 1; i <= totalTodos; i++) {
//       const todoRes = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(200000)
//         .setFunction(
//           "getTodo",
//           new ContractFunctionParameters().addUint256(i)
//         )
//         .execute(client);

//       const title = todoRes.getString(0);
//       const description = todoRes.getString(1);
//       const statusIndexBig = todoRes.getUint256(3); // Hedera returns BigNumber / Long
//       const statusIndex = Number(statusIndexBig);   // ✅ convert to number before comparison

//       const status: Status =
//         statusIndex === 0
//           ? "Active"
//           : statusIndex === 1
//           ? "Completed"
//           : "Expired";

//       allTodos.push({ title, description, status });
//     }

//     setTodos(allTodos);
//   } catch (err) {
//     console.error("Error fetching todos:", err);
//   }
// };

//   // -------------------- Add Todo --------------------
//   const AddTodo = async () => {
//     if (!todoTitle) {
//       toast.error("Title is required");
//       return;
//     }

//     try {
//       if (!accountId || !privateKey) {
//         toast.error("Wallet not connected");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//       const tx = await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(500000)
//         .setFunction(
//           "addTodo",
//           new ContractFunctionParameters()
//             .addString(todoTitle)
//             .addString(todoDescription)
//             .addUint256(dueDate)
//         )
//         .execute(client);

//       const receipt = await tx.getReceipt(client);

//       console.log("Transaction status:", receipt.status.toString());
//       toast.success("Todo added on Hedera Testnet!");

//       setTodos([
//         ...todos,
//         {
//           title: todoTitle,
//           description: todoDescription,
//           status: "Active",
//         },
//       ]);

//       setTodoTitle("");
//       setTodoDescription("");
//       setTodoStatus("Active");
//       setShowModal(false);

//       // ✅ Refresh the todos after adding
//       fetchTodos(client);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add Todo on Hedera");
//     }
//   };

//   // -------------------- Render --------------------
//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         className="input"
//       />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         className="input"
//       />

//       <div className="button-group">
//         <button
//           onClick={connectAccount}
//           disabled={
//             loading || !!localStorage.getItem("hedera_account_id")
//           }
//           className="btn"
//         >
//           {loading
//             ? "Connecting..."
//             : localStorage.getItem("hedera_account_id")
//             ? "Connected"
//             : "Connect"}
//         </button>

//         <button
//           onClick={disconnect}
//           disabled={!localStorage.getItem("hedera_account_id")}
//           className="btn disconnect"
//         >
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p>
//             <strong>Account ID:</strong> {maskAccountId(accountId)}
//           </p>
//           <p>
//             <strong>Private Key:</strong> {maskPrivateKey(privateKey)}
//           </p>
//         </div>
//       )}

//       {balance && (
//         <p className="info">
//           <strong>Balance:</strong> {balance} HBAR
//         </p>
//       )}

//       {evmAddress && (
//         <p className="info">
//           <strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}
//         </p>
//       )}

//       <div className="todo_container">
//         <button
//           type="button"
//           onClick={() => setShowModal(true)}
//           className="btn"
//         >
//           Add Todo
//         </button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>

//             <input
//               type="text"
//               placeholder="Title"
//               value={todoTitle}
//               onChange={(e) => setTodoTitle(e.target.value)}
//               className="input"
//             />

//             <textarea
//               placeholder="Description"
//               value={todoDescription}
//               onChange={(e) => setTodoDescription(e.target.value)}
//               className="textarea"
//             />

//             <select
//               value={todoStatus}
//               onChange={(e) =>
//                 setTodoStatus(e.target.value as Status)
//               }
//               className="select"
//             >
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">
//                 Add
//               </button>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="btn disconnect"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>

//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p>
//                 <strong>Title:</strong> {todo.title}
//               </p>
//               <p>
//                 <strong>Description:</strong> {todo.description}
//               </p>
//               <p>
//                 <strong>Status:</strong> {todo.status}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;


// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import {
//   Client,
//   AccountBalanceQuery,
//   PrivateKey,
//   AccountId,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   ContractExecuteTransaction
// } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";
// import todoapp_icon from "../assets/todoapp_icon.png";

// type Status = "Active" | "Completed" | "Expired";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<
//     { title: string; description: string; status: Status }[]
//   >([]);

//   const navigate = useNavigate();

//   const CONTRACT_ID = "0.0.8028090";

//   const saveAccountId = (id: string) =>
//     localStorage.setItem("hedera_account_id", id);

//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   const getEvmAddressFromAccountId = (id: string): string => {
//     try {
//       const parsed = AccountId.fromString(id);
//       return "0x" + parsed.toSolidityAddress();
//     } catch (err) {
//       console.error("Error converting to EVM address:", err);
//       return "";
//     }
//   };

//   // -------------------- Connect Hedera account --------------------
//   const connectAccount = async () => {
//     try {
//       setLoading(true);

//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(
//         parsedAccountId
//       );
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());
//       saveAccountId(accountId);

//       const evm = getEvmAddressFromAccountId(accountId);
//       setEvmAddress(evm);

//       // ✅ Fetch all todos on login
//       fetchTodos(client);
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   // -------------------- Polling for accountId changes --------------------
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id")
//         setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

//   // -------------------- Balance polling --------------------
//   useEffect(() => {
//     if (!accountId) return;

//     const fetchBalance = async () => {
//       try {
//         setLoading(true);
//         const parsedAccountId = AccountId.fromString(accountId);

//         const client =
//           import.meta.env.VITE_NETWORK === "mainnet"
//             ? Client.forMainnet()
//             : Client.forTestnet();

//         const balanceQuery = new AccountBalanceQuery().setAccountId(
//           parsedAccountId
//         );

//         const accountBalance = await balanceQuery.execute(client);
//         setBalance(accountBalance.hbars.toString());
//       } catch (err) {
//         console.error(err);
//         setBalance("Error fetching balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//     const intervalId = setInterval(fetchBalance, 5000);
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // -------------------- Masking helpers --------------------
//   const maskAccountId = (id: string) =>
//     !id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`;

//   const maskPrivateKey = (key: string) =>
//     !key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`;

//   const maskEvmAddress = (address: string) =>
//     !address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`;

  

//   // -------------------- Fetch Todos --------------------
// const fetchTodos = async (clientOverride?: Client) => {
//   if (!accountId || !privateKey) return;

//   const client =
//     clientOverride ??
//     (import.meta.env.VITE_NETWORK === "mainnet"
//       ? Client.forMainnet()
//       : Client.forTestnet());

//   const parsedAccountId = AccountId.fromString(accountId);
//   const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);
//   client.setOperator(parsedAccountId, parsedPrivateKey);

//   try {
//     // 1️⃣ Get total todos
//     const totalTodosTx = await new ContractCallQuery()
//       .setContractId(CONTRACT_ID)
//       .setGas(100000)
//       .setFunction("getTotalTodos")
//       .execute(client);

//     // const totalTodos = totalTodosTx.getUint256(0);
//     const totalTodosBig = totalTodosTx.getUint256(0);
//     const totalTodos = Number(totalTodosBig);

//     const allTodos: { title: string; description: string; status: Status }[] = [];

//     // 2️⃣ Fetch each todo
//     for (let i = 1; i <= totalTodos; i++) {
//       const todoRes = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(200000)
//         .setFunction(
//           "getTodo",
//           new ContractFunctionParameters().addUint256(i)
//         )
//         .execute(client);

//       const title = todoRes.getString(0);
//       const description = todoRes.getString(1);
//       const statusIndexBig = todoRes.getUint256(3); // Hedera returns BigNumber / Long
//       const statusIndex = Number(statusIndexBig);   // ✅ convert to number before comparison

//       const status: Status =
//         statusIndex === 0
//           ? "Active"
//           : statusIndex === 1
//           ? "Completed"
//           : "Expired";

//       allTodos.push({ title, description, status });
//     }

//     setTodos(allTodos);
//   } catch (err) {
//     console.error("Error fetching todos:", err);
//   }
// };

//   // -------------------- Add Todo --------------------
//   const AddTodo = async () => {
//     if (!todoTitle) {
//       toast.error("Title is required");
//       return;
//     }

//     try {
//       if (!accountId || !privateKey) {
//         toast.error("Wallet not connected");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//       const tx = await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(500000)
//         .setFunction(
//           "addTodo",
//           new ContractFunctionParameters()
//             .addString(todoTitle)
//             .addString(todoDescription)
//             .addUint256(dueDate)
//         )
//         .execute(client);

//       const receipt = await tx.getReceipt(client);

//       console.log("Transaction status:", receipt.status.toString());
//       toast.success("Todo added on Hedera Testnet!");

//       setTodos([
//         ...todos,
//         {
//           title: todoTitle,
//           description: todoDescription,
//           status: "Active",
//         },
//       ]);

//       setTodoTitle("");
//       setTodoDescription("");
//       setTodoStatus("Active");
//       setShowModal(false);

//       // ✅ Refresh the todos after adding
//       fetchTodos(client);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add Todo on Hedera");
//     }
//   };

//   const handleTodoLink = () => {
//     navigate("/todoApp")
//   }

//   // -------------------- Render --------------------
//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input
//         type="text"
//         placeholder="Account ID (0.0.x)"
//         value={accountId}
//         onChange={(e) => setAccountId(e.target.value)}
//         className="input"
//       />

//       <input
//         type="text"
//         placeholder="Private Key"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         className="input"
//       />

//       <div className="button-group">
//         <button
//           onClick={connectAccount}
//           disabled={
//             loading || !!localStorage.getItem("hedera_account_id")
//           }
//           className="btn"
//         >
//           {loading
//             ? "Connecting..."
//             : localStorage.getItem("hedera_account_id")
//             ? "Connected"
//             : "Connect"}
//         </button>

//         <button
//           onClick={disconnect}
//           disabled={!localStorage.getItem("hedera_account_id")}
//           className="btn disconnect"
//         >
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p>
//             <strong>Account ID:</strong> {maskAccountId(accountId)}
//           </p>
//           <p>
//             <strong>Private Key:</strong> {maskPrivateKey(privateKey)}
//           </p>
//         </div>
//       )}

//       {balance && (
//         <p className="info">
//           <strong>Balance:</strong> {balance} HBAR
//         </p>
//       )}

//       {evmAddress && (
//         <p className="info">
//           <strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}
//         </p>
//       )}

//       <div className="apps-container">
//           <div className="app-box" onClick={handleTodoLink}>
              
//               <img src={todoapp_icon} alt="" className="app-image" />
//               <p className="app-title">todoApp</p>
//           </div>
//       </div>

//       {/* <div className="todo_container">
//         <button
//           type="button"
//           onClick={() => setShowModal(true)}
//           className="btn"
//         >
//           Add Todo
//         </button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>

//             <input
//               type="text"
//               placeholder="Title"
//               value={todoTitle}
//               onChange={(e) => setTodoTitle(e.target.value)}
//               className="input"
//             />

//             <textarea
//               placeholder="Description"
//               value={todoDescription}
//               onChange={(e) => setTodoDescription(e.target.value)}
//               className="textarea"
//             />

//             <select
//               value={todoStatus}
//               onChange={(e) =>
//                 setTodoStatus(e.target.value as Status)
//               }
//               className="select"
//             >
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">
//                 Add
//               </button>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="btn disconnect"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>

//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p>
//                 <strong>Title:</strong> {todo.title}
//               </p>
//               <p>
//                 <strong>Description:</strong> {todo.description}
//               </p>
//               <p>
//                 <strong>Status:</strong> {todo.status}
//               </p>
//             </div>
//           ))}
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default ConnectHederaAccount;

import { useState, useEffect } from "react";
import {
  Client,
  AccountBalanceQuery,
  PrivateKey,
  AccountId,
 
  
} from "@hashgraph/sdk";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";
import todoapp_icon from "../assets/todoapp_icon.png";

// type Status = "Active" | "Completed" | "Expired";

interface ConnectWalletProps {
  accountId: string | null;
  privateKey: string | null;
   evmAddress: string | null;
  setAccountId: React.Dispatch<React.SetStateAction<string | null>>;
  setPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
  setEvmAddress: React.Dispatch<React.SetStateAction<string | null>>; // ✅ add this
}

const ConnectHederaAccount: React.FC<ConnectWalletProps> = ({
  accountId,
  privateKey,
  evmAddress,
  setAccountId,
  setPrivateKey,
  setEvmAddress,
}) => {
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  // const [evmAddress, setEvmAddress] = useState("");
 
const [hasConnected, setHasConnected] = useState(false);
  const navigate = useNavigate();

  // const CONTRACT_ID = "0.0.8028090";

  const saveAccountId = (id: string) =>
    localStorage.setItem("hedera_account_id", id);

  const clearAccountId = () => {
    localStorage.removeItem("hedera_account_id");
    setAccountId(null);
    setPrivateKey(null);
    setBalance("");
    setEvmAddress("");
    navigate("/");
  };

  const getEvmAddressFromAccountId = (id: string): string => {
    try {
      const parsed = AccountId.fromString(id);
      return "0x" + parsed.toSolidityAddress();
    } catch (err) {
      console.error("Error converting to EVM address:", err);
      return "";
    }
  };

  // -------------------- Connect Hedera account --------------------
  const connectAccount = async () => {
    try {
      setLoading(true);

      if (!accountId || !privateKey) {
        toast.error("Please enter both Account ID and Private Key");
        return;
      }

      const parsedAccountId = AccountId.fromString(accountId.trim());
      const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

      const client =
        import.meta.env.VITE_NETWORK === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();

      client.setOperator(parsedAccountId, parsedPrivateKey);

      const balanceQuery = new AccountBalanceQuery().setAccountId(
        parsedAccountId
      );
      const accountBalance = await balanceQuery.execute(client);

      setBalance(accountBalance.hbars.toString());
      saveAccountId(accountId);
      setHasConnected(true);

      const evm = getEvmAddressFromAccountId(accountId);
      setEvmAddress(evm);

      // ✅ Fetch all todos on login
      // fetchTodos(client);
    } catch (err) {
      console.error(err);
      toast.error("Invalid Account ID or Private Key");
      setBalance("");
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    clearAccountId();
    toast.error("Disconnected from account.");
  };

  
  useEffect(() => {
  const intervalId = setInterval(() => {
    const savedId = localStorage.getItem("hedera_account_id");
    if (savedId && savedId !== accountId) setAccountId(savedId);
    else if (!savedId && accountId && hasConnected) disconnect();
  }, 3000);

  return () => clearInterval(intervalId);
}, [accountId, hasConnected]);

  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "hedera_account_id") setAccountId(e.newValue || null);
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // -------------------- Balance polling --------------------
  useEffect(() => {
    if (!accountId) return;

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const parsedAccountId = AccountId.fromString(accountId);

        const client =
          import.meta.env.VITE_NETWORK === "mainnet"
            ? Client.forMainnet()
            : Client.forTestnet();

        const balanceQuery = new AccountBalanceQuery().setAccountId(
          parsedAccountId
        );

        const accountBalance = await balanceQuery.execute(client);
        setBalance(accountBalance.hbars.toString());
      } catch (err) {
        console.error(err);
        setBalance("Error fetching balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 5000);
    return () => clearInterval(intervalId);
  }, [accountId]);

  // -------------------- Masking helpers --------------------
  const maskAccountId = (id: string) =>
    !id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`;

  const maskPrivateKey = (key: string) =>
    !key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`;

  const maskEvmAddress = (address: string) =>
    !address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`;



  const handleTodoLink = () => {
    navigate("/todoApp");
  };

  const handlechatboxLink = () => {
    navigate("/chatbox")
  }

  // -------------------- Render --------------------
  return (
    <div className="container">
       <Link to="/">
            <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
      </Link>
      <h2>Connect Hedera Account</h2>

      <input
        type="text"
        placeholder="Account ID (0.0.x)"
        value={accountId ?? ""}
        onChange={(e) => setAccountId(e.target.value.trim())}
        className="input"
      />

      <input
        type="text"
        placeholder="Private Key"
        value={privateKey ?? ""}
        onChange={(e) => setPrivateKey(e.target.value.trim())}
        className="input"
      />

      <div className="button-group">
        <button
          onClick={connectAccount}
          disabled={loading}
          className="btn"
        >
          {loading ? "Connecting..." : accountId ? "Connected" : "Connect"}
        </button>

        <button
          onClick={disconnect}
          disabled={!accountId}
          className="btn disconnect"
        >
          Disconnect
        </button>
      </div>

      {accountId && (
        <div className="info">
          <p>
            <strong>Account ID:</strong> {maskAccountId(accountId)}
          </p>
          <p>
            <strong>Private Key:</strong> {maskPrivateKey(privateKey ?? "")}
          </p>
        </div>
      )}

      {balance && (
        <p className="info">
          <strong>Balance:</strong> {balance} HBAR
        </p>
      )}

      {evmAddress && (
        <p className="info">
          <strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}
        </p>
      )}

      <div className="apps-container">
        <div className="app-box" onClick={handleTodoLink}>
          <img src={todoapp_icon} alt="" className="app-image" />
          <p className="app-title">todoApp</p>
        </div>
        <div className="app-box" onClick={handlechatboxLink}>
            <img width="48" height="48" src="https://img.icons8.com/fluency/48/speech-bubble-with-dots--v1.png" alt="speech-bubble-with-dots--v1"/>
          <p className="app-title">chatbox</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectHederaAccount;



// second

// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";
// // import { EvmAddress } from "@hashgraph/sdk";

// type Status = "Active" | "Completed" | "Expired";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<{ title: string; description: string; status: Status }[]>([]);

//   const navigate = useNavigate();

//   const saveAccountId = (id: string) => localStorage.setItem("hedera_account_id", id);
//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   // -------------------- EVM address fetch --------------------
//   // const fetchEvmAddress = async (id: string) => {
//   //   try {
//   //     const res = await fetch(`https://api.hashscan.io/v1/account/${id}/evm-address`);
//   //     const data = await res.json();
//   //     console.log("data", data)
//   //     if (data && data.evm_address) setEvmAddress(data.evm_address);
//   //     else setEvmAddress("EVM address not found");
//   //   } catch (err) {
//   //     console.error("Error fetching EVM address:", err);
//   //     setEvmAddress("Error fetching EVM");
//   //   }
//   // };

//   // -------------------- Connect Hedera account --------------------
//   // const connectAccount = async () => {
//   //   try {
//   //     setLoading(true);
//   //     if (!accountId || !privateKey) {
//   //       toast.error("Please enter both Account ID and Private Key");
//   //       return;
//   //     }

//   //     const parsedAccountId = AccountId.fromString(accountId);
//   //     const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//   //     const client =
//   //       import.meta.env.VITE_NETWORK === "mainnet"
//   //         ? Client.forMainnet()
//   //         : Client.forTestnet();

//   //     client.setOperator(parsedAccountId, parsedPrivateKey);

//   //     const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//   //     const accountBalance = await balanceQuery.execute(client);

//   //     setBalance(accountBalance.hbars.toString());
//   //     saveAccountId(accountId);

//   //     // ✅ Fetch and set EVM address
//   //     await fetchEvmAddress(accountId);
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Invalid Account ID or Private Key");
//   //     setBalance("");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

  

// const getEvmAddressFromPrivateKey = (privateKey: string): string => {
//   try {
//     const pk = PrivateKey.fromStringECDSA(privateKey);
//     const publicKeyBytes = pk.publicKey.toBytesRaw(); // raw 33 bytes
//     // take last 20 bytes for EVM address
//     const evmBytes = publicKeyBytes.slice(-20);
//     const evmAddress = "0x" + Buffer.from(evmBytes).toString("hex");
//     return evmAddress;
//   } catch (err) {
//     console.error("Error deriving EVM address:", err);
//     return "";
//   }
// };

//   const connectAccount = async () => {
//   try {
//     setLoading(true);
//     if (!accountId || !privateKey) {
//       toast.error("Please enter both Account ID and Private Key");
//       return;
//     }

//     const parsedAccountId = AccountId.fromString(accountId);
//     const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//     const client =
//       import.meta.env.VITE_NETWORK === "mainnet"
//         ? Client.forMainnet()
//         : Client.forTestnet();

//     client.setOperator(parsedAccountId, parsedPrivateKey);

//     const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//     const accountBalance = await balanceQuery.execute(client);

//     setBalance(accountBalance.hbars.toString());
//     saveAccountId(accountId);

//     // <-- Replace fetch with local computation
//     const evm = getEvmAddressFromPrivateKey(privateKey);
//     setEvmAddress(evm);
//   } catch (err) {
//     console.error(err);
//     toast.error("Invalid Account ID or Private Key");
//     setBalance("");
//   } finally {
//     setLoading(false);
//   }
// };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   // -------------------- Polling for accountId changes --------------------
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

//   // -------------------- Balance polling --------------------
//   useEffect(() => {
//     if (!accountId) return;

//     const fetchBalance = async () => {
//       try {
//         setLoading(true);
//         const parsedAccountId = AccountId.fromString(accountId);
//         const client =
//           import.meta.env.VITE_NETWORK === "mainnet"
//             ? Client.forMainnet()
//             : Client.forTestnet();
//         const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//         const accountBalance = await balanceQuery.execute(client);
//         setBalance(accountBalance.hbars.toString());
//       } catch (err) {
//         console.error(err);
//         setBalance("Error fetching balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//     const intervalId = setInterval(fetchBalance, 5000);
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   // -------------------- Masking helpers --------------------
//   const maskAccountId = (id: string) => (!id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`);
//   const maskPrivateKey = (key: string) => (!key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`);
//   const maskEvmAddress = (address: string) => (!address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`);

//   const CONTRACT_ADDRESS = "0xe307fd0518faab84bec309f4206591ee5a6179f0";

//   // -------------------- Add Todo --------------------
//   const AddTodo = async () => {
//     if (!todoTitle) {
//       toast.error("Title is required");
//       return;
//     }

//     if (!evmAddress) {
//       toast.error("EVM Address not available");
//       return;
//     }

//     try {
//       //@ts-ignore
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();

//       const contract = new ethers.Contract(CONTRACT_ADDRESS, TODOLISTABI.abi, signer);

//       const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//       const tx = await contract.addTodo(todoTitle, todoDescription, dueDate);
//       await tx.wait();

//       setTodos([...todos, { title: todoTitle, description: todoDescription, status: "Active" }]);
//       setTodoTitle("");
//       setTodoDescription("");
//       setTodoStatus("Active");
//       setShowModal(false);

//       toast.success("Todo added on chain!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add Todo on chain");
//     }
//   };

//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input type="text" placeholder="Account ID (0.0.x)" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="input" />
//       <input type="text" placeholder="Private Key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} className="input" />

//       <div className="button-group">
//         <button onClick={connectAccount} disabled={loading || !!localStorage.getItem("hedera_account_id")} className="btn">
//           {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//         </button>
//         <button onClick={disconnect} disabled={!localStorage.getItem("hedera_account_id")} className="btn disconnect">
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p><strong>Account ID:</strong> {maskAccountId(accountId)}</p>
//           <p><strong>Private Key:</strong> {maskPrivateKey(privateKey)}</p>
//         </div>
//       )}
//       {balance && <p className="info"><strong>Balance:</strong> {balance} HBAR</p>}
//       {evmAddress && <p className="info"><strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}</p>}

//       <div className="todo_container">
//         <button type="button" onClick={() => setShowModal(true)} className="btn">Add Todo</button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>
//             <input type="text" placeholder="Title" value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} className="input" />
//             <textarea placeholder="Description" value={todoDescription} onChange={(e) => setTodoDescription(e.target.value)} className="textarea" />
//             <select value={todoStatus} onChange={(e) => setTodoStatus(e.target.value as Status)} className="select">
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">Add</button>
//               <button onClick={() => setShowModal(false)} className="btn disconnect">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>
//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p><strong>Title:</strong> {todo.title}</p>
//               <p><strong>Description:</strong> {todo.description}</p>
//               <p><strong>Status:</strong> {todo.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;


// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";

// type Status = "Active" | "Completed" | "Expired";

// const ConnectHederaAccount = () => {
//   const [accountId, setAccountId] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [balance, setBalance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [evmAddress, setEvmAddress] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [todos, setTodos] = useState<{ title: string; description: string; status: Status }[]>([]);

//   const navigate = useNavigate();

//   const saveAccountId = (id: string) => localStorage.setItem("hedera_account_id", id);
//   const clearAccountId = () => {
//     localStorage.removeItem("hedera_account_id");
//     setAccountId("");
//     setPrivateKey("");
//     setBalance("");
//     setEvmAddress("");
//     navigate("/");
//   };

//   const fetchEvmAddress = async (accountId: string) => {
//     try {
//       const res = await fetch(`https://api.hashscan.io/v1/account/${accountId}/evm-address`);
//       const data = await res.json();
//       if (data?.evm_address) {
//         setEvmAddress(data.evm_address); // ✅ fixed
//       } else {
//         setEvmAddress("");
//         toast.warn("Account is not EVM-compatible or EVM address not found");
//       }
//     } catch (err) {
//       console.error(err);
//       setEvmAddress("");
//     }
//   };

//   const connectAccount = async () => {
//     try {
//       setLoading(true);
//       if (!accountId || !privateKey) {
//         toast.error("Please enter both Account ID and Private Key");
//         return;
//       }

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//       const accountBalance = await balanceQuery.execute(client);

//       setBalance(accountBalance.hbars.toString());
//       saveAccountId(accountId);
//       fetchEvmAddress(accountId);
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid Account ID or Private Key");
//       setBalance("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnect = () => {
//     clearAccountId();
//     toast.error("Disconnected from account.");
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const savedId = localStorage.getItem("hedera_account_id");
//       if (savedId && savedId !== accountId) setAccountId(savedId);
//       else if (!savedId && accountId) disconnect();
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   useEffect(() => {
//     const onStorageChange = (e: StorageEvent) => {
//       if (e.key === "hedera_account_id") setAccountId(e.newValue || "");
//     };
//     window.addEventListener("storage", onStorageChange);
//     return () => window.removeEventListener("storage", onStorageChange);
//   }, []);

//   useEffect(() => {
//     if (!accountId) return;

//     const fetchBalance = async () => {
//       try {
//         setLoading(true);
//         const parsedAccountId = AccountId.fromString(accountId);
//         const client =
//           import.meta.env.VITE_NETWORK === "mainnet"
//             ? Client.forMainnet()
//             : Client.forTestnet();
//         const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
//         const accountBalance = await balanceQuery.execute(client);
//         setBalance(accountBalance.hbars.toString());
//       } catch (err) {
//         console.error(err);
//         setBalance("Error fetching balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//     const intervalId = setInterval(fetchBalance, 5000);
//     return () => clearInterval(intervalId);
//   }, [accountId]);

//   const maskAccountId = (id: string) => (!id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`);
//   const maskPrivateKey = (key: string) => (!key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`);
//   const maskEvmAddress = (address: string) => (!address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`);

//   const CONTRACT_ADDRESS = "0xe307fd0518faab84bec309f4206591ee5a6179f0";

//    const AddTodo = async () => {
//   if (!todoTitle) {
//     toast.error("Title is required");
//     return;
//   }

//   if (!evmAddress) {
//     toast.error("EVM Address not available");
//     return;
//   }

//   try {
//     // Connect to Hedera-compatible EVM wallet (via window.ethereum)
//     //@ts-ignore
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();

//     const contract = new ethers.Contract(CONTRACT_ADDRESS, TODOLISTABI.abi, signer);

//     // Example: set dueDate 24h from now
//     const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//     const tx = await contract.addTodo(todoTitle, todoDescription, dueDate);
//     await tx.wait();

//     // Update local state UI
//     setTodos([...todos, { title: todoTitle, description: todoDescription, status: "Active" }]);
//     setTodoTitle("");
//     setTodoDescription("");
//     setTodoStatus("Active");
//     setShowModal(false);

//     toast.success("Todo added on chain!");
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to add Todo on chain");
//   }
// };

//   return (
//     <div className="container">
//       <Link to="/">home</Link>
//       <h2>Connect Hedera Account</h2>

//       <input type="text" placeholder="Account ID (0.0.x)" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="input" />
//       <input type="text" placeholder="Private Key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} className="input" />

//       <div className="button-group">
//         <button onClick={connectAccount} disabled={loading || !!localStorage.getItem("hedera_account_id")} className="btn">
//           {loading ? "Connecting..." : localStorage.getItem("hedera_account_id") ? "Connected" : "Connect"}
//         </button>
//         <button onClick={disconnect} disabled={!localStorage.getItem("hedera_account_id")} className="btn disconnect">
//           Disconnect
//         </button>
//       </div>

//       {accountId && (
//         <div className="info">
//           <p><strong>Account ID:</strong> {maskAccountId(accountId)}</p>
//           <p><strong>Private Key:</strong> {maskPrivateKey(privateKey)}</p>
//         </div>
//       )}
//       {balance && <p className="info"><strong>Balance:</strong> {balance} HBAR</p>}
//       {evmAddress && <p className="info"><strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}</p>}

//       <div className="todo_container">
//         <button type="button" onClick={() => setShowModal(true)} className="btn" disabled={!evmAddress}>
//           Add Todo
//         </button>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>
//             <input type="text" placeholder="Title" value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} className="input" />
//             <textarea placeholder="Description" value={todoDescription} onChange={(e) => setTodoDescription(e.target.value)} className="textarea" />
//             <select value={todoStatus} onChange={(e) => setTodoStatus(e.target.value as Status)} className="select">
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">Add</button>
//               <button onClick={() => setShowModal(false)} className="btn disconnect">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>
//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p><strong>Title:</strong> {todo.title}</p>
//               <p><strong>Description:</strong> {todo.description}</p>
//               <p><strong>Status:</strong> {todo.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectHederaAccount;