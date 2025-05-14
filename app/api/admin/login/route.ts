import { NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/admin-auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ message: "Логин и пароль обязательны" }, { status: 400 })
    }

    const token = await authenticateAdmin(username, password)

    if (!token) {
      return NextResponse.json({ message: "Неверный логин или пароль" }, { status: 401 })
    }

    cookies().set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 часа
      sameSite: "strict",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка входа:", error)
    // Убедимся, что всегда возвращаем валидный JSON
    return NextResponse.json({ message: "Ошибка сервера", error: String(error) }, { status: 500 })
  }
}
