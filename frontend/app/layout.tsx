import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Music UI',
  description: 'Music application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
