'use client'

import classNames from 'classnames'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { FC } from 'react'
import { useKeyPressEvent } from 'react-use'
import { Key } from './Key'
import { KeyboardNavigation } from './KeyboardNavigation'

export const Navigation: FC<{ shortcut: string }> = ({ shortcut }) => {
  const router = useRouter()
  const pathname = usePathname()

  const [showNavigation, setShowNavigation] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<string | undefined>(
    pathname,
  )

  const onOpen = () => {
    setShowNavigation(true)
  }

  // Hide menu and apply selected route
  const onClose = () => {
    setShowNavigation(false)

    // apply selected route
    if (selectedRoute) {
      router.push(selectedRoute)
    }
  }

  // Abort when window loses focus, return to default value
  const onBlur = useCallback(() => {
    setSelectedRoute(pathname)
    setShowNavigation(false)
  }, [pathname])

  // Hide menu on window loses focus as in this case user can release the button unnoticed anyway
  useEffect(() => {
    window.addEventListener('blur', onBlur)

    // clean up after
    return () => {
      window.removeEventListener('blur', onBlur)
    }
  }, [onBlur])

  useKeyPressEvent(shortcut, onOpen, onClose)

  return (
    <KeyboardNavigation.Root
      value={selectedRoute}
      onValueChange={setSelectedRoute}
      looped
    >
      <div
        className={classNames(
          'space-y-12 z-10 fixed inset-0 bg-black bg-opacity-80 p-24 duration-300',
          showNavigation ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden={!showNavigation}
      >
        <nav>
          <KeyboardNavigation.Option value='/' className='group'>
            <div className='inline-flex p-1 group-data-active:bg-blue-700'>
              Home
            </div>
          </KeyboardNavigation.Option>
          <KeyboardNavigation.Option value='/about' className='group'>
            <div className='inline-flex p-1 group-data-active:bg-blue-700'>
              About
            </div>
          </KeyboardNavigation.Option>
          <KeyboardNavigation.Option value='/not-about' className='group'>
            <div className='inline-flex p-1 group-data-active:bg-blue-700'>
              Not About
            </div>
          </KeyboardNavigation.Option>
        </nav>
        <p className='px-1 text-gray-600 text-sm max-w-sm'>
          Use arrows <Key>↑</Key> <Key>↓</Key> to navigate, while holding{' '}
          <Key>{shortcut}</Key>. Release <Key>{shortcut}</Key> when you have
          selected the route you want.
        </p>
      </div>
    </KeyboardNavigation.Root>
  )
}
