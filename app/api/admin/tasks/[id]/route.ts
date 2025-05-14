import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"
import { protectAdminRoute } from "@/lib/admin-auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const redirectResponse = await protectAdminRoute(req)
  if (redirectResponse) return redirectResponse

  try {
    const supabase = supabaseServer()
    const { data, error } = await supabase.from("tasks").select("*").eq("id", params.id).single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Ошибка получения задания:", error)
    return NextResponse.json({ message: "Ошибка загрузки задания" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const redirectResponse = await protectAdminRoute(req)
  if (redirectResponse) return redirectResponse

  try {
    const updates = await req.json()
    const supabase = supabaseServer()
    const { data, error } = await supabase.from("tasks").update(updates).eq("id", params.id).select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Ошибка обновления задания:", error)
    return NextResponse.json({ message: "Ошибка обновления задания" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const redirectResponse = await protectAdminRoute(req)
  if (redirectResponse) return redirectResponse

  try {
    const supabase = supabaseServer()
    const { error } = await supabase.from("tasks").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления задания:", error)
    return NextResponse.json({ message: "Ошибка удаления задания" }, { status: 500 })
  }
}
