// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HederaAIChat {

    struct Message {
        address sender;
        string text;
        uint256 timestamp;
    }

    mapping(address => Message[]) private conversations;

    // Send a message
    function sendMessage(string calldata _text) external {
        conversations[msg.sender].push(
            Message(msg.sender, _text, block.timestamp)
        );
    }

    // AI replies (backend calls this)
    function sendAIReply(address _user, string calldata _text) external {
        conversations[_user].push(
            Message(address(this), _text, block.timestamp)
        );
    }

    // Fetch conversation for user
    function getConversation(address _user) external view returns (Message[] memory) {
        return conversations[_user];
    }
}