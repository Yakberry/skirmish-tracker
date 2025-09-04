import { defineStore } from "pinia";

import type { BattleCharacter } from "@/types";
import { useSocketStore } from "@/stores/socket.ts";

interface InitiativeState {
  characters: BattleCharacter[];
  initiativeOrder: string[];
}

export const useInitiativeStore = defineStore("initiative", {
  state: (): InitiativeState => ({
    characters: [],
    initiativeOrder: []
  }),

  actions: {
    setCharacters(characters: BattleCharacter[]) {
      this.characters = characters;
    },

    setInitiativeOrder(initiativeOrder: string[]) {
      this.initiativeOrder = initiativeOrder;
    },

    updateCharacter(character: BattleCharacter) {
      const index = this.characters.findIndex(c => c.id === character.id);

      if (index !== -1) {
        this.characters[index] = character;
      }

      // const socketStore = useSocketStore();
      //
      // socketStore.updateCharacter(character.id!, character);
    },
    updateCharacterInitiative(characterId: string, newInitiative: number) {
      // const socketStore = useSocketStore();

      this.updateCharacter(characterId, { initiative: newInitiative });
    }
  }
});
