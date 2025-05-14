import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Страница не найдена</h2>
        <p className="text-gray-600 mb-8">Извините, запрашиваемая страница не существует или была перемещена.</p>
        <Link
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}
