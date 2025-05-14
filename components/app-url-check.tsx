"use client"

import { useState, useEffect } from "react"

export default function AppUrlCheck() {
  const [status, setStatus] = useState<"loading" | "success" | "warning" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function checkAppUrl() {
      try {
        const response = await fetch("/api/get-app-url")
        const data = await response.json()

        if (data.configuredUrl !== data.detectedUrl) {
          setStatus("warning")
          setMessage(
            `Внимание: Настроенный URL (${data.configuredUrl}) отличается от обнаруженного URL (${data.detectedUrl})`,
          )
        } else {
          setStatus("success")
          setMessage(`URL приложения настроен правильно: ${data.configuredUrl}`)
        }
      } catch (error) {
        setStatus("error")
        setMessage("Ошибка при проверке URL приложения")
      }
    }

    checkAppUrl()
  }, [])

  if (status === "loading") {
    return <div className="p-4 bg-gray-100 rounded-lg mt-4">Проверка URL приложения...</div>
  }

  return (
    <div
      className={`p-4 rounded-lg mt-4 ${
        status === "success" ? "bg-green-100" : status === "warning" ? "bg-yellow-100" : "bg-red-100"
      }`}
    >
      <p
        className={`${
          status === "success" ? "text-green-600" : status === "warning" ? "text-yellow-600" : "text-red-600"
        }`}
      >
        {message}
      </p>
      {status === "warning" && (
        <p className="text-sm mt-2 text-gray-600">
          Рекомендуется обновить переменную окружения NEXT_PUBLIC_APP_URL в настройках Vercel.
        </p>
      )}
    </div>
  )
}
