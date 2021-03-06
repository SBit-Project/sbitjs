"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const test_1 = require("./test");
const ContractsRepo_1 = require("./ContractsRepo");
describe("ContractsRepo", () => {
    // don't act as sender
    const repo = new ContractsRepo_1.ContractsRepo(test_1.rpc, test_1.repoData);
    it("can instantiate a contract", () => {
        const contract = repo.contract("test/contracts/LogOfDependantContract.sol");
        chai_1.assert.isNotNull(contract);
        chai_1.assert.strictEqual(contract.info, test_1.repoData.contracts["test/contracts/LogOfDependantContract.sol"]);
    });
    it("can instantiate a contract with an log decoder that knows about all events", async () => {
        const contract = repo.contract("test/contracts/LogOfDependantContract.sol");
        const result = await contract.call("emitLog");
        const fooEvent = result.logs[0];
        chai_1.assert.isNotNull(fooEvent);
        chai_1.assert.deepEqual(fooEvent[0], "Foo!");
        chai_1.assert.deepEqual(fooEvent, {
            data: "Foo!",
            type: "LogOfDependantContractChildEvent",
        });
    });
});
