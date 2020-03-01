pragma solidity ^0.5.0;
/* 
Dummy Comment
*/
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract TutorialToken is ERC20 {
	using SafeMath for uint256;
	string public name = "TutorialToken";
	string public symbol = "TT";
	uint8 public decimals = 2;
	uint256 public INITAL_SUPPLY = 420;
	
	ERC20 public token; // REMOVE this line
	
	// rename this to owner payable shouldn't be required now 
	address public owner;
	
	uint256 public rate;
	uint256 public weiRaised;

      
	constructor() public {
		rate = 10;
		// this would be owner
		owner = msg.sender;
	}

	function stabilizeRate() public {
		rate = rate * totalSupply();
	}

	function _transfer(address from, address to, uint256 value) internal {
		_transfer(from, to, value);
	}

	// The refactor here would probably be to not include beneficiary unless you need to buy a token on someone's behalf
	function buyExampleToken() public payable {
		require(msg.value != 0);

		uint256 tokensToETC = msg.value.mul(rate); // Refactor to a more clear name ex. numTokens?
		//refactored weiRaised to use balance instead
		uint256 nextBalance = address(this).balance.add(msg.value);
		// Here is a good place for a security/sanity check its ETC is MONEEY!
		require(nextBalance > address(this).balance);
		//refactor _beneficiary to msg.sender
		
		_mint(msg.sender, tokensToETC);
		
		// We are removing the transfer function from this
		// token.transfer(msg.sender, tokensToETC);
		
		//wallet should be owner , this will take all the users money and give it to the owner :D !!
		//owner.transfer(msg.value);
		/*
			we might implement a withdraw function where we call owner.transfer
		 */
		
		stabilizeRate();
	}
}
