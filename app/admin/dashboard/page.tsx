"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
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
    return <div className="flex h-screen items-center justify-center">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Админ-панель</h1>
          <div className="flex gap-4">
            <Link href="/admin/tasks/new" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
              Добавить задание
            </Link>
            <button onClick={logout} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
              Выйти
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

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
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Нет доступных заданий
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
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
