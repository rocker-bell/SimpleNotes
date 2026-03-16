import { useState } from "react";
import {
  Client,
  AccountBalanceQuery,
  PrivateKey,
  AccountId,
  AccountCreateTransaction,
  Hbar
} from "@hashgraph/sdk";
import {Link} from "react-router-dom";
import { toast } from "alert-handler-lite";

// --- Styles ---
// const cardStyle: React.CSSProperties = {
//   border: "1px solid rgba(255,255,255,0.08)",
//   borderRadius: "16px",
//   padding: "28px",
//   margin: "30px auto",
//   maxWidth: "520px",
//   background: "linear-gradient(145deg, #141414, #1c1c1c)",
//   color: "#f5f5f5",
//   boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
//   backdropFilter: "blur(8px)"
// };

// const inputStyle: React.CSSProperties = {
//   width: "100%",
//   padding: "12px 14px",
//   margin: "10px 0",
//   borderRadius: "10px",
//   border: "1px solid rgba(255,255,255,0.08)",
//   backgroundColor: "#0f0f0f",
//   color: "#ffffff",
//   outline: "none",
//   fontSize: "14px",
//   transition: "all 0.2s ease"
// };

// const buttonStyle: React.CSSProperties = {
//   padding: "12px 18px",
//   borderRadius: "10px",
//   border: "none",
//   cursor: "pointer",
//   background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
//   color: "#ffffff",
//   fontWeight: 600,
//   marginTop: "14px",
//   width: "100%",
//   transition: "all 0.2s ease",
//   boxShadow: "0 6px 18px rgba(79,70,229,0.4)"
// };

// const save_msg: React.CSSProperties = {
//   color: "green",
//   fontWeight: "bold",
//   fontSize: "larger"
// }

// --- Styles ---
const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  // borderRadius: "14px",
  padding: "32px",
  margin: "32px auto",
  maxWidth: "520px",
  backgroundColor: "#ffffff",
  color: "#111827",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  margin: "10px 0",
  // borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#111827",
  outline: "none",
  fontSize: "14px",
  transition: "border 0.15s ease, box-shadow 0.15s ease"
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 18px",
  // borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  fontWeight: 600,
  marginTop: "16px",
  width: "100%",
  fontSize: "14px",
  letterSpacing: "0.3px",
  boxShadow: "0 4px 10px rgba(37,99,235,0.25)"
};

const save_msg: React.CSSProperties = {
  marginTop: "14px",
  padding: "10px 12px",
  borderRadius: "8px",
  backgroundColor: "#ecfdf5",
  border: "1px solid #10b981",
  color: "#065f46",
  fontWeight: 600,
  fontSize: "14px"
};

// --- Browser-safe random hex generator ---
function generateHexPrivateKey(): string {
  const array = new Uint8Array(32); // 256-bit
  window.crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
}

// --- Main Component ---
const HederaWalletManager = () => {
  // Create Account
  const [newAccountId, setNewAccountId] = useState("");
  const [newPrivateKey, setNewPrivateKey] = useState("");
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Connect Account
  const [accountId, setAccountId] = useState("");
  const [balance, setBalance] = useState("");
  const [connecting, setConnecting] = useState(false);

  // --- Create Hedera Account ---
  const createAccount = async () => {
    try {
      setCreating(true);

      // Setup client
      const client =
        import.meta.env.VITE_NETWORK === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();

      client.setOperator(
        import.meta.env.VITE_OPERATOR_ID.trim(),
        PrivateKey.fromStringECDSA(import.meta.env.VITE_OPERATOR_KEY.trim())
      );

      // Generate browser-safe ECDSA private key
      const hexKey = generateHexPrivateKey();
      const newKey = PrivateKey.fromStringECDSA(hexKey);

      // Create account with initial 5 HBAR
      const tx = new AccountCreateTransaction()
        .setKey(newKey.publicKey)
        .setInitialBalance(new Hbar(25));

      const response = await tx.execute(client);
      const receipt = await response.getReceipt(client);

      setNewAccountId(receipt.accountId?.toString() || "");
      setNewPrivateKey(newKey.toString());

    } catch (err) {
      console.error(err);
      toast.error("Account creation failed. Check console for details.");
    } finally {
      setCreating(false);
    }
  };

  // --- Connect Hedera Account & check balance ---
  const connectAccount = async () => {
    try {
      setConnecting(true);

      const parsedAccountId = AccountId.fromString(accountId);
      const parsedPrivateKey = PrivateKey.fromStringECDSA(newPrivateKey);

      const client =
        import.meta.env.VITE_NETWORK === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();

      client.setOperator(parsedAccountId, parsedPrivateKey);

      const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
      const accountBalance = await balanceQuery.execute(client);

      setBalance(accountBalance.hbars.toString());
    } catch (err) {
      console.error(err);
      toast.error("Invalid Account ID or Private Key");
      setBalance("");
    } finally {
      setConnecting(false);
    }
  };

//   const copyCredentials = async () => {
//   try {
//     const text = `Account ID: ${newAccountId}\nPrivate Key: ${newPrivateKey}`;
//     await navigator.clipboard.writeText(text);
//     toast.success("Credentials copied to clipboard");
//   } catch (err) {
//     toast.error("Failed to copy credentials");
//   }
// };

const copyCredentials = async () => {
  try {
    const text = `Account ID: ${newAccountId}\nPrivate Key: ${newPrivateKey}`;
    await navigator.clipboard.writeText(text);

    setCopied(true);
    toast.success("Credentials copied to clipboard");

    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    toast.error("Failed to copy credentials");
  }
};

  return (
    <div>
      {/* --- Create Account Card --- */}
      <Link to="/">
            <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
      </Link>
      <div style={cardStyle}>
        <h2>Create Hedera Account</h2>
        <button style={buttonStyle} onClick={createAccount} disabled={creating}>
          {creating ? "Creating..." : "Create Account"}
        </button>
        {newAccountId && (
          <>
            {/* <p><strong>Account ID:</strong> {newAccountId}</p>
            <p><strong>Private Key:</strong> {newPrivateKey}</p>
            <p style={save_msg}><strong>Make sure to save your AccountID, and Private Key</strong></p> */}

                  <p><strong>Account ID:</strong> {newAccountId}</p>

<p>
  <strong>Private Key:</strong>{" "}
  {newPrivateKey.slice(0, 6)}...{newPrivateKey.slice(-6)}
</p>

<div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
  <p style={save_msg}>
    <strong>Make sure to save your AccountID and Private Key</strong>
  </p>

 <button
  onClick={copyCredentials}
  style={{
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: copied ? "#dcfce7" : "#f9fafb",
    cursor: "pointer",
    fontSize: "13px"
  }}
>
  {/* {copied ? " Copied" : "📋 Copy"} */}

  {copied ? (
  <>
    <img
      width="20"
      height="20"
      src="https://img.icons8.com/color/48/checked--v1.png"
      alt="checked"
      style={{ verticalAlign: "middle", marginRight: "6px" }}
    />
    Copied
  </>
) : (
  <>
    <img
      width="20"
      height="20"
      src="https://img.icons8.com/parakeet/48/copy.png"
      alt="copy"
      style={{ verticalAlign: "middle", marginRight: "6px" }}
    />
    Copy
  </>
)}
</button> </div>

            
          </>
        )}
      </div>

      {/* --- Connect Account Card --- */}
      <div style={cardStyle}>
        <h2>Connect Hedera Account</h2>
        <input
          style={inputStyle}
          type="text"
          placeholder="Account ID (0.0.x)"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <input
          style={inputStyle}
          type="text"
          placeholder="Private Key (hex)"
          value={newPrivateKey}
          onChange={(e) => setNewPrivateKey(e.target.value)}
        />
        <button style={buttonStyle} onClick={connectAccount} disabled={connecting}>
          {connecting ? "Connecting..." : "Check Balance"}
        </button>
        {balance && <p style={{ marginTop: 10 }}><strong>Balance:</strong> {balance} HBAR</p>}
      </div>
    </div>
  );
};

export default HederaWalletManager;