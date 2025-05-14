"use client"

import { useEffect, useState } from "react"
import { CoinsIcon as Coin, Award, BarChart2, ArrowLeft, CheckCircle, XCircle } from "lucide-react"

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

// Тестовые изображения для разметки
const testImages = [
  { id: 1, path: "/tabby-cat-sunbeam.png", question: "На изображении кошка?", correctAnswer: true },
  { id: 2, path: "/happy-golden-retriever.png", question: "На изображении собака?", correctAnswer: true },
  { id: 3, path: "/colorful-bird-perched.png", question: "На изображении птица?", correctAnswer: true },
  { id: 4, path: "/classic-red-convertible.png", question: "На изображении автомобиль?", correctAnswer: true },
  { id: 5, path: "/cozy-suburban-house.png", question: "На изображении дом?", correctAnswer: true },
  { id: 6, path: "/solitary-oak.png", question: "На изображении дерево?", correctAnswer: true },
  { id: 7, path: "/diverse-group.png", question: "На изображении люди?", correctAnswer: true },
  { id: 8, path: "/single-vibrant-flower.png", question: "На изображении цветок?", correctAnswer: true },
  { id: 9, path: "/majestic-mountain-range.png", question: "На изображении горы?", correctAnswer: true },
  { id: 10, path: "/tabby-cat-sunbeam.png", question: "На изображении собака?", correctAnswer: false },
]

export default function MiniApp() {
  const [initialized, setInitialized] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [screen, setScreen] = useState<"main" | "task" | "stats" | "completed">("main")
  const [currentTask, setCurrentTask] = useState<any>(null)
  const [taskIndex, setTaskIndex] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<any[]>([])
  const [coins, setCoins] = useState(0)
  const [streak, setStreak] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
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

        // Загружаем сохраненные данные из localStorage
        const savedCoins = localStorage.getItem("user_coins")
        const savedCompletedTasks = localStorage.getItem("completed_tasks")
        const savedAccuracy = localStorage.getItem("user_accuracy")
        const savedStreak = localStorage.getItem("user_streak")

        if (savedCoins) setCoins(Number.parseInt(savedCoins))
        if (savedCompletedTasks) setCompletedTasks(JSON.parse(savedCompletedTasks))
        if (savedAccuracy) setAccuracy(Number.parseInt(savedAccuracy))
        if (savedStreak) setStreak(Number.parseInt(savedStreak))

        setInitialized(true)
      } catch (error) {
        console.error("Не удалось инициализировать WebApp:", error)
      }
    }
  }, [initialized])

  const startLabeling = async () => {
    setTaskIndex(0)
    await fetchNextTask(0)
    setScreen("task")
  }

  const fetchNextTask = async (index: number) => {
    if (index < testImages.length) {
      setCurrentTask(testImages[index])
    } else {
      setScreen("completed")
    }
  }

  const submitAnswer = async (answer: boolean) => {
    if (!currentTask) return

    // Проверяем правильность ответа
    const isCorrect = answer === currentTask.correctAnswer

    // Обновляем статистику
    const newCompletedTasks = [
      ...completedTasks,
      {
        id: currentTask.id,
        question: currentTask.question,
        userAnswer: answer,
        correctAnswer: currentTask.correctAnswer,
        isCorrect,
        timestamp: new Date().toISOString(),
      },
    ]

    setCompletedTasks(newCompletedTasks)
    localStorage.setItem("completed_tasks", JSON.stringify(newCompletedTasks))

    // Обновляем монеты
    const earnedCoins = isCorrect ? 10 : 2
    const newCoins = coins + earnedCoins
    setCoins(newCoins)
    localStorage.setItem("user_coins", newCoins.toString())

    // Обновляем точность
    const correctCount = newCompletedTasks.filter((task) => task.isCorrect).length
    const newAccuracy = Math.round((correctCount / newCompletedTasks.length) * 100)
    setAccuracy(newAccuracy)
    localStorage.setItem("user_accuracy", newAccuracy.toString())

    // Обновляем серию правильных ответов
    if (isCorrect) {
      const newStreak = streak + 1
      setStreak(newStreak)
      localStorage.setItem("user_streak", newStreak.toString())
    } else {
      setStreak(0)
      localStorage.setItem("user_streak", "0")
    }

    // Показываем результат на 1 секунду
    setTimeout(() => {
      // Переходим к следующему заданию
      const nextIndex = taskIndex + 1
      setTaskIndex(nextIndex)

      if (nextIndex < testImages.length) {
        fetchNextTask(nextIndex)
      } else {
        setScreen("completed")
      }
    }, 1000)
  }

  const showStats = () => {
    setScreen("stats")
  }

  const goToMain = () => {
    setScreen("main")
  }

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Главный экран */}
      {screen === "main" && (
        <div className="max-w-md mx-auto bg-white p-6 min-h-screen flex flex-col">
          {/* Шапка с балансом */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Миниап.Разметка</h1>
            <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
              <Coin className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-bold">{coins}</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-lg mb-6">Добро пожаловать в приложение для разметки данных!</p>

            {/* Статистика пользователя */}
            <div className="grid grid-cols-3 gap-2 mb-8">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-500 flex justify-center mb-1">
                  <Award className="h-6 w-6" />
                </div>
                <p className="text-xs text-gray-500">Выполнено</p>
                <p className="text-lg font-bold">{completedTasks.length}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-500 flex justify-center mb-1">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <p className="text-xs text-gray-500">Точность</p>
                <p className="text-lg font-bold">{accuracy}%</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-orange-500 flex justify-center mb-1">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <p className="text-xs text-gray-500">Серия</p>
                <p className="text-lg font-bold">{streak}</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-xl">
                Доступно заданий: <span className="font-bold">{testImages.length - completedTasks.length}</span>
              </p>
            </div>
          </div>

          <div className="w-full space-y-4 mt-auto">
            <button
              onClick={startLabeling}
              disabled={completedTasks.length >= testImages.length}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-4 rounded-lg font-medium text-lg disabled:opacity-50"
            >
              {completedTasks.length >= testImages.length ? "Все задания выполнены" : "Начать разметку"}
            </button>

            <button
              onClick={showStats}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-4 rounded-lg font-medium text-lg"
            >
              Моя статистика
            </button>
          </div>
        </div>
      )}

      {/* Экран задания */}
      {screen === "task" && currentTask && (
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          {/* Шапка */}
          <div className="flex justify-between items-center p-4 border-b">
            <button onClick={goToMain} className="text-gray-500">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="text-center">
              <p className="font-medium">
                Задание {taskIndex + 1}/{testImages.length}
              </p>
            </div>
            <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
              <Coin className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-bold">{coins}</span>
            </div>
          </div>

          {/* Содержимое задания */}
          <div className="flex-1 p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-center">{currentTask.question}</h2>

            <div className="flex-1 flex items-center justify-center mb-6">
              <img
                src={currentTask.path || "/placeholder.svg"}
                alt="Задание"
                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <button
                onClick={() => submitAnswer(true)}
                className="bg-green-500 hover:bg-green-600 text-white py-4 px-4 rounded-lg font-medium text-lg"
              >
                ✅ Да
              </button>
              <button
                onClick={() => submitAnswer(false)}
                className="bg-red-500 hover:bg-red-600 text-white py-4 px-4 rounded-lg font-medium text-lg"
              >
                ❌ Нет
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Экран статистики */}
      {screen === "stats" && (
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          {/* Шапка */}
          <div className="flex justify-between items-center p-4 border-b">
            <button onClick={goToMain} className="text-gray-500">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="text-center">
              <p className="font-medium">Моя статистика</p>
            </div>
            <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
              <Coin className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-bold">{coins}</span>
            </div>
          </div>

          {/* Содержимое статистики */}
          <div className="flex-1 p-4 overflow-auto">
            {/* Общая статистика */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <h3 className="text-lg font-bold mb-4">Общая статистика</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Всего заданий</p>
                  <p className="text-xl font-bold">{completedTasks.length}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Заработано монет</p>
                  <p className="text-xl font-bold">{coins}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Точность</p>
                  <p className="text-xl font-bold">{accuracy}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Текущая серия</p>
                  <p className="text-xl font-bold">{streak}</p>
                </div>
              </div>
            </div>

            {/* История заданий */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-bold mb-4">История заданий</h3>

              {completedTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Вы еще не выполнили ни одного задания</p>
              ) : (
                <div className="space-y-3">
                  {completedTasks
                    .slice()
                    .reverse()
                    .map((task, index) => (
                      <div key={index} className="border rounded-lg p-3 flex items-center">
                        {task.isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.question}</p>
                          <p className="text-xs text-gray-500">
                            Ваш ответ: {task.userAnswer ? "Да" : "Нет"} | Правильный:{" "}
                            {task.correctAnswer ? "Да" : "Нет"}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <span className={`text-sm font-medium ${task.isCorrect ? "text-green-500" : "text-red-500"}`}>
                            {task.isCorrect ? "+10" : "+2"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Экран завершения */}
      {screen === "completed" && (
        <div className="max-w-md mx-auto bg-white p-6 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Все задания выполнены!</h2>
            <p className="text-gray-600 mb-4">Вы успешно завершили все доступные задания.</p>

            <div className="bg-yellow-50 p-4 rounded-lg inline-block mb-6">
              <div className="flex items-center justify-center">
                <Coin className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="text-xl font-bold">Баланс: {coins}</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={showStats}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium"
            >
              Посмотреть статистику
            </button>

            <button
              onClick={goToMain}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
