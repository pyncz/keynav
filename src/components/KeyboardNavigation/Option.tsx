'use client'

import { Slot, SlotProps } from '@radix-ui/react-slot'
import { useEffect, useRef } from 'react'
import type { FC, PropsWithChildren } from 'react'
import { useMount } from 'react-use'
import { useKeyboardNavigation } from './context'

interface Props extends SlotProps {
  asChild?: boolean
  value: string
  disabled?: boolean
}

export const Option: FC<PropsWithChildren<Props>> = (props) => {
  const { asChild, disabled, children, value, ...forwardedProps } = props
  const { values, value: currentValue } = useKeyboardNavigation()

  const isActive = currentValue === value
  const dataAttributes = isActive ? { 'data-active': true } : {}

  const optionRef = useRef<HTMLDivElement>(null)

  useMount(() => {
    // register the value
    values.push(value)
  })

  // focus on the option once it becomes active
  useEffect(() => {
    if (isActive) {
      optionRef.current?.focus()
    }
  }, [isActive])

  const Wrapper = asChild ? Slot : 'div'

  return (
    <Wrapper ref={optionRef} {...{ ...dataAttributes, ...forwardedProps }}>
      {children}
    </Wrapper>
  )
}
