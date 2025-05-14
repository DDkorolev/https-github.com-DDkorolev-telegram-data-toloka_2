"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Home() {
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    // Проверяем, включен ли демо-режим
    const isDemoMode = localStorage.getItem("demo_mode") === "true"
    setDemoMode(isDemoMode)
  }, [])

  const toggleDemoMode = () => {
    const newDemoMode = !demoMode
    setDemoMode(newDemoMode)
    localStorage.setItem("demo_mode", newDemoMode.toString())

    // Если включаем демо-режим, инициализируем демо-данные
    if (newDemoMode) {
      // Инициализируем демо-пользователей, если их нет
      if (!localStorage.getItem("demo_users")) {
        const initialUsers = [
          {
            id: 1,
            login: "test_user",
            password: "password",
            name: "Тестовый пользователь",
            created_at: new Date().toISOString(),
            completed_tasks: 0,
            accuracy: 0,
            last_login: null,
          },
        ]
        localStorage.setItem("demo_users", JSON.stringify(initialUsers))
      }

      // Инициализируем демо-задания, если их нет
      if (!localStorage.getItem("demo_tasks")) {
        const initialTasks = [
          {
            id: 1,
            type: "text",
            question: "Москва является столицей России.",
            content: "Москва является столицей России.",
            correct_answer: true,
            status: "active",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            type: "text",
            question: "Земля вращается вокруг Солнца.",
            content: "Земля вращается вокруг Солнца.",
            correct_answer: true,
            status: "active",
            created_at: new Date().toISOString(),
          },
          {
            id: 3,
            type: "image",
            question: "На изображении кошка?",
            content: "/tabby-cat-sunbeam.png",
            correct_answer: true,
            status: "active",
            created_at: new Date().toISOString(),
          },
        ]
        localStorage.setItem("demo_tasks", JSON.stringify(initialTasks))
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Миниап.Разметка</h1>
        <p className="text-gray-600 mb-8 text-center">Telegram Mini App для разметки данных</p>

        <div className="space-y-4">
          <Link
            href="/mini-app"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-center"
          >
            Открыть Mini App
          </Link>

          <Link
            href="/cabinet/login"
            className="block w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium text-center"
          >
            Личный кабинет
          </Link>

          <Link
            href="/admin/login"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium text-center"
          >
            Вход в админ-панель
          </Link>

          <Link
            href="/check"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium text-center"
          >
            Проверить настройки
          </Link>

          <div className="flex items-center justify-between mt-6 p-4 bg-yellow-50 rounded-lg">
            <div>
              <p className="font-medium">Демо-режим</p>
              <p className="text-sm text-gray-500">Работа без базы данных</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={demoMode} onChange={toggleDemoMode} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
