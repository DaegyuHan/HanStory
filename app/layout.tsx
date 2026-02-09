import './globals.css'

export const metadata = {
  title: 'Jude 개발일지',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
