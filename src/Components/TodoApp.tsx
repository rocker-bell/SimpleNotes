// test3

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

const CONTRACT_ID = "0.0.8078086";
const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60; // 604800 seconds

interface TodoAppProps {
  accountId: string | null;
  privateKey: string | null;
  evmAddress: string | null;
}

interface TodoItem {
  id: number;
  title: string;
  description: string;
  status: Status;
  owner: string;
  dueDate: number;
}

const TodoApp = ({ accountId, privateKey, evmAddress }: TodoAppProps) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [activeFilter, setActiveFilter] = useState<Status | "All">("All");

  const createClient = () => {
    if (!accountId || !privateKey) throw new Error("Wallet not connected");
    const client = import.meta.env.VITE_NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
    return client;
  };

  // const fetchTodos = async () => {
  //   if (!accountId || !privateKey || !evmAddress) return;

  //   try {
  //     const client = createClient();
  //     const totalTx = await new ContractCallQuery()
  //       .setContractId(CONTRACT_ID)
  //       .setGas(100_000)
  //       .setFunction("getTotalTodos")
  //       .execute(client);

  //     const totalTodos = Number(totalTx.getUint256(0));
  //     const allTodos: TodoItem[] = [];

  //     for (let i = 1; i <= totalTodos; i++) {
  //       const todoRes = await new ContractCallQuery()
  //         .setContractId(CONTRACT_ID)
  //         .setGas(400_000)
  //         .setFunction("getTodo", new ContractFunctionParameters().addUint256(i))
  //         .execute(client);

  //       const title = todoRes.getString(0);
  //       const description = todoRes.getString(1);
  //       const dueDate = Number(todoRes.getUint256(2));
  //       const statusIndex = Number(todoRes.getUint8(3)); 
  //       const rawOwnerAddress = todoRes.getAddress(5); 

  //       const ownerAccountId = AccountId.fromSolidityAddress(rawOwnerAddress).toString();
        
  //       const statusMap: Record<number, Status> = { 0: "Active", 1: "Completed", 2: "Expired" };

  //       allTodos.push({
  //         id: i,
  //         title,
  //         description,
  //         status: statusMap[statusIndex] || "Expired",
  //         owner: ownerAccountId,
  //         dueDate: dueDate
  //       });
  //     }

  //     const myNormalizedId = AccountId.fromString(accountId).toString();
  //     const userTodos = allTodos.filter(todo => todo.owner === myNormalizedId);
  //     setTodos(userTodos);
  //   } catch (err) {
  //     console.error("Fetch Error:", err);
  //   }
  // };

  const fetchTodos = async () => {
  if (!accountId || !privateKey || !evmAddress) return;

  try {
    const client = createClient();

    const totalTx = await new ContractCallQuery()
      .setContractId(CONTRACT_ID)
      .setGas(100_000)
      .setFunction("getTotalTodos")
      .execute(client);

    const totalTodos = Number(totalTx.getUint256(0));
    const allTodos: TodoItem[] = [];

    for (let i = 1; i <= totalTodos; i++) {

      const todoRes = await new ContractCallQuery()
        .setContractId(CONTRACT_ID)
        .setGas(400_000)
        .setFunction("getTodo", new ContractFunctionParameters().addUint256(i))
        .execute(client);

      // ✅ correct decoding order
      const title = todoRes.getString(0);
      const description = todoRes.getString(1);
      // const createdAt = Number(todoRes.getUint256(2));
      const dueDate = Number(todoRes.getUint256(3));
      const statusIndex = Number(todoRes.getUint8(4));
      const rawOwnerAddress = todoRes.getAddress(5);

      const ownerAccountId =
        AccountId.fromSolidityAddress(rawOwnerAddress).toString();

      const statusMap: Record<number, Status> = {
        0: "Active",
        1: "Completed",
        2: "Expired"
      };

      allTodos.push({
        id: i,
        title,
        description,
        status: statusMap[statusIndex] || "Expired",
        owner: ownerAccountId,
        dueDate
      });
    }

    const myNormalizedId = AccountId.fromString(accountId).toString();

    const userTodos = allTodos.filter(
      (todo) => todo.owner === myNormalizedId
    );

    setTodos(userTodos);

  } catch (err) {
    console.error("Fetch Error:", err);
  }
};

  const addTodo = async () => {
  if (!todoTitle || !accountId || !privateKey) {
    toast.error("Please enter a task");
    return;
  }

  try {
    const client = createClient();

    const dueDate = Math.floor(Date.now() / 1000) + ONE_WEEK_SECONDS;

    const tx = await new ContractExecuteTransaction()
      .setContractId(CONTRACT_ID)
      .setGas(500_000)
      .setFunction(
        "addTodo",
        new ContractFunctionParameters()
          .addString(todoTitle)
          .addString("")
          .addUint256(dueDate)
      )
      .execute(client);

    await tx.getReceipt(client);

    toast.success("Todo added (expires in 1 week)");
    setTodoTitle("");
    fetchTodos();

  } catch (err) {
    console.error(err);
    toast.error("Failed to add todo");
  }
};
  const updateTodoStatus = async (todoId: number, newStatus: Status) => {
    if (!accountId || !privateKey) return;

    try {
      const client = createClient();
      const statusValue = newStatus === "Active" ? 0 : 1;

      const tx = await new ContractExecuteTransaction()
        .setContractId(CONTRACT_ID)
        .setGas(500_000)
        .setFunction(
          "updateStatus",
          new ContractFunctionParameters().addUint256(todoId).addUint8(statusValue)
        )
        .execute(client);

      await tx.getReceipt(client);
      fetchTodos();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    if (!accountId || !privateKey || !evmAddress) return;
    fetchTodos();
    const intervalId = setInterval(fetchTodos, 10000);
    return () => clearInterval(intervalId);
  }, [accountId, privateKey, evmAddress]);

  const filteredTodos = todos.filter(t => {
    const now = Math.floor(Date.now() / 1000);
    const isTimedOut = t.dueDate < now;

    // Logic: In 'Active' tab, only show if Active and NOT timed out.
    // In 'All' tab, show everything so the user can see Expired items to reactivate them.
    if (activeFilter === "Active") return t.status === "Active" && !isTimedOut;
    if (activeFilter === "Completed") return t.status === "Completed";
    return true; 
  });

  return (
    <div className="todo-container">
      <Link to="/ConnectWallet">
            <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
      </Link>
      <h2 className="header-title">Todo List</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Add a new task..."
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          className="main-input"
        />
        <button onClick={addTodo} className="add-btn">+</button>
      </div>

      <div className="tabs-container">
        {["All", "Active", "Completed"].map(tab => (
          <button
            key={tab}
            className={`tab-item ${activeFilter === tab ? "active-tab" : ""}`}
            onClick={() => setActiveFilter(tab as any)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="content-area">
        {filteredTodos.length > 0 ? (
          <div className="todo-list">
            {filteredTodos.map(todo => {
              const now = Math.floor(Date.now() / 1000);
              const isTimedOut = todo.dueDate < now && todo.status === "Active";
              const displayStatus = isTimedOut ? "Expired" : todo.status;

              return (
                <div key={todo.id} className={`todo-card ${displayStatus.toLowerCase()}`}>
                  <div className="todo-info">
                    <p className="todo-text">{todo.title}</p>
                    <div className="todo-meta">
                      <span className={`status-badge ${displayStatus.toLowerCase()}`}>
                        {displayStatus}
                      </span>
                      <span className="due-date-display">
                        Due: {new Date(todo.dueDate * 1000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={todo.status === "Completed"}
                    onChange={() =>
                      updateTodoStatus(
                        todo.id,
                        todo.status === "Completed" ? "Active" : "Completed"
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="empty-state">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default TodoApp;