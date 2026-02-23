import {Routes, Route} from "react-router-dom";
import DappStructure from "./Components/DappStructure.tsx";
import CreateAccount from "./Components/CreateAccount.tsx";
import ConnectWallet from "./Components/ConnectWallet.tsx";
const App = () => {
  return (
     <>
        <Routes>
            <Route path="/" element={<DappStructure/>}/>
            <Route path="/CreateAccount" element={<CreateAccount/>}/>
            <Route path="/ConnectWallet" element={<ConnectWallet/>} />
        </Routes>
    </>

  )
 
}

export default App;