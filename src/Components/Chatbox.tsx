import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Client,
  AccountId,
  PrivateKey,
  ContractCallQuery,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  Hbar
} from "@hashgraph/sdk";
import { toast } from "react-toastify";
import "../Styles/Chatbox.css";

const CONTRACT_ID = "0.0.7059508"; // your deployed contract

interface ChatboxProps {
  accountId: string | null;
  privateKey: string | null;
  evmAddress: string | null;
}

interface Message {
  timestamp: string;
  sender?: string;
  recipient?: string;
  content: string;
}

const Chatbox = ({ accountId, privateKey, evmAddress }: ChatboxProps) => {
  const [status, setStatus] = useState("Connect wallet first");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
const [balance, setBalance] = useState<string>("0");

  
  const createClient = () => {
    if (!accountId || !privateKey) throw new Error("Wallet not connected");
    // const client =
    //   import.meta.env.VITE_NETWORK === "mainnet"
    //     ? Client.forMainnet()
    //     : Client.forTestnet();
    // client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
    const client =
  import.meta.env.VITE_NETWORK === "mainnet"
    ? Client.forMainnet()
    : Client.forTestnet();

client.setOperator(
  AccountId.fromString(accountId),
  PrivateKey.fromStringECDSA(privateKey)
);

// increase query payment limit
client.setMaxQueryPayment(new Hbar(5));
    return client;
  };


//   const decodeMessages = (rawResult: any) => {
//   const messages: Message[] = [];
//   let i = 0;

//   while (true) {
//     try {
//       const timestamp = rawResult.getUint256(i * 4);
//       const sender = rawResult.getAddress(i * 4 + 1);
//       const recipient = rawResult.getAddress(i * 4 + 2);
//       const content = rawResult.getString(i * 4 + 3);

//       messages.push({
//         timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
//         sender,
//         recipient,
//         content
//       });

//       i++;
//     } catch {
//       break; // reached end of returned messages
//     }
//   }

//   return messages;
// };
  
//     const decodeMessages = (result: any): Message[] => {
//   const messages: Message[] = [];

//   const raw = result.getResult(); // ABI decoded result
//   if (!raw || raw.length === 0) return [];

//   const arr = raw[0]; // first return value = Message[]

//   for (let i = 0; i < arr.length; i++) {
//     const m = arr[i];

//     messages.push({
//       timestamp: new Date(Number(m.timestamp) * 1000).toLocaleString(),
//       sender: m.sender,
//       recipient: m.recipient,
//       content: m.content
//     });
//   }

//   return messages;
// };


// const decodeMessages = (result: any): Message[] => {
//   const messages: Message[] = [];

//   try {
//     const length = result.getUint256(0); // array length

//     for (let i = 0; i < length; i++) {
//       const base = 1 + i * 4;

//       const timestamp = result.getUint256(base);
//       const sender = result.getAddress(base + 1);
//       const recipient = result.getAddress(base + 2);
//       const content = result.getString(base + 3);

//       messages.push({
//         timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
//         sender,
//         recipient,
//         content
//       });
//     }
//   } catch (err) {
//     console.error("Decode error:", err);
//   }

//   return messages;
// };
const decodeMessages = (result: any): Message[] => {
  try {
    const bytes = result.bytes;

    const abi = [
      "function getMessages() view returns ((uint256 timestamp,address sender,address recipient,string content)[])"
    ];

    const iface = new ethers.Interface(abi);

    const decoded = iface.decodeFunctionResult("getMessages", bytes);

    const msgs = decoded[0];

    return msgs.map((m: any) => ({
      timestamp: new Date(Number(m.timestamp) * 1000).toLocaleString(),
      sender: m.sender,
      recipient: m.recipient,
      content: m.content
    }));
  } catch (err) {
    console.error("Decode error:", err);
    return [];
  }
};
const fetchMessages = async () => {
    if (!accountId || !privateKey || !evmAddress) return;

    try {
      const client = createClient();

      // const sentQuery = await new ContractCallQuery()
      //   .setContractId(CONTRACT_ID)
      //   .setGas(1_00_000)
      //   .setFunction("getSentMessages", new ContractFunctionParameters().addAddress(evmAddress))
      //   .execute(client);

      // const receivedQuery = await new ContractCallQuery()
      //   .setContractId(CONTRACT_ID)
      //   .setGas(1_00_000)
      //   .setFunction("getReceivedMessages", new ContractFunctionParameters().addAddress(evmAddress))
      //   .execute(client);
      const sentQuery = await new ContractCallQuery()
  .setContractId(CONTRACT_ID)
  .setGas(1_000_000)
  .setFunction(
    "getSentMessages",
    new ContractFunctionParameters().addAddress(evmAddress)
  )
  .execute(client);

const receivedQuery = await new ContractCallQuery()
  .setContractId(CONTRACT_ID)
  .setGas(1_000_000)
  .setFunction(
    "getReceivedMessages",
    new ContractFunctionParameters().addAddress(evmAddress)
  )
  .execute(client);

      setSentMessages(decodeMessages(sentQuery));
      setReceivedMessages(decodeMessages(receivedQuery));
      setStatus("Wallet connected ✅");
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Failed to load messages");
    }
  };

  // -----------------------------
  // Send message
  // -----------------------------
  const sendMessage = async () => {
    if (!accountId || !privateKey || !evmAddress) {
      toast.error("Wallet not connected");
      return;
    }
    if (!recipient || !message) {
      toast.error("Enter recipient and message");
      return;
    }

    try {
      const client = createClient();

      const tx = await new ContractExecuteTransaction()
        .setContractId(CONTRACT_ID)
        .setGas(500_000)
        .setFunction(
          "sendMessage",
          new ContractFunctionParameters()
            .addAddress(recipient)
            .addString(message)
        )
        .execute(client);

      await tx.getReceipt(client);
      toast.success("Message sent!");
      setMessage("");
      fetchMessages();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send message");
    }
  };

  // -----------------------------
  // Auto fetch messages every 10s
  // -----------------------------

  
const checkRegistration = async () => {
  if (!accountId || !privateKey || !evmAddress) return;
  try {
    const client = createClient();
    const regQuery = await new ContractCallQuery()
      .setContractId(CONTRACT_ID)
      .setGas(100_000)
      .setFunction("registeredUsers", new ContractFunctionParameters().addAddress(evmAddress))
      .execute(client);

    setIsRegistered(regQuery.getBool(0));
  } catch (err) {
    console.error("Check registration error:", err);
  }
};

const registerUser = async () => {
  if (!accountId || !privateKey) return;
  try {
    const client = createClient();
    const tx = await new ContractExecuteTransaction()
      .setContractId(CONTRACT_ID)
      .setGas(300_000)
      .setFunction("registerUser")
      .execute(client);

    await tx.getReceipt(client);
    toast.success("User registered successfully!");
    setIsRegistered(true);
    fetchBalance();
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Registration failed");
  }
};

const fetchBalance = async () => {
  if (!accountId || !privateKey || !evmAddress) return;
  try {
    const client = createClient();
    const balQuery = await new ContractCallQuery()
      .setContractId(CONTRACT_ID)
      .setGas(100_000)
      .setFunction("balanceOf", new ContractFunctionParameters().addAddress(evmAddress))
      .execute(client);

    setBalance(balQuery.getUint256(0).toString());
  } catch (err) {
    console.error("Fetch balance error:", err);
  }
};

// -----------------------------
// Update useEffect to check registration & balance
// -----------------------------
useEffect(() => {
  if (!accountId || !privateKey || !evmAddress) return;
  fetchMessages();
  checkRegistration();
  fetchBalance();
  const interval = setInterval(() => {
    fetchMessages();
    fetchBalance();
  }, 10000);
  return () => clearInterval(interval);
}, [accountId, privateKey, evmAddress]);

  // useEffect(() => {
  //   if (!accountId || !privateKey || !evmAddress) return;
  //   fetchMessages();
  //   const interval = setInterval(fetchMessages, 10000);
  //   return () => clearInterval(interval);
  // }, [accountId, privateKey, evmAddress]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="chatbox-container">
      <Link to="/ConnectWallet">
        <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
      </Link>

      <h2>Chatbox DApp</h2>
      <div className="status">{status}</div>

    <div className="registration-status">
      <h4>Registration Status</h4>
{isRegistered ? (
  <span>✅ Registered</span>
) : (
  <button onClick={registerUser}>Register User</button>
)}

</div>

<h5>Token Balance: {balance}</h5>
      <input
        type="text"
        placeholder="Recipient (0x...)"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>

      {/* <div className="messages-section">
        <h3>Received Messages</h3>
{receivedMessages.map((msg, idx) => (
  <div key={idx} className="message-card received-message">
    <b>{msg.sender}</b>
    <p>{msg.content}</p>
    <small>{msg.timestamp}</small>
  </div>
))}

<h3>Sent Messages</h3>
{sentMessages.map((msg, idx) => (
  <div key={idx} className="message-card sent-message">
    <b>To: {msg.recipient}</b>
    <p>{msg.content}</p>
    <small>{msg.timestamp}</small>
  </div>
))}
      </div> */}

      <div className="messages-section">

  <h3>Received Messages</h3>
  {receivedMessages.slice(-3).map((msg, idx) => (
    <div key={idx} className="message-card received-message">
      <b>{msg.sender}</b>
      <p>{msg.content}</p>
      <small>{msg.timestamp}</small>
    </div>
  ))}

  <h3>Sent Messages</h3>
  {sentMessages.slice(-3).map((msg, idx) => (
    <div key={idx} className="message-card sent-message">
      <b>To: {msg.recipient}</b>
      <p>{msg.content}</p>
      <small>{msg.timestamp}</small>
    </div>
  ))}

</div>
    </div>
  );
};

export default Chatbox;