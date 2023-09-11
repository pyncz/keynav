'use client'

import type { FC, PropsWithChildren } from 'react'
import { useCallback, useMemo, useRef } from 'react'
import { DEFAULT_INTERVAL } from '../../consts'
import { throttle } from '../../utils'
import { KeyboardNavigationContext } from './context'
import { useKey } from 'react-use'

type KeyFilterFn = (e: KeyboardEvent) => boolean
type KeyFilter = KeyFilterFn | string | string[]

interface Props {
  disabled?: boolean
  
  /**
   * Throttle interval in ms
   */
  throttleInterval?: number

  looped?: boolean
  asChild?: boolean
  prev?: KeyFilter
  next?: KeyFilter

  value?: string
  onValueChange?: (v?: string) => void
}

function toKeyFilterFn(k: KeyFilter): KeyFilterFn {
  if (typeof k === 'function') {
    return k
  }
  const keysArray = typeof k === 'string' ? [k] : k
  return (e) => keysArray.includes(e.key)
}

function getActiveIndexWithOffset<T = any>(values: T[], value: T, offset = 0) {
  const currentIndex = values.findIndex(v => value === v)

  if (currentIndex >= 0 && offset) {
    const len = values.length
    const newIndex = (currentIndex + offset) % len

    // enclose the index within the len
    return newIndex < 0
      ? len + newIndex
      : newIndex
  }

  return currentIndex
}

export const Root: FC<PropsWithChildren<Props>> = (props) => {
  const {
    children,
    disabled,
    throttleInterval = DEFAULT_INTERVAL,
    looped,
    prev = ['ArrowUp', 'ArrowLeft'],
    next = ['ArrowRight', 'ArrowDown'],
    value,
    onValueChange,
  } = props

  const values = useRef<string[]>([])

  const moveByHandler = useCallback((offset = 0, v?: string) => {
    if (disabled) return

    const newIndex = getActiveIndexWithOffset(values.current, v, offset)
    if (newIndex >= 0) {
      // call handler to set new value
      onValueChange?.(values.current[newIndex])
    }
  }, [disabled, onValueChange])

  const moveBy = useMemo(() => throttle(moveByHandler, {
    threshhold: throttleInterval,
    withTrailingCall: true,
  }), [moveByHandler, throttleInterval])

  const prevKeyFilter = toKeyFilterFn(prev)
  useKey(prevKeyFilter, () => moveBy(-1, value))
    
  const nextKeyFilter = toKeyFilterFn(next)
  useKey(nextKeyFilter, () => moveBy(1, value))

  return (
    <KeyboardNavigationContext.Provider value={{ values: values.current, value }}>
      {children}
    </KeyboardNavigationContext.Provider>
  )
}
