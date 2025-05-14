"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, DollarSign, List, Settings, User } from "lucide-react"

// Имитация данных для разметки
const mockTasks = [
  {
    id: 1,
    title: "Классификация изображений",
    description: "Определите, что изображено на картинке",
    reward: 5,
    complexity: "Легкая",
    estimatedTime: "1-2 мин",
    available: 120,
    completed: 0,
    type: "image",
  },
  {
    id: 2,
    title: "Проверка текста",
    description: "Найдите ошибки в тексте",
    reward: 3,
    complexity: "Легкая",
    estimatedTime: "1 мин",
    available: 85,
    completed: 0,
    type: "text",
  },
  {
    id: 3,
    title: "Аудио транскрипция",
    description: "Запишите текст из аудиофайла",
    reward: 10,
    complexity: "Средняя",
    estimatedTime: "3-5 мин",
    available: 45,
    completed: 0,
    type: "audio",
  },
  {
    id: 4,
    title: "Сегментация объектов",
    description: "Выделите объекты на изображении",
    reward: 15,
    complexity: "Сложная",
    estimatedTime: "5-7 мин",
    available: 30,
    completed: 0,
    type: "image",
  },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [user, setUser] = useState({
    name: "Пользователь",
    balance: 0,
    completedTasks: 0,
    level: "Новичок",
    progress: 15,
  })
  const [telegramWebApp, setTelegramWebApp] = useState<any>(null)

  useEffect(() => {
    // Инициализация Telegram Mini App
    const tgApp = (window as any).Telegram?.WebApp
    if (tgApp) {
      tgApp.ready()
      tgApp.expand()
      setTelegramWebApp(tgApp)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* Верхняя панель */}
      <header className="sticky top-0 z-10 bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-500">ДатаТолока</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex gap-1 items-center">
            <DollarSign className="h-3 w-3" />
            {user.balance} ₽
          </Badge>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Основной контент */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="tasks" className="mt-0">
            <div className="grid gap-4">
              {mockTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <Badge variant="secondary">{task.complexity}</Badge>
                    </div>
                    <CardDescription>{task.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{task.reward} ₽</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.estimatedTime}</span>
                      </div>
                      <div>Доступно: {task.available}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 bg-gray-50">
                    <Button className="w-full" variant="default" onClick={() => setActiveTab("task-details")}>
                      Начать задание
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="task-details">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("tasks")}>
                    Назад
                  </Button>
                  <Badge variant="outline" className="flex gap-1 items-center">
                    <DollarSign className="h-3 w-3" />5 ₽
                  </Badge>
                </div>
                <CardTitle className="mt-2">Классификация изображений</CardTitle>
                <CardDescription>Выберите категорию, которая лучше всего описывает изображение</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="Изображение для классификации"
                      className="w-full h-64 object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">Природа</Button>
                    <Button variant="outline">Город</Button>
                    <Button variant="outline">Люди</Button>
                    <Button variant="outline">Животные</Button>
                    <Button variant="outline">Еда</Button>
                    <Button variant="outline">Другое</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("tasks")}>
                  Пропустить
                </Button>
                <Button
                  onClick={() => {
                    setUser({ ...user, balance: user.balance + 5, completedTasks: user.completedTasks + 1 })
                    setActiveTab("tasks")
                  }}
                >
                  Отправить
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Профиль</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <Badge>{user.level}</Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс до следующего уровня</span>
                    <span>{user.progress}%</span>
                  </div>
                  <Progress value={user.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-2xl font-bold">{user.completedTasks}</p>
                    <p className="text-sm text-muted-foreground">Выполнено заданий</p>
                  </div>
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-2xl font-bold">{user.balance} ₽</p>
                    <p className="text-sm text-muted-foreground">Баланс</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={() => alert("Функция вывода средств")}>
                  Вывести средства
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Нижняя навигация */}
      <nav className="sticky bottom-0 bg-white border-t grid grid-cols-3 p-1">
        <Button
          variant={activeTab === "tasks" ? "default" : "ghost"}
          className="flex flex-col items-center rounded-none h-16 gap-1"
          onClick={() => setActiveTab("tasks")}
        >
          <List className="h-5 w-5" />
          <span className="text-xs">Задания</span>
        </Button>
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          className="flex flex-col items-center rounded-none h-16 gap-1"
          onClick={() => setActiveTab("profile")}
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Профиль</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center rounded-none h-16 gap-1"
          onClick={() => {
            if (telegramWebApp) {
              telegramWebApp.close()
            }
          }}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Настройки</span>
        </Button>
      </nav>
    </main>
  )
}
