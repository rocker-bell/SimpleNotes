// import {Link} from "react-router-dom";
// const HbarAccountManager = () => {
//     return (
//         <>
//             <div className="HCManager_wrapper">
//                 <Link to="/ConnectWallet">
//             <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
//       </Link>
//       <h2>Welcome to account Manager</h2>
//             </div>
//         </>
//     )
// }


// export default HbarAccountManager;

// import { Link } from "react-router-dom";
// import { useState } from "react";

// type Props = {
//   accounts: any[]
//   setAccounts: any
//   activeAccount: number | null
//   setActiveAccount: any
// }

// const HbarAccountManager = ({
//   accounts,
//   setAccounts,
//   activeAccount,
//   setActiveAccount
// }: Props) => {

//   const [accountIdInput, setAccountIdInput] = useState("")
//   const [privateKeyInput, setPrivateKeyInput] = useState("")

//   const importWallet = () => {

//     if (!accountIdInput || !privateKeyInput) {
//       alert("Enter accountId and private key")
//       return
//     }

//     const newWallet = {
//       accountId: accountIdInput,
//       privateKey: privateKeyInput,
//       evmAddress: "" // optional if you compute later
//     }

//     setAccounts((prev:any[]) => [...prev, newWallet])

//     setAccountIdInput("")
//     setPrivateKeyInput("")
//   }

//   return (
//     <>
//       <div className="HCManager_wrapper">

//         <Link to="/ConnectWallet">
//           <img
//             width="35"
//             height="35"
//             src="https://img.icons8.com/nolan/64/left.png"
//             alt="left"
//           />
//         </Link>

//         <h2>Welcome to Account Manager</h2>

//         {/* IMPORT WALLET */}

//         <div style={{marginTop:"20px"}}>

//           <h3>Import Wallet</h3>

//           <input
//             type="text"
//             placeholder="Account ID"
//             value={accountIdInput}
//             onChange={(e)=>setAccountIdInput(e.target.value)}
//           />

//           <input
//             type="text"
//             placeholder="Private Key"
//             value={privateKeyInput}
//             onChange={(e)=>setPrivateKeyInput(e.target.value)}
//           />

//           <button onClick={importWallet}>
//             Import Wallet
//           </button>

//         </div>

//         {/* WALLET LIST */}

//         <div style={{marginTop:"30px"}}>

//           <h3>Saved Wallets</h3>

//           {accounts.length === 0 && <p>No wallets saved</p>}

//           {accounts.map((acc:any,index:number)=>(
//             <div key={index} style={{
//               border:"1px solid #ccc",
//               padding:"10px",
//               marginBottom:"10px"
//             }}>

//               <p><b>ID:</b> {acc.accountId}</p>

//               {activeAccount === index && (
//                 <p style={{color:"green"}}>Active Wallet</p>
//               )}

//               <button onClick={()=>setActiveAccount(index)}>
//                 Use Wallet
//               </button>

//             </div>
//           ))}

//         </div>

//       </div>
//     </>
//   )
// }

// export default HbarAccountManager


// import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { saveAccounts, loadAccounts } from "../utils/storage";

// type HederaAccount = {
//   accountId: string;
//   privateKey: string;
//   evmAddress: string;
// };

// type Props = {
//   accounts: HederaAccount[];
//   setAccounts: React.Dispatch<React.SetStateAction<HederaAccount[]>>;
//   activeAccount: number | null;
//   setActiveAccount: React.Dispatch<React.SetStateAction<number | null>>;
//   clearAccount: () => void; // ✅ new prop
//   connectAccount: (account: HederaAccount) => void; // ✅ correct
//   onUseWallet: (index: number) => void; // ✅ need this
// };

// const HbarAccountManager = ({
//   accounts,
//   setAccounts,
//   activeAccount,
//   // setActiveAccount,
//   // clearAccount,
//   // connectAccount,
//   onUseWallet // ✅ need this
// }: Props) => {
//   const [accountIdInput, setAccountIdInput] = useState("");
//   const [privateKeyInput, setPrivateKeyInput] = useState("");

//   // Load accounts from storage if empty
//   useEffect(() => {
//     const init = async () => {
//       if (accounts.length === 0) {
//         const stored = await loadAccounts();
//         setAccounts(stored);
//       }
//     };
//     init();
//   }, []);

//   // Save accounts to storage whenever they change
//   useEffect(() => {
//     saveAccounts(accounts);
//   }, [accounts]);

//   const importWallet = () => {
//     if (!accountIdInput || !privateKeyInput) {
//       alert("Enter accountId and private key");
//       return;
//     }

//     const newWallet: HederaAccount = {
//       accountId: accountIdInput,
//       privateKey: privateKeyInput,
//       evmAddress: "" // optional, can compute later
//     };

//     setAccounts((prev) => [...prev, newWallet]);
//     setAccountIdInput("");
//     setPrivateKeyInput("");
//   };

//   return (
//     <div className="HCManager_wrapper">
//       <Link to="/ConnectWallet">
//         <img
//           width="35"
//           height="35"
//           src="https://img.icons8.com/nolan/64/left.png"
//           alt="left"
//         />
//       </Link>

//       <h2>Welcome to Account Manager</h2>

//       {/* IMPORT WALLET */}
//       <div style={{ marginTop: "20px" }}>
//         <h3>Import Wallet</h3>
//         <input
//           type="text"
//           placeholder="Account ID"
//           value={accountIdInput}
//           onChange={(e) => setAccountIdInput(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Private Key"
//           value={privateKeyInput}
//           onChange={(e) => setPrivateKeyInput(e.target.value)}
//         />
//         <button onClick={importWallet}>Import Wallet</button>
//       </div>

//       {/* WALLET LIST */}
//       <div style={{ marginTop: "30px" }}>
//         <h3>Saved Wallets</h3>
//         {accounts.length === 0 && <p>No wallets saved</p>}

//         {accounts.map((acc, index) => (
//           <div
//             key={index}
//             style={{
//               border: "1px solid #ccc",
//               padding: "10px",
//               marginBottom: "10px"
//             }}
//           >
//             <p>
//               <b>ID:</b> {acc.accountId}
//             </p>

//             {activeAccount === index && <p style={{ color: "green" }}>Active Wallet</p>}

//             <button
//  onClick={() => onUseWallet(index)}
// >
//   Use Wallet
// </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HbarAccountManager;


import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { saveAccounts, loadAccounts } from "../utils/storage";
import "../Styles/HbarAccountManager.css";

type HederaAccount = {
  accountId: string;
  privateKey: string;
  evmAddress: string;
};

type Props = {
  accounts: HederaAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<HederaAccount[]>>;
  activeAccount: number | null;
  setActiveAccount: React.Dispatch<React.SetStateAction<number | null>>;
  clearAccount: () => void;
  connectAccount: (account: HederaAccount) => void;
  onUseWallet: (index: number) => void;
};

const HbarAccountManager = ({
  accounts,
  setAccounts,
  activeAccount,
  onUseWallet
}: Props) => {

  const [accountIdInput, setAccountIdInput] = useState("");
  const [privateKeyInput, setPrivateKeyInput] = useState("");

  useEffect(() => {
    const init = async () => {
      if (accounts.length === 0) {
        const stored = await loadAccounts();
        setAccounts(stored);
      }
    };
    init();
  }, []);

  useEffect(() => {
    saveAccounts(accounts);
  }, [accounts]);

  const importWallet = () => {
    if (!accountIdInput || !privateKeyInput) {
      alert("Enter accountId and private key");
      return;
    }

    const newWallet: HederaAccount = {
      accountId: accountIdInput,
      privateKey: privateKeyInput,
      evmAddress: ""
    };

    setAccounts((prev) => [...prev, newWallet]);
    setAccountIdInput("");
    setPrivateKeyInput("");
  };

  return (
    <div className="HCManager_wrapper">

      <div className="HCManager_header">
        <Link to="/ConnectWallet" className="back_btn">
          ←
        </Link>
        <h2>Account Manager</h2>
      </div>

      {/* IMPORT WALLET */}
      <div className="import_section">

        <h3>Import Wallet</h3>

        <input
          type="text"
          placeholder="Account ID"
          value={accountIdInput}
          onChange={(e) => setAccountIdInput(e.target.value)}
        />

        <input
          type="text"
          placeholder="Private Key"
          value={privateKeyInput}
          onChange={(e) => setPrivateKeyInput(e.target.value)}
        />

        <button onClick={importWallet} className="import_btn">
          Import Wallet
        </button>

      </div>

      {/* WALLET LIST */}

      <div className="wallet_list">

        <h3>Saved Wallets</h3>

        {accounts.length === 0 && <p className="empty">No wallets saved</p>}

        {accounts.map((acc, index) => (

          <div key={index} className="wallet_card">

            <p>
              <b>ID:</b> {acc.accountId}
            </p>

            {activeAccount === index && (
              <p className="active_wallet">Active Wallet</p>
            )}

            <button
              onClick={() => onUseWallet(index)}
              className="use_wallet_btn"
            >
              Use Wallet
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default HbarAccountManager;