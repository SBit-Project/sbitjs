"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Browser polyfill required by ethjs-abi
// https://github.com/ethjs/ethjs-abi/blob/5e2d4c3b7207111c143ca30d01d743c28cfb52f6/src/utils/index.js#L28
if (typeof Buffer === "undefined") {
    const { Buffer } = require("buffer");
    Object.assign(window, {
        Buffer,
    });
}
__exportStar(require("./abi"), exports);
__exportStar(require("./Contract"), exports);
__exportStar(require("./SBitRPC"), exports);
__exportStar(require("./SBit"), exports);
__exportStar(require("./TxReceiptPromise"), exports);
__exportStar(require("./ethjs-abi"), exports);
