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

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import DappStructure from "./Components/DappStructure.tsx";
import CreateHederaAccount from "./Components/CreateAccount.tsx";
import ConnectHederaAccount from "./Components/ConnectWallet.tsx";
import TodoApp from "./Components/TodoApp.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // shared wallet state
  const [accountId, setAccountId] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  return (
    <>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={<DappStructure />} />
        <Route path="/CreateAccount" element={<CreateHederaAccount />} />
        <Route
          path="/ConnectWallet"
          element={
            <ConnectHederaAccount
              accountId={accountId}
              privateKey={privateKey}
              setAccountId={setAccountId}
              setPrivateKey={setPrivateKey}
            />
          }
        />
        <Route
          path="/todoApp"
          element={<TodoApp accountId={accountId} privateKey={privateKey} />}
        />
      </Routes>
    </>
  );
};

export default App;