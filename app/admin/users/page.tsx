"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertCircle, Copy, Download, Plus, RefreshCw, Trash, Users } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [generatingUsers, setGeneratingUsers] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    // Проверяем наличие cookie
    const hasAdminToken = document.cookie.includes("admin_token=")
    if (!hasAdminToken) {
      window.location.href = "/admin/login"
      return
    }

    checkDemoMode()
    fetchUsers()
  }, [])

  const checkDemoMode = () => {
    // Проверяем, работаем ли мы в демо-режиме
    const isDemoMode = localStorage.getItem("demo_mode") === "true"
    setDemoMode(isDemoMode)
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)

      if (demoMode) {
        // В демо-режиме используем локальное хранилище
        const storedUsers = localStorage.getItem("demo_users")
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers))
        } else {
          setUsers([])
        }
      } else {
        // Используем Supabase для получения пользователей
        const supabase = createClient()
        const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setUsers(data || [])
      }
    } catch (error: any) {
      console.error("Ошибка при загрузке пользователей:", error)
      setError("Не удалось загрузить пользователей")
    } finally {
      setLoading(false)
    }
  }

  const generateTestUsers = async () => {
    try {
      setGeneratingUsers(true)
      setError("")

      // Проверяем, работаем ли мы в демо-режиме
      const isDemoMode = localStorage.getItem("demo_mode") === "true"

      // Генерируем 10 тестовых пользователей
      const newUsers = Array.from({ length: 10 }, (_, i) => {
        const id = Date.now() + i
        const login = `test_user_${id}`
        const password = generatePassword(8)

        return {
          id,
          login,
          password,
          telegram_id: null,
          name: `Тестовый пользователь ${i + 1}`,
          created_at: new Date().toISOString(),
          completed_tasks: 0,
          accuracy: 0,
          last_login: null,
        }
      })

      if (isDemoMode) {
        // В демо-режиме сохраняем в localStorage
        const existingUsers = localStorage.getItem("demo_users")
        const updatedUsers = existingUsers ? [...JSON.parse(existingUsers), ...newUsers] : newUsers

        localStorage.setItem("demo_users", JSON.stringify(updatedUsers))
        setUsers(updatedUsers)
        console.log("Пользователи сохранены в демо-режиме:", updatedUsers)
      } else {
        try {
          // Используем Supabase для сохранения пользователей
          const supabase = createClient()

          // Добавляем пользователей по одному
          for (const user of newUsers) {
            const { error } = await supabase.from("users").insert(user)
            if (error) {
              console.error("Ошибка при добавлении пользователя:", error)
              throw error
            }
          }

          // Обновляем список пользователей
          fetchUsers()
        } catch (error) {
          console.error("Ошибка при работе с Supabase:", error)
          throw new Error("Ошибка при сохранении пользователей в базу данных")
        }
      }

      alert("Успешно создано 10 тестовых пользователей")
    } catch (error: any) {
      console.error("Ошибка при создании тестовых пользователей:", error)
      setError(error.message || "Не удалось создать тестовых пользователей")
    } finally {
      setGeneratingUsers(false)
    }
  }

  const deleteUser = async (userId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) return

    try {
      if (demoMode) {
        // В демо-режиме удаляем из localStorage
        const updatedUsers = users.filter((user) => user.id !== userId)
        localStorage.setItem("demo_users", JSON.stringify(updatedUsers))
        setUsers(updatedUsers)
      } else {
        // Используем Supabase для удаления пользователя
        const supabase = createClient()
        const { error } = await supabase.from("users").delete().eq("id", userId)

        if (error) throw error

        // Обновляем список пользователей
        fetchUsers()
      }
    } catch (error: any) {
      console.error("Ошибка при удалении пользователя:", error)
      setError("Не удалось удалить пользователя")
    }
  }

  const exportUsers = () => {
    const csv = [
      ["ID", "Логин", "Пароль", "Имя", "Дата создания", "Выполнено заданий", "Точность"].join(","),
      ...users.map((user) =>
        [
          user.id,
          user.login,
          user.password,
          user.name,
          user.created_at,
          user.completed_tasks,
          `${user.accuracy}%`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Скопировано в буфер обмена"))
      .catch((err) => console.error("Не удалось скопировать: ", err))
  }

  // Функция для генерации случайного пароля
  const generatePassword = (length: number) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let password = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }
    return password
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка пользователей...</p>
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
            <Users className="h-5 w-5 mr-3" />
            Дашборд
          </Link>
          <Link href="/admin/tasks" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Users className="h-5 w-5 mr-3" />
            Задания
          </Link>
          <Link href="/admin/users" className="flex items-center px-6 py-3 bg-blue-500 text-white">
            <Users className="h-5 w-5 mr-3" />
            Пользователи
          </Link>
          <Link href="/admin/settings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Users className="h-5 w-5 mr-3" />
            Настройки
          </Link>
        </nav>
      </div>

      {/* Основной контент */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление пользователями</h1>
          <div className="flex space-x-2">
            <button
              onClick={fetchUsers}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Обновить
            </button>
            <button
              onClick={exportUsers}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Экспорт CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Генерация тестовых пользователей</h2>
              <button
                onClick={generateTestUsers}
                disabled={generatingUsers}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                {generatingUsers ? "Создание..." : "Создать 10 тестовых пользователей"}
              </button>
            </div>
            <p className="text-gray-500 mt-2">
              Создайте тестовых пользователей с уникальными учетными данными для входа в личный кабинет.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Список пользователей ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Логин
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пароль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Имя
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Выполнено
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Точность
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Пользователи не найдены
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {user.login}
                          <button
                            onClick={() => copyToClipboard(user.login)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {user.password}
                          <button
                            onClick={() => copyToClipboard(user.password)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.completed_tasks}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.accuracy}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-900">
                          <Trash className="h-4 w-4" />
                        </button>
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
