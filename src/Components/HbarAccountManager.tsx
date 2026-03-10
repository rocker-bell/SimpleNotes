import {Link} from "react-router-dom";
const HbarAccountManager = () => {
    return (
        <>
            <div className="HCManager_wrapper">
                <Link to="/ConnectWallet">
            <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
      </Link>
      <h2>Welcome to account Manager</h2>
            </div>
        </>
    )
}


export default HbarAccountManager;