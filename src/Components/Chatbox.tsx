// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";

// const RPC_URL = "https://testnet.hashio.io/api";
// const CONTRACT_ADDRESS = "0x5cad1ddf1e72fd84e9ce9389db0c5bd4cf85eb51";
// const ABI = [
//   "function sendMessage(address recipient, string message) public",
//   "function getSentMessages(address sender) view returns (tuple(uint256 timestamp, address sender, address recipient, string content)[])",
//   "function getReceivedMessages(address user) view returns (tuple(uint256 timestamp, address sender, address recipient, string content)[])",
//   "function registeredUsers(address) view returns (bool)",
//   "function registerUser() public"
// ];

// export default function MailerDApp() {
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [userAddress, setUserAddress] = useState("");
//   const [status, setStatus] = useState("Not connected");
//   const [recipient, setRecipient] = useState("");
//   const [message, setMessage] = useState("");
//   const [sentMessages, setSentMessages] = useState([]);
//   const [receivedMessages, setReceivedMessages] = useState([]);

//   const switchToHederaTestnet = async () => {
//     try {
//       await window.ethereum.request({
//         method: "wallet_addEthereumChain",
//         params: [{
//           chainId: "0x128",
//           chainName: "Hedera Testnet",
//           nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
//           rpcUrls: [RPC_URL],
//           blockExplorerUrls: ["https://hashscan.io/testnet"]
//         }]
//       });
//       setStatus("Switched to Hedera Testnet ✅");
//     } catch (err) {
//       console.error("Error switching to Hedera:", err);
//       setStatus("Switch network failed");
//     }
//   };

//   const connectMetaMask = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask.");
//       return;
//     }
//     try {
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       const p = new ethers.BrowserProvider(window.ethereum);
//       setProvider(p);

//       const network = await p.getNetwork();
//       if (network.chainId !== 296n) {
//         setStatus("Wrong network. Switching to Hedera Testnet...");
//         await switchToHederaTestnet();
//         return;
//       }

//       const s = await p.getSigner();
//       setSigner(s);
//       const addr = await s.getAddress();
//       setUserAddress(addr);

//       const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, s);
//       setContract(c);

//       setStatus(`Connected ✅ ${addr}`);

//       const isRegistered = await c.registeredUsers(addr);
//       if (!isRegistered) {
//         const tx = await c.registerUser();
//         setStatus("Registering user...");
//         await tx.wait();
//         setStatus("User registered successfully!");
//       }

//       await loadMessages(addr, c);

//     } catch (err) {
//       console.error(err);
//       setStatus("MetaMask connection failed.");
//     }
//   };

//   const loadMessages = async (addr, c = contract) => {
//     if (!c) return;
//     try {
//       const received = await c.getReceivedMessages(addr);
//       const sent = await c.getSentMessages(addr);

//       setReceivedMessages(received.map(msg => ({
//         timestamp: new Date(Number(msg.timestamp) * 1000).toLocaleString(),
//         sender: msg.sender,
//         content: msg.content
//       })));

//       setSentMessages(sent.map(msg => ({
//         timestamp: new Date(Number(msg.timestamp) * 1000).toLocaleString(),
//         recipient: msg.recipient,
//         content: msg.content
//       })));

//     } catch (err) {
//       console.error("Load messages error:", err);
//     }
//   };

//   const sendMessage = async () => {
//     if (!contract || !signer) {
//       alert("Connect MetaMask first.");
//       return;
//     }
//     const r = recipient.trim();
//     if (!r || !message) {
//       alert("Please enter recipient and message.");
//       return;
//     }
//     if (!ethers.isAddress(r)) {
//       alert("Invalid recipient address.");
//       return;
//     }

//     try {
//       const tx = await contract.sendMessage(r, message);
//       setStatus("Sending transaction...");
//       await tx.wait();
//       setStatus("Message sent!");
//       setMessage("");
//       await loadMessages(userAddress);
//     } catch (err) {
//       console.error("Error sending message:", err);
//       alert(err.reason || err.message || "Transaction failed");
//     }
//   };

//   return (
//     <div style={{ fontFamily: "Arial", margin: 20, padding: 20 }}>
//       <h1>Mailer DApp on Hedera (EVM)</h1>
//       <button onClick={connectMetaMask}>Connect MetaMask</button>
//       <div style={{ margin: "10px 0", fontWeight: "bold" }}>{status}</div>

//       <h2>Send Message</h2>
//       <input
//         type="text"
//         placeholder="Recipient (0x...)"
//         value={recipient}
//         onChange={e => setRecipient(e.target.value)}
//         style={{ width: "100%", padding: 10, margin: "10px 0", borderRadius: 4, border: "1px solid #ccc" }}
//       />
//       <textarea
//         placeholder="Message"
//         value={message}
//         onChange={e => setMessage(e.target.value)}
//         style={{ width: "100%", padding: 10, margin: "10px 0", borderRadius: 4, border: "1px solid #ccc" }}
//       />
//       <button onClick={sendMessage}>Send Message</button>

//       <div id="messages" style={{ marginTop: 30 }}>
//         <h3>Received Messages</h3>
//         <ul style={{ listStyle: "none", paddingLeft: 0 }}>
//           {receivedMessages.map((msg, idx) => (
//             <li key={idx} style={{ background: "#f9f9f9", padding: 10, marginBottom: 10, borderLeft: "4px solid #4CAF50" }}>
//               [{msg.timestamp}] From: {msg.sender} - {msg.content}
//             </li>
//           ))}
//         </ul>

//         <h3>Sent Messages</h3>
//         <ul style={{ listStyle: "none", paddingLeft: 0 }}>
//           {sentMessages.map((msg, idx) => (
//             <li key={idx} style={{ background: "#f9f9f9", padding: 10, marginBottom: 10, borderLeft: "4px solid #4CAF50" }}>
//               [{msg.timestamp}] To: {msg.recipient} - {msg.content}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// Chatbox.tsx
// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";

// interface ChatboxProps {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
//   provider?: ethers.BrowserProvider | null; // optional, can be passed from wallet connect
//   signer?: ethers.Signer | null;
// }

// const RPC_URL = "https://testnet.hashio.io/api";
// const CONTRACT_ADDRESS = "0x5cad1ddf1e72fd84e9ce9389db0c5bd4cf85eb51";
// const ABI = [
//   "function sendMessage(address recipient, string message) public",
//   "function getSentMessages(address sender) view returns (tuple(uint256 timestamp, address sender, address recipient, string content)[])",
//   "function getReceivedMessages(address user) view returns (tuple(uint256 timestamp, address sender, address recipient, string content)[])",
//   "function registeredUsers(address) view returns (bool)",
//   "function registerUser() public"
// ];

// const Chatbox: React.FC<ChatboxProps> = ({
//   accountId,
//   evmAddress,
//   provider,
//   signer,
// }) => {
//   const [contract, setContract] = useState<ethers.Contract | null>(null);
//   const [status, setStatus] = useState("Not connected");
//   const [recipient, setRecipient] = useState("");
//   const [message, setMessage] = useState("");
//   const [sentMessages, setSentMessages] = useState<any[]>([]);
//   const [receivedMessages, setReceivedMessages] = useState<any[]>([]);

//   useEffect(() => {
//     const initContract = async () => {
//       if (!signer) {
//         setStatus("Connect wallet first");
//         return;
//       }
//       const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
//       setContract(c);

//       if (evmAddress) {
//         try {
//           const isRegistered = await c.registeredUsers(evmAddress);
//           if (!isRegistered) {
//             const tx = await c.registerUser();
//             setStatus("Registering user...");
//             await tx.wait();
//             setStatus("User registered successfully!");
//           }
//           await loadMessages(evmAddress, c);
//         } catch (err: any) {
//           console.error(err);
//           setStatus(err.reason || err.message || "Error initializing contract");
//         }
//       }
//     };

//     initContract();
//   }, [signer, evmAddress]);

//   const loadMessages = async (addr: string, c: ethers.Contract) => {
//     try {
//       const received = await c.getReceivedMessages(addr);
//       const sent = await c.getSentMessages(addr);

//       setReceivedMessages(
//         received.map((msg: any) => ({
//           timestamp: new Date(Number(msg.timestamp) * 1000).toLocaleString(),
//           sender: msg.sender,
//           content: msg.content,
//         }))
//       );

//       setSentMessages(
//         sent.map((msg: any) => ({
//           timestamp: new Date(Number(msg.timestamp) * 1000).toLocaleString(),
//           recipient: msg.recipient,
//           content: msg.content,
//         }))
//       );
//     } catch (err) {
//       console.error("Load messages error:", err);
//     }
//   };

//   const sendMessage = async () => {
//     if (!contract || !signer) {
//       alert("Connect wallet first");
//       return;
//     }
//     const r = recipient.trim();
//     if (!r || !message) {
//       alert("Enter recipient and message");
//       return;
//     }
//     if (!ethers.isAddress(r)) {
//       alert("Invalid recipient address");
//       return;
//     }

//     try {
//       const tx = await contract.sendMessage(r, message);
//       setStatus("Sending transaction...");
//       await tx.wait();
//       setStatus("Message sent!");
//       setMessage("");
//       if (evmAddress) await loadMessages(evmAddress, contract);
//     } catch (err: any) {
//       console.error(err);
//       alert(err.reason || err.message || "Transaction failed");
//     }
//   };

//   return (
//     <div style={{ fontFamily: "Arial", margin: 20, padding: 20 }}>
//       <h1>Chatbox DApp</h1>
//       <div style={{ margin: "10px 0", fontWeight: "bold" }}>{status}</div>

//       <h2>Send Message</h2>
//       <input
//         type="text"
//         placeholder="Recipient (0x...)"
//         value={recipient}
//         onChange={(e) => setRecipient(e.target.value)}
//         style={{ width: "100%", padding: 10, margin: "10px 0", borderRadius: 4, border: "1px solid #ccc" }}
//       />
//       <textarea
//         placeholder="Message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         style={{ width: "100%", padding: 10, margin: "10px 0", borderRadius: 4, border: "1px solid #ccc" }}
//       />
//       <button onClick={sendMessage} style={{ padding: "10px 16px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
//         Send Message
//       </button>

//       <div id="messages" style={{ marginTop: 30 }}>
//         <h3>Received Messages</h3>
//         <ul style={{ listStyle: "none", paddingLeft: 0 }}>
//           {receivedMessages.map((msg, idx) => (
//             <li key={idx} style={{ background: "#f9f9f9", padding: 10, marginBottom: 10, borderLeft: "4px solid #4CAF50" }}>
//               [{msg.timestamp}] From: {msg.sender} - {msg.content}
//             </li>
//           ))}
//         </ul>

//         <h3>Sent Messages</h3>
//         <ul style={{ listStyle: "none", paddingLeft: 0 }}>
//           {sentMessages.map((msg, idx) => (
//             <li key={idx} style={{ background: "#f9f9f9", padding: 10, marginBottom: 10, borderLeft: "4px solid #4CAF50" }}>
//               [{msg.timestamp}] To: {msg.recipient} - {msg.content}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Chatbox;



// Chatbox.tsx
// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";

// interface ChatboxProps {
//  accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
// }

// const CONTRACT_ADDRESS = "0x5cad1ddf1e72fd84e9ce9389db0c5bd4cf85eb51";
// const ABI = [
//   "function sendMessage(address recipient, string message) public",
//   "function getSentMessages(address sender) view returns (tuple(uint256 timestamp, address sender, address recipient, string content)[])",
//   "function getReceivedMessages(address user) view returns (tuple(uint256 timestamp, address sender, address recipient, string content)[])",
//   "function registeredUsers(address) view returns (bool)",
//   "function registerUser() public"
// ];

// const Chatbox: React.FC<ChatboxProps> = ({ accountId, evmAddress, provider, signer }) => {
//   const [contract, setContract] = useState<ethers.Contract | null>(null);
//   const [status, setStatus] = useState("Connect wallet first");
//   const [recipient, setRecipient] = useState("");
//   const [message, setMessage] = useState("");
//   const [sentMessages, setSentMessages] = useState<any[]>([]);
//   const [receivedMessages, setReceivedMessages] = useState<any[]>([]);

//   // Initialize contract and register user if needed
//   useEffect(() => {
//     const init = async () => {
//       if (!signer || !evmAddress) {
//         setStatus("Wallet not connected");
//         return;
//       }

//       const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
//       setContract(c);

//       try {
//         const isRegistered = await c.registeredUsers(evmAddress);
//         if (!isRegistered) {
//           setStatus("Registering user...");
//           const tx = await c.registerUser();
//           await tx.wait();
//           setStatus("User registered successfully!");
//         } else {
//           setStatus("Wallet connected ✅");
//         }

//         // Load messages
//         await loadMessages(evmAddress, c);
//       } catch (err: any) {
//         console.error(err);
//         setStatus(err.reason || err.message || "Contract initialization failed");
//       }
//     };

//     init();
//   }, [signer, evmAddress]);

//   const loadMessages = async (addr: string, c: ethers.Contract) => {
//     try {
//       const received = await c.getReceivedMessages(addr);
//       const sent = await c.getSentMessages(addr);

//       setReceivedMessages(
//         received.map((msg: any) => ({
//           timestamp: new Date(Number(msg.timestamp) * 1000).toLocaleString(),
//           sender: msg.sender,
//           content: msg.content,
//         }))
//       );

//       setSentMessages(
//         sent.map((msg: any) => ({
//           timestamp: new Date(Number(msg.timestamp) * 1000).toLocaleString(),
//           recipient: msg.recipient,
//           content: msg.content,
//         }))
//       );
//     } catch (err) {
//       console.error("Load messages error:", err);
//     }
//   };

//   const sendMessage = async () => {
//     if (!contract || !signer) {
//       alert("Connect wallet first");
//       return;
//     }

//     const r = recipient.trim();
//     if (!r || !message) {
//       alert("Enter recipient and message");
//       return;
//     }

//     if (!ethers.isAddress(r)) {
//       alert("Invalid recipient address");
//       return;
//     }

//     try {
//       const tx = await contract.sendMessage(r, message);
//       setStatus("Sending transaction...");
//       await tx.wait();
//       setStatus("Message sent!");
//       setMessage("");
//       if (evmAddress) await loadMessages(evmAddress, contract);
//     } catch (err: any) {
//       console.error(err);
//       alert(err.reason || err.message || "Transaction failed");
//     }
//   };

//   return (
//     <div style={{ fontFamily: "Arial", padding: 20 }}>
//       <h1>Chatbox DApp</h1>
//       <div style={{ margin: "10px 0", fontWeight: "bold" }}>{status}</div>

//       <h2>Send Message</h2>
//       <input
//         type="text"
//         placeholder="Recipient (0x...)"
//         value={recipient}
//         onChange={(e) => setRecipient(e.target.value)}
//         style={{ width: "100%", padding: 10, margin: "10px 0", borderRadius: 4, border: "1px solid #ccc" }}
//       />
//       <textarea
//         placeholder="Message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         style={{ width: "100%", padding: 10, margin: "10px 0", borderRadius: 4, border: "1px solid #ccc" }}
//       />
//       <button
//         onClick={sendMessage}
//         style={{ padding: "10px 16px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
//       >
//         Send Message
//       </button>

//       <div style={{ marginTop: 30 }}>
//         <h3>Received Messages</h3>
//         <ul style={{ listStyle: "none", paddingLeft: 0 }}>
//           {receivedMessages.map((msg, idx) => (
//             <li key={idx} style={{ background: "#f9f9f9", padding: 10, marginBottom: 10, borderLeft: "4px solid #4CAF50" }}>
//               [{msg.timestamp}] From: {msg.sender} - {msg.content}
//             </li>
//           ))}
//         </ul>

//         <h3>Sent Messages</h3>
//         <ul style={{ listStyle: "none", paddingLeft: 0 }}>
//           {sentMessages.map((msg, idx) => (
//             <li key={idx} style={{ background: "#f9f9f9", padding: 10, marginBottom: 10, borderLeft: "4px solid #4CAF50" }}>
//               [{msg.timestamp}] To: {msg.recipient} - {msg.content}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Chatbox;

// close

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   ContractExecuteTransaction
// } from "@hashgraph/sdk";
// import { toast } from "react-toastify";
// import "../Styles/Chatbox.css";

// const CONTRACT_ID = "0.0.7059508"; 

// interface ChatboxProps {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
// }

// interface Message {
//   timestamp: string;
//   sender?: string;
//   recipient?: string;
//   content: string;
// }

// const Chatbox = ({ accountId, privateKey, evmAddress }: ChatboxProps) => {
//   const [status, setStatus] = useState("Connect wallet first");
//   const [recipient, setRecipient] = useState("");
//   const [message, setMessage] = useState("");
//   const [sentMessages, setSentMessages] = useState<Message[]>([]);
//   const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);

//   const createClient = () => {
//     if (!accountId || !privateKey) throw new Error("Wallet not connected");
//     const client =
//       import.meta.env.VITE_NETWORK === "mainnet"
//         ? Client.forMainnet()
//         : Client.forTestnet();
//     client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
//     return client;
//   };

//   const fetchMessages = async () => {
//     if (!accountId || !privateKey || !evmAddress) return;

//     try {
//       const client = createClient();

//       const sentQuery = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(300_000)
//         .setFunction("getSentMessages", new ContractFunctionParameters().addAddress(evmAddress))
//         .execute(client);

//       const receivedQuery = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(300_000)
//         .setFunction("getReceivedMessages", new ContractFunctionParameters().addAddress(evmAddress))
//         .execute(client);

//       // Decode messages (assumes each returns tuple arrays)
//       // const decodeMessages = (result: any, type: "sent" | "received") => {
//       //   const messages: Message[] = [];
//       //   const total = result.getUint256(0); // adjust based on your contract
//       //   for (let i = 0; i < total; i++) {
//       //     const timestamp = new Date(result.getUint256(i * 4) * 1000).toLocaleString();
//       //     const sender = type === "received" ? result.getAddress(i * 4 + 1) : undefined;
//       //     const recipient = type === "sent" ? result.getAddress(i * 4 + 2) : undefined;
//       //     const content = result.getString(i * 4 + 3);
//       //     messages.push({ timestamp, sender, recipient, content });
//       //   }
//       //   return messages;
//       // };
//       const decodeMessages = (result: any, type: "sent" | "received") => {
//   const messages: Message[] = [];
//   const tuples = result.getTupleArray(0); // first output from the contract

//   if (!tuples || tuples.length === 0) return messages;

//   tuples.forEach((t: any) => {
//     messages.push({
//       timestamp: new Date(Number(t[0]) * 1000).toLocaleString(),
//       sender: type === "received" ? t[1] : undefined,
//       recipient: type === "sent" ? t[2] : undefined,
//       content: t[3],
//     });
//   });

//   return messages;
// };

//       setSentMessages(decodeMessages(sentQuery, "sent"));
//       setReceivedMessages(decodeMessages(receivedQuery, "received"));
//       setStatus("Wallet connected ✅");
//     } catch (err: any) {
//       console.error(err);
//       setStatus(err.message || "Failed to load messages");
//     }
//   };

//   const sendMessage = async () => {
//     if (!accountId || !privateKey || !evmAddress) {
//       toast.error("Wallet not connected");
//       return;
//     }

//     if (!recipient || !message) {
//       toast.error("Enter recipient and message");
//       return;
//     }

//     try {
//       const client = createClient();

//       const tx = await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(500_000)
//         .setFunction(
//           "sendMessage",
//           new ContractFunctionParameters()
//             .addAddress(recipient)
//             .addString(message)
//         )
//         .execute(client);

//       await tx.getReceipt(client);
//       toast.success("Message sent!");
//       setMessage("");
//       fetchMessages();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to send message");
//     }
//   };

//   useEffect(() => {
//     if (!accountId || !privateKey || !evmAddress) return;
//     fetchMessages();
//     const interval = setInterval(fetchMessages, 10000);
//     return () => clearInterval(interval);
//   }, [accountId, privateKey, evmAddress]);

//   return (
//     <div className="chatbox-container">
//       <Link to="/ConnectWallet">
//         <img
//           width="35"
//           height="35"
//           src="https://img.icons8.com/nolan/64/left.png"
//           alt="left"
//         />
//       </Link>

//       <h2>Chatbox DApp</h2>
//       <div className="status">{status}</div>

//       <input
//         type="text"
//         placeholder="Recipient (0x...)"
//         value={recipient}
//         onChange={(e) => setRecipient(e.target.value)}
//       />
//       <textarea
//         placeholder="Message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send Message</button>

//       <div className="messages-section">
//         <h3>Received Messages</h3>
//         {receivedMessages.map((msg, idx) => (
//           <div key={idx} className="message-card">
//             [{msg.timestamp}] From: {msg.sender} - {msg.content}
//           </div>
//         ))}

//         <h3>Sent Messages</h3>
//         {sentMessages.map((msg, idx) => (
//           <div key={idx} className="message-card">
//             [{msg.timestamp}] To: {msg.recipient} - {msg.content}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Chatbox;


// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   ContractExecuteTransaction
// } from "@hashgraph/sdk";
// import { toast } from "react-toastify";
// import "../Styles/Chatbox.css";

// const CONTRACT_ID = "0.0.7059508"; // your deployed contract

// interface ChatboxProps {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
// }

// interface Message {
//   timestamp: string;
//   sender?: string;
//   recipient?: string;
//   content: string;
// }

// const Chatbox = ({ accountId, privateKey, evmAddress }: ChatboxProps) => {
//   const [status, setStatus] = useState("Connect wallet first");
//   const [recipient, setRecipient] = useState("");
//   const [message, setMessage] = useState("");
//   const [sentMessages, setSentMessages] = useState<Message[]>([]);
//   const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);

//   const createClient = () => {
//     if (!accountId || !privateKey) throw new Error("Wallet not connected");
//     const client =
//       import.meta.env.VITE_NETWORK === "mainnet"
//         ? Client.forMainnet()
//         : Client.forTestnet();
//     client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
//     return client;
//   };

//   // Fetch messages by querying total count first, then fetching each message individually
//   const fetchMessages = async () => {
//     if (!accountId || !privateKey || !evmAddress) return;

//     try {
//       const client = createClient();

//       // Get total sent messages
//       const sentCountTx = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(100_000)
//         .setFunction("getSentMessagesCount", new ContractFunctionParameters().addAddress(evmAddress))
//         .execute(client);

//       const sentCount = Number(sentCountTx.getUint256(0));
//       const sent: Message[] = [];

//       for (let i = 0; i < sentCount; i++) {
//         const msgTx = await new ContractCallQuery()
//           .setContractId(CONTRACT_ID)
//           .setGas(200_000)
//           .setFunction("getSentMessage", new ContractFunctionParameters().addAddress(evmAddress).addUint256(i))
//           .execute(client);

//         sent.push({
//           timestamp: new Date(Number(msgTx.getUint256(0)) * 1000).toLocaleString(),
//           recipient: msgTx.getAddress(1),
//           content: msgTx.getString(2)
//         });
//       }

//       // Get total received messages
//       const recvCountTx = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(100_000)
//         .setFunction("getReceivedMessagesCount", new ContractFunctionParameters().addAddress(evmAddress))
//         .execute(client);

//       const recvCount = Number(recvCountTx.getUint256(0));
//       const received: Message[] = [];

//       for (let i = 0; i < recvCount; i++) {
//         const msgTx = await new ContractCallQuery()
//           .setContractId(CONTRACT_ID)
//           .setGas(200_000)
//           .setFunction("getReceivedMessage", new ContractFunctionParameters().addAddress(evmAddress).addUint256(i))
//           .execute(client);

//         received.push({
//           timestamp: new Date(Number(msgTx.getUint256(0)) * 1000).toLocaleString(),
//           sender: msgTx.getAddress(1),
//           content: msgTx.getString(2)
//         });
//       }

//       setSentMessages(sent);
//       setReceivedMessages(received);
//       setStatus("Wallet connected ✅");
//     } catch (err: any) {
//       console.error(err);
//       setStatus(err.message || "Failed to load messages");
//     }
//   };

//   const sendMessage = async () => {
//     if (!accountId || !privateKey || !evmAddress) {
//       toast.error("Wallet not connected");
//       return;
//     }

//     if (!recipient || !message) {
//       toast.error("Enter recipient and message");
//       return;
//     }

//     try {
//       const client = createClient();

//       const tx = await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(500_000)
//         .setFunction(
//           "sendMessage",
//           new ContractFunctionParameters()
//             .addAddress(recipient)
//             .addString(message)
//         )
//         .execute(client);

//       await tx.getReceipt(client);
//       toast.success("Message sent!");
//       setMessage("");
//       fetchMessages();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to send message");
//     }
//   };

//   useEffect(() => {
//     if (!accountId || !privateKey || !evmAddress) return;
//     fetchMessages();
//     const interval = setInterval(fetchMessages, 10000);
//     return () => clearInterval(interval);
//   }, [accountId, privateKey, evmAddress]);

//   return (
//     <div className="chatbox-container">
//       <Link to="/ConnectWallet">
//         <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left" />
//       </Link>

//       <h2>Chatbox DApp</h2>
//       <div className="status">{status}</div>

//       <input
//         type="text"
//         placeholder="Recipient (0x...)"
//         value={recipient}
//         onChange={(e) => setRecipient(e.target.value)}
//       />
//       <textarea
//         placeholder="Message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send Message</button>

//       <div className="messages-section">
//         <h3>Received Messages</h3>
//         {receivedMessages.map((msg, idx) => (
//           <div key={idx} className="message-card">
//             [{msg.timestamp}] From: {msg.sender} - {msg.content}
//           </div>
//         ))}

//         <h3>Sent Messages</h3>
//         {sentMessages.map((msg, idx) => (
//           <div key={idx} className="message-card">
//             [{msg.timestamp}] To: {msg.recipient} - {msg.content}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Chatbox;



// src/Components/Chatbox.tsx

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Client,
  AccountId,
  PrivateKey,
  ContractCallQuery,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  Hbar
} from "@hashgraph/sdk";
import { toast } from "react-toastify";
import "../Styles/Chatbox.css";

const CONTRACT_ID = "0.0.7059508"; // your deployed contract

interface ChatboxProps {
  accountId: string | null;
  privateKey: string | null;
  evmAddress: string | null;
}

interface Message {
  timestamp: string;
  sender?: string;
  recipient?: string;
  content: string;
}

const Chatbox = ({ accountId, privateKey, evmAddress }: ChatboxProps) => {
  const [status, setStatus] = useState("Connect wallet first");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
const [balance, setBalance] = useState<string>("0");

  
  const createClient = () => {
    if (!accountId || !privateKey) throw new Error("Wallet not connected");
    // const client =
    //   import.meta.env.VITE_NETWORK === "mainnet"
    //     ? Client.forMainnet()
    //     : Client.forTestnet();
    // client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
    const client =
  import.meta.env.VITE_NETWORK === "mainnet"
    ? Client.forMainnet()
    : Client.forTestnet();

client.setOperator(
  AccountId.fromString(accountId),
  PrivateKey.fromStringECDSA(privateKey)
);

// increase query payment limit
client.setMaxQueryPayment(new Hbar(5));
    return client;
  };


//   const decodeMessages = (rawResult: any) => {
//   const messages: Message[] = [];
//   let i = 0;

//   while (true) {
//     try {
//       const timestamp = rawResult.getUint256(i * 4);
//       const sender = rawResult.getAddress(i * 4 + 1);
//       const recipient = rawResult.getAddress(i * 4 + 2);
//       const content = rawResult.getString(i * 4 + 3);

//       messages.push({
//         timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
//         sender,
//         recipient,
//         content
//       });

//       i++;
//     } catch {
//       break; // reached end of returned messages
//     }
//   }

//   return messages;
// };
  
//     const decodeMessages = (result: any): Message[] => {
//   const messages: Message[] = [];

//   const raw = result.getResult(); // ABI decoded result
//   if (!raw || raw.length === 0) return [];

//   const arr = raw[0]; // first return value = Message[]

//   for (let i = 0; i < arr.length; i++) {
//     const m = arr[i];

//     messages.push({
//       timestamp: new Date(Number(m.timestamp) * 1000).toLocaleString(),
//       sender: m.sender,
//       recipient: m.recipient,
//       content: m.content
//     });
//   }

//   return messages;
// };


// const decodeMessages = (result: any): Message[] => {
//   const messages: Message[] = [];

//   try {
//     const length = result.getUint256(0); // array length

//     for (let i = 0; i < length; i++) {
//       const base = 1 + i * 4;

//       const timestamp = result.getUint256(base);
//       const sender = result.getAddress(base + 1);
//       const recipient = result.getAddress(base + 2);
//       const content = result.getString(base + 3);

//       messages.push({
//         timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
//         sender,
//         recipient,
//         content
//       });
//     }
//   } catch (err) {
//     console.error("Decode error:", err);
//   }

//   return messages;
// };
const decodeMessages = (result: any): Message[] => {
  try {
    const bytes = result.bytes;

    const abi = [
      "function getMessages() view returns ((uint256 timestamp,address sender,address recipient,string content)[])"
    ];

    const iface = new ethers.Interface(abi);

    const decoded = iface.decodeFunctionResult("getMessages", bytes);

    const msgs = decoded[0];

    return msgs.map((m: any) => ({
      timestamp: new Date(Number(m.timestamp) * 1000).toLocaleString(),
      sender: m.sender,
      recipient: m.recipient,
      content: m.content
    }));
  } catch (err) {
    console.error("Decode error:", err);
    return [];
  }
};
const fetchMessages = async () => {
    if (!accountId || !privateKey || !evmAddress) return;

    try {
      const client = createClient();

      // const sentQuery = await new ContractCallQuery()
      //   .setContractId(CONTRACT_ID)
      //   .setGas(1_00_000)
      //   .setFunction("getSentMessages", new ContractFunctionParameters().addAddress(evmAddress))
      //   .execute(client);

      // const receivedQuery = await new ContractCallQuery()
      //   .setContractId(CONTRACT_ID)
      //   .setGas(1_00_000)
      //   .setFunction("getReceivedMessages", new ContractFunctionParameters().addAddress(evmAddress))
      //   .execute(client);
      const sentQuery = await new ContractCallQuery()
  .setContractId(CONTRACT_ID)
  .setGas(1_000_000)
  .setFunction(
    "getSentMessages",
    new ContractFunctionParameters().addAddress(evmAddress)
  )
  .execute(client);

const receivedQuery = await new ContractCallQuery()
  .setContractId(CONTRACT_ID)
  .setGas(1_000_000)
  .setFunction(
    "getReceivedMessages",
    new ContractFunctionParameters().addAddress(evmAddress)
  )
  .execute(client);

      setSentMessages(decodeMessages(sentQuery));
      setReceivedMessages(decodeMessages(receivedQuery));
      setStatus("Wallet connected ✅");
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Failed to load messages");
    }
  };

  // -----------------------------
  // Send message
  // -----------------------------
  const sendMessage = async () => {
    if (!accountId || !privateKey || !evmAddress) {
      toast.error("Wallet not connected");
      return;
    }
    if (!recipient || !message) {
      toast.error("Enter recipient and message");
      return;
    }

    try {
      const client = createClient();

      const tx = await new ContractExecuteTransaction()
        .setContractId(CONTRACT_ID)
        .setGas(500_000)
        .setFunction(
          "sendMessage",
          new ContractFunctionParameters()
            .addAddress(recipient)
            .addString(message)
        )
        .execute(client);

      await tx.getReceipt(client);
      toast.success("Message sent!");
      setMessage("");
      fetchMessages();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send message");
    }
  };

  // -----------------------------
  // Auto fetch messages every 10s
  // -----------------------------

  
const checkRegistration = async () => {
  if (!accountId || !privateKey || !evmAddress) return;
  try {
    const client = createClient();
    const regQuery = await new ContractCallQuery()
      .setContractId(CONTRACT_ID)
      .setGas(100_000)
      .setFunction("registeredUsers", new ContractFunctionParameters().addAddress(evmAddress))
      .execute(client);

    setIsRegistered(regQuery.getBool(0));
  } catch (err) {
    console.error("Check registration error:", err);
  }
};

const registerUser = async () => {
  if (!accountId || !privateKey) return;
  try {
    const client = createClient();
    const tx = await new ContractExecuteTransaction()
      .setContractId(CONTRACT_ID)
      .setGas(300_000)
      .setFunction("registerUser")
      .execute(client);

    await tx.getReceipt(client);
    toast.success("User registered successfully!");
    setIsRegistered(true);
    fetchBalance();
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Registration failed");
  }
};

const fetchBalance = async () => {
  if (!accountId || !privateKey || !evmAddress) return;
  try {
    const client = createClient();
    const balQuery = await new ContractCallQuery()
      .setContractId(CONTRACT_ID)
      .setGas(100_000)
      .setFunction("balanceOf", new ContractFunctionParameters().addAddress(evmAddress))
      .execute(client);

    setBalance(balQuery.getUint256(0).toString());
  } catch (err) {
    console.error("Fetch balance error:", err);
  }
};

// -----------------------------
// Update useEffect to check registration & balance
// -----------------------------
useEffect(() => {
  if (!accountId || !privateKey || !evmAddress) return;
  fetchMessages();
  checkRegistration();
  fetchBalance();
  const interval = setInterval(() => {
    fetchMessages();
    fetchBalance();
  }, 10000);
  return () => clearInterval(interval);
}, [accountId, privateKey, evmAddress]);

  // useEffect(() => {
  //   if (!accountId || !privateKey || !evmAddress) return;
  //   fetchMessages();
  //   const interval = setInterval(fetchMessages, 10000);
  //   return () => clearInterval(interval);
  // }, [accountId, privateKey, evmAddress]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="chatbox-container">
      <Link to="/ConnectWallet">
        <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
      </Link>

      <h2>Chatbox DApp</h2>
      <div className="status">{status}</div>


      <h4>Registration Status</h4>
{isRegistered ? (
  <span>✅ Registered</span>
) : (
  <button onClick={registerUser}>Register User</button>
)}

<h5>Token Balance: {balance}</h5>
      <input
        type="text"
        placeholder="Recipient (0x...)"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>

      <div className="messages-section">
        <h3>Received Messages</h3>
        {receivedMessages.map((msg, idx) => (
          <div key={idx} className="message-card">
            [{msg.timestamp}] From: {msg.sender} - {msg.content}
          </div>
        ))}

        <h3>Sent Messages</h3>
        {sentMessages.map((msg, idx) => (
          <div key={idx} className="message-card">
            [{msg.timestamp}] To: {msg.recipient} - {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatbox;