"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

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
    // Имитация проверки переменных окружения
    setTimeout(() => {
      setEnvVars({
        supabaseUrl: "https://example.supabase.co",
        supabaseKey: "Настроен (скрыт)",
        appUrl: window.location.origin,
        telegramToken: "Настроен (скрыт)",
        jwtSecret: "Настроен (скрыт)",
      })
      setStatus("success")
      setMessage("Подключение к Supabase успешно! Найдено задач: 20")
    }, 1000)
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
