"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart2, Users, FileText, Settings, LogOut, AlertCircle, PieChart, Database, ImageIcon } from "lucide-react"

export default function AdminDashboard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [stats, setStats] = useState<{
    totalTasks: number
    totalUsers: number
    totalResponses: number
    completionRate: number
  }>({
    totalTasks: 0,
    totalUsers: 0,
    totalResponses: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Проверяем наличие cookie
    const hasAdminToken = document.cookie.includes("admin_token=")

    if (!hasAdminToken) {
      console.error("Отсутствует токен администратора, перенаправление на страницу входа")
      router.push("/admin/login")
      return
    }

    // Если токен есть, загружаем данные
    Promise.all([fetchTasks(), fetchStats()]).finally(() => {
      setLoading(false)
    })
  }, [])

  const fetchTasks = async () => {
    try {
      // Имитация загрузки данных без обращения к API
      const mockTasks = [
        { id: 1, type: "text", question: "Москва является столицей России.", status: "active" },
        { id: 2, type: "text", question: "Земля вращается вокруг Солнца.", status: "active" },
        { id: 3, type: "image", question: "На изображении кошка?", status: "active" },
        { id: 4, type: "image", question: "На изображении собака?", status: "active" },
        { id: 5, type: "text", question: "Китай находится в Африке.", status: "hidden" },
      ]

      setTasks(mockTasks)
    } catch (error: any) {
      setError("Ошибка загрузки заданий")
      console.error(error)
    }
  }

  const fetchStats = async () => {
    try {
      // Имитация загрузки статистики без обращения к API
      setStats({
        totalTasks: 20,
        totalUsers: 5,
        totalResponses: 35,
        completionRate: 35,
      })
    } catch (error: any) {
      console.error("Ошибка загрузки статистики:", error)
    }
  }

  const logout = () => {
    // Удаляем cookie и перенаправляем на страницу входа
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/admin/login")
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
      {/* Боковая панель */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Админ-панель</h2>
          <p className="text-sm text-gray-500 mt-1">Миниап.Разметка</p>
        </div>

        <nav className="mt-6">
          <Link href="/admin/dashboard" className="flex items-center px-6 py-3 bg-blue-500 text-white">
            <BarChart2 className="h-5 w-5 mr-3" />
            Дашборд
          </Link>
          <Link href="/admin/tasks" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <FileText className="h-5 w-5 mr-3" />
            Задания
          </Link>
          <Link href="/admin/users" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Users className="h-5 w-5 mr-3" />
            Пользователи
          </Link>
          <Link href="/admin/settings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Settings className="h-5 w-5 mr-3" />
            Настройки
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Панель управления</h1>
          <div className="text-sm text-gray-500">Последнее обновление: {new Date().toLocaleString()}</div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Всего заданий</p>
                <p className="text-2xl font-semibold">{stats.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Пользователей</p>
                <p className="text-2xl font-semibold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Всего ответов</p>
                <p className="text-2xl font-semibold">{stats.totalResponses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                <PieChart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Выполнено</p>
                <p className="text-2xl font-semibold">{stats.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Последние задания */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Последние задания</h2>
              <Link href="/admin/tasks" className="text-sm text-blue-500 hover:text-blue-700">
                Смотреть все
              </Link>
            </div>
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
                    Инструкция
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.type === "text" ? "Текст" : "Изображение"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{task.question}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.status === "active" ? "Активно" : "Скрыто"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Быстрые действия</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/admin/tasks/new"
              className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <FileText className="h-5 w-5 mr-2" />
              Добавить задание
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Users className="h-5 w-5 mr-2" />
              Управление пользователями
            </Link>
            <Link
              href="/admin/image-recognition"
              className="flex items-center justify-center px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <ImageIcon className="h-5 w-5 mr-2" />
              Тестирование распознавания
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-center px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              <Settings className="h-5 w-5 mr-2" />
              Настройки системы
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
