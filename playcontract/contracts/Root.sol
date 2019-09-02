pragma solidity ^0.5.0;

// A sample implementation of core ERC1155 function.
import './Genesis.sol';
contract Root is Genesis
{
    event RootPayment(address  _from, address _to, uint256 _val, uint256 _when);
    function pay(address payable one, address payable two) public payable {
        //Genesis.pay();
        Genesis(address(this)).pay();
        one;
        emit RootPayment(msg.sender, two, 0, 0);
    }
}
