"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Lock } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const router = useRouter()

  // Функция для добавления отладочной информации
  const addDebugInfo = (info: string) => {
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    addDebugInfo(`Начало входа с логином: ${username}`)

    try {
      // Прямая проверка логина без обращения к API
      if (username === "admin31337") {
        addDebugInfo("Логин верный, устанавливаем cookie напрямую")

        // Устанавливаем cookie напрямую через document.cookie
        document.cookie = `admin_token=direct_auth_token; path=/; max-age=${60 * 60 * 24}`

        addDebugInfo("Cookie установлен, перенаправляем на дашборд")
        router.push("/admin/dashboard")
        return
      }

      addDebugInfo("Логин неверный")
      throw new Error("Неверное имя пользователя. Используйте admin31337")
    } catch (error: any) {
      addDebugInfo(`Ошибка: ${error.message}`)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Lock className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">Вход в админ-панель</h1>
        <p className="text-gray-500 text-center mb-6">Миниап.Разметка</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Имя пользователя:
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </div>
        </form>

        {/* Отладочная информация */}
        {debugInfo.length > 0 && (
          <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-gray-700 max-h-40 overflow-auto">
            <h3 className="font-bold mb-1">Отладочная информация:</h3>
            {debugInfo.map((info, index) => (
              <div key={index}>{info}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
