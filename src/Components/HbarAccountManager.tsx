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