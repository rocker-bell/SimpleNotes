import {Link} from "react-router-dom";
const Myapps = () => {
    return (
        <>      

            <div className="Myapps_wrapper">
        
                    <Link to="/ConnectWallet">
                            <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
                    </Link>
                    <h2>Welcome to my APPS</h2>

      </div>
        </>
    )
}

export default Myapps;