import "../Styles/DexScan.css";
import { Link } from "react-router-dom";
const DexScan = () => {
    return (
        <>  
            <div className="DexScan_wrapper">
                 <Link to="/ConnectWallet">
            <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
      </Link>
                <h1>Welcome to dexScanner</h1>
            </div>
            
        </>
    )
}

export default DexScan;