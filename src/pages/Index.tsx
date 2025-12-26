import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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
      content: 'Привет! Я AI ассистент. Готов помочь вам с любыми вопросами на разных языках. Чем могу быть полезен?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Перевод документов', lastMessage: new Date(Date.now() - 3600000) },
    { id: '2', title: 'Помощь с кодом Python', lastMessage: new Date(Date.now() - 7200000) },
    { id: '3', title: 'Изучение английского', lastMessage: new Date(Date.now() - 86400000) },
  ]);
  const [currentView, setCurrentView] = useState<'chat' | 'features' | 'profile' | 'faq'>('chat');

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Отлично! Я понял ваш запрос: "${inputValue}". Это демо-версия ответа. В реальной версии здесь будет полноценный AI-анализ с поддержкой множества языков и контекста.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const examplePrompts = [
    { icon: 'Languages', text: 'Переведи текст на английский', gradient: 'from-purple-500 to-pink-500' },
    { icon: 'Code', text: 'Помоги с кодом', gradient: 'from-blue-500 to-cyan-500' },
    { icon: 'BookOpen', text: 'Объясни сложную тему', gradient: 'from-orange-500 to-red-500' },
    { icon: 'Lightbulb', text: 'Дай креативную идею', gradient: 'from-green-500 to-emerald-500' },
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
  ];

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          AI Ассистент
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
          <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">История диалогов</h3>
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <Button key={chat.id} variant="ghost" className="w-full justify-start text-sm">
                <Icon name="MessageCircle" className="mr-2 h-3 w-3" />
                <span className="truncate">{chat.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" className="w-full">
          <Icon name="Plus" className="mr-2 h-4 w-4" />
          Новый чат
        </Button>
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
              Чем могу помочь?
            </h1>
            <p className="text-lg text-gray-600">
              Задайте любой вопрос на любом языке — я готов помочь!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
            {examplePrompts.map((prompt, index) => (
              <Card
                key={index}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary"
                onClick={() => setInputValue(prompt.text)}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${prompt.gradient} mb-4`}>
                  <Icon name={prompt.icon as any} className="h-5 w-5 text-white" />
                </div>
                <p className="font-medium">{prompt.text}</p>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 animate-fade-in ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Icon name="Bot" className="h-5 w-5 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-6 py-4 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Icon name="User" className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4 animate-fade-in">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Icon name="Bot" className="h-5 w-5 text-white" />
                </div>
                <div className="rounded-2xl px-6 py-4 bg-gray-100">
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

      <div className="border-t border-gray-200 p-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-4">
            <Input
              placeholder="Напишите сообщение на любом языке..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="lg" className="px-8">
              <Icon name="Send" className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const FeaturesView = () => (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-8 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Возможности AI Ассистента
          </h1>
          <p className="text-lg text-gray-600">
            Мощный инструмент для решения любых задач
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                <Icon name={feature.icon as any} className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center gap-4 mb-4">
            <Icon name="Rocket" className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-bold">Скоро появится</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <Icon name="Check" className="h-5 w-5 text-green-500 mt-1" />
              <span>Интеграция с популярными сервисами и API</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" className="h-5 w-5 text-green-500 mt-1" />
              <span>Голосовой ввод и озвучивание ответов</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" className="h-5 w-5 text-green-500 mt-1" />
              <span>Работа с документами и изображениями</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" className="h-5 w-5 text-green-500 mt-1" />
              <span>Персональные AI ассистенты с обучением</span>
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

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Icon name="User" className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Пользователь</h3>
              <p className="text-gray-600">user@example.com</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Настройки</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Язык интерфейса</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Русский</option>
                <option>English</option>
                <option>Español</option>
                <option>中文</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Тема оформления</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Светлая</option>
                <option>Тёмная</option>
                <option>Автоматическая</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Статистика</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-primary">127</p>
              <p className="text-sm text-gray-600">Диалогов</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-3xl font-bold text-secondary">2.5k</p>
              <p className="text-sm text-gray-600">Сообщений</p>
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
              a: 'AI ассистент автоматически определяет язык вашего сообщения и отвечает на том же языке. Вы также можете попросить перевести текст на любой из 100+ поддерживаемых языков.',
            },
            {
              q: 'Сохраняется ли история диалогов?',
              a: 'Да, все ваши диалоги сохраняются и доступны в боковой панели. Вы можете вернуться к любому предыдущему разговору в любое время.',
            },
            {
              q: 'Насколько безопасны мои данные?',
              a: 'Мы используем шифрование данных и не передаём вашу личную информацию третьим лицам. Вся информация хранится конфиденциально.',
            },
            {
              q: 'Могу ли я использовать ассистента для работы?',
              a: 'Конечно! AI ассистент помогает с широким спектром задач: написание кода, переводы, анализ данных, обучение и многое другое.',
            },
          ].map((item, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                <Icon name="HelpCircle" className="h-5 w-5 text-primary mt-1" />
                {item.q}
              </h3>
              <p className="text-gray-600 leading-relaxed ml-8">{item.a}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
          <h3 className="text-xl font-bold mb-3">Нужна помощь?</h3>
          <p className="text-gray-700 mb-4">
            Свяжитесь с нашей службой поддержки, и мы ответим на все ваши вопросы!
          </p>
          <Button className="w-full">
            <Icon name="Mail" className="mr-2 h-4 w-4" />
            Написать в поддержку
          </Button>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="hidden lg:block w-64 border-r border-gray-200">
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
