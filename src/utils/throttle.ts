import { DEFAULT_INTERVAL } from '../consts'

export const throttle = <Args extends any[]>(
  fn: (...args: Args) => void,
  options?: {
    threshhold?: number
    withTrailingCall?: boolean
  },
) => {
  const { threshhold = DEFAULT_INTERVAL, withTrailingCall = false } =
    options ?? {}

  let lastFulfilledCallTimestamp: number
  let deferTimer: NodeJS.Timeout

  return (...args: Args) => {
    const now = +new Date()

    if (
      lastFulfilledCallTimestamp &&
      now < lastFulfilledCallTimestamp + threshhold
    ) {
      // hold on
      if (withTrailingCall) {
        // forget previous deferred call planned
        clearTimeout(deferTimer)

        deferTimer = setTimeout(() => {
          // Store time of the call initialized, not the actual execution
          lastFulfilledCallTimestamp = now

          fn(...args)
        }, threshhold)
      }
    } else {
      // fire it!
      lastFulfilledCallTimestamp = now
      fn(...args)
    }
  }
}
