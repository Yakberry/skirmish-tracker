import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";

import { useInitiativeStore } from "@/stores/initiative.ts";
import { useLibraryStore } from "@/stores/library";

import type { BattleCharacter, Character, CreateCharacterRequest, SocketSession } from "@/types";

interface SocketState extends SocketSession {
    socket: Socket | null;
}

export const useSocketStore = defineStore('socket', {
    state: (): SocketState => ({
        socket: null,
        sessionId: null,
        isConnected: false,
        players: []
    }),

    actions: {
        connect(serverUrl: string) {

            console.log(serverUrl, this.$state);

            this.socket = io(serverUrl)

            this.socket.on('connect', () => {
                this.isConnected = true
                console.log('Connected to server')
            })

            this.socket.on('disconnect', () => {
                this.isConnected = false
                console.log('Disconnected from server')
            })

            this.socket.on('session:created', (data: { sessionId: string }) => {
                this.sessionId = data.sessionId
                console.log('Session created:', data.sessionId)
            })

            this.socket.on('session:state', (data: any) => {
                // Здесь будем обновлять состояние инициативы
            })

            this.socket.on('initiative:updated', (initiativeOrder: string[]) => {
                const initiativeStore = useInitiativeStore()

                initiativeStore.updateInitiativeOrder(initiativeOrder)
            })

            this.socket.on('player:joined', (data: { playerName: string }) => {
                console.log("new player! ", data);
                this.players.push(data.playerName)
            })

            this.socket.on('player:left', (data: { playerName: string }) => {
                const index = this.players.indexOf(data.playerName)

                if (index > -1) {
                    this.players.splice(index, 1)
                }
            })

            this.socket.on('characters:list', (characters: Character[]) => {
                const libraryStore = useLibraryStore()

                libraryStore.setCharacters(characters)
            })

            this.socket.on('character:created', (character: Character) => {
                const libraryStore = useLibraryStore()

                libraryStore.addCharacter(character)
            })

            this.socket.on('character:add-to-battle-result',
              (data: { success: boolean; character?: BattleCharacter; error?: string }) => {
                  if (data.success && data.character) {
                      const initiativeStore = useInitiativeStore()

                      initiativeStore.addCharacter(data.character)
                  } else {
                      console.error('Failed to add character to battle:', data.error)
                  }
              })
        },

        createSession() {
            console.log(this.socket, this.$state);

            if (this.socket) {
                this.socket.emit('session:create')
            }
        },

        joinSession(sessionId: string, playerName: string) {
            if (this.socket) {
                this.socket.emit('session:join', { sessionId, playerName })
            }
        },

        updateInitiative(characterId: string, newScore: number) {
            if (this.socket && this.sessionId) {
                this.socket.emit('initiative:update', {
                    sessionId: this.sessionId,
                    characterId,
                    newScore
                })
            }
        },

        requestCharacters() {
            if (this.socket) {
                this.socket.emit('characters:request');
            }
        },

        // Создание нового персонажа
        createCharacter(characterData: CreateCharacterRequest) {
            if (this.socket) {
                this.socket.emit('character:create', characterData);
            }
        },

        // Добавление персонажа в бой
        addCharacterToBattle(characterId: string) {
            if (this.socket && this.sessionId) {
                this.socket.emit('character:add-to-battle', {
                    sessionId: this.sessionId,
                    characterId
                });
            }
        }
    }
    });
