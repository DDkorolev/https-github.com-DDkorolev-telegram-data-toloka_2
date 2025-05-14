import { NextResponse } from "next/server"
import { env } from "@/lib/env"

export async function GET(request: Request) {
  // Получаем хост из запроса
  const url = new URL(request.url)
  const host = url.host

  // Формируем полный URL приложения
  const appUrl = `https://${host}`

  return NextResponse.json({
    configuredUrl: env.NEXT_PUBLIC_APP_URL,
    detectedUrl: appUrl,
  })
}
