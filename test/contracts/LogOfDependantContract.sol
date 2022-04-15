pragma solidity ^0.5.8;

import "./LogOfDependantContractChild.sol";

// https://github.com/SBit-Project/sbitjs/issues/4
contract LogOfDependantContract {
  LogOfDependantContractChild testContract;

  constructor() public {
    testContract = new LogOfDependantContractChild();
  }

  function emitLog() public {
    testContract.emitFoo();
  }
}
