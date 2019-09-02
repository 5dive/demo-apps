pragma solidity ^0.5.0;

// A sample implementation of core ERC1155 function.
import './Root.sol';
contract PayAll is Root
{
    event Payment(address  _from, address _to, uint256 _val, uint256 _when);
    function pay(address payable one, address payable two) public  payable {
        super.pay(one, two);
        emit Payment(msg.sender, address(this), msg.value, now);
        uint256 val = msg.value/3;
        one.transfer(val);
        emit Payment(address(this), one, val, now);
        two.transfer(val);
        emit Payment(address(this), two, val, now);
    }
}
