import "mocha"

import { assert } from "chai"

import { rpcURL, repoData } from "./test"
import { SBit } from "./SBit"
import { Contract } from "./Contract"

describe("SBit", () => {
  const sbit = new SBit(rpcURL, repoData)

  it("can instantiate a contract", () => {
    const contract = sbit.contract("test/contracts/Methods.sol")
    assert.instanceOf(contract, Contract)
  })

  it("throws an error if contract is not known", () => {
    // assertThrow
    assert.throw(() => {
      sbit.contract("test/contracts/Unknown.sol")
    })
  })
})
