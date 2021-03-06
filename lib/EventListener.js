"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListener = void 0;
const eventemitter3_1 = require("eventemitter3");
class EventListener {
    // TODO filter out unparseable logs
    constructor(rpc, logDecoder) {
        this.rpc = rpc;
        this.logDecoder = logDecoder;
    }
    /**
     * Get contract event logs. Long-poll wait if no log is found. Returns a cancel
     * function that stops the events subscription.
     *
     * @param req (optional) IRPCWaitForLogsRequest
     */
    waitLogs(req = {}) {
        const filter = req.filter || {};
        const logPromise = this.rpc.waitforlogs(Object.assign(Object.assign({}, req), { filter }));
        return logPromise.then((result) => {
            const entries = result.entries.map((entry) => {
                const parsedLog = this.logDecoder.decode(entry);
                return Object.assign(Object.assign({}, entry), { event: parsedLog });
            });
            return Object.assign(Object.assign({}, result), { entries });
        }); // bypass typechecker problem
    }
    /**
     * Subscribe to contract's events, using callback interface.
     */
    onLog(fn, opts = {}) {
        let nextblock = opts.fromBlock || "latest";
        let promiseCancel;
        let canceled = false;
        const asyncLoop = async () => {
            while (true) {
                if (canceled) {
                    break;
                }
                const logPromise = this.waitLogs(Object.assign(Object.assign({}, opts), { fromBlock: nextblock }));
                promiseCancel = logPromise.cancel;
                const result = await logPromise;
                for (const entry of result.entries) {
                    fn(entry);
                }
                nextblock = result.nextblock;
            }
        };
        asyncLoop();
        // return a cancel function
        return () => {
            canceled = true;
            if (promiseCancel) {
                promiseCancel();
            }
        };
    }
    /**
     * Subscribe to contract's events, use EventsEmitter interface.
     */
    emitter(opts = {}) {
        const emitter = new eventemitter3_1.EventEmitter();
        const cancel = this.onLog((entry) => {
            const key = (entry.event && entry.event.type) || "?";
            emitter.emit(key, entry);
        }, opts);
        return Object.assign(emitter, {
            cancel,
        });
    }
}
exports.EventListener = EventListener;
