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

