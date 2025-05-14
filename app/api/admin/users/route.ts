import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"
import { protectAdminRoute } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const redirectResponse = await protectAdminRoute(req)
  if (redirectResponse) return redirectResponse

  try {
    const supabase = supabaseServer()
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Ошибка получения пользователей:", error)
    return NextResponse.json({ message: "Ошибка загрузки пользователей" }, { status: 500 })
  }
}
