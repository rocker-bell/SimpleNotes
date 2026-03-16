import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Link } from "react-router-dom";
import "../Styles/HCAIHelper.css";
import flash from "../assets/flash.png"

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

type HCAIHelperProps = {
  evmAddress: string | null;
  privateKey: string | null;
  accountId: string | null;
};

const HCAIhelper = ({ evmAddress, privateKey, accountId }: HCAIHelperProps) => {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activesend, setactivesend] = useState(false);
  const API =  import.meta.env.VITE_GEMINI_API_KEY as string;
  const API_url = atob(API);
  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(
     API_url
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { sender: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    console.log(
      `script : ${evmAddress}, ${privateKey}, ${accountId}`
    );

    try {
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      setChat((prev) => [...prev, { sender: "ai", text }]);
    } catch (error) {
      console.error("Gemini error:", error);
      setChat((prev) => [
        ...prev,
        { sender: "ai", text: "Error getting response." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="AI_chatbox_wrapper">
      <Link to="/ConnectWallet">
        <img
          width="35"
          height="35"
          src="https://img.icons8.com/nolan/64/left.png"
          alt="left"
        />
      </Link>

      {/* <h2><strong>Your AI companion is here for you</strong>!</h2> */}

      <div className="AI_chatbox_container">
        <div className="AI_chatbox_header">
          <span>AI Assistant</span>
          <span className="HCAI_xpbar">xp
            <img  className="image" src={flash} alt="" />
          </span>
        </div>

        <div className="AI_chatbox_messages">
          {chat.map((msg, index) => (
            <div key={index} className={`chat_message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="chat_message ai">Thinking...</div>}
        </div>

        <div className="AI_chatbox_input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Gemini..."
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && sendMessage()
            }
          />
          <button
  onClick={sendMessage}
  className={activesend ? "active" : ""}
  onMouseEnter={() => setactivesend(true)}
  onMouseLeave={() => setactivesend(false)}
>
  {activesend ? (
    <img
      width="24"
      height="24"
      src="https://img.icons8.com/fluency/48/sent.png"
      alt="sent"
    />
  ) : (
    "Send"
  )}
</button>
        
        </div>
      </div>
    </div>
  );
};

export default HCAIhelper;