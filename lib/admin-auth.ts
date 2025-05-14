import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "./supabase"
import jwt from "jsonwebtoken"
import { env } from "./env"

// Хардкодированные учетные данные для разработки и тестирования
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

// Изменяем функцию authenticateAdmin, чтобы она проверяла только логин
export async function authenticateAdmin(username: string, password = "") {
  try {
    // Проверяем только логин, без пароля
    if (username === "admin31337") {
      // Получаем админа из базы данных для ID
      const supabase = supabaseServer()
      const { data, error } = await supabase.from("admins").select("id").eq("username", "admin").single()

      // Если админ не найден в базе, используем фиктивный ID
      const adminId = data?.id || 1

      // Создаем токен
      const token = jwt.sign({ id: adminId, username: username }, env.ADMIN_JWT_SECRET, { expiresIn: "24h" })

      return token
    }

    return null
  } catch (error) {
    console.error("Ошибка аутентификации:", error)
    return null
  }
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, env.ADMIN_JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function protectAdminRoute(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  const payload = verifyAdminToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  return null
}
