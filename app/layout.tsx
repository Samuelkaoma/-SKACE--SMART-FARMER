import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'

import { getSiteUrl } from '@/lib/config/env'

import './globals.css'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SmartFarmer SKACE',
    template: '%s | SmartFarmer SKACE',
  },
  description:
    'SmartFarmer SKACE is a farm operating platform for Zambian growers and livestock keepers, combining records, guidance, weather context, and market signals in one place.',
  keywords: [
    'farming',
    'agriculture',
    'smart farm',
    'Zambia',
    'crop management',
    'livestock',
    'farm operations',
    'smallholder farmers',
    'agritech',
  ],
  authors: [{ name: 'Samuel Kaoma' }],
  openGraph: {
    title: 'SmartFarmer SKACE',
    description:
      'A production-minded agritech platform built to help farmers record operations, spot risks, and act with more confidence.',
    url: siteUrl,
    siteName: 'SmartFarmer SKACE',
    locale: 'en_ZM',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#059669',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
