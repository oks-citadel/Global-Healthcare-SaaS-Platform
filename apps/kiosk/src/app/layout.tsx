import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { IdleTimeoutProvider } from '@/components/IdleTimeoutProvider'
import { LanguageProvider } from '@/components/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hospital Kiosk - Patient Services',
  description: 'Self-service kiosk for patient check-in, registration, and scheduling',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full overflow-hidden`}>
        <LanguageProvider>
          <IdleTimeoutProvider timeout={120000}>
            {children}
          </IdleTimeoutProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
