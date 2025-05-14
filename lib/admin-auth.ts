import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "./supabase"
import { compare } from "bcryptjs"
import jwt from "jsonwebtoken"
import { env } from "./env"

export async function authenticateAdmin(username: string, password: string) {
  try {
    const supabase = supabaseServer()

    const { data, error } = await supabase.from("admins").select("*").eq("username", username).single()

    if (error || !data) {
      return null
    }

    const passwordMatch = await compare(password, data.password)
    if (!passwordMatch) {
      return null
    }

    const token = jwt.sign({ id: data.id, username: data.username }, env.ADMIN_JWT_SECRET, { expiresIn: "24h" })

    return token
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
