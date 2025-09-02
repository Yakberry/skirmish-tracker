import { defineStore } from "pinia";

import type { BattleCharacter } from "@/types";

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
    },
    updateCharacterInitiative(characterId: string, newInitiative: number) {
      // const socketStore = useSocketStore();

      this.updateCharacter(characterId, { initiative: newInitiative });
    }
  }
});
