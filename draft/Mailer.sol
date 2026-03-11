// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Mailer {
    // Basic token details
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    address payable public owner;

    // Pricing & wallet limits
    uint256 public pricePerToken = 0.0000001 ether;
    uint256 public maxWallet;

    // Tax
    uint256 public taxBasisPoints;
    address public taxTreasury;

    // Burn timing
    uint256 public immutable burnStartTime;
    uint256 public burnAmountPerInterval;
    uint256 public burnInterval;
    uint256 public lastBurnTime;
    uint256 public totalBurned;

    // Message cost
    uint256 public messageCost = 1 * (10 ** uint256(decimals));

    // Balances / allowances
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;
    mapping(address => bool) public blockedAddresses;
    mapping(address => bool) public registeredUsers;

    // Message structure and mapping
   // Modify Message struct to include recipient address
struct Message {
    uint256 timestamp;
    address sender;
    address recipient;  // Store recipient address
    string content;
}


    // Mapping of user addresses to messages
    mapping(address => Message[]) public receivedMessages;
    mapping(address => Message[]) public sentMessages;

    // Interaction tracking
    struct Interaction {
        uint256 timestamp;
        address account;
        string action;
        uint256 amount;
    }
    Interaction[] public interactions;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed ownerAddr, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event ReclaimedOwnership(address indexed previousOwner, address indexed reclaimedBy);
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed burner, uint256 amount);
    event BlockedAddress(address indexed blockedAddress);
    event UnblockedAddress(address indexed unblockedAddress);
    event AutoBurn(address indexed executedBy, uint256 amountBurned);
    event UserRegistered(address indexed user);
    event MessageSent(address indexed sender, address indexed recipient, string content);
    event MessageCostUpdated(uint256 oldCost, uint256 newCost);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier notBlocked() {
        require(!blockedAddresses[msg.sender], "Address is blocked");
        _;
    }

    modifier isRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    modifier isValidRecipient(address recipient) {
        require(registeredUsers[recipient], "Recipient not registered");
        _;
    }

    // Constructor
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 initialSupply,
        uint256 _maxWallet,
        uint256 _taxBasisPoints,
        address _taxTreasury,
        uint256 burnDelaySeconds,
        uint256 _burnIntervalSeconds
    ) {
        name = _name;
        symbol = _symbol;
        owner = payable(msg.sender);
        maxWallet = _maxWallet;
        taxBasisPoints = _taxBasisPoints;
        taxTreasury = _taxTreasury;
        burnStartTime = block.timestamp + burnDelaySeconds;
        burnInterval = _burnIntervalSeconds;
        lastBurnTime = block.timestamp;
        _mint(owner, initialSupply);
    }

    // ===========================
    // Info & Token Management
    // ===========================
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function approve(address spender, uint256 amount) public notBlocked returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) public notBlocked returns (bool) {
        require(to != address(0), "Zero address");

        uint256 tax = (amount * taxBasisPoints) / 10000;
        uint256 totalAmount = amount + tax;

        require(balances[msg.sender] >= totalAmount, "Not enough balance to cover transfer + tax");

        balances[msg.sender] -= totalAmount;
        balances[to] += amount;

        if (tax > 0) {
            balances[taxTreasury] += tax;
            emit Transfer(msg.sender, taxTreasury, tax);
        }

        emit Transfer(msg.sender, to, amount);
        interactions.push(Interaction(block.timestamp, msg.sender, "Transfer", totalAmount));
        return true;
    }

    // ===========================
    // Mint & Burn Logic
    // ===========================
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Mint to zero address");
        totalSupply += amount;
        balances[account] += amount;
        emit Transfer(address(0), account, amount);
        emit Mint(account, amount);
        interactions.push(Interaction(block.timestamp, account, "Mint", amount));
    }

    function burn(uint256 amount) public notBlocked {
        require(balances[msg.sender] >= amount, "Not enough balance to burn");
        balances[msg.sender] -= amount;
        totalSupply -= amount;
        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
        interactions.push(Interaction(block.timestamp, msg.sender, "Burn", amount));
    }

    // ===========================
    // Auto Burn (periodic)
    // ===========================
    function autoBurn() public onlyOwner {
        require(block.timestamp >= burnStartTime, "Auto-burn not started yet");
        require(block.timestamp >= lastBurnTime + burnInterval, "Too soon for next auto burn");

        uint256 burnAmount = totalSupply / 1000;
        require(burnAmount > 0, "Nothing to burn");

        if (balances[owner] >= burnAmount) {
            balances[owner] -= burnAmount;
        } else if (balances[address(this)] >= burnAmount) {
            balances[address(this)] -= burnAmount;
        }

        totalBurned += burnAmount;
        totalSupply -= burnAmount;
        lastBurnTime = block.timestamp;
        emit AutoBurn(msg.sender, burnAmount);
        emit Transfer(address(this), address(0), burnAmount);
    }

    // ===========================
    // Ownership Functions
    // ===========================
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = payable(newOwner);
    }

    function reclaimOwnership() public onlyOwner {
        emit ReclaimedOwnership(owner, msg.sender);
        owner = payable(msg.sender);
    }

    // ===========================
    // Block / Unblock Addresses
    // ===========================
    function blockAddress(address _address) public onlyOwner {
        blockedAddresses[_address] = true;
        emit BlockedAddress(_address);
    }

    function unblockAddress(address _address) public onlyOwner {
        blockedAddresses[_address] = false;
        emit UnblockedAddress(_address);
    }

    function isBlocked(address _address) public view returns (bool) {
        return blockedAddresses[_address];
    }

    // ===========================
    // User Registration & Messaging
    // ===========================
    function registerUser() public {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;

        uint256 registrationReward = 100 * (10 ** uint256(decimals));
        _mint(msg.sender, registrationReward);
        // totalSupply -= registrationReward;

        // emit Transfer(address(0), msg.sender, registrationReward);
        // interactions.push(Interaction(block.timestamp, msg.sender, "RegisterUser", registrationReward));

        emit UserRegistered(msg.sender);
    }

    // function sendMessage(address recipient, string memory messageContent) public isRegistered isValidRecipient(recipient) notBlocked {
    //     uint256 tax = (messageCost * taxBasisPoints) / 10000;
    //     uint256 totalCost = messageCost + tax;

    //     require(balances[msg.sender] >= totalCost, "Insufficient tokens to send message");

    //     balances[msg.sender] -= totalCost;

    //     if (tax > 0) {
    //         balances[taxTreasury] += tax;
    //         emit Transfer(msg.sender, taxTreasury, tax);
    //     }

    //     totalSupply -= messageCost;
    //     emit Burn(msg.sender, messageCost);
    //     emit Transfer(msg.sender, address(0), messageCost);

    //     Message memory newMessage = Message(block.timestamp, msg.sender, messageContent);
    //     receivedMessages[recipient].push(newMessage);
    //     sentMessages[msg.sender].push(newMessage);

    //     emit MessageSent(msg.sender, recipient, messageContent);
    //     interactions.push(Interaction(block.timestamp, msg.sender, "SendMessage", totalCost));
    // }


    function sendMessage(address recipient, string memory messageContent) public isRegistered isValidRecipient(recipient) notBlocked {
    uint256 tax = (messageCost * taxBasisPoints) / 10000;
    uint256 totalCost = messageCost + tax;

    require(balances[msg.sender] >= totalCost, "Insufficient tokens to send message");

    balances[msg.sender] -= totalCost;

    if (tax > 0) {
        balances[taxTreasury] += tax;
        emit Transfer(msg.sender, taxTreasury, tax);
    }

    totalSupply -= messageCost;
    emit Burn(msg.sender, messageCost);
    emit Transfer(msg.sender, address(0), messageCost);

    // Store both sender and recipient in the sent messages
    Message memory newMessage = Message(block.timestamp, msg.sender, recipient, messageContent);
    receivedMessages[recipient].push(newMessage);
    sentMessages[msg.sender].push(newMessage);

    emit MessageSent(msg.sender, recipient, messageContent);
    interactions.push(Interaction(block.timestamp, msg.sender, "SendMessage", totalCost));
}


    function getReceivedMessages(address user) public view returns (Message[] memory) {
        return receivedMessages[user];
    }

    function getSentMessages(address user) public view returns (Message[] memory) {
        return sentMessages[user];
    }

    function setMessageCost(uint256 newCost) public onlyOwner {
        require(newCost > 0, "Message cost must be greater than zero");
        uint256 oldCost = messageCost;
        messageCost = newCost;
        emit MessageCostUpdated(oldCost, newCost);
    }

    // ===========================
    // Helper Functions
    // ===========================
   
    function getInteractions() public view returns (Interaction[] memory) {
        return interactions;
    }
}
