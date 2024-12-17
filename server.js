const express = require('express');
const { faker } = require('@faker-js/faker');
const cors = require('cors'); 

const app = express();
const port = 3000;

const corsOptions = {
  origin: '*',
  methods: 'GET',
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// Генерация случайных сообщений
function generateMessages(count) {
  const messages = [];
  for (let i = 0; i < count; i++) {
    const message = {
      id: faker.string.uuid(),
      from: faker.internet.email(),
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      received: Math.floor(faker.date.past().getTime() / 1000), // Время в секундах
    };
    messages.push(message);
  }
  return messages;
}

// Симуляция непрочитанных сообщений
const unreadMessages = generateMessages(5);

// Таймер для генерации новых сообщений
setInterval(() => {
  const newMessage = generateMessages(1)[0]; // Генерируем одно новое сообщение
  if (unreadMessages.length > 10) {
    unreadMessages.shift(); // Удаляем первое (самое старое) сообщение, если массив полон
  }
  unreadMessages.push(newMessage);
}, 3000);

app.get('/messages/unread', (req, res) => {
  const response = {
    status: 'ok',
    timestamp: Math.floor(Date.now() / 1000), // Текущее время в секундах
    messages: unreadMessages,
  };

  res.json(response);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});