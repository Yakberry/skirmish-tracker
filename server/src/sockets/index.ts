import { Server } from 'socket.io';
import { AppSocket, BattleCharacter, CharacterData, CreateCharacterRequest, SessionData } from "../types";
import { Character } from "../models/Character";

// Хранилище активных сессий в памяти
// В продакшене лучше использовать Redis или другую персистентную базу
const activeSessions = new Map<string, SessionData>();

export const initializeSockets = (io: Server): void => {
  io.on('connection', (socket: AppSocket) => {
    console.log(`User ${socket.id} connected`);

    // Создание новой игровой сессии
    socket.on('session:create', () => {
      const sessionId = generateSessionId();
      activeSessions.set(sessionId, {
        id: sessionId,
        initiativeOrder: [],
        charactersInBattle: [],
        masterSocketId: socket.id, // Запоминаем сокет мастера
      });

      socket.join(sessionId);
      socket.sessionId = sessionId;
      socket.emit('session:created', { sessionId });
    });

    // Присоединение к существующей сессии
    socket.on('session:join', (data: { sessionId: string; playerName: string }) => {
      console.log("session join: ", data);
      const { sessionId, playerName } = data;
      const session = activeSessions.get(sessionId);

      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      socket.join(sessionId);
      socket.sessionId = sessionId;
      socket.playerName = playerName;
      socket.emit('session:master', { isMaster: false });

      // Отправляем новому участнику текущее состояние сессии
      socket.emit('session:state', session);

      // Оповещаем других участников о новом игроке
      socket.to(sessionId).emit('player:joined', { playerName });
    });

    // Добавление персонажа в бой
    socket.on('character:add-to-battle', async (data: { characterId: string }) => {
      if (!socket.sessionId) return;

      const session = activeSessions.get(socket.sessionId);
      if (!session) return;

      // Здесь должна быть логика загрузки персонажа из базы данных
      // и добавления его в session.charactersInBattle

      // Рассылаем обновление всем участникам сессии
      io.to(socket.sessionId).emit('characters-in-battle:updated', session.charactersInBattle);
    });

    // Обновление инициативы персонажа
    socket.on('initiative:update', (data: { characterId: string; newScore: number }) => {
      if (!socket.sessionId) return;

      const session = activeSessions.get(socket.sessionId);
      if (!session) return;

      // Обновляем инициативу персонажа
      const character = session.charactersInBattle.find(c => c.id === data.characterId);
      if (character) {
        character.initiative = data.newScore;

        // Пересортировываем порядок инициативы
        session.initiativeOrder = session.charactersInBattle
          .filter(c => c.initiative > 0)
          .sort((a, b) => b.initiative - a.initiative)
          .map(c => c.id!);
        // При ничьей сравнивается Воздух персонажей

        // Синхронизируем всех клиентов
        io.to(socket.sessionId).emit('initiative:updated', session.initiativeOrder);
      }
    });

    // Обработка отключения клиента
    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);

      if (socket.sessionId && socket.playerName) {
        // Оповещаем других участников о выходе игрока
        socket.to(socket.sessionId).emit('player:left', { playerName: socket.playerName });
      }
    });

    // socket.on('characters:request', async () => {
    //   try {
    //     const characters = await Character.findAll();
    //     socket.emit('characters:list', characters);
    //   } catch (error) {
    //     console.error('Error fetching characters:', error);
    //     socket.emit('error', { message: 'Failed to fetch characters' });
    //   }
    // });

    socket.on('characters:request', async () => {
      try {
        const characters = await Character.findAll({
          order: [['name', 'ASC']] // Сортируем по имени
        });
        socket.emit('characters:list', characters);
      } catch (error) {
        console.error('Error fetching characters:', error);
        socket.emit('error', { message: 'Failed to fetch characters' });
      }
    });

    // Создание нового персонажа
    // socket.on('character:create', async (data: CreateCharacterRequest) => {
    //   try {
    //     const character = await Character.create(data);
    //     socket.emit('character:created', character);
    //
    //     // Рассылаем обновление всем, кто запросил список персонажей
    //     // (в реальном приложении нужно отслеживать, кто интересуется обновлениями)
    //     io.emit('character:added', character);
    //   } catch (error) {
    //     console.error('Error creating character:', error);
    //     socket.emit('error', { message: 'Failed to create character' });
    //   }
    // });
    socket.on('character:create', async (data: CreateCharacterRequest) => {
      try {
        // Валидация данных
        if (!data.name || !data.health || !data.fatigue) {
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        const character = await Character.create(data);
        socket.emit('character:created', character);

        // Оповещаем всех подключенных клиентов о новом персонаже
        socket.broadcast.emit('character:added', character);
      } catch (error) {
        console.error('Error creating character:', error);
        socket.emit('error', { message: 'Failed to create character' });
      }
    });

    // Добавление персонажа в бой
    // socket.on('character:add-to-battle', async (data: { sessionId: string; characterId: string }) => {
    //   try {
    //     const { sessionId, characterId } = data;
    //     const session = activeSessions.get(sessionId);
    //
    //     if (!session) {
    //       socket.emit('character:add-to-battle-result', {
    //         success: false,
    //         error: 'Session not found'
    //       });
    //       return;
    //     }
    //
    //     const character = await Character.findByPk(characterId);
    //
    //     if (!character) {
    //       socket.emit('character:add-to-battle-result', {
    //         success: false,
    //         error: 'Character not found'
    //       });
    //       return;
    //     }
    //
    //     const battleCharacter: BattleCharacter = {
    //       ...character.toJSON(),
    //       initiative: 0,
    //       isVisible: true,
    //       conditions: []
    //     };
    //
    //     session.charactersInBattle.push(battleCharacter);
    //
    //     // Рассылаем обновление всем участникам сессии
    //     io.to(sessionId).emit('characters-in-battle:updated', session.charactersInBattle);
    //
    //     socket.emit('character:add-to-battle-result', {
    //       success: true,
    //       character: battleCharacter
    //     });
    //   } catch (error) {
    //     console.error('Error adding character to battle:', error);
    //     socket.emit('character:add-to-battle-result', {
    //       success: false,
    //       error: 'Failed to add character to battle'
    //     });
    //   }
    // });
    socket.on('character:add-to-battle', async (data: { sessionId: string; characterId: string }) => {
      try {
        const { sessionId, characterId } = data;
        const session = activeSessions.get(sessionId);

        if (!session) {
          socket.emit('character:add-to-battle-result', {
            success: false,
            error: 'Session not found'
          });
          return;
        }

        const character = await Character.findByPk(characterId);

        if (!character) {
          socket.emit('character:add-to-battle-result', {
            success: false,
            error: 'Character not found'
          });
          return;
        }

        const battleCharacter: BattleCharacter = {
          ...character.toJSON(),
          initiative: 0,
          isVisible: true,
          conditions: []
        };

        session.charactersInBattle.push(battleCharacter);

        // Рассылаем обновление всем участникам сессии
        io.to(sessionId).emit('characters-in-battle:updated', session.charactersInBattle);

        socket.emit('character:add-to-battle-result', {
          success: true,
          character: battleCharacter
        });
      } catch (error) {
        console.error('Error adding character to battle:', error);
        socket.emit('character:add-to-battle-result', {
          success: false,
          error: 'Failed to add character to battle'
        });
      }
    });

    socket.on('tracker:sync', (data: { sessionId: string }) => {
      const session = activeSessions.get(data.sessionId);
      if (session && socket.id === session.masterSocketId) {
        // Рассылаем текущее состояние всем участникам сессии
        io.to(data.sessionId).emit('tracker:state', {
          characters: session.charactersInBattle,
          initiativeOrder: session.initiativeOrder
        });
      }
    });

    // Сброс инициативы и стресса к значениям по умолчанию
    socket.on('characters:reset', (data: { sessionId: string }) => {
      const session = activeSessions.get(data.sessionId);
      if (session && socket.id === session.masterSocketId) {
        // Сбрасываем значения для всех персонажей в бою
        session.charactersInBattle.forEach(character => {
          character.initiative = character.defaultInitiative;
          character.stress = 0;
        });

        // Пересортировываем инициативу
        session.initiativeOrder = session.charactersInBattle
          .filter(c => c.initiative > 0)
          .sort((a, b) => b.initiative - a.initiative)
          .map(c => c.id!);

        // Рассылаем обновление всем участникам сессии
        io.to(data.sessionId).emit('characters-in-battle:updated', session.charactersInBattle);
        io.to(data.sessionId).emit('initiative:updated', session.initiativeOrder);
      }
    });

    // Обновление отдельных значений персонажа
    socket.on('character:update', (data: {
      sessionId: string;
      characterId: string;
      updates: Partial<CharacterData>
    }) => {
      const session = activeSessions.get(data.sessionId);
      if (session) {
        const character = session.charactersInBattle.find(c => c.id === data.characterId);
        if (character) {
          // Обновляем значения
          Object.assign(character, data.updates);

          // Если обновили инициативу, пересортировываем
          if (data.updates.initiative !== undefined) {
            session.initiativeOrder = session.charactersInBattle
              .filter(c => c.initiative > 0)
              .sort((a, b) => b.initiative - a.initiative)
              .map(c => c.id!);

            io.to(data.sessionId).emit('initiative:updated', session.initiativeOrder);
          }

          // Рассылаем обновление конкретного персонажа
          io.to(data.sessionId).emit('character:updated', character);
        }
      }
    });
  });
};

const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};
