import './globals.css'
import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import Providers from '@/app/providers/provider.component'

export const metadata: Metadata = {
  title: 'BE1 Tecnologia',
  description: 'Qualidade de vida no campo!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
