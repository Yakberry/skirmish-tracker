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
        masterSocketId: socket.id,
      });

      socket.join(sessionId);
      socket.sessionId = sessionId;
      socket.isMaster = true;

      socket.emit('session:created', { sessionId });
      socket.emit('session:master', { isMaster: true });
    });

    // Присоединение к существующей сессии
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

      socket.emit('session:master', { isMaster: false });
      socket.emit('session:state', session);
      socket.to(sessionId).emit('player:joined', { playerName });
    });

    // Запрос списка персонажей из библиотеки
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
        socket.emit('character:created', character);
        socket.broadcast.emit('character:added', character);
      } catch (error) {
        console.error('Error creating character:', error);
        socket.emit('error', { message: 'Failed to create character' });
      }
    });

    // Добавление персонажа в бой
    socket.on('character:add-to-battle', async (data: { characterId: string }) => {
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
        io.to(socket.sessionId).emit('characters-in-battle:updated', session.charactersInBattle);
      } catch (error) {
        console.error('Error adding character to battle:', error);
        socket.emit('error', { message: 'Failed to add character to battle' });
      }
    });

    // Единый обработчик обновления персонажа
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

        // Обновляем персонажа в базе данных
        const [affectedCount] = await Character.update(data.updates, {
          where: { id: data.characterId }
        });

        if (affectedCount === 0) {
          socket.emit('error', { message: 'Character not found' });
          return;
        }

        // Получаем обновленного персонажа
        const updatedCharacter = await Character.findByPk(data.characterId);
        if (!updatedCharacter) {
          socket.emit('error', { message: 'Character not found after update' });
          return;
        }

        // Обновляем персонажа в текущей сессии
        const battleCharIndex = session.charactersInBattle.findIndex(c => c.id === data.characterId);
        if (battleCharIndex !== -1) {
          session.charactersInBattle[battleCharIndex] = {
            ...updatedCharacter.toJSON(),
            isVisible: session.charactersInBattle[battleCharIndex].isVisible
          };
        }

        // Если обновили инициативу, пересортировываем
        if (data.updates.initiative !== undefined) {
          session.initiativeOrder = session.charactersInBattle
            .filter(c => c.initiative > 0)
            .sort((a, b) => b.initiative - a.initiative)
            .map(c => c.id!);

          io.to(socket.sessionId).emit('initiative:updated', session.initiativeOrder);
        }

        // Рассылаем обновленного персонажа всем участникам сессии
        io.to(socket.sessionId).emit('character:updated', updatedCharacter);
      } catch (error) {
        console.error('Error updating character:', error);
        socket.emit('error', { message: 'Failed to update character' });
      }
    });

    // Синхронизация состояния трекера
    socket.on('tracker:sync', () => {
      if (!socket.sessionId || !socket.isMaster) return;

      const session = activeSessions.get(socket.sessionId);
      if (session) {
        io.to(socket.sessionId).emit('tracker:state', {
          characters: session.charactersInBattle,
          initiativeOrder: session.initiativeOrder
        });
      }
    });

    // Сброс инициативы и strife
    socket.on('characters:reset', async () => {
      try {
        if (!socket.sessionId || !socket.isMaster) return;

        const session = activeSessions.get(socket.sessionId);
        if (!session) return;

        // Сбрасываем значения для всех персонажей в бою
        for (const character of session.charactersInBattle) {
          const [affectedCount] = await Character.update(
            {
              initiative: character.defaultInitiative,
              strife: 0
            },
            { where: { id: character.id } }
          );

          if (affectedCount > 0) {
            character.initiative = character.defaultInitiative;
            character.strife = 0;
          }
        }

        // Пересортировываем инициативу
        session.initiativeOrder = session.charactersInBattle
          .filter(c => c.initiative > 0)
          .sort((a, b) => b.initiative - a.initiative)
          .map(c => c.id!);

        // Рассылаем обновления всем участникам сессии
        io.to(socket.sessionId).emit('characters-in-battle:updated', session.charactersInBattle);
        io.to(socket.sessionId).emit('initiative:updated', session.initiativeOrder);
      } catch (error) {
        console.error('Error resetting characters:', error);
        socket.emit('error', { message: 'Failed to reset characters' });
      }
    });

    // Обработка отключения клиента
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
