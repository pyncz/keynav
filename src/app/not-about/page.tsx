import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
  description: 'Generated by create next app',
}

export default function NotAbout() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24">
      not about
    </main>
  )
}
