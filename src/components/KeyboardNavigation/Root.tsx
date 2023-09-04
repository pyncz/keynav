'use client'

import type { FC, PropsWithChildren } from 'react'
import { useCallback, useRef } from 'react'
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
  onValueChange: (v?: string) => void
}

const toKeyFilterFn = (k: KeyFilter): KeyFilterFn => {
  if (typeof k === 'function') {
    return k
  }
  const keysArray = typeof k === 'string' ? [k] : k
  return (e) => keysArray.includes(e.key)
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

  const getActiveIndexWithOffset = useCallback((offset = 0) => {
    const currentIndex = values.current.findIndex(v => value === v)

    if (currentIndex >= 0 && offset) {
      const len = values.current.length
      const newIndex = (currentIndex + offset) % len

      // enclose the index within the len
      return newIndex < 0
        ? len + newIndex
        : newIndex
    }

    return currentIndex
  }, [value, values])

  const moveBy = throttle((offset = 0) => {
    const newIndex = getActiveIndexWithOffset(offset)
    if (newIndex >= 0) {
      // call handler to set new value
      onValueChange?.(values.current[newIndex])
    }
  }, { threshhold: throttleInterval })

  const moveToPrev = () => moveBy(-1)
  const prevKeyFilter = toKeyFilterFn(prev)
  useKey(prevKeyFilter, moveToPrev)
    
  const moveToNext = () => moveBy(1)
  const nextKeyFilter = toKeyFilterFn(next)
  useKey(nextKeyFilter, moveToNext)

  return (
    <KeyboardNavigationContext.Provider value={{ values: values.current, value }}>
      {children}
    </KeyboardNavigationContext.Provider>
  )
}
