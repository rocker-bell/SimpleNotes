// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractFunctionParameters
// } from "@hashgraph/sdk";
// import "../Styles/DexScan.css";

// const CONTRACT_ID = "0.0.YOUR_CONTRACT";

// interface DexScanProps {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
// }

// interface TokenResult {
//   id: number;
//   name: string;
//   symbol: string;
//   liquidity: number;
// }

// const DexScan = ({ accountId, privateKey }: DexScanProps) => {

//   const [network, setNetwork] = useState<"mainnet" | "testnet">("testnet");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [results, setResults] = useState<TokenResult[]>([]);
//   const [history, setHistory] = useState<string[]>([]);
//   const [activeTab, setActiveTab] = useState<"results" | "history">("results");

//   const createClient = () => {

//     if (!accountId || !privateKey) throw new Error("Wallet not connected");

//     const client =
//       network === "mainnet"
//         ? Client.forMainnet()
//         : Client.forTestnet();

//     client.setOperator(
//       AccountId.fromString(accountId),
//       PrivateKey.fromStringECDSA(privateKey)
//     );

//     return client;
//   };

//   const searchToken = async () => {

//     if (!searchQuery || !accountId || !privateKey) return;

//     try {

//       const client = createClient();

//       const tx = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(300000)
//         .setFunction(
//           "searchToken",
//           new ContractFunctionParameters().addString(searchQuery)
//         )
//         .execute(client);

//       const total = Number(tx.getUint256(0));

//       const found: TokenResult[] = [];

//       for (let i = 0; i < total; i++) {

//         const name = tx.getString(i * 3 + 1);
//         const symbol = tx.getString(i * 3 + 2);
//         const liquidity = Number(tx.getUint256(i * 3 + 3));

//         found.push({
//           id: i,
//           name,
//           symbol,
//           liquidity
//         });
//       }

//       setResults(found);

//       setHistory(prev => {
//         const newHistory = [searchQuery, ...prev];
//         return [...new Set(newHistory)].slice(0, 10);
//       });

//     } catch (err) {
//       console.error("Search error:", err);
//     }
//   };

//   return (
//     <div className="dex-container">

//       <Link to="/ConnectWallet">
//         ← Back
//       </Link>

//       <div className="top-bar">

//         <select
//           value={network}
//           onChange={e => setNetwork(e.target.value as any)}
//         >
//           <option value="mainnet">Mainnet</option>
//           <option value="testnet">Testnet</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Search token..."
//           value={searchQuery}
//           onChange={e => setSearchQuery(e.target.value)}
//         />

//         <button onClick={searchToken}>
//           Search
//         </button>

//       </div>

//       <div className="tabs">

//         <button
//           className={activeTab === "results" ? "active" : ""}
//           onClick={() => setActiveTab("results")}
//         >
//           Results
//         </button>

//         <button
//           className={activeTab === "history" ? "active" : ""}
//           onClick={() => setActiveTab("history")}
//         >
//           History
//         </button>

//       </div>

//       <div className="results-container">

//         {activeTab === "results" && results.map(token => (

//           <div key={token.id} className="token-card">

//             <div>
//               <strong>{token.name}</strong>
//               <p>{token.symbol}</p>
//             </div>

//             <span>Liquidity: {token.liquidity}</span>

//           </div>

//         ))}

//         {activeTab === "history" && history.map((item, index) => (

//           <div
//             key={index}
//             className="history-item"
//             onClick={() => {
//               setSearchQuery(item);
//               searchToken();
//             }}
//           >
//             {item}
//           </div>

//         ))}

//       </div>

//     </div>
//   );
// };

// export default DexScan;

// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// interface DexScanProps {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
// }

// const DexScan = ({ accountId, evmAddress }: DexScanProps) => {

//   const [network, setNetwork] = useState<"mainnet" | "testnet">("testnet");
//   const [search, setSearch] = useState("");
//   const [results, setResults] = useState<any[]>([]);
//   const [history, setHistory] = useState<any[]>([]);
//   const [tab, setTab] = useState<"results" | "history">("results");

//   const baseURL =
//     network === "mainnet"
//       ? "https://mainnet.mirrornode.hedera.com/api/v1"
//       : "https://testnet.mirrornode.hedera.com/api/v1";

//   const searchQuery = async () => {

//     if (!search) return;

//     try {

//       let url = "";

//       if (search.startsWith("0.0.")) {
//         url = `${baseURL}/accounts/${search}`;
//       }
//       else if (search.startsWith("0x")) {
//         url = `${baseURL}/accounts/${search}`;
//       }
//       else {
//         url = `${baseURL}/transactions/${search}`;
//       }

//       const res = await fetch(url);
//       const data = await res.json();

//       setResults([data]);

//     } catch (err) {
//       console.error("Search error:", err);
//     }
//   };

//   const fetchHistory = async () => {

//     if (!accountId) return;

//     try {

//       const res = await fetch(
//         `${baseURL}/accounts/${accountId}/transactions?limit=20`
//       );

//       const data = await res.json();

//       setHistory(data.transactions || []);

//     } catch (err) {
//       console.error("History error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, [accountId, network]);

//   return (
//     <div className="dex-container">

//       <Link to="/ConnectWallet">← Back</Link>

//       <h2>Dex Scanner</h2>

//       <div>

//         <select
//           value={network}
//           onChange={(e) => setNetwork(e.target.value as any)}
//         >
//           <option value="testnet">Testnet</option>
//           <option value="mainnet">Mainnet</option>
//         </select>

//         <input
//           placeholder="Search tx / account / evm..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <button onClick={searchQuery}>
//           Search
//         </button>

//       </div>

//       <div>

//         <button onClick={() => setTab("results")}>
//           Search Results
//         </button>

//         <button onClick={() => setTab("history")}>
//           History
//         </button>

//       </div>

//       <div className="results">

//         {tab === "results" &&
//           results.map((r, i) => (
//             <pre key={i}>
//               {JSON.stringify(r, null, 2)}
//             </pre>
//           ))}

//         {tab === "history" &&
//           history.map((tx: any, i) => (

//             <div key={i} className="tx-card">

//               <p><b>Tx ID:</b> {tx.transaction_id}</p>

//               <p><b>Type:</b> {tx.name}</p>

//               <p><b>Result:</b> {tx.result}</p>

//               <p><b>Consensus:</b> {tx.consensus_timestamp}</p>

//             </div>

//           ))}

//       </div>

//     </div>
//   );
// };

// export default DexScan;


// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "../Styles/TodoApp.css";

// interface DexScanProps {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
// }

// const DexScan = ({ accountId, evmAddress }: DexScanProps) => {

//   const [network, setNetwork] = useState<"mainnet" | "testnet">("testnet");
//   const [search, setSearch] = useState("");
//   const [results, setResults] = useState<any[]>([]);
//   const [history, setHistory] = useState<any[]>([]);
//   const [tab, setTab] = useState<"results" | "history">("results");

//   const baseURL =
//     network === "mainnet"
//       ? "https://mainnet.mirrornode.hedera.com/api/v1"
//       : "https://testnet.mirrornode.hedera.com/api/v1";

//   const searchQuery = async () => {

//     if (!search) return;

//     try {

//       let url = "";

//       if (search.startsWith("0.0.")) {
//         url = `${baseURL}/accounts/${search}`;
//       }
//       else if (search.startsWith("0x")) {
//         url = `${baseURL}/accounts/${search}`;
//       }
//       else {
//         url = `${baseURL}/transactions/${search}`;
//       }

//       const res = await fetch(url);
//       const data = await res.json();

//       setResults([data]);

//     } catch (err) {
//       console.error("Search error:", err);
//     }
//   };

//   const fetchHistory = async () => {

//     if (!accountId) return;

//     try {

//       const res = await fetch(
//         `${baseURL}/accounts/${accountId}/transactions?limit=20`
//       );

//       const data = await res.json();

//       setHistory(data.transactions || []);

//     } catch (err) {
//       console.error("History error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, [accountId, network]);

//   return (
//     <div className="todo-container">

//       <Link to="/ConnectWallet">
//         <img width="35" height="35"
//           src="https://img.icons8.com/nolan/64/left.png"
//           alt="back"
//         />
//       </Link>

//       <h2 className="header-title">Dex Scanner</h2>

//       {/* Search Bar */}
//       <div className="input-group">

//         <select
//           value={network}
//           onChange={(e) => setNetwork(e.target.value as any)}
//         >
//           <option value="testnet">Testnet</option>
//           <option value="mainnet">Mainnet</option>
//         </select>

//         <input
//           className="main-input"
//           placeholder="Search tx / account / evm..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <button
//           onClick={searchQuery}
//           className="add-btn"
//         >
//           Search
//         </button>

//       </div>

//       {/* Tabs */}
//       <div className="tabs-container">

//         <button
//           className={`tab-item ${tab === "results" ? "active-tab" : ""}`}
//           onClick={() => setTab("results")}
//         >
//           Search Results
//         </button>

//         <button
//           className={`tab-item ${tab === "history" ? "active-tab" : ""}`}
//           onClick={() => setTab("history")}
//         >
//           History
//         </button>

//       </div>

//       {/* Results */}
//       <div className="content-area">

//         {tab === "results" && results.length > 0 ? (

//           <div className="todo-list">

//             {results.map((r, i) => (

//               <div key={i} className="todo-card">

//                 <pre>
//                   {JSON.stringify(r, null, 2)}
//                 </pre>

//               </div>

//             ))}

//           </div>

//         ) : null}

//         {tab === "history" && history.length > 0 ? (

//           <div className="todo-list">

//             {history.map((tx: any, i) => (

//               <div key={i} className="todo-card">

//                 <p><b>Tx ID:</b> {tx.transaction_id}</p>
//                 <p><b>Type:</b> {tx.name}</p>
//                 <p><b>Result:</b> {tx.result}</p>
//                 <p><b>Consensus:</b> {tx.consensus_timestamp}</p>

//               </div>

//             ))}

//           </div>

//         ) : (
//           <p className="empty-state">
//             No data found.
//           </p>
//         )}

//       </div>

//     </div>
//   );
// };

// export default DexScan;


// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "../Styles/TodoApp.css";

// interface DexScanProps {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
// }

// const DexScan = ({ accountId, evmAddress }: DexScanProps) => {

//   const [network, setNetwork] = useState<"mainnet" | "testnet">("testnet");
//   const [search, setSearch] = useState("");
//   const [results, setResults] = useState<any[]>([]);
//   const [history, setHistory] = useState<any[]>([]);
//   const [tab, setTab] = useState<"results" | "history">("results");

//   const baseURL =
//     network === "mainnet"
//       ? "https://mainnet.mirrornode.hedera.com/api/v1"
//       : "https://testnet.mirrornode.hedera.com/api/v1";

//   /*
//   -------------------------
//   SEARCH DETECTION
//   -------------------------
//   */
//   const searchQuery = async () => {

//     if (!search) return;

//     try {

//       const accountRegex = /^0\.0\.\d+$/;
//       const txRegex = /^0\.0\.\d+-\d+-\d+$/;
//       const evmRegex = /^0x[a-fA-F0-9]{40}$/;

//       let url = "";

//       if (txRegex.test(search)) {
//         url = `${baseURL}/transactions/${search}`;
//       }
//       else if (evmRegex.test(search)) {
//         url = `${baseURL}/accounts/${search}`;
//       }
//       else if (accountRegex.test(search)) {
//         url = `${baseURL}/accounts/${search}/transactions`;
//       }
//       else {
//         console.error("Unsupported search format");
//         return;
//       }

//       const res = await fetch(url);
//       const data = await res.json();

//       if (data.transactions) {
//         setResults(data.transactions);
//       } else {
//         setResults([data]);
//       }

//     } catch (err) {
//       console.error("Search error:", err);
//     }
//   };

//   /*
//   -------------------------
//   WALLET HISTORY
//   -------------------------
//   */

//   const fetchHistory = async () => {

//     if (!accountId) return;

//     try {

//       const res = await fetch(
//         `${baseURL}/accounts/${accountId}/transactions?limit=25&order=desc`
//       );

//       const data = await res.json();

//       setHistory(data.transactions || []);

//     } catch (err) {

//       console.error("History error:", err);

//     }

//   };

//   useEffect(() => {
//     fetchHistory();
//   }, [accountId, evmAddress, network]);

//   /*
//   -------------------------
//   UI
//   -------------------------
//   */

//   return (

//     <div className="todo-container">

//       <Link to="/ConnectWallet">
//         <img
//           width="35"
//           height="35"
//           src="https://img.icons8.com/nolan/64/left.png"
//           alt="back"
//         />
//       </Link>

//       <h2 className="header-title">Dex Scanner</h2>

//       {/* SEARCH BAR */}

//       <div className="input-group">

//         <select
//           value={network}
//           onChange={(e) => setNetwork(e.target.value as any)}
//         >
//           <option value="testnet">Testnet</option>
//           <option value="mainnet">Mainnet</option>
//         </select>

//         <input
//           className="main-input"
//           placeholder="Search tx / account / evm..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <button
//           className="add-btn"
//           onClick={searchQuery}
//         >
//           Search
//         </button>

//       </div>

//       {/* TABS */}

//       <div className="tabs-container">

//         <button
//           className={`tab-item ${tab === "results" ? "active-tab" : ""}`}
//           onClick={() => setTab("results")}
//         >
//           Search Results
//         </button>

//         <button
//           className={`tab-item ${tab === "history" ? "active-tab" : ""}`}
//           onClick={() => setTab("history")}
//         >
//           History
//         </button>

//       </div>

//       {/* CONTENT */}

//       <div className="content-area">

//         {/* SEARCH RESULTS */}

//         {tab === "results" && results.length > 0 ? (

//           <div className="todo-list">

//             {results.map((tx: any, i) => (

//               <div key={i} className="todo-card">

//                 {tx.transaction_id && (
//                   <p><b>Tx ID:</b> {tx.transaction_id}</p>
//                 )}

//                 {tx.name && (
//                   <p><b>Operation:</b> {tx.name}</p>
//                 )}

//                 {tx.result && (
//                   <p><b>Status:</b> {tx.result}</p>
//                 )}

//                 {tx.consensus_timestamp && (
//                   <p>
//                     <b>Time:</b>{" "}
//                     {new Date(
//                       Number(tx.consensus_timestamp.split(".")[0]) * 1000
//                     ).toLocaleString()}
//                   </p>
//                 )}

//                 {tx.transfers && tx.transfers.length > 0 && (
//                   <p>
//                     <b>Transfers:</b> {tx.transfers.length}
//                   </p>
//                 )}

//               </div>

//             ))}

//           </div>

//         ) : null}

//         {/* HISTORY */}

//         {tab === "history" && history.length > 0 ? (

//           <div className="todo-list">

//             {history.map((tx: any, i) => (

//               <div key={i} className="todo-card">

//                 <p><b>Tx ID:</b> {tx.transaction_id}</p>

//                 <p><b>Operation:</b> {tx.name}</p>

//                 <p><b>Status:</b> {tx.result}</p>

//                 <p>
//                   <b>Time:</b>{" "}
//                   {new Date(
//                     Number(tx.consensus_timestamp.split(".")[0]) * 1000
//                   ).toLocaleString()}
//                 </p>

//               </div>

//             ))}

//           </div>

//         ) : (
//           <p className="empty-state">
//             No data found.
//           </p>
//         )}

//       </div>

//     </div>

//   );
// };

// export default DexScan;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/DexScan.css";

interface DexScanProps {
  accountId: string | null;
  privateKey: string | null;
  evmAddress: string | null;
}

const DexScan = ({ accountId, evmAddress }: DexScanProps) => {

  const [network, setNetwork] = useState<"mainnet" | "testnet">("testnet");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [tab, setTab] = useState<"results" | "history">("results");

  const baseURL =
    network === "mainnet"
      ? "https://mainnet.mirrornode.hedera.com/api/v1"
      : "https://testnet.mirrornode.hedera.com/api/v1";

  /*
  -----------------------
  SEARCH FUNCTION
  -----------------------
  */

  // const searchQuery = async () => {

  //   if (!search) return;

  //   try {

  //     const accountRegex = /^0\.0\.\d+$/;
  //     const txRegex = /^0\.0\.\d+-\d+-\d+$/;
  //     const evmRegex = /^0x[a-fA-F0-9]{40}$/;

  //     let url = "";

  //     if (txRegex.test(search)) {
  //       url = `${baseURL}/transactions/${search}`;
  //     }
  //     else if (evmRegex.test(search)) {
  //       url = `${baseURL}/accounts/${search}`;
  //     }
  //     else if (accountRegex.test(search)) {
  //       url = `${baseURL}/accounts/${search}/transactions?limit=10&order=desc`;
  //     }
  //     else {
  //       console.warn("Invalid search format");
  //       return;
  //     }

  //     const res = await fetch(url);

  //     if (!res.ok) {
  //       console.error("Mirror node error:", res.status);
  //       return;
  //     }

  //     const data = await res.json();

  //     if (data.transactions) {
  //       setResults(data.transactions);
  //     } else {
  //       setResults([data]);
  //     }

  //   } catch (err) {
  //     console.error("Search error:", err);
  //   }
  // };
//   const searchQuery = async () => {

//   if (!search) return;

//   const query = search.trim();

//   try {

//     const accountRegex = /^0\.0\.\d+$/;
//     const txRegex = /^0\.0\.\d+@\d+\.\d+$/;
//     const evmRegex = /^0x[a-fA-F0-9]{40}$/;

//     let url = "";

//     if (txRegex.test(query)) {

//       url = `${baseURL}/transactions/${encodeURIComponent(query)}`;

//     }
//     else if (evmRegex.test(query)) {

//       url = `${baseURL}/accounts/${query}`;

//     }
//     else if (accountRegex.test(query)) {

//       url = `${baseURL}/transactions?account.id=${query}&limit=10&order=desc`;

//     }
//     else {

//       console.warn("Invalid search format:", query);
//       return;

//     }

//     const res = await fetch(url);

//     if (!res.ok) {
//       console.error("Mirror node error:", res.status);
//       return;
//     }

//     const data = await res.json();

//     if (data.transactions) {

//       setResults(data.transactions);

//     } else if (data.account) {

//       setResults([data]);

//     } else {

//       setResults([data]);

//     }

//   } catch (err) {

//     console.error("Search error:", err);

//   }

// };

// const searchQuery = async () => {
//   if (!search) return;

//   const query = search.trim();

//   try {
//     const accountRegex = /^0\.0\.\d+$/;            // Hedera account
//     const txIdRegex = /^0\.0\.\d+@\d+\.\d+$/;      // Hedera transaction ID
//     const evmRegex = /^0x[a-fA-F0-9]{40}$/;        // EVM address
//     const txHashRegex = /^[a-fA-F0-9]{64}$/;       // Hedera tx hash (32 bytes hex)

//     let url = "";

//     if (txIdRegex.test(query)) {
//       url = `${baseURL}/transactions?transactionId=${encodeURIComponent(query)}`;
//     } else if (txHashRegex.test(query)) {
//       url = `${baseURL}/transactions?transaction.hash=${query}`;
//     } else if (evmRegex.test(query)) {
//       url = `${baseURL}/accounts/${query}`;
//     } else if (accountRegex.test(query)) {
//       url = `${baseURL}/transactions?account.id=${query}&limit=10&order=desc`;
//     } else {
//       console.warn("Invalid search format:", query);
//       return;
//     }

//     const res = await fetch(url);

//     if (!res.ok) {
//       console.error("Mirror node error:", res.status);
//       return;
//     }

//     const data = await res.json();

//     if (data.transactions) {
//       setResults(data.transactions);
//     } else if (data.account) {
//       setResults([data]);
//     } else {
//       setResults([data]);
//     }

//   } catch (err) {
//     console.error("Search error:", err);
//   }
// };
// works
// const searchQuery = async () => {
//   if (!search) return;

//   const query = search.trim();
//   const accountRegex = /^0\.0\.\d+$/;
//   const txIdRegex = /^0\.0\.\d+@\d+\.\d+$/;
//   const evmRegex = /^0x[a-fA-F0-9]{40}$/;

//   let url = "";

//   if (txIdRegex.test(query)) {
//     // ✅ Correct: path parameter
//     url = `${baseURL}/transactions/${encodeURIComponent(query)}`;
//   } else if (evmRegex.test(query)) {
//     url = `${baseURL}/accounts/${query}`;
//   } else if (accountRegex.test(query)) {
//     url = `${baseURL}/transactions?account.id=${query}&limit=10&order=desc`;
//   } else {
//     console.warn("Invalid search format:", query);
//     return;
//   }

//   try {
//     const res = await fetch(url);
//     if (!res.ok) {
//       const text = await res.text();
//       console.error("Mirror node error:", res.status, text);
//       return;
//     }
//     const data = await res.json();
//     if (data.transactions) {
//       setResults(data.transactions);
//     } else if (data.account) {
//       setResults([data]);
//     } else {
//       setResults([data]);
//     }
//   } catch (err) {
//     console.error("Search error:", err);
//   }
// };

const searchQuery = async () => {
  if (!search) return;

  const query = search.trim();
  const accountRegex = /^0\.0\.\d+$/;               // Hedera account
  const txIdRegex = /^0\.0\.\d+[-@]\d+-\d+$/;       // Hedera tx ID
  const evmRegex = /^0x[a-fA-F0-9]{40}$/;           // EVM address

  let url = "";

  if (txIdRegex.test(query)) {
    const txIdMirror = query.replace("@", "-");     // convert @ → - for Mirror Node
    url = `${baseURL}/transactions/${encodeURIComponent(txIdMirror)}`;
  } else if (evmRegex.test(query)) {
    url = `${baseURL}/accounts/${query}`;
  } else if (accountRegex.test(query)) {
    url = `${baseURL}/transactions?account.id=${query}&limit=10&order=desc`;
  } else {
    console.warn("Invalid search format:", query);
    return;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error("Mirror node error:", res.status, text);
      return;
    }
    const data = await res.json();
    if (data.transactions) {
      setResults(data.transactions);
    } else if (data.account) {
      setResults([data]);
    } else {
      setResults([data]);
    }
  } catch (err) {
    console.error("Search error:", err);
  }
};

//   const searchQuery = async () => {

//   if (!search) return;

//   try {

//     const accountRegex = /^0\.0\.\d+$/;
//     const txRegex = /^0\.0\.\d+@\d+\.\d+$/;
//     const evmRegex = /^0x[a-fA-F0-9]{40}$/;

//     let url = "";

//     if (txRegex.test(search)) {

//       url = `${baseURL}/transactions?transactionId=${search}`;

//     }
//     else if (evmRegex.test(search)) {

//       url = `${baseURL}/accounts?account.evm_address=${search}`;

//     }
//     else if (accountRegex.test(search)) {

//       url = `${baseURL}/accounts/${search}/transactions?limit=10&order=desc`;

//     }
//     else {

//       console.warn("Invalid search format");
//       return;

//     }

//     const res = await fetch(url);

//     const data = await res.json();

//     if (data.transactions) {
//       setResults(data.transactions);
//     }
//     else if (data.accounts) {
//       setResults(data.accounts);
//     }
//     else {
//       setResults([data]);
//     }

//   } catch (err) {

//     console.error("Search error:", err);

//   }
// };

//             const searchQuery = async () => {

//   if (!search) return;

//   try {

//     const accountRegex = /^0\.0\.\d+$/;
//     const txRegex = /^0\.0\.\d+@\d+\.\d+$/;
//     const evmRegex = /^0x[a-fA-F0-9]{40}$/;

//     let url = "";

//     if (txRegex.test(search)) {

//       url = `${baseURL}/transactions?transactionId=${search}`;

//     }
//     else if (evmRegex.test(search)) {

//       url = `${baseURL}/accounts?account.evm_address=${search}`;

//     }
//     else if (accountRegex.test(search)) {

//       url = `${baseURL}/accounts/${search}/transactions?limit=10&order=desc`;

//     }
//     else {

//       console.warn("Invalid search format");
//       return;

//     }

//     const res = await fetch(url);

//     if (!res.ok) {
//       console.error("Mirror node error:", res.status);
//       return;
//     }

//     const data = await res.json();

//     if (data.transactions) {

//       setResults(data.transactions);

//     } else if (data.accounts) {

//       setResults(data.accounts);

//     } else {

//       setResults([data]);

//     }

//   } catch (err) {

//     console.error("Search error:", err);

//   }

// };
  /*
  -----------------------
  FETCH WALLET HISTORY
  -----------------------
  */

  const fetchHistory = async () => {

    if (!accountId) return;

    const accountRegex = /^0\.0\.\d+$/;

    if (!accountRegex.test(accountId)) {
      console.warn("Invalid accountId:", accountId);
      return;
    }

    try {

      // const url = `${baseURL}/accounts/${accountId}/transactions?limit=20&order=desc`;
      const url = `${baseURL}/transactions?account.id=${accountId}&limit=20&order=desc`;

      const res = await fetch(url);

      if (!res.ok) {
        console.error("Mirror node error:", res.status);
        return;
      }

      const data = await res.json();
      console.log("data:", data);
      setHistory(data.transactions || []);
      console.log("Fetching history for:", accountId);

    } catch (err) {

      console.error("History fetch error:", err);

    }

  };

  
  const getHashscanUrl = (txId: string) => {
  return `https://hashscan.io/${network}/transaction/${txId}`;
};

  useEffect(() => {
    fetchHistory();
  }, [accountId, evmAddress, network]);

  /*
  -----------------------
  UI
  -----------------------
  */

  return (

    <div className="dex-container">

      <Link to="/ConnectWallet">← Back</Link>

      <h2>Dex Scanner</h2>

      {/* SEARCH BAR */}

      <div className="top-bar">

        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value as any)}
        >
          <option value="testnet">Testnet</option>
          <option value="mainnet">Mainnet</option>
        </select>

        <input
          placeholder="Search tx / account / evm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={searchQuery}>
          Search
        </button>

      </div>

      {/* TABS */}

      <div className="tabs">

        <button
          className={tab === "results" ? "active" : ""}
          onClick={() => setTab("results")}
        >
          Search Results
        </button>

        <button
          className={tab === "history" ? "active" : ""}
          onClick={() => setTab("history")}
        >
          History
        </button>

      </div>

      {/* RESULTS AREA */}

      <div className="results-container">

        {/* SEARCH RESULTS */}

        {tab === "results" && results.length > 0 &&

          results.map((item, i) => (

            <div key={i} className="token-card">

              <div>

                {item.transaction_id && (
                  <p><b>Tx:</b> {item.transaction_id}</p>
                )}

                {item.name && (
                  <p><b>Operation:</b> {item.name}</p>
                )}

                {item.result && (
                  <p><b>Status:</b> {item.result}</p>
                )}

                {item.consensus_timestamp && (
                  <p><b>Time:</b> {item.consensus_timestamp}</p>
                )}

                {item.account && (
                  <p><b>Account:</b> {item.account}</p>
                )}

              </div>

              <div className="more-class">
              <a
  className="more"
  href={getHashscanUrl(item.transaction_id)}
  target="_blank"
  rel="noopener noreferrer"
>
  more
</a>  </div>

            </div>

          ))
        }

        {/* HISTORY */}

        {tab === "history" && history.length > 0 &&

          history.map((tx, i) => (

            <div key={i} className="history-item">

              <p><b>Tx:</b> {tx.transaction_id}</p>
              <p><b>Operation:</b> {tx.name}</p>
              <p><b>Status:</b> {tx.result}</p>
              <p><b>Time:</b> {tx.consensus_timestamp}</p>

               <div className="more-class">
              <a
  className="more"
  href={getHashscanUrl(tx.transaction_id)}
  target="_blank"
  rel="noopener noreferrer"
>
  more
</a>
            </div>

            </div>

           
            

          ))
        }

        {(tab === "results" && results.length === 0) ||
        (tab === "history" && history.length === 0) ? (
          <p>No data found</p>
        ) : null}

      </div>

    </div>
  );
};

export default DexScan;


// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "../Styles/DexScan.css";

// interface DexScanProps {
//   accountId: string | null;
//   evmAddress: string | null;
// }

// const DexScan = ({ accountId, evmAddress }: DexScanProps) => {

//   const [network, setNetwork] = useState<"mainnet" | "testnet">("testnet");
//   const [search, setSearch] = useState("");

//   const [results, setResults] = useState<any[]>([]);
//   const [history, setHistory] = useState<any[]>([]);
//   const [tokens, setTokens] = useState<any[]>([]);

//   const [balance, setBalance] = useState<number | null>(null);

//   const [tab, setTab] = useState<"results" | "history" | "tokens">("results");

//   const [nextPage, setNextPage] = useState<string | null>(null);

//   const [selectedTx, setSelectedTx] = useState<any>(null);

//   const baseURL =
//     network === "mainnet"
//       ? "https://mainnet.mirrornode.hedera.com/api/v1"
//       : "https://testnet.mirrornode.hedera.com/api/v1";

//   /*
//   -----------------------
//   UNIVERSAL SEARCH
//   -----------------------
//   */

//   const searchQuery = async () => {

//     if (!search) return;

//     try {

//       const accountRegex = /^0\.0\.\d+$/;
//       const txRegex = /^0\.0\.\d+@\d+\.\d+$/;
//       const evmRegex = /^0x[a-fA-F0-9]{40}$/;

//       let url = "";

//       if (txRegex.test(search)) {

//         url = `${baseURL}/transactions?transactionId=${search}`;

//       }
//       else if (evmRegex.test(search)) {

//         url = `${baseURL}/accounts?account.evm_address=${search}`;

//       }
//       else if (accountRegex.test(search)) {

//         url = `${baseURL}/accounts/${search}/transactions?limit=10&order=desc`;

//       }
//       else {

//         console.warn("Invalid search format");
//         return;

//       }

//       const res = await fetch(url);

//       if (!res.ok) {

//         console.error("Mirror node error:", res.status);
//         return;

//       }

//       const data = await res.json();

//       if (data.transactions) {

//         setResults(data.transactions);
//         setNextPage(data.links?.next || null);

//       }
//       else if (data.accounts) {

//         setResults(data.accounts);

//       }
//       else {

//         setResults([data]);

//       }

//       setTab("results");

//     } catch (err) {

//       console.error("Search error:", err);

//     }

//   };

//   /*
//   -----------------------
//   FETCH WALLET HISTORY
//   -----------------------
//   */

//   const fetchHistory = async () => {

//     if (!accountId) return;

//     try {

//       const res = await fetch(
//         `${baseURL}/accounts/${accountId}/transactions?limit=10&order=desc`
//       );

//       if (!res.ok) return;

//       const data = await res.json();

//       setHistory(data.transactions || []);
//       setNextPage(data.links?.next || null);

//     } catch (err) {

//       console.error("History error:", err);

//     }

//   };

//   /*
//   -----------------------
//   FETCH BALANCE
//   -----------------------
//   */

//   const fetchBalance = async () => {

//     if (!accountId) return;

//     try {

//       const res = await fetch(`${baseURL}/accounts/${accountId}`);

//       const data = await res.json();

//       setBalance(data.balance?.balance);

//     } catch (err) {

//       console.error("Balance error:", err);

//     }

//   };

//   /*
//   -----------------------
//   FETCH TOKENS
//   -----------------------
//   */

//   const fetchTokens = async () => {

//     if (!accountId) return;

//     try {

//       const res = await fetch(`${baseURL}/accounts/${accountId}/tokens`);

//       const data = await res.json();

//       setTokens(data.tokens || []);

//       setTab("tokens");

//     } catch (err) {

//       console.error("Token fetch error:", err);

//     }

//   };

//   /*
//   -----------------------
//   PAGINATION
//   -----------------------
//   */

//   const loadMore = async () => {

//     if (!nextPage) return;

//     try {

//       const res = await fetch(baseURL + nextPage);

//       const data = await res.json();

//       setResults(prev => [...prev, ...(data.transactions || [])]);

//       setNextPage(data.links?.next || null);

//     } catch (err) {

//       console.error("Pagination error:", err);

//     }

//   };

//   /*
//   -----------------------
//   AUTO REFRESH
//   -----------------------
//   */

//   useEffect(() => {

//     fetchHistory();
//     fetchBalance();

//   }, [accountId, network]);

//   useEffect(() => {

//     const interval = setInterval(() => {

//       fetchHistory();

//     }, 10000);

//     return () => clearInterval(interval);

//   }, [accountId, network]);

//   /*
//   -----------------------
//   UI
//   -----------------------
//   */

//   return (

//     <div className="dex-container">

//       <Link to="/ConnectWallet">← Back</Link>

//       <h2>Dex Scanner</h2>

//       {/* NETWORK + SEARCH */}

//       <div className="top-bar">

//         <select
//           value={network}
//           onChange={(e) => setNetwork(e.target.value as any)}
//         >
//           <option value="testnet">Testnet</option>
//           <option value="mainnet">Mainnet</option>
//         </select>

//         <input
//           placeholder="Search account / tx / evm..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <button onClick={searchQuery}>
//           Search
//         </button>

//       </div>

//       {/* WALLET INFO */}

//       {accountId && (

//         <div className="wallet-box">

//           <p><b>Account:</b> {accountId}</p>

//           {evmAddress && (
//             <p><b>EVM:</b> {evmAddress}</p>
//           )}

//           {balance !== null && (
//             <p><b>HBAR:</b> {balance / 100000000} ℏ</p>
//           )}

//           <button onClick={fetchTokens}>
//             View Tokens
//           </button>

//         </div>

//       )}

//       {/* TABS */}

//       <div className="tabs">

//         <button
//           className={tab === "results" ? "active" : ""}
//           onClick={() => setTab("results")}
//         >
//           Search Results
//         </button>

//         <button
//           className={tab === "history" ? "active" : ""}
//           onClick={() => setTab("history")}
//         >
//           History
//         </button>

//         <button
//           className={tab === "tokens" ? "active" : ""}
//           onClick={() => setTab("tokens")}
//         >
//           Tokens
//         </button>

//       </div>

//       {/* RESULTS */}

//       <div className="results-container">

//         {tab === "results" && results.map((item, i) => (

//           <div
//             key={i}
//             className="token-card"
//             onClick={() => setSelectedTx(item)}
//           >

//             {item.transaction_id && (
//               <p><b>Tx:</b> {item.transaction_id}</p>
//             )}

//             {item.name && (
//               <p><b>Type:</b> {item.name}</p>
//             )}

//             {item.result && (
//               <p><b>Status:</b> {item.result}</p>
//             )}

//             {item.consensus_timestamp && (
//               <p><b>Time:</b> {item.consensus_timestamp}</p>
//             )}

//           </div>

//         ))}

//         {/* HISTORY */}

//         {tab === "history" && history.map((tx, i) => (

//           <div
//             key={i}
//             className="history-item"
//             onClick={() => setSelectedTx(tx)}
//           >

//             <p><b>Tx:</b> {tx.transaction_id}</p>
//             <p><b>Type:</b> {tx.name}</p>
//             <p><b>Status:</b> {tx.result}</p>
//             <p><b>Time:</b> {tx.consensus_timestamp}</p>

//           </div>

//         ))}

//         {/* TOKENS */}

//         {tab === "tokens" && tokens.map((token, i) => (

//           <div key={i} className="token-card">

//             <p><b>Token:</b> {token.token_id}</p>
//             <p><b>Balance:</b> {token.balance}</p>

//           </div>

//         ))}

//         {/* PAGINATION */}

//         {nextPage && (
//           <button onClick={loadMore}>
//             Load More
//           </button>
//         )}

//         {/* EMPTY */}

//         {((tab === "results" && results.length === 0) ||
//           (tab === "history" && history.length === 0) ||
//           (tab === "tokens" && tokens.length === 0)) && (

//           <p>No data found</p>

//         )}

//       </div>

//       {/* TX DETAIL PANEL */}

//       {selectedTx && (

//         <div className="tx-detail">

//           <h3>Transaction Details</h3>

//           <p><b>ID:</b> {selectedTx.transaction_id}</p>
//           <p><b>Status:</b> {selectedTx.result}</p>
//           <p><b>Type:</b> {selectedTx.name}</p>
//           <p><b>Timestamp:</b> {selectedTx.consensus_timestamp}</p>

//           <button onClick={() => setSelectedTx(null)}>
//             Close
//           </button>

//         </div>

//       )}

//     </div>

//   );

// };

// export default DexScan;