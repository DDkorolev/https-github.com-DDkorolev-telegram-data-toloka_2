"use client"

import { useState, useEffect } from "react"
import { supabaseClient } from "@/lib/supabase"

export default function SupabaseCheck() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
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
  )
}
