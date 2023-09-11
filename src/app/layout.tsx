import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import classNames from 'classnames'
import { Navigation } from '../components'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Home',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={classNames('bg-gray-900 text-gray-50 min-h-screen flex flex-col', inter.className)}>
        <Navigation />

        {children}

        <div className='text-center py-8 text-sm opacity-50'>
          Press{' '}
          <pre className='inline font-mono px-1.5 py-1 rounded border bg-gray-800 text-[0.875em] text-gray-300 border-gray-500 border-opacity-10'>Q</pre>
          {' '}for navigation
        </div>
      </body>
    </html>
  )
}
