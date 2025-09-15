import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HertzBetz Casino - Регистрация',
  description: 'Присоединяйтесь к HertzBetz Casino и получите бонус до €1,500 + 250 бесплатных спинов',
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
