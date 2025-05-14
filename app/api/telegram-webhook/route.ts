import { NextResponse } from "next/server"
import { createBot } from "@/lib/telegram-bot"

export async function POST(request: Request) {
  try {
    const bot = createBot()

    if (!bot) {
      return NextResponse.json({ error: "Telegram бот не инициализирован из-за отсутствия токена" }, { status: 500 })
    }

    const body = await request.json()
    await bot.handleUpdate(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Ошибка обработки вебхука:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
