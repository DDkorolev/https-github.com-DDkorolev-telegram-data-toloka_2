"use client"

import { useState, useEffect } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import { TaskCard } from "@/components/task-card"
import { AudioWave } from "@/components/audio-wave"
import { EmojiRating } from "@/components/emoji-rating"
import { ArrowLeft, User, BarChart, CheckCircle } from "lucide-react"

// Имитация данных для разметки
const mockTasks = [
  {
    id: 1,
    title: "Image Annotation (3/14)",
    description: "Is this a dog?",
    reward: 5,
    complexity: "Easy",
    estimatedTime: "1-2 min",
    available: 120,
    completed: 0,
    type: "image" as const,
  },
  {
    id: 2,
    title: "Text Classification",
    description: "Classify this text by sentiment",
    reward: 3,
    complexity: "Easy",
    estimatedTime: "1 min",
    available: 85,
    completed: 0,
    type: "text" as const,
  },
  {
    id: 3,
    title: "Audio Annotation (3/15)",
    description: "What words is being spoken in this segment?",
    reward: 10,
    complexity: "Medium",
    estimatedTime: "3-5 min",
    available: 45,
    completed: 0,
    type: "audio" as const,
  },
  {
    id: 4,
    title: "Image Classification",
    description: "What does this sign say?",
    reward: 15,
    complexity: "Hard",
    estimatedTime: "5-7 min",
    available: 30,
    completed: 0,
    type: "image" as const,
  },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [points, setPoints] = useState(20000)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [activeSubTab, setActiveSubTab] = useState("tasks")

  const { telegramApp, user } = useTelegram()

  const activeTask = activeTaskId ? mockTasks.find((task) => task.id === activeTaskId) : null

  const handleStartTask = (taskId: number) => {
    setActiveTaskId(taskId)
    setActiveTab("task-details")
    telegramApp?.BackButton?.show()
  }

  const handleBackToTasks = () => {
    setActiveTaskId(null)
    setActiveTab("tasks")
    telegramApp?.BackButton?.hide()
  }

  const handleSubmitTask = () => {
    if (activeTask) {
      setPoints(points + activeTask.reward)
      setCompletedTasks(completedTasks + 1)
      telegramApp?.HapticFeedback?.notificationOccurred("success")
      handleBackToTasks()
    }
  }

  useEffect(() => {
    if (telegramApp) {
      telegramApp.BackButton.onClick(() => {
        if (activeTab === "task-details") {
          handleBackToTasks()
        }
      })
    }
  }, [telegramApp, activeTab])

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* Верхняя панель */}
      {activeTab === "tasks" && (
        <header className="sticky top-0 z-10 bg-white p-4 flex justify-between items-center border-b">
          <div>
            <h1 className="text-xl font-bold text-blue-600">Pits</h1>
            <p className="text-sm text-gray-500">Home</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </header>
      )}

      {activeTab === "task-details" && (
        <header className="sticky top-0 z-10 bg-white p-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-gray-100" onClick={handleBackToTasks}>
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Start Task</h1>
              <p className="text-sm text-gray-500">{activeTask?.title}</p>
            </div>
          </div>
        </header>
      )}

      {/* Основной контент */}
      <div className="flex-1 p-4">
        {activeTab === "tasks" && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h2 className="points-display">{points.toLocaleString()} Pts</h2>
            </div>

            <div className="flex justify-center space-x-2 mb-6">
              <button
                className={`tab-button ${activeSubTab === "tasks" ? "active" : ""}`}
                onClick={() => setActiveSubTab("tasks")}
              >
                Tasks
              </button>
              <button
                className={`tab-button ${activeSubTab === "available" ? "active" : ""}`}
                onClick={() => setActiveSubTab("available")}
              >
                Available
              </button>
              <button
                className={`tab-button ${activeSubTab === "history" ? "active" : ""}`}
                onClick={() => setActiveSubTab("history")}
              >
                History
              </button>
            </div>

            <div className="grid gap-4">
              {mockTasks.map((task) => (
                <TaskCard key={task.id} {...task} onClick={() => handleStartTask(task.id)} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "task-details" && activeTask && (
          <div className="space-y-6 py-4">
            {activeTask.type === "image" && (
              <div className="space-y-6">
                <div className="border rounded-xl overflow-hidden">
                  <img src="/happy-golden-retriever.png" alt="Task image" className="w-full h-64 object-cover" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Is this a dog?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="action-button">Positive</button>
                    <button className="secondary-button">Negative</button>
                  </div>
                </div>
              </div>
            )}

            {activeTask.type === "audio" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">What words is being spoken in this segment?</h3>
                  <AudioWave
                    isPlaying={isAudioPlaying}
                    onPlay={() => setIsAudioPlaying(true)}
                    onPause={() => setIsAudioPlaying(false)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button className="secondary-button">Previous</button>
                  <button className="action-button" onClick={handleSubmitTask}>
                    Next
                  </button>
                </div>
              </div>
            )}

            {activeTask.type === "text" && (
              <div className="space-y-6">
                <div className="p-4 bg-white rounded-xl border">
                  <p className="text-gray-800">
                    This product is amazing! I've been using it for a month now and it has completely changed my
                    workflow. The interface is intuitive and the features are exactly what I needed. Highly recommend to
                    anyone looking for a solution like this.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">What is the sentiment of this text?</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="secondary-button">Negative</button>
                    <button className="secondary-button">Neutral</button>
                    <button className="action-button">Positive</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">How would you rate this task?</h3>
                  <EmojiRating onRate={(rating) => console.log("Rating:", rating)} />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button className="secondary-button">Previous</button>
                  <button className="action-button" onClick={handleSubmitTask}>
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Нижняя навигация */}
      <nav className="sticky bottom-0 bg-white border-t grid grid-cols-4 p-2">
        <button
          className={`nav-button ${activeTab === "tasks" && activeSubTab === "tasks" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("tasks")
            setActiveSubTab("tasks")
          }}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </button>
        <button
          className={`nav-button ${activeSubTab === "available" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("tasks")
            setActiveSubTab("available")
          }}
        >
          <CheckCircle className="h-5 w-5" />
          <span className="text-xs">Tasks</span>
        </button>
        <button
          className={`nav-button ${activeSubTab === "history" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("tasks")
            setActiveSubTab("history")
          }}
        >
          <BarChart className="h-5 w-5" />
          <span className="text-xs">Stats</span>
        </button>
        <button className="nav-button">
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </main>
  )
}
