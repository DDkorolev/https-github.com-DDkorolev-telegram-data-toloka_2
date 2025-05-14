"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, BarChart2, FileText, LogOut, User } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function CabinetDashboard() {
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const storedUser = localStorage.getItem("current_user")
    if (!storedUser) {
      router.push("/cabinet/login")
      return
    }

    setUser(JSON.parse(storedUser))
    fetchUserTasks()
  }, [])

  const fetchUserTasks = async () => {
    try {
      setLoading(true)

      // Проверяем, работаем ли мы в демо-режиме
      const isDemoMode = localStorage.getItem("demo_mode") === "true"
      const storedUser = localStorage.getItem("current_user")
      const user = storedUser ? JSON.parse(storedUser) : null

      if (!user) {
        throw new Error("Пользователь не найден")
      }

      if (isDemoMode) {
        // В демо-режиме генерируем случайные задания
        const mockTasks = Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          type: Math.random() > 0.5 ? "text" : "image",
          question: `Тестовое задание #${i + 1}`,
          completed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_correct: Math.random() > 0.3,
        }))

        setTasks(mockTasks)
      } else {
        // Используем Supabase для получения заданий пользователя
        const supabase = createClient()

        const { data, error } = await supabase
          .from("user_responses")
          .select(`
            id,
            completed_at,
            is_correct,
            tasks (
              id,
              type,
              question
            )
          `)
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false })

        if (error) throw error

        setTasks(data || [])
      }
    } catch (error: any) {
      console.error("Ошибка при загрузке заданий:", error)
      setError("Не удалось загрузить задания")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("current_user")
    router.push("/cabinet/login")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Верхняя панель */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Личный кабинет</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user?.name || user?.login}</span>
              <button onClick={logout} className="bg-gray-200 p-2 rounded-full text-gray-700 hover:bg-gray-300">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Информация о пользователе */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Информация о пользователе</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Имя пользователя</p>
                  <p className="text-lg font-semibold">{user?.name || "Не указано"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Выполнено заданий</p>
                  <p className="text-lg font-semibold">{user?.completed_tasks || tasks.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Точность</p>
                  <p className="text-lg font-semibold">
                    {user?.accuracy ||
                      Math.round((tasks.filter((t: any) => t.is_correct).length / Math.max(1, tasks.length)) * 100)}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* История заданий */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">История выполненных заданий</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Задание
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата выполнения
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Результат
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Вы еще не выполнили ни одного задания
                    </td>
                  </tr>
                ) : (
                  tasks.map((task: any) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.type || task.tasks?.type || "Текст"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                        {task.question || task.tasks?.question || "Задание"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(task.completed_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.is_correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {task.is_correct ? "Верно" : "Неверно"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
