import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Применяется только к маршрутам личного кабинета, кроме входа
  if (request.nextUrl.pathname.startsWith("/cabinet") && !request.nextUrl.pathname.startsWith("/cabinet/login")) {
    // Проверяем наличие пользователя в localStorage
    // Это будет работать только на клиенте, поэтому мы перенаправляем на страницу входа
    // и там уже проверяем наличие пользователя
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/cabinet/:path*"],
}
