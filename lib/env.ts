// Функция для генерации случайной строки
function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Значения по умолчанию для разработки
const defaultValues = {
  NEXT_PUBLIC_APP_URL: "https://v0-new-project-bnvfxpxmmtk.vercel.app",
  TELEGRAM_BOT_TOKEN: "development_token",
  ADMIN_JWT_SECRET: generateRandomString(32),
}

export const env = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",

  // Приложение
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || defaultValues.NEXT_PUBLIC_APP_URL,

  // Telegram
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || defaultValues.TELEGRAM_BOT_TOKEN,

  // Аутентификация
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET || defaultValues.ADMIN_JWT_SECRET,

  // Режим
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
}
