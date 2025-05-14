"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, Lock } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function CabinetLogin() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Проверяем, работаем ли мы в демо-режиме
      const isDemoMode = localStorage.getItem("demo_mode") === "true"

      if (isDemoMode) {
        // В демо-режиме проверяем учетные данные из localStorage
        const storedUsers = localStorage.getItem("demo_users")
        const users = storedUsers ? JSON.parse(storedUsers) : []

        const user = users.find((u: any) => u.login === login && u.password === password)

        if (user) {
          // Сохраняем информацию о пользователе в localStorage
          localStorage.setItem("current_user", JSON.stringify(user))

          // Обновляем время последнего входа
          const updatedUsers = users.map((u: any) => {
            if (u.id === user.id) {
              return { ...u, last_login: new Date().toISOString() }
            }
            return u
          })
          localStorage.setItem("demo_users", JSON.stringify(updatedUsers))

          router.push("/cabinet/dashboard")
        } else {
          throw new Error("Неверный логин или пароль")
        }
      } else {
        // Используем Supabase для аутентификации
        const supabase = createClient()

        // Получаем пользователя по логину и паролю
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("login", login)
          .eq("password", password)
          .single()

        if (error || !data) {
          throw new Error("Неверный логин или пароль")
        }

        // Сохраняем информацию о пользователе в localStorage
        localStorage.setItem("current_user", JSON.stringify(data))

        // Обновляем время последнего входа
        await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", data.id)

        router.push("/cabinet/dashboard")
      }
    } catch (error: any) {
      console.error("Ошибка при входе:", error)
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

        <h1 className="text-2xl font-bold mb-2 text-center">Вход в личный кабинет</h1>
        <p className="text-gray-500 text-center mb-6">Миниап.Разметка</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login" className="block text-gray-700 text-sm font-bold mb-2">
              Логин:
            </label>
            <input
              type="text"
              id="login"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Введите логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Пароль:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-500 hover:text-blue-700 text-sm">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
