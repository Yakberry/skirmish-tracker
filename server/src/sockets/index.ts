import { Server } from 'socket.io';
import {
  AppSocket,
  BattleCharacter,
  CharacterData,
  ReadyCharacter,
  SessionData,
  UpdateCharacterRequest
} from "../types";
import { Character } from '../models/Character';
import { sequelize } from "../models";

const activeSessions = new Map<string, SessionData>();

// Упрощенная версия с оптимизированными событиями
export const initializeSockets = (io: Server): void => {
  io.on('connection', (socket: AppSocket) => {
    console.log(`User ${socket.id} connected`);

    // Создание сессии
    socket.on('session:create', () => {
      const sessionId = generateSessionId();
      activeSessions.set(sessionId, {
        id: sessionId,
        initiativeOrder: [],
        charactersInBattle: [],
        masterSocketId: socket.id,
      });

      socket.join(sessionId);
      socket.sessionId = sessionId;
      socket.isMaster = true;

      // Отправляем одно событие с всей информацией
      socket.emit('session:created', {
        sessionId,
        isMaster: true,
        session: activeSessions.get(sessionId)
      });
    });

    // Присоединение к сессии
    socket.on('session:join', (data: { sessionId: string; playerName: string }) => {
      const { sessionId, playerName } = data;
      const session = activeSessions.get(sessionId);

      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      socket.join(sessionId);
      socket.sessionId = sessionId;
      socket.playerName = playerName;
      socket.isMaster = false;

      // Отправляем информацию о сессии
      socket.emit('session:created', {
        sessionId,
        isMaster: false,
        session
      });

      // Уведомляем других участников
      socket.to(sessionId).emit('player:joined', { playerName });
    });

    // Запрос списка персонажей
    socket.on('characters:request', async () => {
      try {
        const characters = await Character.findAll({
          order: [['name', 'ASC']]
        });
        socket.emit('characters:list', characters);
      } catch (error) {
        console.error('Error fetching characters:', error);
        socket.emit('error', { message: 'Failed to fetch characters' });
      }
    });

    // Создание нового персонажа
    socket.on('character:create', async (data: ReadyCharacter) => {
      try {
        if (!data.name) {
          socket.emit('error', { message: 'Name is required' });
          return;
        }

        const character = await Character.create(data);
        // Отправляем создателю и broadcast всем
        socket.emit('character:created', character);
        socket.broadcast.emit('character:created', character);
      } catch (error) {
        console.error('Error creating character:', error);
        socket.emit('error', { message: 'Failed to create character' });
      }
    });

    // Обновление персонажа
    socket.on('character:update', async (data: UpdateCharacterRequest) => {
      try {
        if (!socket.sessionId) {
          socket.emit('error', { message: 'Not in a session' });
          return;
        }

        const session = activeSessions.get(socket.sessionId);
        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Обновляем в базе
        const [affectedCount] = await Character.update(data.updates, {
          where: { id: data.characterId }
        });

        if (affectedCount === 0) {
          socket.emit('error', { message: 'Character not found' });
          return;
        }

        const updatedCharacter = await Character.findByPk(data.characterId);
        if (!updatedCharacter) {
          socket.emit('error', { message: 'Character not found after update' });
          return;
        }

        // Обновляем в сессии
        const battleCharIndex = session.charactersInBattle.findIndex(c => c.id === data.characterId);
        if (battleCharIndex !== -1) {
          session.charactersInBattle[battleCharIndex] = {
            ...updatedCharacter.toJSON(),
            isVisible: session.charactersInBattle[battleCharIndex].isVisible
          };
        }

        // Отправляем обновление всем
        io.to(socket.sessionId).emit('character:updated', updatedCharacter);

        // Если изменилась инициатива, обновляем порядок
        if (data.updates.initiative !== undefined) {
          session.initiativeOrder = session.charactersInBattle
            .filter(c => c.initiative > 0)
            .sort((a, b) => b.initiative - a.initiative)
            .map(c => c.id!);

          // Отправляем обновление сессии
          io.to(socket.sessionId).emit('session:updated', session);
        }
      } catch (error) {
        console.error('Error updating character:', error);
        socket.emit('error', { message: 'Failed to update character' });
      }
    });

    // Добавление персонажа в бой
    socket.on('character:add-to-battle', async (data: { characterId: string }) => {
      try {
        console.log(data);
        if (!socket.sessionId) {
          socket.emit('error', { message: 'Not in a session' });
          return;
        }

        const session = activeSessions.get(socket.sessionId);
        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        const character = await Character.findByPk(data.characterId);
        if (!character) {
          socket.emit('error', { message: 'Character not found' });
          return;
        }

        const battleCharacter: BattleCharacter = {
          ...character.toJSON(),
          isVisible: true
        };

        session.charactersInBattle.push(battleCharacter);
        // session.initiativeOrder = session.charactersInBattle
        //   .filter(c => c.initiative > 0)
        //   .sort((a, b) => b.initiative - a.initiative)
        //   .map(c => c.id!);
        session.initiativeOrder.push(battleCharacter.id!)

        // Отправляем обновление всей сессии
        io.to(socket.sessionId).emit('session:updated', session);
      } catch (error) {
        console.error('Error adding character to battle:', error);
        socket.emit('error', { message: 'Failed to add character to battle' });
      }
    });

    // Сброс значений персонажей
    // ... остальной код ...

    // Сброс значений персонажей
    socket.on('characters:reset', async () => {
      try {
        if (!socket.sessionId || !socket.isMaster) return;

        const session = activeSessions.get(socket.sessionId);
        if (!session) return;

        // Подготавливаем данные для обновления
        const updateData = session.charactersInBattle
          .filter(character => character.id)
          .map(character => ({
            id: character.id!,
            initiative: character.defaultInitiative || 0,
            strife: 0,
            updated_at: new Date()
          }));

        if (updateData.length === 0) return;

        // 1. Сначала обновляем в памяти
        session.charactersInBattle.forEach(character => {
          if (character.id) {
            character.initiative = character.defaultInitiative || 0;
            character.strife = 0;
          }
        });

        // 2. Пытаемся обновить базу (но не блокируемся на ошибках)
        try {
          // Используем транзакцию для надежности
          await sequelize.transaction(async (transaction) => {
            for (const data of updateData) {
              await Character.update(
                {
                  initiative: data.initiative,
                  strife: data.strife,
                  updated_at: data.updated_at
                },
                {
                  where: { id: data.id },
                  transaction
                }
              );
            }
          });
        } catch (dbError) {
          console.warn('Database update partially failed, but in-memory state is updated:', dbError);
          // Можно добавить retry логику здесь
        }

        // 3. Обновляем порядок инициативы
        session.initiativeOrder = session.charactersInBattle
          .filter(c => c.initiative > 0)
          .sort((a, b) => b.initiative - a.initiative)
          .map(c => c.id!);

        // 4. Отправляем обновление
        io.to(socket.sessionId).emit('session:updated', session);

      } catch (error) {
        console.error('Error in characters:reset:', error);
        socket.emit('error', { message: 'Failed to reset characters' });
      }
    });

    // Синхронизация трекера
    socket.on('tracker:sync', () => {
      if (!socket.sessionId || !socket.isMaster) return;

      const session = activeSessions.get(socket.sessionId);
      if (session) {
        io.to(socket.sessionId).emit('session:updated', session);
      }
    });

    // Обработка отключения
    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);

      if (socket.sessionId && socket.playerName) {
        socket.to(socket.sessionId).emit('player:left', { playerName: socket.playerName });
      }
    });
  });
};

const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};
