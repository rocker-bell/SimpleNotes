// import { useState, useEffect } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Link } from "react-router-dom";
// import {
//   Client,
//   TopicMessageSubmitTransaction,
//   TopicMessageQuery,
// } from "@hashgraph/sdk";
// import "../Styles/HCAIHelper.css";

// type ChatMessage = {
//   sender: "user" | "ai";
//   text: string;
// };

// type HCAIHelperProps = {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
// };

// const HCAIhelper = ({ accountId, privateKey, evmAddress }: HCAIHelperProps) => {
//   const [message, setMessage] = useState<string>("");
//   const [chat, setChat] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [open, setOpen] = useState<boolean>(false);

//   // Initialize Hedera client only if account info is available
//   const client =
//     accountId && privateKey
//       ? (() => {
//           const c = Client.forTestnet();
//           c.setOperator(accountId, privateKey);
//           return c;
//         })()
//       : null;

//   const TOPIC_ID = evmAddress || ""; // You can also pass a dedicated topic ID as prop if needed

//   // Initialize Gemini AI
//   const genAI = new GoogleGenerativeAI(
//     import.meta.env.VITE_GEMINI_API_KEY as string
//   );
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//   // Fetch conversation from HCS
// //   useEffect(() => {
// //     if (!client || !TOPIC_ID) return;

// //     const fetchHistory = async () => {
// //       const messages: ChatMessage[] = [];
// //       await new TopicMessageQuery()
// //         .setTopicId(TOPIC_ID)
// //         .subscribe(client, (msg) => {
// //           try {
// //             const data = JSON.parse(Buffer.from(msg.contents).toString());
// //             if (data.sender && data.text) {
// //               messages.push({ sender: data.sender, text: data.text });
// //               setChat([...messages]);
// //             }
// //           } catch (e) {
// //             console.error("Failed to parse HCS message:", e);
// //           }
// //         });
// //     };
// //     fetchHistory();
// //   }, [client, TOPIC_ID]);

// useEffect(() => {
//   if (!client || !TOPIC_ID) return;

//   const fetchHistory = async () => {
//     const messages: ChatMessage[] = [];
    
//     await new TopicMessageQuery()
//       .setTopicId(TOPIC_ID)
//       .subscribe(
//         client,
//         (msg) => {
//           // Ensure msg.contents exists
//           if (msg && msg.contents) {
//             try {
//               const data = JSON.parse(Buffer.from(msg.contents).toString());
//               if (data.sender && data.text) {
//                 messages.push({ sender: data.sender, text: data.text });
//                 setChat([...messages]);
//               }
//             } catch (e) {
//               console.error("Failed to parse HCS message:", e);
//             }
//           }
//         },
//         (error) => {
//           console.error("HCS subscription error:", error);
//         }
//       );
//   };

//   fetchHistory();
// }, [client, TOPIC_ID]);

//   const sendMessage = async () => {
//     if (!message.trim() || !client || !TOPIC_ID) return;

//     const userMessage: ChatMessage = { sender: "user", text: message };
//     setChat((prev) => [...prev, userMessage]);
//     setMessage("");
//     setLoading(true);

//     try {
//       // Call Gemini AI
//       const result = await model.generateContent(message);
//       const response = await result.response;
//       const text = response.text();

//       const aiMessage: ChatMessage = { sender: "ai", text };
//       setChat((prev) => [...prev, aiMessage]);

//       // Store messages on HCS
//       await new TopicMessageSubmitTransaction({
//         topicId: TOPIC_ID,
//         message: JSON.stringify(userMessage),
//       }).execute(client);

//       await new TopicMessageSubmitTransaction({
//         topicId: TOPIC_ID,
//         message: JSON.stringify(aiMessage),
//       }).execute(client);
//     } catch (error) {
//       console.error("Gemini error:", error);
//       const errorMsg: ChatMessage = { sender: "ai", text: "Error getting response." };
//       setChat((prev) => [...prev, errorMsg]);

//       await new TopicMessageSubmitTransaction({
//         topicId: TOPIC_ID,
//         message: JSON.stringify(errorMsg),
//       }).execute(client);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className={`AI_chatbox_wrapper ${open ? "open" : ""}`}>
//       <Link to="/ConnectWallet">
//         <img
//           width="35"
//           height="35"
//           src="https://img.icons8.com/nolan/64/left.png"
//           alt="left"
//         />
//       </Link>
//       <h2>Welcome back to Hedera Account !!!</h2>

//       {!open && (
//         <div className="AI_chatbox_closed" onClick={() => setOpen(true)}>
//           💬
//         </div>
//       )}

//       {open && (
//         <div className="AI_chatbox_container">
//           <div className="AI_chatbox_header">
//             <span>AI Assistant</span>
//             <button className="AI_close_btn" onClick={() => setOpen(false)}>
//               ✖
//             </button>
//           </div>

//           <div className="AI_chatbox_messages">
//             {chat.map((msg, index) => (
//               <div key={index} className={`chat_message ${msg.sender}`}>
//                 {msg.text}
//               </div>
//             ))}
//             {loading && <div className="chat_message ai">Thinking...</div>}
//           </div>

//           <div className="AI_chatbox_input">
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Ask Gemini..."
//               onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
//                 e.key === "Enter" && sendMessage()
//               }
//             />
//             <button onClick={sendMessage}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HCAIhelper;


// import { useState, useEffect } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Link } from "react-router-dom";
// import {
//   Client,
//   TopicCreateTransaction,
//   TopicMessageSubmitTransaction,
//   TopicMessageQuery,
// } from "@hashgraph/sdk";
// import "../Styles/HCAIHelper.css";

// type ChatMessage = {
//   sender: "user" | "ai";
//   text: string;
// };

// type HCAIHelperProps = {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
// };

// const HCAIhelper = ({ accountId, privateKey, evmAddress }: HCAIHelperProps) => {
//   const [message, setMessage] = useState<string>("");
//   const [chat, setChat] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [open, setOpen] = useState<boolean>(false);
//   const [topicId, setTopicId] = useState<string | null>(null);

//   // Initialize Hedera client only if account info is available
//   const client =
//     accountId && privateKey
//       ? (() => {
//           const c = Client.forTestnet();
//           c.setOperator(accountId, privateKey);
//           return c;
//         })()
//       : null;

//   // Function to create HCS topic automatically
//   const createTopic = async () => {
//     if (!client) return;
//     try {
//       const tx = await new TopicCreateTransaction().execute(client);
//       const receipt = await tx.getReceipt(client);
//       const newTopicId = receipt.topicId?.toString() || null;
//       setTopicId(newTopicId);
//       console.log("✅ Created new HCS topic:", newTopicId);
//     } catch (err) {
//       console.error("Failed to create HCS topic:", err);
//     }
//   };

//   // Initialize Gemini AI
//   const genAI = new GoogleGenerativeAI(
//     import.meta.env.VITE_GEMINI_API_KEY as string
//   );
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//   // Create topic if none exists
//   useEffect(() => {
//     if (!topicId && client) {
//       createTopic();
//     }
//   }, [client, topicId]);

//   // Fetch conversation from HCS
//   useEffect(() => {
//     if (!client || !topicId) return;

//     const fetchHistory = async () => {
//       const messages: ChatMessage[] = [];

//       await new TopicMessageQuery()
//         .setTopicId(topicId)
//         .subscribe(
//           client,
//           (msg) => {
//             if (msg && msg.contents) {
//               try {
//                 const data = JSON.parse(Buffer.from(msg.contents).toString());
//                 if (data.sender && data.text) {
//                   messages.push({ sender: data.sender, text: data.text });
//                   setChat([...messages]);
//                 }
//               } catch (e) {
//                 console.error("Failed to parse HCS message:", e);
//               }
//             }
//           },
//           (error) => {
//             console.error("HCS subscription error:", error);
//           }
//         );
//     };

//     fetchHistory();
//   }, [client, topicId]);

//   const sendMessage = async () => {
//     if (!message.trim() || !client || !topicId) return;

//     const userMessage: ChatMessage = { sender: "user", text: message };
//     setChat((prev) => [...prev, userMessage]);
//     setMessage("");
//     setLoading(true);

//     try {
//       // Call Gemini AI
//       const result = await model.generateContent(message);
//       const response = await result.response;
//       const text = response.text();

//       const aiMessage: ChatMessage = { sender: "ai", text };
//       setChat((prev) => [...prev, aiMessage]);

//       // Store messages on HCS
//       await new TopicMessageSubmitTransaction({
//         topicId,
//         message: JSON.stringify(userMessage),
//       }).execute(client);

//       await new TopicMessageSubmitTransaction({
//         topicId,
//         message: JSON.stringify(aiMessage),
//       }).execute(client);
//     } catch (error) {
//       console.error("Gemini error:", error);
//       const errorMsg: ChatMessage = { sender: "ai", text: "Error getting response." };
//       setChat((prev) => [...prev, errorMsg]);

//       await new TopicMessageSubmitTransaction({
//         topicId,
//         message: JSON.stringify(errorMsg),
//       }).execute(client);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className={`AI_chatbox_wrapper ${open ? "open" : ""}`}>
//       <Link to="/ConnectWallet">
//         <img
//           width="35"
//           height="35"
//           src="https://img.icons8.com/nolan/64/left.png"
//           alt="left"
//         />
//       </Link>
//       <h2>Welcome back to Hedera Account !!!</h2>

//       {!open && (
//         <div className="AI_chatbox_closed" onClick={() => setOpen(true)}>
//           💬
//         </div>
//       )}

//       {open && (
//         <div className="AI_chatbox_container">
//           <div className="AI_chatbox_header">
//             <span>AI Assistant</span>
//             <button className="AI_close_btn" onClick={() => setOpen(false)}>
//               ✖
//             </button>
//           </div>

//           <div className="AI_chatbox_messages">
//             {chat.map((msg, index) => (
//               <div key={index} className={`chat_message ${msg.sender}`}>
//                 {msg.text}
//               </div>
//             ))}
//             {loading && <div className="chat_message ai">Thinking...</div>}
//           </div>

//           <div className="AI_chatbox_input">
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Ask Gemini..."
//               onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
//                 e.key === "Enter" && sendMessage()
//               }
//             />
//             <button onClick={sendMessage}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HCAIhelper;


// import { useState, useEffect } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Link } from "react-router-dom";
// import {
//   Client,
//   TopicCreateTransaction,
//   TopicMessageSubmitTransaction,
//   TopicMessageQuery,
//   TopicId
// } from "@hashgraph/sdk";
// import "../Styles/HCAIHelper.css";

// type ChatMessage = {
//   sender: "user" | "ai";
//   text: string;
// };

// type HCAIHelperProps = {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
// };

// const HCAIhelper = ({ accountId, privateKey, evmAddress }: HCAIHelperProps) => {
//   const [message, setMessage] = useState<string>("");
//   const [chat, setChat] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [open, setOpen] = useState<boolean>(false);
//   const [topicId, setTopicId] = useState<string>("");

//   // Initialize Hedera client only if account info is available
//   const client =
//     accountId && privateKey
//       ? (() => {
//           const c = Client.forTestnet();
//           c.setOperator(accountId, privateKey);
//           return c;
//         })()
//       : null;

//   // Initialize Gemini AI
//   const genAI = new GoogleGenerativeAI(
//     import.meta.env.VITE_GEMINI_API_KEY as string
//   );
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//   // --- Handle topic creation / retrieval ---
//   useEffect(() => {
//     if (!client || !accountId) return;

//     const TOPIC_KEY = `HCS_TOPIC_${accountId}`;
//     let storedTopic = localStorage.getItem(TOPIC_KEY);

//     const createTopic = async () => {
//       try {
       
//           if (!client || !client.operatorPublicKey) return;

// const txResponse = await new TopicCreateTransaction()
//   .setAdminKey(client.operatorPublicKey!) // ! tells TS it’s not null
//   .execute(client);

//         const receipt = await txResponse.getReceipt(client);
//         const newTopicId = receipt.topicId!.toString();
//         localStorage.setItem(TOPIC_KEY, newTopicId);
//         setTopicId(newTopicId);
//         console.log("Created new HCS topic:", newTopicId);
//       } catch (err) {
//         console.error("Error creating HCS topic:", err);
//       }
//     };

//     if (!storedTopic) {
//       createTopic();
//     } else {
//       setTopicId(storedTopic);
//       console.log("Using existing HCS topic:", storedTopic);
//     }
//   }, [client, accountId]);

//   // --- Fetch messages using polling (browser-safe) ---
//   useEffect(() => {
//     if (!client || !topicId) return;

//     // const fetchMessages = async () => {
//     //   try {
//     //     const query = new TopicMessageQuery().setTopicId(TopicId.fromString(topicId));
//     //     const messages: ChatMessage[] = [];

//     //     // Hedera SDK does not support subscription in browsers
//     //     // so we poll last messages from the mirror node periodically
//     //     const poll = async () => {
//     //       const response = await query.execute(client);
//     //       response.messages.forEach((msg) => {
//     //         try {
//     //           const data = JSON.parse(Buffer.from(msg.contents).toString());
//     //           if (data.sender && data.text) {
//     //             messages.push({ sender: data.sender, text: data.text });
//     //           }
//     //         } catch (e) {
//     //           console.error("Failed to parse HCS message:", e);
//     //         }
//     //       });
//     //       setChat([...messages]);
//     //     };

//     //     // Initial fetch
//     //     await poll();
//     //     // Poll every 5 seconds
//     //     const interval = setInterval(poll, 5000);
//     //     return () => clearInterval(interval);
//     //   } catch (err) {
//     //     console.error("Error fetching messages:", err);
//     //   }
//     // };
//     const fetchMessages = async () => {
//   if (!topicId) return;
//   try {
//     const resp = await fetch(
//       `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages?limit=25`
//     );
//     const data = await resp.json();
//     const messages: ChatMessage[] = data.messages.map((m: any) => {
//       try {
//         const parsed = JSON.parse(Buffer.from(m.message, "base64").toString());
//         return { sender: parsed.sender, text: parsed.text };
//       } catch {
//         return null;
//       }
//     }).filter(Boolean);
//     setChat(messages);
//   } catch (err) {
//     console.error("Error fetching HCS messages", err);
//   }
// };
//     fetchMessages();
//   }, [client, topicId]);

//   const sendMessage = async () => {
//     if (!message.trim() || !client || !topicId) return;

//     const userMessage: ChatMessage = { sender: "user", text: message };
//     setChat((prev) => [...prev, userMessage]);
//     setMessage("");
//     setLoading(true);

//     try {
//       // Call Gemini AI
//       const result = await model.generateContent(message);
//       const response = await result.response;
//       const text = response.text();

//       const aiMessage: ChatMessage = { sender: "ai", text };
//       setChat((prev) => [...prev, aiMessage]);

//       // Submit messages to HCS
//       await new TopicMessageSubmitTransaction({
//         topicId: TopicId.fromString(topicId),
//         message: JSON.stringify(userMessage),
//       }).execute(client);

//       await new TopicMessageSubmitTransaction({
//         topicId: TopicId.fromString(topicId),
//         message: JSON.stringify(aiMessage),
//       }).execute(client);
//     } catch (err) {
//       console.error("Gemini or HCS error:", err);
//       const errorMsg: ChatMessage = { sender: "ai", text: "Error getting response." };
//       setChat((prev) => [...prev, errorMsg]);
//       try {
//         await new TopicMessageSubmitTransaction({
//           topicId: TopicId.fromString(topicId),
//           message: JSON.stringify(errorMsg),
//         }).execute(client);
//       } catch {}
//     }

//     setLoading(false);
//   };

//   return (
//     <div className={`AI_chatbox_wrapper ${open ? "open" : ""}`}>
//       <Link to="/ConnectWallet">
//         <img
//           width="35"
//           height="35"
//           src="https://img.icons8.com/nolan/64/left.png"
//           alt="left"
//         />
//       </Link>
//       <h2>Welcome back to Hedera Account !!!</h2>

//       {!open && (
//         <div className="AI_chatbox_closed" onClick={() => setOpen(true)}>
//           💬
//         </div>
//       )}

//       {open && (
//         <div className="AI_chatbox_container">
//           <div className="AI_chatbox_header">
//             <span>AI Assistant</span>
//             <button className="AI_close_btn" onClick={() => setOpen(false)}>
//               ✖
//             </button>
//           </div>

//           <div className="AI_chatbox_messages">
//             {chat.map((msg, index) => (
//               <div key={index} className={`chat_message ${msg.sender}`}>
//                 {msg.text}
//               </div>
//             ))}
//             {loading && <div className="chat_message ai">Thinking...</div>}
//           </div>

//           <div className="AI_chatbox_input">
//             {/* <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Ask Gemini..."
//               onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
//                 e.key === "Enter" && sendMessage()
//               }
//             />
//             <button onClick={sendMessage}>Send</button> */}
//             <form
//   onSubmit={(e) => {
//     e.preventDefault();
//     sendMessage();
//   }}
// >
//   <input
//     type="text"
//     value={message}
//     onChange={(e) => setMessage(e.target.value)}
//     placeholder="Ask Gemini..."
//   />
//   <button type="submit">Send</button>
// </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HCAIhelper;