import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VIRTRA - Healthcare Platform',
  description: 'Your intelligent healthcare companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle MetaMask errors to prevent interference with authentication
              window.addEventListener('error', function(event) {
                if (event.message && event.message.includes('MetaMask')) {
                  event.preventDefault();
                  console.log('MetaMask error suppressed:', event.message);
                }
              });
              
              // Handle unhandled promise rejections from MetaMask
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && event.reason.message && event.reason.message.includes('MetaMask')) {
                  event.preventDefault();
                  console.log('MetaMask promise rejection suppressed:', event.reason.message);
                }
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
