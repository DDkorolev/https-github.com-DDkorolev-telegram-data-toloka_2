import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"
import { protectAdminRoute } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const redirectResponse = await protectAdminRoute(req)
  if (redirectResponse) return redirectResponse

  try {
    const supabase = supabaseServer()

    // Получаем количество заданий
    const { count: totalTasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })

    if (tasksError) throw tasksError

    // Получаем количество пользователей
    const { count: totalUsers, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    if (usersError) throw usersError

    // Получаем количество ответов
    const { count: totalResponses, error: responsesError } = await supabase
      .from("responses")
      .select("*", { count: "exact", head: true })

    if (responsesError) throw responsesError

    // Вычисляем процент выполнения
    let completionRate = 0
    if (totalTasks && totalUsers && totalTasks > 0 && totalUsers > 0) {
      // Максимально возможное количество ответов = количество заданий * количество пользователей
      const maxPossibleResponses = totalTasks * totalUsers
      completionRate = Math.round((totalResponses / maxPossibleResponses) * 100)
    }

    return NextResponse.json({
      totalTasks,
      totalUsers,
      totalResponses,
      completionRate,
    })
  } catch (error) {
    console.error("Ошибка получения статистики:", error)
    return NextResponse.json({ message: "Ошибка загрузки статистики" }, { status: 500 })
  }
}
