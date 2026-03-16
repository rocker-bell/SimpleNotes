// import {Routes, Route} from "react-router-dom";
// import DappStructure from "./Components/DappStructure.tsx";
// import CreateHederaAccount from "./Components/CreateAccount.tsx";
// import ConnectHederaAccount from "./Components/ConnectWallet.tsx";
// import { ToastContainer} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import TodoApp from "./Components/TodoApp.tsx"

// const App = () => {
//   return (
//      <>
//          <ToastContainer position="top-right" />
//         <Routes>
           
//             <Route path="/" element={<DappStructure/>}/>
//             <Route path="/CreateAccount" element={<CreateHederaAccount/>}/>
//             <Route path="/ConnectWallet" element={<ConnectHederaAccount/>} />
//             <Route path="/todoApp" element={<TodoApp />} />
//         </Routes>
//      </>

//   )
 
// }

// export default App;


// import { Routes, Route } from "react-router-dom";
// import DappStructure from "./Components/DappStructure.tsx";
// import CreateHederaAccount from "./Components/CreateAccount.tsx";
// import ConnectHederaAccount from "./Components/ConnectWallet.tsx";
// import TodoApp from "./Components/TodoApp.tsx";
// import { ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { useState } from "react";

// const App = () => {
//   // shared state
//   const [accountId, setAccountId] = useState<string | null>(null);
//   const [privateKey, setPrivateKey] = useState<string | null>(null);

//   return (
//     <>
//       <ToastContainer position="top-right" />
//       <Routes>
//         <Route path="/" element={<DappStructure />} />
//         <Route path="/CreateAccount" element={<CreateHederaAccount />} />
//         <Route 
//           path="/ConnectWallet" 
//           element={
//             <ConnectHederaAccount 
//               accountId={accountId}
//               privateKey={privateKey}
//               setAccountId={setAccountId}
//               setPrivateKey={setPrivateKey}
//             />
//           } 
//         />
//         <Route 
//           path="/todoApp" 
//           element={
//             <TodoApp
//               accountId={accountId}
//               privateKey={privateKey}
//             />
//           } 
//         />
//       </Routes>
//     </>
//   )
// }

// export default App;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadAccounts,
  saveAccounts,
  loadActiveAccount,
  saveActiveAccount
} from "./utils/storage"

import { Routes, Route } from "react-router-dom";
import DappStructure from "./Components/DappStructure.tsx";
import CreateHederaAccount from "./Components/CreateAccount.tsx";
import ConnectHederaAccount from "./Components/ConnectWallet.tsx";
import TodoApp from "./Components/TodoApp.tsx";
import Chatbox from "./Components/Chatbox.tsx";
import DexScan from "./Components/DexScan.tsx";
import HCAIhelper from "./Components/HCAIhelper.tsx";
// import HCAIhelper from "./Components/AI_Chatbox.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HbarAccountManager from "./Components/HbarAccountManager.tsx";
import Myapps from "./Components/Myapps.tsx"
const App = () => {
  const navigate = useNavigate()
  // shared wallet state
  const [accountId, setAccountId] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [autoConnect, setAutoConnect] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([])
const [activeAccount, setActiveAccount] = useState<number | null>(null)


useEffect(() => {
  const initWallet = async () => {
    const storedAccounts = await loadAccounts()
    const activeIndex = await loadActiveAccount()

    setAccounts(storedAccounts)
    setActiveAccount(activeIndex)
  }

  initWallet()
}, [])

useEffect(() => {
  saveAccounts(accounts)
}, [accounts])

useEffect(() => {
  if (activeAccount !== null) {
    saveActiveAccount(activeAccount)
  }
}, [activeAccount])

// useEffect(() => {
//   if (activeAccount !== null && accounts[activeAccount]) {
//     const acc = accounts[activeAccount]
//     setAccountId(acc.accountId)
//     setPrivateKey(acc.privateKey)
//     setEvmAddress(acc.evmAddress)
//   }
// }, [activeAccount, accounts])

const clearAccount = () => {
  setAccountId(null);
  setPrivateKey(null);
  setEvmAddress(null);
  localStorage.removeItem("hedera_account_id");
};

const connectAccount = async (acc?: { accountId: string; privateKey: string }) => {
    try {
      const a = acc || (activeAccount !== null ? accounts[activeAccount] : null);
      if (!a) return;

      const { AccountId, PrivateKey, Client, AccountBalanceQuery } = await import("@hashgraph/sdk");
      const parsedAccountId = AccountId.fromString(a.accountId);
      const parsedPrivateKey = PrivateKey.fromStringECDSA(a.privateKey);

      const client =
        import.meta.env.VITE_NETWORK === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();
      client.setOperator(parsedAccountId, parsedPrivateKey);

      const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
      const accountBalance = await balanceQuery.execute(client);

      setAccountId(a.accountId);
      setPrivateKey(a.privateKey);
      setEvmAddress("0x" + parsedAccountId.toSolidityAddress());
      console.log("Connected. Balance:", accountBalance.hbars.toString());
      localStorage.setItem("hedera_account_id", a.accountId);
    } catch (err) {
      console.error("Failed to connect account:", err);
    }
  };

  const handleUseWallet = (index: number) => {
  clearAccount();                   // disconnect old wallet
  setActiveAccount(index);          // set new active wallet
  connectAccount(accounts[index]);  // connect new wallet
  navigate('/ConnectWallet')
};

  return (
    <>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/Myapps" element={<Myapps/>}/>
        <Route path="/" element={<DappStructure />} />
        <Route path="/CreateAccount" element={<CreateHederaAccount />} />
        <Route
  path="/DexScan"
  element={
    <DexScan
      accountId={accountId}
      privateKey={privateKey}
      evmAddress={evmAddress}
    />
  }
/>
       {/* <Route
  path="/ConnectWallet"
  element={
    <ConnectHederaAccount
      accountId={accountId}
      privateKey={privateKey}
      evmAddress={evmAddress}
      setAccountId={setAccountId}
      setPrivateKey={setPrivateKey}
      setEvmAddress={setEvmAddress} // ✅ pass the setter
    />
  }
/> */}
        <Route
  path="/ConnectWallet"
  element={
    <ConnectHederaAccount
      accountId={accountId}
      privateKey={privateKey}
      evmAddress={evmAddress}
      setAccountId={setAccountId}
      setPrivateKey={setPrivateKey}
      setEvmAddress={setEvmAddress}
      accounts={accounts}           // pass accounts
      activeAccount={activeAccount} // pass 
      autoConnect={autoConnect}
      setAutoConnect={setAutoConnect}
    />
  }
/>
        <Route
          path="/todoApp"
          element={<TodoApp accountId={accountId} privateKey={privateKey}  evmAddress={evmAddress} />}
        />
        {/* <Route path="chatbox" element={<Chatbox/>} /> */}
          <Route
          path="/chatbox"
          element={<Chatbox accountId={accountId} privateKey={privateKey} evmAddress={evmAddress} />}
        />
        {/* <Route path="/HCmanager" element={<HbarAccountManager />} />
        
        */}

        {/* <Route
  path="/HCmanager"
  element={
    <HbarAccountManager
      accounts={accounts}
      setAccounts={setAccounts}
      activeAccount={activeAccount}
      setActiveAccount={setActiveAccount} // just pass the setter
      clearAccount={clearAccount}        // ✅ pass clearAccount
    />
  }
/> */}  

            { <Route
  path="/HCmanager"
  element={
    <HbarAccountManager
      accounts={accounts}
      setAccounts={setAccounts}
      activeAccount={activeAccount}
      setActiveAccount={setActiveAccount} // ✅ keep it
      onUseWallet={handleUseWallet}       // ✅ wrapper for full logic
      clearAccount={clearAccount}
      connectAccount={connectAccount}
    />
  }
/> }

                {/* <Route
  path="/HCmanager"
  element={
    <HbarAccountManager
      accounts={accounts}
      setAccounts={setAccounts}
      activeAccount={activeAccount}
      setActiveAccount={setActiveAccount}
      clearAccount={clearAccount}
      connectAccount={connectAccount} // pass your connect function
    />
  }
/> */}
        <Route path="/HCAIhelper" element={<HCAIhelper 
              accountId={accountId}
              privateKey={privateKey}
              evmAddress={evmAddress} />} />
        {/* <Route
          path="/HCAIhelper"
          element={
            <HCAIhelper
              accountId={accountId}
              privateKey={privateKey}
              evmAddress={evmAddress}
            />
          }
        /> */}
      </Routes>
    </>
  );
};

export default App;