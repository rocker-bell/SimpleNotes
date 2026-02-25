// import { useState, useEffect, useCallback } from "react";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   ContractExecuteTransaction,
// } from "@hashgraph/sdk";
// import { toast } from "react-toastify";

// type Status = "Active" | "Completed" | "Expired";

// const CONTRACT_ID = "0.0.8028090";

// const TodoApp = () => {
//   const [accountId, setAccountId] = useState<string>("");
//   const [privateKey, setPrivateKey] = useState<string>("");

//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [todos, setTodos] = useState<
//     { title: string; description: string; status: Status }[]
//   >([]);

//   // ✅ Load wallet from localStorage safely
//   useEffect(() => {
//     const savedId = localStorage.getItem("hedera_account_id");
//     const savedKey = localStorage.getItem("hedera_private_key");

//     if (savedId && savedKey) {
//       setAccountId(savedId);
//       setPrivateKey(savedKey);
//     } else {
//       toast.error("Wallet not connected");
//     }
//   }, []);

//   // ✅ Safe Hedera client creator
//   const createClient = useCallback((): Client | null => {
//     try {
//       if (!accountId || !privateKey) return null;

//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();

//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       return client;
//     } catch (err) {
//       console.error("Client creation error:", err);
//       toast.error("Invalid wallet credentials");
//       return null;
//     }
//   }, [accountId, privateKey]);

//   // ---------------- FETCH TODOS ----------------
//   const fetchTodos = useCallback(async () => {
//     const client = createClient();
//     if (!client) return;

//     try {
//       const totalTodosTx = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(100000)
//         .setFunction("getTotalTodos")
//         .execute(client);

//       // 👇 safer conversion
//       const totalTodos = Number(
//         totalTodosTx.getUint256(0).toString()
//       );

//       const allTodos: {
//         title: string;
//         description: string;
//         status: Status;
//       }[] = [];

//       for (let i = 1; i <= totalTodos; i++) {
//         const todoRes = await new ContractCallQuery()
//           .setContractId(CONTRACT_ID)
//           .setGas(200000)
//           .setFunction(
//             "getTodo",
//             new ContractFunctionParameters().addUint256(i)
//           )
//           .execute(client);

//         const title = todoRes.getString(0);
//         const description = todoRes.getString(1);

//         const statusIndex = Number(
//           todoRes.getUint256(3).toString()
//         );

//         const status: Status =
//           statusIndex === 0
//             ? "Active"
//             : statusIndex === 1
//             ? "Completed"
//             : "Expired";

//         allTodos.push({ title, description, status });
//       }

//       setTodos(allTodos);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       toast.error("Failed to fetch todos");
//     }
//   }, [createClient]);

//   // Auto-fetch when wallet loads
//   useEffect(() => {
//     if (accountId && privateKey) {
//       fetchTodos();
//     }
//   }, [accountId, privateKey, fetchTodos]);

//   // ---------------- ADD TODO ----------------
//   const AddTodo = async () => {
//     if (!todoTitle.trim()) {
//       toast.error("Title is required");
//       return;
//     }

//     const client = createClient();
//     if (!client) return;

//     try {
//       const dueDate = Math.floor(Date.now() / 1000) + 86400;

//       await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(500000)
//         .setFunction(
//           "addTodo",
//           new ContractFunctionParameters()
//             .addString(todoTitle)
//             .addString(todoDescription)
//             .addUint256(dueDate)
//         )
//         .execute(client);

//       toast.success("Todo added!");

//       setTodoTitle("");
//       setTodoDescription("");
//       setShowModal(false);

//       fetchTodos();
//     } catch (err) {
//       console.error("Add error:", err);
//       toast.error("Failed to add todo");
//     }
//   };

//   return (
//     <div className="TodoAppcontainer" >
//       <button onClick={() => setShowModal(true)} className="btn">
//         Add Todo
//       </button>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>

//             <input
//               type="text"
//               placeholder="Title"
//               value={todoTitle}
//               onChange={(e) => setTodoTitle(e.target.value)}
//               className="input"
//             />

//             <textarea
//               placeholder="Description"
//               value={todoDescription}
//               onChange={(e) => setTodoDescription(e.target.value)}
//               className="textarea"
//             />

//             <div className="button-group">
//               <button onClick={AddTodo} className="btn">
//                 Add
//               </button>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="btn disconnect"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>

//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p><strong>Title:</strong> {todo.title}</p>
//               <p><strong>Description:</strong> {todo.description}</p>
//               <p><strong>Status:</strong> {todo.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TodoApp;

// import { useState, useEffect } from "react";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   ContractExecuteTransaction,
// } from "@hashgraph/sdk";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";

// type Status = "Active" | "Completed" | "Expired";

// const CONTRACT_ID = "0.0.8028090";

// interface TodoAppProps {
//   accountId: string | null;
//   privateKey: string | null;
// }

// const TodoApp = ({ accountId, privateKey }: TodoAppProps) => {
//   const [todos, setTodos] = useState<{ title: string; description: string; status: Status }[]>([]);
//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [showModal, setShowModal] = useState(false);

//   const createClient = () => {
//     if (!accountId || !privateKey) throw new Error("Wallet not connected");
//     const client = import.meta.env.VITE_NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
//     client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
//     return client;
//   };

    

//   const fetchTodos = async () => {
//     if (!accountId || !privateKey) return;

//     try {
//       const client = createClient();
//       const totalTx = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(100_000)
//         .setFunction("getTotalTodos")
//         .execute(client);

//       const totalTodos = Number(totalTx.getUint256(0));
//       const allTodos: { title: string; description: string; status: Status }[] = [];

//       for (let i = 1; i <= totalTodos; i++) {
//         const todoRes = await new ContractCallQuery()
//           .setContractId(CONTRACT_ID)
//           .setGas(200_000)
//           .setFunction("getTodo", new ContractFunctionParameters().addUint256(i))
//           .execute(client);

//         const title = todoRes.getString(0);
//         const description = todoRes.getString(1);
//         const statusIndex = Number(todoRes.getUint256(3));
//         const status: Status = statusIndex === 0 ? "Active" : statusIndex === 1 ? "Completed" : "Expired";

//         allTodos.push({ title, description, status });
//       }

//       setTodos(allTodos);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch todos");
//     }
//   };

//   const addTodo = async () => {
//     if (!todoTitle || !accountId || !privateKey) {
//       toast.error("Wallet not connected or title missing");
//       return;
//     }

//     try {
//       const client = createClient();
//       const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//       await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(500_000)
//         .setFunction(
//           "addTodo",
//           new ContractFunctionParameters().addString(todoTitle).addString(todoDescription).addUint256(dueDate)
//         )
//         .execute(client);

//       toast.success("Todo added!");
//       setTodoTitle("");
//       setTodoDescription("");
//       setShowModal(false);
//       fetchTodos();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add todo");
//     }
//   };

//   useEffect(() => {
//     if (accountId && privateKey) fetchTodos();
//   }, [accountId, privateKey]);

//   return (
//     <div className="TodoAppcontainer">
//       <button onClick={() => setShowModal(true)} className="btn">
//         Add Todo
//       </button>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>
//             <input
//               type="text"
//               placeholder="Title"
//               value={todoTitle}
//               onChange={(e) => setTodoTitle(e.target.value)}
//               className="input"
//             />
//             <textarea
//               placeholder="Description"
//               value={todoDescription}
//               onChange={(e) => setTodoDescription(e.target.value)}
//               className="textarea"
//             />
//             <div className="button-group">
//               <button onClick={addTodo} className="btn">Add</button>
//               <button onClick={() => setShowModal(false)} className="btn disconnect">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>
//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p><strong>Title:</strong> {todo.title}</p>
//               <p><strong>Description:</strong> {todo.description}</p>
//               <p><strong>Status:</strong> {todo.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TodoApp;


// import { useState, useEffect } from "react";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   ContractExecuteTransaction,
// } from "@hashgraph/sdk";
// import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";

// type Status = "Active" | "Completed" | "Expired";

// const CONTRACT_ID = "0.0.8028090";

// interface TodoAppProps {
//   accountId: string | null;
//   privateKey: string | null;
// }

// const TodoApp = ({ accountId, privateKey }: TodoAppProps) => {
//   const [todos, setTodos] = useState<{ title: string; description: string; status: Status }[]>([]);
//   const [todoTitle, setTodoTitle] = useState("");
//   const [todoDescription, setTodoDescription] = useState("");
//   const [todoStatus, setTodoStatus] = useState<Status>("Active");
//   const [showModal, setShowModal] = useState(false);

//   // -------------------- Create Hedera Client --------------------
//   const createClient = () => {
//     if (!accountId || !privateKey) throw new Error("Wallet not connected");
//     const client = import.meta.env.VITE_NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
//     client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
//     return client;
//   };

//   // -------------------- Fetch Todos --------------------
//   const fetchTodos = async () => {
//     if (!accountId || !privateKey) return;

//     try {
//       const client = createClient();

//       const totalTx = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(100_000)
//         .setFunction("getTotalTodos")
//         .execute(client);

//       const totalTodos = Number(totalTx.getUint256(0));
//       const allTodos: { title: string; description: string; status: Status }[] = [];

//       for (let i = 1; i <= totalTodos; i++) {
//         const todoRes = await new ContractCallQuery()
//           .setContractId(CONTRACT_ID)
//           .setGas(200_000)
//           .setFunction("getTodo", new ContractFunctionParameters().addUint256(i))
//           .execute(client);

//         const title = todoRes.getString(0);
//         const description = todoRes.getString(1);

//         // ✅ Correct status index — adjust based on your contract
//         const statusIndex = Number(todoRes.getUint256(2));
//         const status: Status =
//           statusIndex === 0 ? "Active" : statusIndex === 1 ? "Completed" : "Expired";

//         allTodos.push({ title, description, status });
//       }

//       setTodos(allTodos);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch todos");
//     }
//   };

//   // -------------------- Add Todo --------------------
//   const addTodo = async () => {
//     if (!todoTitle || !accountId || !privateKey) {
//       toast.error("Wallet not connected or title missing");
//       return;
//     }

//     try {
//       const client = createClient();
//       const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//       await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(500_000)
//         .setFunction(
//           "addTodo",
//           new ContractFunctionParameters()
//             .addString(todoTitle)
//             .addString(todoDescription)
//             .addUint256(dueDate)
//         )
//         .execute(client);

//       toast.success("Todo added!");
//       setTodoTitle("");
//       setTodoDescription("");
//       setTodoStatus("Active");
//       setShowModal(false);

//       fetchTodos();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add todo");
//     }
//   };

//   // -------------------- Fetch todos on wallet connect --------------------
//   useEffect(() => {
//     if (accountId && privateKey) fetchTodos();
//   }, [accountId, privateKey]);

//   // -------------------- Render --------------------
//   return (
//     <div className="TodoAppcontainer">
//       <button onClick={() => setShowModal(true)} className="btn">
//         Add Todo
//       </button>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h3>Add Todo</h3>
//             <input
//               type="text"
//               placeholder="Title"
//               value={todoTitle}
//               onChange={(e) => setTodoTitle(e.target.value)}
//               className="input"
//             />
//             <textarea
//               placeholder="Description"
//               value={todoDescription}
//               onChange={(e) => setTodoDescription(e.target.value)}
//               className="textarea"
//             />
//             <select
//               value={todoStatus}
//               onChange={(e) => setTodoStatus(e.target.value as Status)}
//               className="select"
//             >
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Expired">Expired</option>
//             </select>
//             <div className="button-group">
//               <button onClick={addTodo} className="btn">Add</button>
//               <button onClick={() => setShowModal(false)} className="btn disconnect">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {todos.length > 0 && (
//         <div className="todo-list">
//           <h3>Todo List</h3>
//           {todos.map((todo, idx) => (
//             <div key={idx} className="todo-item">
//               <p><strong>Title:</strong> {todo.title}</p>
//               <p><strong>Description:</strong> {todo.description}</p>
//               <p><strong>Status:</strong> {todo.status}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {todos.length === 0 && <p>No todos found.</p>}
//     </div>
//   );
// };

// export default TodoApp;

// import { useState, useEffect } from "react";
// import {Link} from "react-router-dom";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   ContractExecuteTransaction,
// } from "@hashgraph/sdk";
// import { toast } from "react-toastify";
// import "../Styles/TodoApp.css";

// type Status = "Active" | "Completed" | "Expired";

// const CONTRACT_ID = "0.0.8028090";

// interface TodoAppProps {
//   accountId: string | null;
//   privateKey: string | null;
// }

// const TodoApp = ({ accountId, privateKey }: TodoAppProps) => {
//   const [todos, setTodos] = useState<{ title: string; description: string; status: Status }[]>([]);
//   const [todoTitle, setTodoTitle] = useState("");
//   const [activeFilter, setActiveFilter] = useState<Status | "All">("All");

//   // -------------------- Create Hedera Client --------------------
//   const createClient = () => {
//     if (!accountId || !privateKey) throw new Error("Wallet not connected");
//     const client = import.meta.env.VITE_NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
//     client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
//     return client;
//   };

//   // -------------------- Fetch Todos --------------------
//   // const fetchTodos = async () => {
//   //   if (!accountId || !privateKey) return;

//   //   try {
//   //     const client = createClient();

//   //     const totalTx = await new ContractCallQuery()
//   //       .setContractId(CONTRACT_ID)
//   //       .setGas(500_000)
//   //       .setFunction("getTotalTodos")
//   //       .execute(client);

//   //     const totalTodos = Number(totalTx.getUint256(0));
//   //     const allTodos: { title: string; description: string; status: Status }[] = [];

//   //     for (let i = 1; i <= totalTodos; i++) {
//   //       const todoRes = await new ContractCallQuery()
//   //         .setContractId(CONTRACT_ID)
//   //         .setGas(200_000)
//   //         .setFunction("getTodo", new ContractFunctionParameters().addUint256(i))
//   //         .execute(client);

//   //       const title = todoRes.getString(0);
//   //       const description = todoRes.getString(1);
//   //       const statusIndex = Number(todoRes.getUint256(2));
//   //       const status: Status =
//   //         statusIndex === 0 ? "Active" : statusIndex === 1 ? "Completed" : "Expired";

//   //       allTodos.push({ title, description, status });
//   //     }

//   //     setTodos(allTodos);
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Failed to fetch todos");
//   //   }
//   // };

//   const fetchTodos = async () => {
//   if (!accountId || !privateKey) return;

//   try {
//     const client = createClient();

//     const totalTx = await new ContractCallQuery()
//       .setContractId(CONTRACT_ID)
//       .setGas(500_000)
//       .setFunction("getTotalTodos")
//       .execute(client);

//     const totalTodos = Number(totalTx.getUint256(0));
//     const allTodos: { title: string; description: string; status: Status }[] = [];

//     for (let i = 1; i <= totalTodos; i++) {
//       const todoRes = await new ContractCallQuery()
//         .setContractId(CONTRACT_ID)
//         .setGas(200_000)
//         .setFunction("getTodo", new ContractFunctionParameters().addUint256(i))
//         .execute(client);

//       const title = todoRes.getString(0);
//       const description = todoRes.getString(1);
//       const statusIndex = Number(todoRes.getUint256(3)); // <-- index 3, not 2
//       const status: Status =
//         statusIndex === 0 ? "Active" : statusIndex === 1 ? "Completed" : "Expired";

//       allTodos.push({ title, description, status });
//     }

//     setTodos(allTodos);
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to fetch todos");
//   }
// };

//   // -------------------- Add Todo --------------------
//   const addTodo = async () => {
//     if (!todoTitle || !accountId || !privateKey) {
//       toast.error("Please enter a task");
//       return;
//     }

//     try {
//       const client = createClient();
//       const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

//       await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(500_000)
//         .setFunction(
//           "addTodo",
//           new ContractFunctionParameters()
//             .addString(todoTitle)
//             .addString("") // Keeping description empty for the quick-add UI
//             .addUint256(dueDate)
//         )
//         .execute(client);

//       toast.success("Todo added!");
//       setTodoTitle("");
//       fetchTodos();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add todo");
//     }
//   };

//   useEffect(() => {
//     if (accountId && privateKey) fetchTodos();
//   }, [accountId, privateKey]);

//   // Filter logic
//   const filteredTodos = todos.filter(t => 
//     activeFilter === "All" ? true : t.status === activeFilter
//   );

//   return (
//     <div className="todo-container">

//       <Link to="/">home</Link>
//       <h2 className="header-title">Todo List</h2>

//       {/* Input Section */}
//       <div className="input-group">
//         <input
//           type="text"
//           placeholder="Add a new task..."
//           value={todoTitle}
//           onChange={(e) => setTodoTitle(e.target.value)}
//           className="main-input"
//         />
//         <button onClick={addTodo} className="add-btn">+</button>
//       </div>

//       {/* Tabs Section */}
//       <div className="tabs-container">
//         {["All", "Active", "Completed"].map((tab) => (
//           <button
//             key={tab}
//             className={`tab-item ${activeFilter === tab ? "active-tab" : ""}`}
//             onClick={() => setActiveFilter(tab as any)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* List / Empty State */}
//       <div className="content-area">
//         {filteredTodos.length > 0 ? (
//           <div className="todo-list">
//             {filteredTodos.map((todo, idx) => (
//               <div key={idx} className="todo-card">
//                 <div className="todo-info">
//                   <p className="todo-text">{todo.title}</p>
//                   <span className={`status-badge ${todo.status.toLowerCase()}`}>
//                     {todo.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="empty-state">
//             <div className="check-icon-circle">
//               <span className="checkmark">✓</span>
//             </div>
//             <p>Your todo list is empty. Add a task to get started!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TodoApp;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Client,
  AccountId,
  PrivateKey,
  ContractCallQuery,
  ContractFunctionParameters,
  ContractExecuteTransaction,
} from "@hashgraph/sdk";
import { toast } from "react-toastify";
import "../Styles/TodoApp.css";

type Status = "Active" | "Completed" | "Expired";

const CONTRACT_ID = "0.0.8028090";

interface TodoAppProps {
  accountId: string | null;
  privateKey: string | null;
}

const TodoApp = ({ accountId, privateKey }: TodoAppProps) => {
  const [todos, setTodos] = useState<{ title: string; description: string; status: Status }[]>([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [activeFilter, setActiveFilter] = useState<Status | "All">("All");

  // -------------------- Create Hedera Client --------------------
  const createClient = () => {
    if (!accountId || !privateKey) throw new Error("Wallet not connected");
    const client = import.meta.env.VITE_NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
    return client;
  };

  // -------------------- Fetch Todos --------------------
  const fetchTodos = async () => {
    if (!accountId || !privateKey) return;

    try {
      const client = createClient();

      const totalTx = await new ContractCallQuery()
        .setContractId(CONTRACT_ID)
        .setGas(500_000)
        .setFunction("getTotalTodos")
        .execute(client);

      const totalTodos = Number(totalTx.getUint256(0));
      const allTodos: { title: string; description: string; status: Status }[] = [];

      for (let i = 1; i <= totalTodos; i++) {
        const todoRes = await new ContractCallQuery()
          .setContractId(CONTRACT_ID)
          .setGas(200_000)
          .setFunction("getTodo", new ContractFunctionParameters().addUint256(i))
          .execute(client);

        const title = todoRes.getString(0);
        const description = todoRes.getString(1);
        const statusIndex = Number(todoRes.getUint256(3)); // <-- correct index
        const status: Status =
          statusIndex === 0 ? "Active" : statusIndex === 1 ? "Completed" : "Expired";

        allTodos.push({ title, description, status });
      }

      setTodos(allTodos);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch todos");
    }
  };

  // -------------------- Add Todo --------------------
  const addTodo = async () => {
    if (!todoTitle || !accountId || !privateKey) {
      toast.error("Please enter a task");
      return;
    }

    try {
      const client = createClient();
      const dueDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

      await new ContractExecuteTransaction()
        .setContractId(CONTRACT_ID)
        .setGas(500_000)
        .setFunction(
          "addTodo",
          new ContractFunctionParameters()
            .addString(todoTitle)
            .addString("") // description empty for quick-add
            .addUint256(dueDate)
        )
        .execute(client);

      toast.success("Todo added!");
      setTodoTitle("");
      fetchTodos();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add todo");
    }
  };

  // -------------------- Polling / Hot reload --------------------
  useEffect(() => {
    if (!accountId || !privateKey) return;

    fetchTodos(); // initial fetch

    const intervalId = setInterval(() => {
      fetchTodos(); // poll every 5 seconds
    }, 5000);

    return () => clearInterval(intervalId);
  }, [accountId, privateKey]);

  // -------------------- Filtered Todos --------------------
  const filteredTodos = todos.filter(t =>
    activeFilter === "All" ? true : t.status === activeFilter
  );

  return (
    <div className="todo-container">

      <Link to="/">home</Link>
      <h2 className="header-title">Todo List</h2>

      {/* Input Section */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Add a new task..."
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          className="main-input"
        />
        <button onClick={addTodo} className="add-btn">+</button>
      </div>

      {/* Tabs Section */}
      <div className="tabs-container">
        {["All", "Active", "Completed"].map((tab) => (
          <button
            key={tab}
            className={`tab-item ${activeFilter === tab ? "active-tab" : ""}`}
            onClick={() => setActiveFilter(tab as any)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List / Empty State */}
      <div className="content-area">
        {filteredTodos.length > 0 ? (
          <div className="todo-list">
            {filteredTodos.map((todo, idx) => (
              <div key={idx} className="todo-card">
                <div className="todo-info">
                  <p className="todo-text">{todo.title}</p>
                  <span className={`status-badge ${todo.status.toLowerCase()}`}>
                    {todo.status}
                  </span>
                </div>
                <input type="checkbox" name="" id="" />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="check-icon-circle">
              <span className="checkmark">✓</span>
            </div>
            <p>Your todo list is empty. Add a task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;