"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertCircle, Download, FileText, Plus, RefreshCw, Settings, Trash, Users } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function AdminTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [creatingTask, setCreatingTask] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const [newTask, setNewTask] = useState({
    type: "text",
    question: "",
    content: "",
    correct_answer: true,
  })

  useEffect(() => {
    // Проверяем наличие cookie
    const hasAdminToken = document.cookie.includes("admin_token=")
    if (!hasAdminToken) {
      window.location.href = "/admin/login"
      return
    }

    checkDemoMode()
    fetchTasks()
  }, [])

  const checkDemoMode = () => {
    // Проверяем, работаем ли мы в демо-режиме
    const isDemoMode = localStorage.getItem("demo_mode") === "true"
    setDemoMode(isDemoMode)
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)

      if (demoMode) {
        // В демо-режиме используем локальное хранилище
        const storedTasks = localStorage.getItem("demo_tasks")
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks))
        } else {
          // Создаем начальные демо-задания
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
          setTasks(initialTasks)
        }
      } else {
        // Используем Supabase для получения заданий
        const supabase = createClient()
        const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setTasks(data || [])
      }
    } catch (error: any) {
      console.error("Ошибка при загрузке заданий:", error)
      setError("Не удалось загрузить задания")
    } finally {
      setLoading(false)
    }
  }

  const createTask = async () => {
    try {
      setCreatingTask(true)
      setError("")

      if (!newTask.question) {
        throw new Error("Вопрос задания не может быть пустым")
      }

      const task = {
        ...newTask,
        id: Date.now(),
        status: "active",
        created_at: new Date().toISOString(),
      }

      if (demoMode) {
        // В демо-режиме сохраняем в localStorage
        const storedTasks = localStorage.getItem("demo_tasks")
        const existingTasks = storedTasks ? JSON.parse(storedTasks) : []
        const updatedTasks = [task, ...existingTasks]
        localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks))
        setTasks(updatedTasks)
      } else {
        // Используем Supabase для сохранения задания
        const supabase = createClient()
        const { error } = await supabase.from("tasks").insert(task)

        if (error) throw error

        // Обновляем список заданий
        fetchTasks()
      }

      // Сбрасываем форму
      setNewTask({
        type: "text",
        question: "",
        content: "",
        correct_answer: true,
      })

      alert("Задание успешно создано")
    } catch (error: any) {
      console.error("Ошибка при создании задания:", error)
      setError(error.message || "Не удалось создать задание")
    } finally {
      setCreatingTask(false)
    }
  }

  const deleteTask = async (taskId: number) => {
    if (!confirm("Вы уверены, что хотите удалить это задание?")) return

    try {
      if (demoMode) {
        // В демо-режиме удаляем из localStorage
        const storedTasks = localStorage.getItem("demo_tasks")
        if (storedTasks) {
          const existingTasks = JSON.parse(storedTasks)
          const updatedTasks = existingTasks.filter((task: any) => task.id !== taskId)
          localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks))
          setTasks(updatedTasks)
        }
      } else {
        // Используем Supabase для удаления задания
        const supabase = createClient()
        const { error } = await supabase.from("tasks").delete().eq("id", taskId)

        if (error) throw error

        // Обновляем список заданий
        fetchTasks()
      }
    } catch (error: any) {
      console.error("Ошибка при удалении задания:", error)
      setError("Не удалось удалить задание")
    }
  }

  const toggleTaskStatus = async (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "hidden" : "active"

    try {
      if (demoMode) {
        // В демо-режиме обновляем в localStorage
        const storedTasks = localStorage.getItem("demo_tasks")
        if (storedTasks) {
          const existingTasks = JSON.parse(storedTasks)
          const updatedTasks = existingTasks.map((task: any) => {
            if (task.id === taskId) {
              return { ...task, status: newStatus }
            }
            return task
          })
          localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks))
          setTasks(updatedTasks)
        }
      } else {
        // Используем Supabase для обновления статуса задания
        const supabase = createClient()
        const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId)

        if (error) throw error

        // Обновляем список заданий
        fetchTasks()
      }
    } catch (error: any) {
      console.error("Ошибка при обновлении статуса задания:", error)
      setError("Не удалось обновить статус задания")
    }
  }

  const exportTasks = () => {
    const csv = [
      ["ID", "Тип", "Вопрос", "Содержание", "Правильный ответ", "Статус", "Дата создания"].join(","),
      ...tasks.map((task) =>
        [
          task.id,
          task.type,
          `"${task.question.replace(/"/g, '""')}"`,
          `"${task.content.replace(/"/g, '""')}"`,
          task.correct_answer ? "Да" : "Нет",
          task.status === "active" ? "Активно" : "Скрыто",
          task.created_at,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tasks.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка заданий...</p>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление заданиями</h1>
          <div className="flex space-x-2">
            <button
              onClick={fetchTasks}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Обновить
            </button>
            <button
              onClick={exportTasks}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Экспорт CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Форма создания задания */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Создание нового задания</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="task-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Тип задания
                </label>
                <select
                  id="task-type"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                >
                  <option value="text">Текст</option>
                  <option value="image">Изображение</option>
                </select>
              </div>

              <div>
                <label htmlFor="correct-answer" className="block text-sm font-medium text-gray-700 mb-2">
                  Правильный ответ
                </label>
                <select
                  id="correct-answer"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newTask.correct_answer ? "true" : "false"}
                  onChange={(e) => setNewTask({ ...newTask, correct_answer: e.target.value === "true" })}
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
                  value={newTask.question}
                  onChange={(e) => setNewTask({ ...newTask, question: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="task-content" className="block text-sm font-medium text-gray-700 mb-2">
                  Содержание
                </label>
                {newTask.type === "text" ? (
                  <textarea
                    id="task-content"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Введите текст задания"
                    rows={4}
                    value={newTask.content}
                    onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    id="task-content"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Введите URL изображения (например, /tabby-cat-sunbeam.png)"
                    value={newTask.content}
                    onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                  />
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={createTask}
                disabled={creatingTask || !newTask.question}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                {creatingTask ? "Создание..." : "Создать задание"}
              </button>
            </div>
          </div>
        </div>

        {/* Список заданий */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Список заданий ({tasks.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Вопрос
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Правильный ответ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Задания не найдены
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.type === "text" ? "Текст" : "Изображение"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{task.question}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.correct_answer ? "Да" : "Нет"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => toggleTaskStatus(task.id, task.status)}
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.status === "active" ? "Активно" : "Скрыто"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-900">
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
