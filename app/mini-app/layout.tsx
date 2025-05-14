import type React from "react"
export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <title>Миниап.Разметка</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
