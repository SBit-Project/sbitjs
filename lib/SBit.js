"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SBit = void 0;
const SBitRPC_1 = require("./SBitRPC");
const ContractsRepo_1 = require("./ContractsRepo");
/**
 * The `SBit` class is an instance of the `SBITjs` API.
 *
 * @param providerURL URL of the SBITd RPC service.
 * @param repoData Information about Solidity contracts.
 */
class SBit extends SBitRPC_1.SBitRPC {
    constructor(providerURL, repoData) {
        super(providerURL);
        this.repo = new ContractsRepo_1.ContractsRepo(this, Object.assign({ 
            // massage the repoData by providing empty default properties
            contracts: {}, libraries: {}, related: {} }, repoData));
    }
    /**
     * A factory method to instantiate a `Contract` instance using the ABI
     * definitions and address found in `repoData`. The Contract instance is
     * configured with an event log decoder that can decode all known event types
     * found in `repoData`.
     *
     * @param name The name of a deployed contract
     */
    contract(name, info) {
        return this.repo.contract(name, info);
    }
}
exports.SBit = SBit;
