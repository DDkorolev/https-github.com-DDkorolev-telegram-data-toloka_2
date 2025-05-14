import { NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/admin-auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username } = body

    if (!username) {
      return NextResponse.json({ message: "Логин обязателен" }, { status: 400 })
    }

    console.log(`Попытка входа: ${username}`)

    const token = await authenticateAdmin(username)

    if (!token) {
      console.log("Аутентификация не удалась")
      return NextResponse.json({ message: "Неверный логин" }, { status: 401 })
    }

    console.log("Аутентификация успешна, устанавливаем cookie")

    // Устанавливаем cookie с улучшенными параметрами безопасности
    cookies().set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 часа
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // Secure в production
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка входа:", error)
    return NextResponse.json({ message: "Ошибка сервера", error: String(error) }, { status: 500 })
  }
}
