"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, FileText, Settings, Users } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function NewTask() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [demoMode, setDemoMode] = useState(false)
  const [task, setTask] = useState({
    type: "text",
    question: "",
    content: "",
    correct_answer: true,
    status: "active",
  })
  const router = useRouter()

  useEffect(() => {
    // Проверяем наличие cookie
    const hasAdminToken = document.cookie.includes("admin_token=")
    if (!hasAdminToken) {
      router.push("/admin/login")
      return
    }

    // Проверяем, работаем ли мы в демо-режиме
    const isDemoMode = localStorage.getItem("demo_mode") === "true"
    setDemoMode(isDemoMode)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!task.question) {
        throw new Error("Вопрос задания не может быть пустым")
      }

      if (task.type === "image" && !task.content) {
        throw new Error("URL изображения не может быть пустым")
      }

      const newTask = {
        ...task,
        id: Date.now(),
        created_at: new Date().toISOString(),
      }

      if (demoMode) {
        // В демо-режиме сохраняем в localStorage
        const storedTasks = localStorage.getItem("demo_tasks")
        const existingTasks = storedTasks ? JSON.parse(storedTasks) : []
        localStorage.setItem("demo_tasks", JSON.stringify([newTask, ...existingTasks]))
      } else {
        // Используем Supabase для сохранения задания
        const supabase = createClient()
        const { error } = await supabase.from("tasks").insert(newTask)

        if (error) throw error
      }

      router.push("/admin/tasks")
    } catch (error: any) {
      console.error("Ошибка при создании задания:", error)
      setError(error.message || "Не удалось создать задание")
    } finally {
      setLoading(false)
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
            <FileText className="h-5 w-5 mr-3" />
            Дашборд
          </Link>
          <Link href="/admin/tasks" className="flex items-center px-6 py-3 bg-blue-500 text-white">
            <FileText className="h-5 w-5 mr-3" />
            Задания
          </Link>
          <Link href="/admin/users" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Users className="h-5 w-5 mr-3" />
            Пользователи
          </Link>
          <Link href="/admin/settings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Settings className="h-5 w-5 mr-3" />
            Настройки
          </Link>
        </nav>
      </div>

      {/* Основной контент */}
      <div className="ml-64 p-8">
        <div className="flex items-center mb-6">
          <Link href="/admin/tasks" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold">Создание нового задания</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="task-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Тип задания
                </label>
                <select
                  id="task-type"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={task.type}
                  onChange={(e) => setTask({ ...task, type: e.target.value })}
                >
                  <option value="text">Текст</option>
                  <option value="image">Изображение</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  id="task-status"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={task.status}
                  onChange={(e) => setTask({ ...task, status: e.target.value })}
                >
                  <option value="active">Активно</option>
                  <option value="hidden">Скрыто</option>
                </select>
              </div>

              <div>
                <label htmlFor="correct-answer" className="block text-sm font-medium text-gray-700 mb-2">
                  Правильный ответ
                </label>
                <select
                  id="correct-answer"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={task.correct_answer ? "true" : "false"}
                  onChange={(e) => setTask({ ...task, correct_answer: e.target.value === "true" })}
                >
                  <option value="true">Да</option>
                  <option value="false">Нет</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="task-question" className="block text-sm font-medium text-gray-700 mb-2">
                  Вопрос
                </label>
                <input
                  type="text"
                  id="task-question"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Введите вопрос задания"
                  value={task.question}
                  onChange={(e) => setTask({ ...task, question: e.target.value })}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="task-content" className="block text-sm font-medium text-gray-700 mb-2">
                  {task.type === "text" ? "Текст задания" : "URL изображения"}
                </label>
                {task.type === "text" ? (
                  <textarea
                    id="task-content"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Введите текст задания"
                    rows={4}
                    value={task.content}
                    onChange={(e) => setTask({ ...task, content: e.target.value })}
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    id="task-content"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Введите URL изображения (например, /tabby-cat-sunbeam.png)"
                    value={task.content}
                    onChange={(e) => setTask({ ...task, content: e.target.value })}
                    required
                  />
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Link href="/admin/tasks" className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Отмена
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Создание..." : "Создать задание"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
