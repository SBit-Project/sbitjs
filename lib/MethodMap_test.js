"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const test_1 = require("./test");
const MethodMap_1 = require("./MethodMap");
describe("MethodMap", () => {
    // don't act as sender
    const methods = test_1.repoData.contracts["test/contracts/MethodOverloading.sol"].abi;
    const map = new MethodMap_1.MethodMap(methods);
    it("can find method by name, if no ambiguity", () => {
        const method = map.findMethod("foo", []);
        chai_1.assert.deepEqual(method, {
            name: "foo",
            type: "function",
            payable: false,
            inputs: [],
            outputs: [{ name: "", type: "string", indexed: false }],
            constant: false,
            anonymous: false,
        });
        // console.log(method)
    });
    it("can find method by method signature", () => {
        const method = map.findMethod("foo()", []);
        chai_1.assert.deepEqual(method, {
            name: "foo",
            type: "function",
            payable: false,
            inputs: [],
            outputs: [{ name: "", type: "string", indexed: false }],
            constant: false,
            anonymous: false,
        });
    });
    it("can disambiguate method of same arity by signature", () => {
        let method = map.findMethod("foo(string)");
        chai_1.assert.deepEqual(method, {
            name: "foo",
            type: "function",
            payable: false,
            inputs: [{ name: "_a", type: "string", indexed: false }],
            outputs: [{ name: "", type: "string", indexed: false }],
            constant: false,
            anonymous: false,
        });
        method = map.findMethod("foo(uint256)");
        chai_1.assert.deepEqual(method, {
            name: "foo",
            type: "function",
            payable: false,
            inputs: [{ name: "_a", type: "uint256", indexed: false }],
            outputs: [{ name: "", type: "string", indexed: false }],
            constant: false,
            anonymous: false,
        });
    });
    it("cannot find method by name, if there is ambiguity", () => {
        let method = map.findMethod("foo", [1]);
        chai_1.assert.isUndefined(method);
        method = map.findMethod("foo", [1, 2]);
        chai_1.assert.isUndefined(method);
    });
    it("can disambiguate method by number of parameters", () => {
        const method = map.findMethod("foo", [1, 2, 3]);
        chai_1.assert.deepEqual(method, {
            name: "foo",
            type: "function",
            payable: false,
            inputs: [
                { name: "_a", type: "int256", indexed: false },
                { name: "_b", type: "int256", indexed: false },
                { name: "_c", type: "int256", indexed: false },
            ],
            outputs: [{ name: "", type: "string", indexed: false }],
            constant: false,
            anonymous: false,
        });
    });
});
