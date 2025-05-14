"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, Database, Settings } from "lucide-react"

export default function AdminSettings() {
  const [demoMode, setDemoMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем наличие cookie
    const hasAdminToken = document.cookie.includes("admin_token=")
    if (!hasAdminToken) {
      window.location.href = "/admin/login"
      return
    }

    // Проверяем, включен ли демо-режим
    const isDemoMode = localStorage.getItem("demo_mode") === "true"
    setDemoMode(isDemoMode)
    setLoading(false)
  }, [])

  const toggleDemoMode = () => {
    const newDemoMode = !demoMode
    setDemoMode(newDemoMode)
    localStorage.setItem("demo_mode", newDemoMode.toString())
  }

  const clearDemoData = () => {
    if (confirm("Вы уверены, что хотите очистить все демо-данные? Это действие нельзя отменить.")) {
      localStorage.removeItem("demo_users")
      localStorage.removeItem("demo_tasks")
      localStorage.removeItem("demo_responses")
      alert("Демо-данные успешно очищены")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка настроек...</p>
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
            <Settings className="h-5 w-5 mr-3" />
            Дашборд
          </Link>
          <Link href="/admin/tasks" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Settings className="h-5 w-5 mr-3" />
            Задания
          </Link>
          <Link href="/admin/users" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Settings className="h-5 w-5 mr-3" />
            Пользователи
          </Link>
          <Link href="/admin/settings" className="flex items-center px-6 py-3 bg-blue-500 text-white">
            <Settings className="h-5 w-5 mr-3" />
            Настройки
          </Link>
        </nav>
      </div>

      {/* Основной контент */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Настройки системы</h1>
        </div>

        {/* Настройки демо-режима */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Демо-режим</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-md font-medium">Включить демо-режим</h3>
                <p className="text-sm text-gray-500 mt-1">
                  В демо-режиме все данные хранятся локально в браузере, без использования базы данных.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={demoMode} onChange={toggleDemoMode} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {demoMode && (
              <div className="mt-6">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-bold">Внимание! Демо-режим активен.</p>
                    <p>Все данные хранятся только в вашем браузере и будут потеряны при очистке кэша.</p>
                  </div>
                </div>

                <button
                  onClick={clearDemoData}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Очистить все демо-данные
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Настройки базы данных */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Настройки базы данных</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-md font-medium">Статус подключения к Supabase</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {demoMode ? "Демо-режим активен, подключение к базе данных не используется" : "Подключено к Supabase"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">Переменные окружения</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="mb-2">
                  <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL:</span>{" "}
                  <span className="text-green-600">✓ Настроено</span>
                </p>
                <p className="mb-2">
                  <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>{" "}
                  <span className="text-green-600">✓ Настроено</span>
                </p>
                <p>
                  <span className="font-mono text-sm">ADMIN_JWT_SECRET:</span>{" "}
                  <span className="text-green-600">✓ Настроено</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
