import { NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/admin-auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ message: "Логин и пароль обязательны" }, { status: 400 })
    }

    console.log(`Попытка входа: ${username}/${password.substring(0, 1)}***`)

    const token = await authenticateAdmin(username, password)

    if (!token) {
      console.log("Аутентификация не удалась")
      return NextResponse.json({ message: "Неверный логин или пароль" }, { status: 401 })
    }

    console.log("Аутентификация успешна, устанавливаем cookie")

    // Устанавливаем cookie
    cookies().set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 часа
      sameSite: "lax", // Изменено с "strict" на "lax" для лучшей совместимости
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка входа:", error)
    return NextResponse.json({ message: "Ошибка сервера", error: String(error) }, { status: 500 })
  }
}
