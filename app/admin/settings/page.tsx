"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, CheckCircle, ArrowLeft, Users, FileText, Settings, LogOut, BarChart2, Save } from "lucide-react"

export default function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [settings, setSettings] = useState({
    appName: "Миниап.Разметка",
    pointsPerTask: 25,
    enableNotifications: true,
    enableStatistics: true,
    enableUserRanking: false,
    maxTasksPerDay: 50,
    adminEmail: "admin@example.com",
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setSettings({
      ...settings,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number.parseInt(value)
            : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Здесь будет API-запрос для сохранения настроек
      // await fetch("/api/admin/settings", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(settings)
      // })

      // Имитация задержки API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      showNotification("success", "Настройки успешно сохранены")
    } catch (error: any) {
      setError(error.message || "Ошибка сохранения настроек")
      showNotification("error", "Ошибка сохранения настроек")
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Ошибка выхода:", error)
    }
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
          <Link href="/admin/tasks" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <FileText className="h-5 w-5 mr-3" />
            Задания
          </Link>
          <Link href="/admin/users" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Users className="h-5 w-5 mr-3" />
            Пользователи
          </Link>
          <Link href="/admin/settings" className="flex items-center px-6 py-3 bg-blue-500 text-white">
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
            <h1 className="text-2xl font-bold">Настройки системы</h1>
          </div>
        </div>

        {/* Уведомления */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start ${notification.type === "success" ? "bg-green-100" : "bg-red-100"}`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <span className={notification.type === "success" ? "text-green-700" : "text-red-700"}>
              {notification.message}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="appName" className="block text-sm font-medium text-gray-700 mb-1">
                  Название приложения
                </label>
                <input
                  type="text"
                  id="appName"
                  name="appName"
                  value={settings.appName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email администратора
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="pointsPerTask" className="block text-sm font-medium text-gray-700 mb-1">
                  Баллы за задание
                </label>
                <input
                  type="number"
                  id="pointsPerTask"
                  name="pointsPerTask"
                  value={settings.pointsPerTask}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="maxTasksPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                  Максимум заданий в день
                </label>
                <input
                  type="number"
                  id="maxTasksPerDay"
                  name="maxTasksPerDay"
                  value={settings.maxTasksPerDay}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableNotifications"
                  name="enableNotifications"
                  checked={settings.enableNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-700">
                  Включить уведомления
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableStatistics"
                  name="enableStatistics"
                  checked={settings.enableStatistics}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableStatistics" className="ml-2 block text-sm text-gray-700">
                  Включить статистику
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableUserRanking"
                  name="enableUserRanking"
                  checked={settings.enableUserRanking}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableUserRanking" className="ml-2 block text-sm text-gray-700">
                  Включить рейтинг пользователей
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить настройки
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Безопасность</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Изменить учетные данные администратора</h3>
              <p className="text-sm text-gray-500 mt-1">
                Текущий логин: <span className="font-medium">admin31337</span>
              </p>
              <button
                type="button"
                className="mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Изменить учетные данные
              </button>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Журнал безопасности</h3>
              <p className="text-sm text-gray-500 mt-1">Просмотр журнала входов и действий администраторов</p>
              <button
                type="button"
                className="mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Просмотреть журнал
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
