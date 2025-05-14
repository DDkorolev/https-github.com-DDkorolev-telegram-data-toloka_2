import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "./supabase"
import jwt from "jsonwebtoken"
import { env } from "./env"

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

      // Создаем токен с дополнительной информацией для безопасности
      const token = jwt.sign(
        {
          id: adminId,
          username: username,
          role: "admin",
          iat: Math.floor(Date.now() / 1000),
        },
        env.ADMIN_JWT_SECRET,
        {
          expiresIn: "24h",
          issuer: "miniapp-labeling",
          audience: "admin-panel",
        },
      )

      // Логируем успешный вход (в реальном приложении это должно быть в базе данных)
      console.log(`Успешный вход администратора: ${username} в ${new Date().toISOString()}`)

      return token
    }

    // Логируем неудачную попытку входа
    console.log(`Неудачная попытка входа: ${username} в ${new Date().toISOString()}`)
    return null
  } catch (error) {
    console.error("Ошибка аутентификации:", error)
    return null
  }
}

export function verifyAdminToken(token: string) {
  try {
    // Проверяем токен с дополнительными параметрами
    return jwt.verify(token, env.ADMIN_JWT_SECRET, {
      issuer: "miniapp-labeling",
      audience: "admin-panel",
    })
  } catch (error) {
    console.error("Ошибка проверки токена:", error)
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

  // Проверяем роль пользователя
  if ((payload as any).role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  return null
}
