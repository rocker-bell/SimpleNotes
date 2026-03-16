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

// interface ConnectWalletProps {
//   accountId: string | null;
//   privateKey: string | null;
//    evmAddress: string | null;
//   setAccountId: React.Dispatch<React.SetStateAction<string | null>>;
//   setPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
//   setEvmAddress: React.Dispatch<React.SetStateAction<string | null>>; // ✅ add this

  
// }

interface ConnectWalletProps {
  accountId: string | null;
  privateKey: string | null;
  evmAddress: string | null;
  setAccountId: React.Dispatch<React.SetStateAction<string | null>>;
  setPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
  setEvmAddress: React.Dispatch<React.SetStateAction<string | null>>;
  accounts: { accountId: string; privateKey: string; evmAddress: string }[]; // type accounts
  activeAccount: number | null; // index of active wallet
  autoConnect: boolean; // ✅ new
  setAutoConnect: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConnectHederaAccount: React.FC<ConnectWalletProps> = ({
  accountId,
  privateKey,
  evmAddress,
  setAccountId,
  setPrivateKey,
  setEvmAddress,
    accounts,
  activeAccount,
  autoConnect,
  setAutoConnect
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

  useEffect(() => {
  if (activeAccount !== null && accounts[activeAccount]) {
    const acc = accounts[activeAccount];
    setAccountId(acc.accountId);
    setPrivateKey(acc.privateKey);
    setEvmAddress(acc.evmAddress);
  }
}, [activeAccount, accounts]);

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

  const handleDexScannLink = () => {
    navigate("/DexScan")
  }

  const handleHCManagerLink = () => {
    navigate("/HCmanager")
  }

  const handleHCAIhelperLink = () => {
    navigate("/HCAIhelper")
  }



  type CopyField = "accountId" | "privateKey" | "evmAddress";

const [copied, setCopied] = useState<CopyField | "">("");

const copyToClipboard = async (text: string, field: CopyField) => {
  await navigator.clipboard.writeText(text);
  setCopied(field);

  setTimeout(() => {
    setCopied("");
  }, 2000);
};

useEffect(() => {
  if (autoConnect && accountId && privateKey && !hasConnected) {
    connectAccount();
    setAutoConnect(false); // reset flag
  }
}, [autoConnect, accountId, privateKey]);

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

      {/* {accountId && (
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
      )} */}

      {accountId && (
  <div className="info">
    <div className="wallet-info-container">
    <p className="container-paragraph">
      <strong>Account ID:</strong> {maskAccountId(accountId)}
      <button onClick={() => copyToClipboard(accountId ?? "", "accountId")}>
        {copied === "accountId" ? "📋 Copied" : "📋"}
      </button>
    </p>
    </div>
        <div className="wallet-info-container">
    <p className="container-paragraph">
      <strong>Private Key:</strong> {maskPrivateKey(privateKey ?? "")}
      <button onClick={() => copyToClipboard(privateKey ?? "", "privateKey")}>
        {copied === "privateKey" ? "📋 Copied" : "📋"}
      </button>
    </p>
    </div>
  </div>
)}

      {balance && (
        <p className="info">
          <strong>Balance:</strong> {balance} HBAR
        </p>
      )}

      {evmAddress && (
        <p className="wallet-info-container info">
          <strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}
          <button  onClick={() => copyToClipboard(evmAddress, "evmAddress")}>
            
            {copied === "evmAddress" ? "📋 Copied" : "📋"}
          </button>
        </p>
      )}

      <div className="apps-container">
        <span className="more-apps">
          <Link to="/Myapps" className="Myapps-link">
          more <img width="25" height="25" src="https://img.icons8.com/office/40/forward--v1.png" alt="forward--v1"/>
          </Link>
        </span>
        <div className="general-appbox">
          
        <div className="app-box" onClick={handleTodoLink}>
          <img src={todoapp_icon} alt="" className="app-image" />
          <p className="app-title">todoApp</p>
        </div>
        <div className="app-box" onClick={handlechatboxLink}>
            <img width="48" height="48" src="https://img.icons8.com/fluency/48/speech-bubble-with-dots--v1.png" alt="speech-bubble-with-dots--v1"/>
          <p className="app-title">chatbox</p>
        </div>
         <div className="app-box" onClick={handleDexScannLink}>
            <img width="48" height="48" src="https://img.icons8.com/liquid-glass/48/google-web-search.png" alt="google-web-search"/>
          <p className="app-title">DexScann</p>
        </div>
        <div className="app-box" onClick={handleHCManagerLink}>
            <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/test-account.png" alt="test-account"/>
          <p className="app-title">HCManager</p>
        </div>
         <div className="app-box" onClick={handleHCAIhelperLink}>
                <img width="48" height="48" src="https://img.icons8.com/pulsar-color/48/bard.png" alt="bard"/>
            <p className="app-title">HCAIhelper</p>
        </div>
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