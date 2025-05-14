import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"
import { protectAdminRoute } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const redirectResponse = await protectAdminRoute(req)
  if (redirectResponse) return redirectResponse

  try {
    const supabase = supabaseServer()
    const { data, error } = await supabase.from("tasks").select("*").order("id", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Ошибка получения заданий:", error)
    return NextResponse.json({ message: "Ошибка загрузки заданий" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const redirectResponse = await protectAdminRoute(req)
  if (redirectResponse) return redirectResponse

  try {
    const { type, content, question, correct_answer } = await req.json()

    // Валидация ввода
    if (!type || !content || !question) {
      return NextResponse.json({ message: "Все поля обязательны" }, { status: 400 })
    }

    if (type === "text" && content.length > 1000) {
      return NextResponse.json({ message: "Текст не должен превышать 1000 символов" }, { status: 400 })
    }

    const supabase = supabaseServer()
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        type,
        content,
        question,
        correct_answer,
      })
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Ошибка создания задания:", error)
    return NextResponse.json({ message: "Ошибка создания задания" }, { status: 500 })
  }
}
