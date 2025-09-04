import { defineStore } from "pinia";

import { useSocketStore } from "./socket";

import type { CharacterData } from "@/types";

interface LibraryState {
  characters: CharacterData[];
  isLoading: boolean;
  error: string | null;
}

export const useLibraryStore = defineStore("library", {
  state: (): LibraryState => ({
    characters: [],
    isLoading: false,
    error: null
  }),

  actions: {
    setCharacters(characters: CharacterData[]) {
      this.characters = characters;
      this.isLoading = false;
      this.error = null;
    },

    addCharacter(character: CharacterData) {
      this.characters.push(character);
    },

    removeCharacter(characterId: string) {
      this.characters = this.characters.filter(c => c.id !== characterId);
    },

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    setError(error: string | null) {
      this.error = error;
      this.isLoading = false;
    },

    async loadCharacters() {
      this.setLoading(true);
      this.setError(null);

      const socketStore = useSocketStore();

      socketStore.requestCharacters();

      // Таймаут на случай, если ответ от сервера не придет
      setTimeout(() => {
        if (this.isLoading) {
          this.setError("Timeout while loading characters");
        }
      }, 5000);
    },

    async createCharacter(characterData: Partial<CharacterData>) {
      this.setLoading(true);
      this.setError(null);

      const socketStore = useSocketStore();

      socketStore.createCharacter(characterData);

      // Таймаут на случай, если ответ от сервера не придет
      setTimeout(() => {
        if (this.isLoading) {
          this.setError("Timeout while creating character");
        }
      }, 5000);
    }
  }
});
