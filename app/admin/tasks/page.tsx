"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  Users,
  FileText,
  Settings,
  LogOut,
  BarChart2,
  Search,
  PlusCircle,
  Filter,
} from "lucide-react"

export default function AdminTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [filteredTasks, setFilteredTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "hidden">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "text" | "image">("all")
  const router = useRouter()

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [searchTerm, filter, typeFilter, tasks])

  const filterTasks = () => {
    let filtered = [...tasks]

    // Фильтр по статусу
    if (filter !== "all") {
      filtered = filtered.filter((task) => task.status === filter)
    }

    // Фильтр по типу
    if (typeFilter !== "all") {
      filtered = filtered.filter((task) => task.type === typeFilter)
    }

    // Поиск по тексту
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.type === "text" && task.content.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredTasks(filtered)
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/tasks")

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login")
          return
        }
        throw new Error("Ошибка загрузки заданий")
      }

      const data = await response.json()
      setTasks(data)
      setFilteredTasks(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskStatus = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "hidden" : "active"

      const response = await fetch(`/api/admin/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Ошибка обновления статуса")
      }

      setTasks(tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)))
    } catch (error: any) {
      setError(error.message)
    }
  }

  const deleteTask = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить это задание?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/tasks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Ошибка удаления задания")
      }

      setTasks(tasks.filter((task) => task.id !== id))
    } catch (error: any) {
      setError(error.message)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Ошибка выхода:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка заданий...</p>
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
          <Link href="/admin/dashboard" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <BarChart2 className="h-5 w-5 mr-3" />
            Дашборд
          </Link>
          <Link href="/admin/tasks" className="flex items-center px-6 py-3 bg-blue-500 text-white">
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
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </Link>
            <h1 className="text-2xl font-bold">Задания</h1>
          </div>

          <Link
            href="/admin/tasks/new"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Добавить задание
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Поиск заданий..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-500 mr-2">Статус:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "active" | "hidden")}
                className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Все</option>
                <option value="active">Активные</option>
                <option value="hidden">Скрытые</option>
              </select>
            </div>

            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-500 mr-2">Тип:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as "all" | "text" | "image")}
                className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Все</option>
                <option value="text">Текст</option>
                <option value="image">Изображение</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Инструкция
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || filter !== "all" || typeFilter !== "all"
                      ? "Задания не найдены"
                      : "Нет доступных заданий"}
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleTaskStatus(task.id, task.status)}
                          className={`${
                            task.status === "active"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white py-1 px-2 rounded text-xs`}
                        >
                          {task.status === "active" ? "Скрыть" : "Активировать"}
                        </button>
                        <Link
                          href={`/admin/tasks/${task.id}/edit`}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
                        >
                          Изменить
                        </Link>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
