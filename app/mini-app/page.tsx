"use client"

import { useEffect, useState } from "react"

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
  const [availableTasks, setAvailableTasks] = useState<number>(20)
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
          setUser(webAppUser)
        }

        setInitialized(true)
      } catch (error) {
        console.error("Не удалось инициализировать WebApp:", error)
      }
    }
  }, [initialized])

  const startLabeling = async () => {
    await fetchNextTask()
    setScreen("task")
  }

  const fetchNextTask = async () => {
    // Имитация получения задания
    const mockTasks = [
      {
        id: 1,
        type: "text",
        content: "Москва является столицей России.",
        question: "Это утверждение верно?",
        correct_answer: true,
      },
      {
        id: 2,
        type: "image",
        content: "/tabby-cat-sunbeam.png",
        question: "На изображении кошка?",
        correct_answer: true,
      },
    ]

    setCurrentTask(mockTasks[Math.floor(Math.random() * mockTasks.length)])
  }

  const submitAnswer = async (answer: boolean) => {
    // Имитация отправки ответа
    setTimeout(() => {
      setAvailableTasks((prev) => Math.max(0, prev - 1))

      if (availableTasks <= 1) {
        setScreen("completed")
      } else {
        fetchNextTask()
      }
    }, 500)
  }

  if (!initialized) {
    return <div className="flex h-screen items-center justify-center">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {screen === "main" && (
        <div className="max-w-md mx-auto bg-white p-6 min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-center mb-6">Миниап.Разметка</h1>

          <p className="text-center mb-8 text-lg">Добро пожаловать в приложение для разметки данных!</p>

          <div className="text-center mb-10">
            <p className="text-xl">
              Доступно заданий: <span className="font-bold">{availableTasks}</span>
            </p>
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={startLabeling}
              disabled={availableTasks === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-4 rounded-lg font-medium text-lg disabled:opacity-50"
            >
              Начать разметку
            </button>

            <button
              onClick={() => WebApp?.showAlert("Эта функция будет доступна в будущем")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-4 rounded-lg font-medium text-lg"
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
                src={currentTask.content || "/placeholder.svg"}
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
