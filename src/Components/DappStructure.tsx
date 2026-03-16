import "../Styles/DappLanding.css";
import {Link} from "react-router-dom";

const DappStructure = () => {
  return (
    <div className="dapp-container">
      {/* Header */}
      <header className="dapp-header">
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4c1d95"/>
<path d="M2 17L12 22L22 17" stroke="#3730a3" strokeWidth="2"/>
<path d="M2 12L12 17L22 12" stroke="#312e81" strokeWidth="2"/>
            </svg>
          </div>
          <div className="logo-text">
            <h1>HashCompanion</h1>
            <p className="tagline">Your Hedera Web3 Companion</p>
          </div>
        </div>
      </header>

      {/* Connect Wallet Section */}
      <main className="dapp-main">
        <div className="welcome-section">
          <h2>Welcome to HashComapnion</h2>
          <p className="welcome-text">
              Connect your wallet to begin managing your Hedera activity.
          </p>
        </div>

        <div className="connect-section">
          <button className="connect-btn primary">
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>
                <Link to="/ConnectWallet">
                    Connect Wallet
                </Link>
                
            </span>
          </button>
          <button className="connect-btn secondary">
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="2" fill="currentColor"/>
            </svg>
            <span>
                <Link to="/CreateAccount">
                        Create Account
                </Link>
                </span>
          </button>
        </div>

        {/* Features */}
        <div className="features-section">
          <h3>Why Choose HashCompanion?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>Secure Storage</h4>
              {/* <p>All operations and information are cryptographically secured and anchored on the blockchain, preserving transparency and security.</p> */}
              <p>Blockchain-secured and encrypted.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>Decentralized</h4>
              {/* <p>Built on a decentralized network with no central server, giving you full control over your data and assets.</p> */}
              <p>Fully decentralized. Fully yours.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>Access Anywhere</h4>
              <p>Everything, everywhere — one app.</p>
              {/* <p>A unified platform that lets you access and manage everything from anywhere, all within one application.</p> */}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dapp-footer">
        <div className="footer-links">
          <Link  to="https://github.com/rocker-bell/SimpleNotes/tree/main-2/documentation"  className="footer-link">Documentation</Link>
          <Link to="https://github.com/rocker-bell/SimpleNotes" className="footer-link">GitHub</Link>
          <Link to="https://github.com/rocker-bell/SimpleNotes" className="footer-link">Support(⭐)</Link>
        </div>
        <p className="copyright">© 2026 #HashCompanion. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DappStructure;