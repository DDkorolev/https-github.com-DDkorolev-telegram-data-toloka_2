"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewTask() {
  const [type, setType] = useState<"text" | "image">("text")
  const [content, setContent] = useState("")
  const [question, setQuestion] = useState("")
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверка размера файла (лимит 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Размер файла не должен превышать 5MB")
      return
    }

    // Проверка типа файла
    if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
      setError("Поддерживаются только изображения в формате JPG и PNG")
      return
    }

    setImageFile(file)
    setError("")

    // Создание превью
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let finalContent = content

      // Если это тип изображения, сначала загружаем изображение
      if (type === "image" && imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Ошибка загрузки изображения")
        }

        const { url } = await uploadResponse.json()
        finalContent = url
      }

      // Создаем задание
      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          content: finalContent,
          question,
          correct_answer: correctAnswer,
        }),
      })

      if (!response.ok) {
        throw new Error("Ошибка создания задания")
      }

      router.push("/admin/dashboard")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Добавить задание</h1>
          <Link href="/admin/dashboard" className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
            Назад
          </Link>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тип задания</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="type"
                  value="text"
                  checked={type === "text"}
                  onChange={() => setType("text")}
                />
                <span className="ml-2">Текст</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="type"
                  value="image"
                  checked={type === "image"}
                  onChange={() => setType("image")}
                />
                <span className="ml-2">Изображение</span>
              </label>
            </div>
          </div>

          {type === "text" ? (
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Текст задания
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                maxLength={1000}
                rows={5}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">{content.length}/1000 символов</p>
            </div>
          ) : (
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Изображение
              </label>
              <input
                type="file"
                id="image"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Поддерживаются JPG и PNG до 5MB</p>
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview || "/placeholder.svg"} alt="Превью" className="max-h-40 rounded border" />
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Вопрос / Инструкция
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Правильный ответ (опционально)</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="correctAnswer"
                  value="true"
                  checked={correctAnswer === true}
                  onChange={() => setCorrectAnswer(true)}
                />
                <span className="ml-2">Правильно</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="correctAnswer"
                  value="false"
                  checked={correctAnswer === false}
                  onChange={() => setCorrectAnswer(false)}
                />
                <span className="ml-2">Неправильно</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="correctAnswer"
                  value="null"
                  checked={correctAnswer === null}
                  onChange={() => setCorrectAnswer(null)}
                />
                <span className="ml-2">Не указано</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? "Создание..." : "Создать задание"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
