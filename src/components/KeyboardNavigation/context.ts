import { RefObject, createContext, useContext } from "react"

interface KeyboardNavigationCtx {
  value?: string
  values: string[]
}

export const KeyboardNavigationContext = createContext<KeyboardNavigationCtx>({
  values: [],
})

export const useKeyboardNavigation = () => useContext(KeyboardNavigationContext)
