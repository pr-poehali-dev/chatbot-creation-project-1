import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import ChatMessage from '@/components/ChatMessage';
import FileUpload from '@/components/FileUpload';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я расширенный AI ассистент. Могу помочь с:\n\n• Текстовыми запросами на любых языках\n• Написанием и анализом кода\n• Генерацией изображений\n• Работой с документами\n• Переводами и обучением\n\nЧем могу быть полезен?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Перевод документов', lastMessage: new Date(Date.now() - 3600000) },
    { id: '2', title: 'Помощь с кодом Python', lastMessage: new Date(Date.now() - 7200000) },
    { id: '3', title: 'Изучение английского', lastMessage: new Date(Date.now() - 86400000) },
    { id: '4', title: 'Генерация изображений', lastMessage: new Date(Date.now() - 172800000) },
  ]);
  const [currentView, setCurrentView] = useState<'chat' | 'features' | 'profile' | 'faq'>('chat');
  const [darkMode, setDarkMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue || 'Прикрепленный файл',
      timestamp: new Date(),
      fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
      fileName: selectedFile?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setSelectedFile(null);
    setIsTyping(true);

    setTimeout(() => {
      let responseContent = '';
      
      if (inputValue.toLowerCase().includes('код') || inputValue.toLowerCase().includes('code')) {
        responseContent = `Вот пример кода на Python:\n\n\`\`\`python\ndef greeting(name):\n    """Функция приветствия пользователя"""\n    return f"Привет, {name}! Добро пожаловать!"\n\n# Использование\nprint(greeting("Пользователь"))\n\`\`\`\n\nЭтот код создает простую функцию приветствия. Хотите, чтобы я объяснил детально или добавил больше функционала?`;
      } else if (inputValue.toLowerCase().includes('изображение') || inputValue.toLowerCase().includes('картинк')) {
        responseContent = 'Для генерации изображений я могу использовать AI-модели. Опишите подробно, что хотите увидеть: стиль, цвета, композицию, настроение. Чем детальнее описание, тем лучше результат!';
      } else {
        responseContent = `Отличный вопрос! Позвольте дать развернутый ответ:\n\n${inputValue}\n\nЭто демо-версия с расширенным функционалом. В реальной версии:\n• Полная поддержка 100+ языков\n• Генерация изображений по описанию\n• Анализ загруженных файлов\n• Контекстные ответы с памятью диалога\n\nЧто еще вас интересует?`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setInputValue('Пример текста с голосовым вводом');
        setIsRecording(false);
      }, 2000);
    }
  };

  const exportChat = () => {
    const chatText = messages
      .map((msg) => `[${msg.role === 'user' ? 'Вы' : 'AI'}]: ${msg.content}`)
      .join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${Date.now()}.txt`;
    a.click();
  };

  const examplePrompts = [
    { icon: 'Languages', text: 'Переведи текст на 5 языков', gradient: 'from-purple-500 to-pink-500' },
    { icon: 'Code', text: 'Напиши REST API на Python', gradient: 'from-blue-500 to-cyan-500' },
    { icon: 'Image', text: 'Создай изображение космоса', gradient: 'from-orange-500 to-red-500' },
    { icon: 'FileText', text: 'Проанализируй документ', gradient: 'from-green-500 to-emerald-500' },
    { icon: 'BookOpen', text: 'Объясни квантовую физику', gradient: 'from-indigo-500 to-purple-500' },
    { icon: 'Lightbulb', text: 'Дай идею для стартапа', gradient: 'from-pink-500 to-rose-500' },
  ];

  const features = [
    {
      icon: 'Globe',
      title: 'Мультиязычность',
      description: 'Общение на 100+ языках с автоматическим переводом и адаптацией контекста',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: 'Zap',
      title: 'Быстрые ответы',
      description: 'Мгновенная обработка запросов с использованием передовых AI технологий',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: 'Shield',
      title: 'Безопасность',
      description: 'Полная конфиденциальность данных и защита личной информации',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: 'Brain',
      title: 'Умный контекст',
      description: 'Запоминание предыдущих диалогов для более точных и персонализированных ответов',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: 'Image',
      title: 'Генерация изображений',
      description: 'Создание уникальных изображений по текстовому описанию с высоким качеством',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: 'FileText',
      title: 'Работа с документами',
      description: 'Анализ, перевод и обработка документов различных форматов',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          AI Ассистент Pro
        </h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          <Button
            variant={currentView === 'chat' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentView('chat')}
          >
            <Icon name="MessageSquare" className="mr-2 h-4 w-4" />
            Чат
          </Button>
          <Button
            variant={currentView === 'features' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentView('features')}
          >
            <Icon name="Sparkles" className="mr-2 h-4 w-4" />
            Возможности
          </Button>
          <Button
            variant={currentView === 'profile' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentView('profile')}
          >
            <Icon name="User" className="mr-2 h-4 w-4" />
            Профиль
          </Button>
          <Button
            variant={currentView === 'faq' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentView('faq')}
          >
            <Icon name="HelpCircle" className="mr-2 h-4 w-4" />
            FAQ
          </Button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">История</h3>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={exportChat}>
              <Icon name="Download" className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <div key={chat.id} className="group flex items-center gap-2">
                <Button variant="ghost" className="flex-1 justify-start text-sm">
                  <Icon name="MessageCircle" className="mr-2 h-3 w-3" />
                  <span className="truncate">{chat.title}</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                >
                  <Icon name="Trash2" className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <Button variant="outline" className="w-full">
          <Icon name="Plus" className="mr-2 h-4 w-4" />
          Новый чат
        </Button>
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Темная тема</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
      </div>
    </div>
  );

  const ChatView = () => (
    <div className="flex flex-col h-full">
      {messages.length === 1 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-block p-6 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-6 animate-pulse-glow">
              <Icon name="Sparkles" className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Чем могу помочь сегодня?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Расширенный AI с поддержкой файлов, изображений и голоса
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
            {examplePrompts.map((prompt, index) => (
              <Card
                key={index}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary dark:bg-gray-800"
                onClick={() => setInputValue(prompt.text)}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${prompt.gradient} mb-4`}>
                  <Icon name={prompt.icon as any} className="h-5 w-5 text-white" />
                </div>
                <p className="font-medium dark:text-white">{prompt.text}</p>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                imageUrl={message.imageUrl}
                fileUrl={message.fileUrl}
                fileName={message.fileName}
              />
            ))}
            {isTyping && (
              <div className="flex gap-4 animate-fade-in">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Icon name="Bot" className="h-5 w-5 text-white" />
                </div>
                <div className="rounded-2xl px-6 py-4 bg-gray-100 dark:bg-gray-800">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          {selectedFile && (
            <div className="mb-3 flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Icon name="File" className="h-4 w-4" />
              <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setSelectedFile(null)}
              >
                <Icon name="X" className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <FileUpload onFileSelect={setSelectedFile} disabled={isTyping} />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isTyping} className="h-10 w-10">
                  <Icon name="Image" className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Генерация изображения</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Опишите изображение: стиль, детали, цвета..."
                    className="min-h-32"
                  />
                  <Button className="w-full">
                    <Icon name="Wand2" className="mr-2 h-4 w-4" />
                    Сгенерировать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceInput}
              disabled={isTyping}
              className={`h-10 w-10 ${isRecording ? 'text-red-500' : ''}`}
            >
              <Icon name={isRecording ? 'MicOff' : 'Mic'} className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Введите сообщение или используйте голосовой ввод..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="flex-1"
              disabled={isTyping}
            />
            <Button onClick={handleSendMessage} size="lg" className="px-8" disabled={isTyping}>
              <Icon name="Send" className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            AI может ошибаться. Проверяйте важную информацию.
          </p>
        </div>
      </div>
    </div>
  );

  const FeaturesView = () => (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-8 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Расширенные возможности
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Профессиональный AI инструмент для любых задач
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 dark:bg-gray-800">
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                <Icon name={feature.icon as any} className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-4 mb-4">
            <Icon name="Rocket" className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-bold dark:text-white">В разработке</h3>
          </div>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <Icon name="Check" className="h-5 w-5 text-green-500 mt-1" />
              <span>Интеграция с популярными сервисами (Gmail, Notion, Slack)</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" className="h-5 w-5 text-green-500 mt-1" />
              <span>Распознавание речи на 50+ языках с высокой точностью</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" className="h-5 w-5 text-green-500 mt-1" />
              <span>Анализ видео и аудио файлов с генерацией саммари</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" className="h-5 w-5 text-green-500 mt-1" />
              <span>Командная работа с общими чатами и проектами</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" className="h-5 w-5 text-green-500 mt-1" />
              <span>API доступ для интеграции в ваши приложения</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto p-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Личный кабинет
        </h1>

        <Card className="p-6 mb-6 dark:bg-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Icon name="User" className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white">Пользователь Pro</h3>
              <p className="text-gray-600 dark:text-gray-400">user@example.com</p>
            </div>
            <Button variant="outline" className="ml-auto">
              <Icon name="Settings" className="mr-2 h-4 w-4" />
              Изменить
            </Button>
          </div>
        </Card>

        <Card className="p-6 mb-6 dark:bg-gray-800">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Настройки</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">Язык интерфейса</label>
              <select className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Русский</option>
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
                <option>中文</option>
                <option>日本語</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">Модель AI</label>
              <select className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>GPT-4 Turbo (рекомендуется)</option>
                <option>GPT-4 (более точная)</option>
                <option>GPT-3.5 (быстрая)</option>
                <option>Claude 3 Opus</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium dark:text-gray-300">Автосохранение диалогов</label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium dark:text-gray-300">Голосовые уведомления</label>
              <Switch />
            </div>
          </div>
        </Card>

        <Card className="p-6 dark:bg-gray-800">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Статистика использования</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-3xl font-bold text-primary">247</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Диалогов</p>
            </div>
            <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <p className="text-3xl font-bold text-secondary">5.2k</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Сообщений</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-3xl font-bold text-accent">89</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Файлов</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-3xl font-bold text-green-600">34</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Изображений</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const FAQView = () => (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto p-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Часто задаваемые вопросы
        </h1>

        <div className="space-y-4">
          {[
            {
              q: 'Как работает мультиязычная поддержка?',
              a: 'AI ассистент автоматически определяет язык вашего сообщения и отвечает на том же языке. Поддерживается более 100 языков с учетом диалектов и контекста.',
            },
            {
              q: 'Как загрузить файлы для анализа?',
              a: 'Нажмите на иконку скрепки рядом с полем ввода. Поддерживаются документы (PDF, DOCX, TXT), изображения (PNG, JPG), таблицы (XLSX, CSV) и код (любые языки программирования).',
            },
            {
              q: 'Как работает генерация изображений?',
              a: 'Нажмите на иконку изображения и опишите детально, что хотите увидеть. AI создаст уникальное изображение за 10-30 секунд. Можно указать стиль, цвета, композицию и настроение.',
            },
            {
              q: 'Можно ли экспортировать историю диалогов?',
              a: 'Да! Нажмите на иконку загрузки в боковой панели. Диалоги экспортируются в формате TXT, PDF или JSON для дальнейшего использования.',
            },
            {
              q: 'Как использовать голосовой ввод?',
              a: 'Нажмите на иконку микрофона и начните говорить. AI распознает речь на вашем языке и автоматически преобразует в текст. Работает офлайн на устройстве.',
            },
            {
              q: 'Насколько безопасны мои данные?',
              a: 'Используется end-to-end шифрование. Данные хранятся только на ваших устройствах или в зашифрованном облаке. Мы не передаем информацию третьим лицам и не используем для обучения моделей.',
            },
          ].map((item, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 dark:bg-gray-800">
              <h3 className="text-lg font-bold mb-3 flex items-start gap-3 dark:text-white">
                <Icon name="HelpCircle" className="h-5 w-5 text-primary mt-1" />
                {item.q}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed ml-8">{item.a}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold mb-3 dark:text-white">Нужна помощь?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Свяжитесь с нашей службой поддержки 24/7, и мы поможем решить любой вопрос!
          </p>
          <div className="flex gap-3">
            <Button className="flex-1">
              <Icon name="Mail" className="mr-2 h-4 w-4" />
              Email поддержка
            </Button>
            <Button variant="outline" className="flex-1">
              <Icon name="MessageCircle" className="mr-2 h-4 w-4" />
              Онлайн чат
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-900">
      <aside className="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-800">
        <Sidebar />
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Icon name="Menu" className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'chat' && <ChatView />}
        {currentView === 'features' && <FeaturesView />}
        {currentView === 'profile' && <ProfileView />}
        {currentView === 'faq' && <FAQView />}
      </main>
    </div>
  );
};

export default Index;
