"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const test_1 = require("./test");
const SBit_1 = require("./SBit");
const Contract_1 = require("./Contract");
describe("SBit", () => {
    const SBIT = new SBit_1.SBit(test_1.rpcURL, test_1.repoData);
    it("can instantiate a contract", () => {
        const contract = SBIT.contract("test/contracts/Methods.sol");
        chai_1.assert.instanceOf(contract, Contract_1.Contract);
    });
    it("throws an error if contract is not known", () => {
        // assertThrow
        chai_1.assert.throw(() => {
            SBIT.contract("test/contracts/Unknown.sol");
        });
    });
});
