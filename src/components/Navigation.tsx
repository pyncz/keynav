'use client'

import classNames from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import type { FC } from 'react'
import { useKeyPressEvent } from 'react-use'
import { KeyboardNavigation } from './KeyboardNavigation'
import { usePathname, useRouter } from 'next/navigation'

export const Navigation: FC = () => {
  const router = useRouter()
  const pathname = usePathname()

  const [showNavigation, setShowNavigation] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<string | undefined>(pathname)

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
    window.addEventListener("blur", onBlur);

    // clean up after
    return () => {
      window.removeEventListener("blur", onBlur)
    }
  }, [onBlur])
  
  useKeyPressEvent('q', onOpen, onClose)

  return (
    <KeyboardNavigation.Root
      value={selectedRoute}
      onValueChange={setSelectedRoute}
    >
      <nav
        className={classNames(
          'z-10 fixed inset-0 bg-black bg-opacity-80 p-24 duration-300',
          showNavigation ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden={!showNavigation}
      >
        <KeyboardNavigation.Option value='/' className='group'>
          <div className="inline-flex p-1 group-data-active:bg-blue-700">
            Home
          </div>
        </KeyboardNavigation.Option>
        <KeyboardNavigation.Option value='/about' className='group'>
          <div className="inline-flex p-1 group-data-active:bg-blue-700">
            About
          </div>
        </KeyboardNavigation.Option>
        <KeyboardNavigation.Option value='/not-about' className='group'>
          <div className="inline-flex p-1 group-data-active:bg-blue-700">
            Not About
          </div>
        </KeyboardNavigation.Option>
      </nav>
    </KeyboardNavigation.Root>
  )
}
