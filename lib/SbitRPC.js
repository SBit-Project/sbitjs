"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SBitRPC = void 0;
const SBitRPCRaw_1 = require("./SBitRPCRaw");
const sendToContractRequestDefaults = {
    amount: 0,
    gasLimit: 200000,
    // FIXME: Does not support string gasPrice although the doc says it does.
    gasPrice: 0.0000004,
};
class SBitRPC extends SBitRPCRaw_1.SBitRPCRaw {
    getBlockChainInfo() {
        return this.rawCall("getblockchaininfo");
    }
    sendToContract(req) {
        const vals = Object.assign(Object.assign({}, sendToContractRequestDefaults), req);
        const args = [
            vals.address,
            vals.datahex,
            vals.amount,
            vals.gasLimit,
            vals.gasPrice,
        ];
        if (vals.senderAddress) {
            args.push(vals.senderAddress);
        }
        return this.rawCall("sendtocontract", args);
    }
    callContract(req) {
        const args = [req.address, req.datahex];
        args.push(req.senderAddress || "");
        args.push(req.gasLimit || 0);
        args.push(req.amount || 0);
        return this.rawCall("callcontract", args);
    }
    getTransaction(req) {
        const args = [req.txid];
        if (req.include_watchonly) {
            args.push(req.include_watchonly);
        }
        else {
            args.push(false);
        }
        if (req.verbose) {
            args.push(!!req.verbose);
        }
        else {
            args.push(false);
        }
        if (req.waitconf) {
            args.push(req.waitconf);
        }
        return this.rawCall("gettransaction", args);
    }
    async getTransactionReceipt(req) {
        // The raw RPC API returns [] if tx id doesn't exist or not mined yet
        // When transaction is mined, the API returns [receipt]
        //
        // We'll do the unwrapping here.
        const result = await this.rawCall("gettransactionreceipt", [req.txid]);
        if (result.length === 0) {
            return null;
        }
        return result[0];
    }
    /**
     * Long-poll request to get logs. Cancel the returned promise to terminate polling early.
     */
    waitforlogs(req = {}) {
        const args = [req.fromBlock, req.toBlock, req.filter, req.minconf];
        const cancelTokenSource = this.cancelTokenSource();
        const p = this.rawCall("waitforlogs", args, {
            cancelToken: cancelTokenSource.token,
        });
        return Object.assign(p, {
            cancel: cancelTokenSource.cancel.bind(cancelTokenSource),
        });
    }
    async searchlogs(_req = {}) {
        const searchlogsDefaults = {
            fromBlock: "latest",
            toBlock: -1,
            addresses: [],
            topics: [],
            minconf: 0,
        };
        const req = Object.assign({ searchlogsDefaults }, _req);
        const args = [
            req.fromBlock,
            req.toBlock,
            req.addresses,
            req.topics,
            req.minconf,
        ];
        return this.rawCall("searchlogs", args);
    }
    async checkTransactionWaitSupport() {
        if (this._hasTxWaitSupport !== undefined) {
            return this._hasTxWaitSupport;
        }
        const helpmsg = await this.rawCall("help", ["gettransaction"]);
        this._hasTxWaitSupport = helpmsg.split("\n")[0].indexOf("waitconf") !== -1;
        return this._hasTxWaitSupport;
    }
    async fromHexAddress(hexAddress) {
        return this.rawCall("fromhexaddress", [hexAddress]);
    }
    async getHexAddress(address) {
        return this.rawCall("gethexaddress", [address]);
    }
}
exports.SBitRPC = SBitRPC;
