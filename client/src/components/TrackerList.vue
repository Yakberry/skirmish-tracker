<template>
  <div class="tracker-list">
    <div class="tracker-header">
      <h2>Трекер инициативы</h2>
      <div v-if="socketStore.isMaster" class="tracker-actions">
        <button class="sync-button" @click="syncTracker">
          Синхронизировать
        </button>
        <button class="reset-button" @click="resetCharacters">Сбросить</button>
      </div>
    </div>

    <div class="initiative-order">
      <div v-if="initiativeStore.characters.length === 0" class="empty-state">
        Нет персонажей в бою. Добавьте персонажей из библиотеки.
      </div>

      <TrackerToken
        v-for="characterId in initiativeStore.initiativeOrder"
        :key="characterId"
        :character="findCharacter(characterId)"
        :is-master="socketStore.isMaster"
        @update-initiative="updateInitiative"
        @update-stress="updateStress"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import { useInitiativeStore } from "@/stores/initiative";
import { useSocketStore } from "@/stores/socket";

import TrackerToken from "./TrackerToken.vue";

import type { BattleCharacter } from "@/types";

const initiativeStore = useInitiativeStore();
const socketStore = useSocketStore();

const findCharacter = (characterId: string): BattleCharacter | undefined => {
  return initiativeStore.characters.find(c => c.id === characterId);
};

const updateInitiative = (characterId: string, newInitiative: number) => {
  initiativeStore.updateCharacterInitiative(characterId, newInitiative);
};

const updateStress = (characterId: string, newStress: number) => {
  initiativeStore.updateCharacterStress(characterId, newStress);
};

const syncTracker = () => {
  socketStore.syncTracker();
};

const resetCharacters = () => {
  socketStore.resetCharacters();
};
</script>

<style scoped>
.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.tracker-actions {
  display: flex;
  gap: 10px;
}

.sync-button,
.reset-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.sync-button {
  background-color: #2196f3;
  color: white;
}

.reset-button {
  background-color: #f44336;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #757575;
  font-style: italic;
}
</style>
