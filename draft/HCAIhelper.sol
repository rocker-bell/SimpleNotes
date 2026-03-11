// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HederaAIChat {

    struct Message {
        address user;
        string prompt;
        string response;
        uint256 timestamp;
    }

    Message[] public messages;

    function sendPrompt(string calldata prompt) external returns(uint256) {

        messages.push(
            Message({
                user: msg.sender,
                prompt: prompt,
                response: "",
                timestamp: block.timestamp
            })
        );

        return messages.length - 1;
    }

    function addResponse(uint256 id, string calldata response) external {
        messages[id].response = response;
    }

    function getMessage(uint256 id) public view returns(Message memory){
        return messages[id];
    }
}