import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HertzBetz Casino - Registration',
  description: 'Join HertzBetz Casino and claim 200% up to 1000 EUR + 150 Free Spins',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-900 m-0 p-0">
        {children}
      </body>
    </html>
  )
}
