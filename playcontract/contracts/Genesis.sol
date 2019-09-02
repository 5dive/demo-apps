pragma solidity ^0.5.0;

// A sample implementation of core ERC1155 function.
contract Genesis
{
    event GenesisPayment(address _from, string _msg);
    function pay() public payable  {
        emit GenesisPayment(msg.sender, "Genesis was triggered");
    }
}
