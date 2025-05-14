import Link from "next/link"
import SupabaseCheck from "@/components/supabase-check"

export default function Home() {
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
            href="/admin/login"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium text-center"
          >
            Вход в админ-панель
          </Link>

          <Link
            href="/check"
            className="block w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium text-center"
          >
            Проверить настройки
          </Link>
        </div>

        <SupabaseCheck />
      </div>
    </div>
  )
}
