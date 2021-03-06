"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const test_1 = require("./test");
// import { } from "mocha"
describe("SBitRPC", () => {
    it("can make RPC call", async () => {
        const info = await test_1.rpc.rawCall("getblockchaininfo");
        chai_1.assert.isNotEmpty(info);
        // assert.hasAllKeys(info, [
        //   "version",
        //   "protocolversion",
        //   "walletversion",
        //   "balance",
        //   "stake",
        //   "blocks",
        //   "deprecation-warning",
        //   "timeoffset",
        //   "connections",
        //   "proxy",
        //   "difficulty",
        //   "testnet",
        //   "moneysupply",
        //   "keypoololdest",
        //   "keypoolsize",
        //   "paytxfee",
        //   "relayfee",
        //   "errors",
        // ])
    });
    it("throws error if method is not found", async () => {
        await test_1.assertThrow(async () => {
            return test_1.rpc.rawCall("unknown-method");
        });
    });
    it("throws error if calling method using invalid params", async () => {
        await test_1.assertThrow(async () => {
            return test_1.rpc.rawCall("getinfo", [1, 2]);
        });
    });
    it("can convert a hex address to a p2pkh address", async () => {
        const p2pkhAddress = await test_1.rpc.fromHexAddress("b22cbfd8dffcd4e0120279c2cc41315fac2335e2");
        chai_1.assert.strictEqual(p2pkhAddress, "hZoV3RKeHaxKM5RnuZdA5bwoYTCH73QLrE");
    });
    it("can convert a p2pkh address to a hex address", async () => {
        const hexAddress = await test_1.rpc.getHexAddress("hZoV3RKeHaxKM5RnuZdA5bwoYTCH73QLrE");
        chai_1.assert.strictEqual(hexAddress, "b22cbfd8dffcd4e0120279c2cc41315fac2335e2");
    });
});
