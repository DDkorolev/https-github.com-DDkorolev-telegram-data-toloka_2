"use client"

import { useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase"

// Имитация WebApp для разработки
const mockWebApp = {
  ready: () => console.log("WebApp ready"),
  expand: () => console.log("WebApp expand"),
  showAlert: (message: string) => alert(message),
  initDataUnsafe: {
    user: {
      id: 123456789,
      username: "test_user",
      first_name: "Test",
      last_name: "User",
    },
  },
}

export default function MiniApp() {
  const [initialized, setInitialized] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [screen, setScreen] = useState<"main" | "task" | "completed">("main")
  const [currentTask, setCurrentTask] = useState<any>(null)
  const [availableTasks, setAvailableTasks] = useState<number>(0)
  const [WebApp, setWebApp] = useState<any>(null)

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (typeof window !== "undefined" && !initialized) {
      try {
        // Проверяем, доступен ли Telegram WebApp
        const telegramWebApp = (window as any).Telegram?.WebApp || mockWebApp
        setWebApp(telegramWebApp)

        telegramWebApp.ready()
        telegramWebApp.expand()

        const webAppUser = telegramWebApp.initDataUnsafe?.user
        if (webAppUser) {
          registerUser(webAppUser)
        }

        setInitialized(true)
      } catch (error) {
        console.error("Не удалось инициализировать WebApp:", error)
      }
    }
  }, [initialized])

  useEffect(() => {
    if (user) {
      countAvailableTasks()
    }
  }, [user])

  const registerUser = async (webAppUser: any) => {
    try {
      const supabase = supabaseClient()
      const { data, error } = await supabase
        .from("users")
        .upsert(
          {
            telegram_id: webAppUser.id,
            username: webAppUser.username,
            first_name: webAppUser.first_name,
            last_name: webAppUser.last_name,
          },
          { onConflict: "telegram_id" },
        )
        .select()

      if (error) throw error
      setUser(webAppUser)
    } catch (error) {
      console.error("Ошибка регистрации пользователя:", error)
    }
  }

  const countAvailableTasks = async () => {
    try {
      const supabase = supabaseClient()
      // Получаем все активные задания
      const { data: allTasks, error: tasksError } = await supabase.from("tasks").select("id").eq("status", "active")

      if (tasksError) throw tasksError

      // Получаем все задания, на которые пользователь уже ответил
      const { data: userResponses, error: responsesError } = await supabase
        .from("responses")
        .select("task_id")
        .eq("user_id", user.id)

      if (responsesError) throw responsesError

      const answeredTaskIds = userResponses.map((r) => r.task_id)
      const availableTasksCount = allTasks.filter((task) => !answeredTaskIds.includes(task.id)).length

      setAvailableTasks(availableTasksCount)
    } catch (error) {
      console.error("Ошибка подсчета доступных заданий:", error)
    }
  }

  const startLabeling = async () => {
    await fetchNextTask()
    setScreen("task")
  }

  const fetchNextTask = async () => {
    try {
      const supabase = supabaseClient()
      // Получаем все активные задания
      const { data: allTasks, error: tasksError } = await supabase.from("tasks").select("*").eq("status", "active")

      if (tasksError) throw tasksError

      // Получаем все задания, на которые пользователь уже ответил
      const { data: userResponses, error: responsesError } = await supabase
        .from("responses")
        .select("task_id")
        .eq("user_id", user.id)

      if (responsesError) throw responsesError

      const answeredTaskIds = userResponses.map((r) => r.task_id)
      const availableTasks = allTasks.filter((task) => !answeredTaskIds.includes(task.id))

      if (availableTasks.length > 0) {
        setCurrentTask(availableTasks[0])
      } else {
        setScreen("completed")
      }
    } catch (error) {
      console.error("Ошибка получения следующего задания:", error)
    }
  }

  const submitAnswer = async (answer: boolean) => {
    try {
      const supabase = supabaseClient()
      const isCorrect = currentTask.correct_answer !== null ? answer === currentTask.correct_answer : null

      const { error } = await supabase.from("responses").insert({
        user_id: user.id,
        task_id: currentTask.id,
        answer,
        is_correct: isCorrect,
      })

      if (error) throw error

      // Получаем следующее задание
      await fetchNextTask()
      await countAvailableTasks()
    } catch (error) {
      console.error("Ошибка отправки ответа:", error)
    }
  }

  if (!initialized) {
    return <div className="flex h-screen items-center justify-center">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {screen === "main" && (
        <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Миниап.Разметка</h1>
          <p className="text-center mb-4">Добро пожаловать в приложение для разметки данных!</p>
          <p className="text-center mb-6">
            Доступно заданий: <span className="font-bold">{availableTasks}</span>
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={startLabeling}
              disabled={availableTasks === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-400"
            >
              Начать разметку
            </button>
            <button
              onClick={() => WebApp?.showAlert("Эта функция будет доступна в будущем")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium"
            >
              Моя статистика
            </button>
          </div>
        </div>
      )}

      {screen === "task" && currentTask && (
        <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">{currentTask.question}</h2>

          {currentTask.type === "image" ? (
            <div className="mb-6">
              <img
                src={currentTask.content || "/placeholder.svg?height=300&width=400&query=image"}
                alt="Задание"
                className="w-full h-auto rounded-lg object-contain max-h-80"
              />
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p>{currentTask.content}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => submitAnswer(true)}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium"
            >
              ✅ Правильно
            </button>
            <button
              onClick={() => submitAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium"
            >
              ❌ Неправильно
            </button>
          </div>
        </div>
      )}

      {screen === "completed" && (
        <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold mb-4">🎉 Вы завершили все доступные задания!</h2>
          <p className="mb-6">Загляните позже, когда появятся новые задания.</p>
          <button
            onClick={() => setScreen("main")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium"
          >
            Вернуться на главную
          </button>
        </div>
      )}
    </div>
  )
}
