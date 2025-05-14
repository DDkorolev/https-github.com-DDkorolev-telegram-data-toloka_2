"use client"

import { useState, useEffect } from "react"
import { supabaseClient } from "@/lib/supabase"
import { env } from "@/lib/env"
import Link from "next/link"
import AppUrlCheck from "@/components/app-url-check"

export default function CheckPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [envVars, setEnvVars] = useState({
    supabaseUrl: "",
    supabaseKey: "",
    appUrl: "",
    telegramToken: "",
    jwtSecret: "",
  })

  useEffect(() => {
    // Проверяем переменные окружения
    setEnvVars({
      supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL || "Не настроен",
      supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Настроен (скрыт)" : "Не настроен",
      appUrl: env.NEXT_PUBLIC_APP_URL || "Не настроен",
      telegramToken: env.TELEGRAM_BOT_TOKEN ? "Настроен (скрыт)" : "Не настроен",
      jwtSecret: env.ADMIN_JWT_SECRET ? "Настроен (скрыт)" : "Не настроен",
    })

    async function checkConnection() {
      try {
        const supabase = supabaseClient()

        // Используем более простой запрос без count(*)
        const { data, error } = await supabase.from("tasks").select("id").limit(1)

        if (error) {
          throw error
        }

        // Проверяем, существует ли таблица, получая количество записей другим способом
        const tasksCount = data ? data.length : 0

        setStatus("success")
        setMessage(`Подключение к Supabase успешно! Найдено задач: ${tasksCount}`)
      } catch (error: any) {
        console.error("Ошибка подключения к Supabase:", error)
        setStatus("error")
        setMessage(`Ошибка подключения к Supabase: ${error.message}`)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Проверка настроек приложения</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Переменные окружения:</h2>
          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <p>
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {envVars.supabaseUrl}
            </p>
            <p>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {envVars.supabaseKey}
            </p>
            <p>
              <strong>NEXT_PUBLIC_APP_URL:</strong> {envVars.appUrl}
            </p>
            <p>
              <strong>TELEGRAM_BOT_TOKEN:</strong> {envVars.telegramToken}
            </p>
            <p>
              <strong>ADMIN_JWT_SECRET:</strong> {envVars.jwtSecret}
            </p>
          </div>
        </div>

        {/* Добавляем компонент проверки URL */}
        <AppUrlCheck />

        <div
          className={`p-4 rounded-lg mt-4 ${
            status === "loading" ? "bg-gray-100" : status === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <p
            className={`${
              status === "loading" ? "text-gray-600" : status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status === "loading" ? "Проверка подключения к Supabase..." : message}
          </p>
        </div>

        {status === "error" && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Возможные решения:</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Убедитесь, что переменные окружения правильно настроены в Vercel</li>
              <li>Проверьте, что URL и ключ API Supabase скопированы правильно</li>
              <li>Перезапустите сервер разработки или повторно разверните приложение</li>
            </ul>
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-center"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
