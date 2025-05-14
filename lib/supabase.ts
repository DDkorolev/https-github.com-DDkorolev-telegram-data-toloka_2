import { createClient } from "@supabase/supabase-js"
import { env } from "./env"

// Типы для базы данных
export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: number
          type: "text" | "image"
          content: string
          question: string
          correct_answer: boolean | null
          status: "active" | "hidden"
          created_at: string
        }
        Insert: {
          type: "text" | "image"
          content: string
          question: string
          correct_answer?: boolean | null
          status?: "active" | "hidden"
        }
        Update: {
          type?: "text" | "image"
          content?: string
          question?: string
          correct_answer?: boolean | null
          status?: "active" | "hidden"
        }
      }
      users: {
        Row: {
          id: number
          telegram_id: number
          username: string | null
          first_name: string | null
          last_name: string | null
          created_at: string
        }
        Insert: {
          telegram_id: number
          username?: string | null
          first_name?: string | null
          last_name?: string | null
        }
        Update: {
          username?: string | null
          first_name?: string | null
          last_name?: string | null
        }
      }
      responses: {
        Row: {
          id: number
          user_id: number
          task_id: number
          answer: boolean
          is_correct: boolean | null
          created_at: string
        }
        Insert: {
          user_id: number
          task_id: number
          answer: boolean
          is_correct?: boolean | null
        }
        Update: {
          answer?: boolean
          is_correct?: boolean | null
        }
      }
      admins: {
        Row: {
          id: number
          username: string
          password: string
          created_at: string
        }
        Insert: {
          username: string
          password: string
        }
        Update: {
          username?: string
          password?: string
        }
      }
    }
  }
}

// Клиент для клиентской стороны (браузера)
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export function supabaseClient() {
  if (clientInstance) return clientInstance

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Переменные окружения Supabase не настроены")
  }

  clientInstance = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return clientInstance
}

// Клиент для серверной стороны
export function supabaseServer() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Переменные окружения Supabase не настроены")
  }

  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Для обратной совместимости
export const supabase = supabaseClient
