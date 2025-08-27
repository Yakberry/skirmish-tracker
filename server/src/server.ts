import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { initializeDatabase } from './database';
import { initializeSockets } from './sockets';

const PORT = Number(process.env.PORT) || 3000;

// Создаем HTTP сервер
const httpServer = createServer(app);

// Инициализируем Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // В продакшене замените на конкретный origin
    methods: ["GET", "POST"]
  }
});

// Инициализируем базу данных и запускаем сервер
initializeDatabase()
  .then(() => {
    console.log('Database initialized');

    // Инициализируем обработчики сокетов
    initializeSockets(io);

    // Запускаем сервер
    httpServer.listen(PORT, '0.0.0.0', 1, () => {
      console.log(`L5R Initiative Tracker Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
