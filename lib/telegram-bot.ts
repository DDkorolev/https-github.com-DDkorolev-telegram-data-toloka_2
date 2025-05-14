import { Telegraf } from "telegraf"
import { env } from "./env"

// Создаем экземпляр бота
export function createBot() {
  if (!env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN === "development_token") {
    console.warn("TELEGRAM_BOT_TOKEN не определен или использует значение по умолчанию")
    return null
  }

  try {
    const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN)

    // Настройка команды /start
    bot.start(async (ctx) => {
      const webAppUrl = `${env.NEXT_PUBLIC_APP_URL}/mini-app`

      await ctx.reply("Добро пожаловать в Миниап.Разметка!", {
        reply_markup: {
          inline_keyboard: [[{ text: "Открыть приложение", web_app: { url: webAppUrl } }]],
        },
      })
    })

    // Обработка ошибок
    bot.catch((err, ctx) => {
      console.error(`Ошибка для ${ctx.updateType}`, err)
    })

    return bot
  } catch (error) {
    console.error("Ошибка создания Telegram бота:", error)
    return null
  }
}

// Функция для запуска бота в режиме long polling
export function startBot() {
  const bot = createBot()

  if (!bot) {
    console.warn("Бот не запущен из-за отсутствия токена")
    return
  }

  // Запускаем бота
  bot.launch()
  console.log("Бот запущен")

  // Включаем корректную остановку
  process.once("SIGINT", () => bot.stop("SIGINT"))
  process.once("SIGTERM", () => bot.stop("SIGTERM"))
}
