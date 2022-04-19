import { assert } from "chai"

import { SBitRPC } from "../SBitRPC"

export const rpcURL = process.env.SBIT_RPC || "http://sbit:test@localhost:22002"

export const rpc = new SBitRPC(rpcURL)

export const repoData = require("../../solar.development.json")

export async function generateBlock(n = 1) {
  // generate to a throwaway address
  return rpc.rawCall("generatetoaddress", [n, "sUdPrkrdbmWD5m21mKEr5euZpFDsQHWzsG"])
}

export async function assertThrow(
  fn: () => Promise<any>,
  msg?: string,
  report?: (err: any) => void,
) {
  let errorThrown: any = null

  try {
    await fn()
  } catch (err) {
    errorThrown = err
  }

  // assert.erro
  if (errorThrown && report) {
    report(errorThrown)
  }

  assert(
    errorThrown != null,
    msg ? `Expects error to be thrown: ${msg}` : "Expects error to be thrown",
  )

  // assert.isNotNull(errorThrown, )
}
