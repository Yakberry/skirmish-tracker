import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";

import { useInitiativeStore } from "./initiative";
import { useLibraryStore } from "./library";

import type {
  CharacterData,
  BattleCharacter,
  SocketSession,
  UpdateCharacterRequest
} from "@/types";

interface SocketState extends SocketSession {
  socket: Socket | null;
}

export const useSocketStore = defineStore("socket", {
  state: (): SocketState => ({
    socket: null,
    sessionId: null,
    isConnected: false,
    isMaster: false,
    players: []
  }),

  actions: {
    connect(serverUrl: string) {
      this.socket = io(serverUrl);

      this.socket.on("connect", () => {
        this.isConnected = true;
        console.log("Connected to server");
      });

      this.socket.on("disconnect", () => {
        this.isConnected = false;
        console.log("Disconnected from server");
      });

      this.socket.on("session:created", (data: { sessionId: string }) => {
        this.sessionId = data.sessionId;
      });

      this.socket.on("session:master", (data: { isMaster: boolean }) => {
        this.isMaster = data.isMaster;
      });

      this.socket.on("session:state", (data: any) => {
        const initiativeStore = useInitiativeStore();

        initiativeStore.setCharacters(data.charactersInBattle || []);
        initiativeStore.setInitiativeOrder(data.initiativeOrder || []);
      });

      this.socket.on("player:joined", (data: { playerName: string }) => {
        this.players.push(data.playerName);
      });

      this.socket.on("player:left", (data: { playerName: string }) => {
        const index = this.players.indexOf(data.playerName);

        if (index > -1) {
          this.players.splice(index, 1);
        }
      });

      this.socket.on("characters:list", (characters: CharacterData[]) => {
        const libraryStore = useLibraryStore();

        libraryStore.setCharacters(characters);
      });

      this.socket.on("character:created", (character: CharacterData) => {
        const libraryStore = useLibraryStore();

        libraryStore.addCharacter(character);
      });

      this.socket.on("character:added", (character: CharacterData) => {
        const libraryStore = useLibraryStore();

        libraryStore.addCharacter(character);
      });

      this.socket.on(
        "characters-in-battle:updated",
        (characters: BattleCharacter[]) => {
          const initiativeStore = useInitiativeStore();

          initiativeStore.setCharacters(characters);
        }
      );

      this.socket.on("initiative:updated", (initiativeOrder: string[]) => {
        const initiativeStore = useInitiativeStore();

        initiativeStore.setInitiativeOrder(initiativeOrder);
      });

      this.socket.on("character:updated", (character: Character) => {
        const initiativeStore = useInitiativeStore();

        initiativeStore.updateCharacter(character);
      });

      this.socket.on(
        "tracker:state",
        (data: {
          characters: BattleCharacter[];
          initiativeOrder: string[];
        }) => {
          const initiativeStore = useInitiativeStore();

          initiativeStore.setCharacters(data.characters);
          initiativeStore.setInitiativeOrder(data.initiativeOrder);
        }
      );

      this.socket.on("error", (data: { message: string }) => {
        console.error("Server error:", data.message);
      });
    },

    createSession() {
      if (this.socket) {
        this.socket.emit("session:create");
      }
    },

    joinSession(sessionId: string, playerName: string) {
      if (this.socket) {
        this.socket.emit("session:join", { sessionId, playerName });
      }
    },

    requestCharacters() {
      if (this.socket) {
        this.socket.emit("characters:request");
      }
    },

    createCharacter(characterData: Partial<CharacterData>) {
      if (this.socket) {
        this.socket.emit("character:create", characterData);
      }
    },

    addCharacterToBattle(characterId: string) {
      if (this.socket) {
        this.socket.emit("character:add-to-battle", { characterId });
      }
    },

    updateCharacter(characterId: string, updates: Partial<CharacterData>) {
      if (this.socket) {
        this.socket.emit("character:update", { characterId, updates });
      }
    },

    syncTracker() {
      if (this.socket) {
        this.socket.emit("tracker:sync");
      }
    },

    resetCharacters() {
      if (this.socket) {
        this.socket.emit("characters:reset");
      }
    }
  }
});
