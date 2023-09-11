import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

export const Key: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return (
    <pre className={classNames('inline uppercase font-mono px-1.5 py-1 rounded border bg-gray-300/10 text-[0.875em] border-gray-300/10', className)}>
      {children}
    </pre>
  )
}
