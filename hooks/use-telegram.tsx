"use client"

import { useEffect, useState } from "react"

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  initDataUnsafe: {
    user?: TelegramUser
    start_param?: string
  }
  themeParams: {
    bg_color: string
    text_color: string
    hint_color: string
    link_color: string
    button_color: string
    button_text_color: string
    secondary_bg_color: string
  }
  onEvent: (eventName: string, callback: Function) => void
  offEvent: (eventName: string, callback: Function) => void
  sendData: (data: any) => void
  openLink: (url: string) => void
  showAlert: (message: string, callback?: Function) => void
  showConfirm: (message: string, callback: Function) => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: Function) => void
    offClick: (callback: Function) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive: boolean) => void
    hideProgress: () => void
  }
  BackButton: {
    isVisible: boolean
    onClick: (callback: Function) => void
    offClick: (callback: Function) => void
    show: () => void
    hide: () => void
  }
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void
    notificationOccurred: (type: "error" | "success" | "warning") => void
    selectionChanged: () => void
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export function useTelegram() {
  const [telegramApp, setTelegramApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)

  useEffect(() => {
    const tgApp = window.Telegram?.WebApp
    if (tgApp) {
      tgApp.ready()
      tgApp.expand()

      // Применяем цвета темы Telegram
      document.documentElement.style.setProperty("--tg-theme-bg-color", tgApp.themeParams.bg_color)
      document.documentElement.style.setProperty("--tg-theme-text-color", tgApp.themeParams.text_color)
      document.documentElement.style.setProperty("--tg-theme-hint-color", tgApp.themeParams.hint_color)
      document.documentElement.style.setProperty("--tg-theme-link-color", tgApp.themeParams.link_color)
      document.documentElement.style.setProperty("--tg-theme-button-color", tgApp.themeParams.button_color)
      document.documentElement.style.setProperty("--tg-theme-button-text-color", tgApp.themeParams.button_text_color)
      document.documentElement.style.setProperty("--tg-theme-secondary-bg-color", tgApp.themeParams.secondary_bg_color)

      setTelegramApp(tgApp)

      if (tgApp.initDataUnsafe?.user) {
        setUser(tgApp.initDataUnsafe.user)
      }
    }
  }, [])

  return { telegramApp, user }
}
