// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {

    // Enum to represent the status of the to-do item
    enum Status { Active, Completed, Expired }

    // Struct for a single Todo item
    struct Todo {
        string title;
        string description;
        uint256 dueDate; // Timestamp
        Status status;
        address accountId; // Owner (Hedera EVM address)
    }

    // Mapping of Todo ID to Todo struct
    mapping(uint256 => Todo) public todos;

    // Variable to keep track of the number of todos
    uint256 public todoCount;

    // Event to log when a new todo is added
    event TodoAdded(
        uint256 todoId,
        string title,
        string description,
        uint256 dueDate,
        address accountId
    );

    // Event to log when a todo status is changed
    event TodoStatusChanged(uint256 todoId, Status status);

    // Modifier to restrict access to owner
    modifier onlyOwner(uint256 _todoId) {
        require(_todoId > 0 && _todoId <= todoCount, "Todo does not exist.");
        require(todos[_todoId].accountId == msg.sender, "Not authorized.");
        _;
    }

    // Function to add a new Todo
    function addTodo(
        string memory _title,
        string memory _description,
        uint256 _dueDate
    ) public {

        todoCount++;

        todos[todoCount] = Todo({
            title: _title,
            description: _description,
            dueDate: _dueDate,
            status: Status.Active,
            accountId: msg.sender
        });

        emit TodoAdded(
            todoCount,
            _title,
            _description,
            _dueDate,
            msg.sender
        );
    }

    // OLD FUNCTIONALITY (now owner protected)
    // Function to mark a Todo as completed
    function completeTodo(uint256 _todoId)
        public
        onlyOwner(_todoId)
    {
        require(
            todos[_todoId].status != Status.Expired,
            "Todo is expired and cannot be completed."
        );

        todos[_todoId].status = Status.Completed;

        emit TodoStatusChanged(_todoId, Status.Completed);
    }

    // OLD FUNCTIONALITY (now owner protected)
    // Function to check if a Todo has timed out (due date passed)
    function checkTimeout(uint256 _todoId)
        public
        onlyOwner(_todoId)
    {
        Todo storage todo = todos[_todoId];

        if (
            todo.dueDate < block.timestamp &&
            todo.status == Status.Active
        ) {
            todo.status = Status.Expired;

            emit TodoStatusChanged(_todoId, Status.Expired);
        }
    }

    // NEW FUNCTIONALITY
    // Allows changing status freely between Active, Completed, Expired
    function updateStatus(uint256 _todoId, Status _newStatus)
        public
        onlyOwner(_todoId)
    {
        todos[_todoId].status = _newStatus;

        emit TodoStatusChanged(_todoId, _newStatus);
    }

    // Function to get the details of a Todo
    function getTodo(uint256 _todoId)
        public
        view
        returns (
            string memory title,
            string memory description,
            uint256 dueDate,
            Status status,
            address accountId
        )
    {
        require(_todoId > 0 && _todoId <= todoCount, "Todo does not exist.");

        Todo memory todo = todos[_todoId];

        return (
            todo.title,
            todo.description,
            todo.dueDate,
            todo.status,
            todo.accountId
        );
    }

    // Function to get total number of todos
    function getTotalTodos() public view returns (uint256) {
        return todoCount;
    }

    // Optional function to get status as string (for frontend display)
    function getStatusAsString(Status _status)
        public
        pure
        returns (string memory)
    {
        if (_status == Status.Active) {
            return "Active";
        } else if (_status == Status.Completed) {
            return "Completed";
        } else {
            return "Expired";
        }
    }
}