"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Lock } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Отправка запроса на вход...")

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })

      console.log("Получен ответ:", response.status)

      // Проверяем, что ответ можно распарсить как JSON
      let data
      try {
        const text = await response.text()
        console.log("Текст ответа:", text)
        data = JSON.parse(text)
      } catch (jsonError) {
        console.error("Ошибка парсинга JSON:", jsonError)
        throw new Error("Ошибка обработки ответа сервера")
      }

      if (!response.ok) {
        throw new Error(data.message || "Ошибка авторизации")
      }

      console.log("Успешный вход, перенаправление...")
      router.push("/admin/dashboard")
    } catch (error: any) {
      console.error("Ошибка входа:", error)
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
