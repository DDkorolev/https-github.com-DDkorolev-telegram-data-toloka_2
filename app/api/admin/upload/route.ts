import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"
import { protectAdminRoute } from "@/lib/admin-auth"

export async function POST(req: NextRequest) {
  const redirectResponse = await protectAdminRoute(req)
  if (redirectResponse) return redirectResponse

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "Файл не найден" }, { status: 400 })
    }

    // Проверка размера файла (лимит 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "Размер файла не должен превышать 5MB" }, { status: 400 })
    }

    // Проверка типа файла
    if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
      return NextResponse.json({ message: "Поддерживаются только изображения в формате JPG и PNG" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`

    const supabase = supabaseServer()
    const { data, error } = await supabase.storage.from("task-images").upload(fileName, buffer, {
      contentType: file.type,
    })

    if (error) throw error

    const { data: urlData } = supabase.storage.from("task-images").getPublicUrl(data.path)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error("Ошибка загрузки файла:", error)
    return NextResponse.json({ message: "Ошибка загрузки файла" }, { status: 500 })
  }
}
