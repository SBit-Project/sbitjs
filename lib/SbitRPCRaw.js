"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SBitRPCRaw = void 0;
const axios_1 = require("axios");
const URL = require("url-parse");
const debug_1 = require("debug");
const log = debug_1.default("SBITjs:rpc");
class SBitRPCRaw {
    constructor(_baseURL) {
        this._baseURL = _baseURL;
        this.idNonce = 0;
        const url = new URL(_baseURL);
        const config = {
            baseURL: url.origin,
            // don't throw on non-200 response
            validateStatus: () => true,
        };
        if (url.username !== "" && url.password !== "") {
            config.auth = {
                username: url.username,
                password: url.password,
            };
        }
        this._api = axios_1.default.create(config);
    }
    cancelTokenSource() {
        return axios_1.default.CancelToken.source();
    }
    async rawCall(method, params = [], opts = {}) {
        const rpcCall = {
            method,
            params,
            id: this.idNonce++,
        };
        log("%O", {
            method,
            params,
        });
        let res = await this.makeRPCCall(rpcCall);
        if (res.status === 402) {
            const auth = res.data;
            res = await this.authCall(auth.id, rpcCall);
        }
        if (res.status === 401) {
            // body is empty
            throw new Error(await res.statusText);
        }
        // 404 if method doesn't exist
        if (res.status === 404) {
            throw new Error(`unknown method: ${method}`);
        }
        if (res.status !== 200) {
            if (res.headers["content-type"] !== "application/json") {
                const body = await res.data;
                throw new Error(`${res.status} ${res.statusText}\n${res.data}`);
            }
            const eresult = await res.data;
            if (eresult.error) {
                const { code, message } = eresult.error;
                throw new Error(`RPC Error: [${code}] ${message}`);
            }
            else {
                throw new Error(String(eresult));
            }
        }
        const { result } = await res.data;
        return result;
    }
    makeRPCCall(rpcCall) {
        return this._api.post("/", rpcCall);
    }
    async authCall(authID, rpcCall) {
        // long-poll an authorization until its state changes
        const res = await this._api.get(`/api/authorizations/${authID}/onchange`);
        const { data } = res;
        if (res.status !== 200) {
            throw new Error(data.message);
        }
        const auth = data;
        if (auth.state === "denied") {
            throw new Error(`Authorization denied: ${authID}`);
        }
        if (auth.state === "accepted") {
            return this.makeRPCCall(Object.assign(Object.assign({}, rpcCall), { auth: auth.id }));
        }
    }
}
exports.SBitRPCRaw = SBitRPCRaw;
