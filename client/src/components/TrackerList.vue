<template>
  <div class="tracker-list">
    <h2>Трекер инициативы</h2>
    <div class="initiative-order">
      <TrackerToken
        v-for="characterId in initiativeStore.initiativeOrder"
        :key="characterId"
        :character="findCharacter(characterId)"
        @update-initiative="updateInitiative"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInitiativeStore } from "@/stores/initiative";

import TrackerToken from "./TrackerToken.vue";

import type { BattleCharacter } from "@/types";

const initiativeStore = useInitiativeStore();

const findCharacter = (characterId: string): BattleCharacter | undefined => {
  return initiativeStore.characters.find(c => c.id === characterId);
};

const updateInitiative = (characterId: string, newInitiative: number) => {
  initiativeStore.updateCharacterInitiative(characterId, newInitiative);
};
</script>
