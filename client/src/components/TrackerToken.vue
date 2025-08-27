<template>
  <div v-if="character" class="tracker-token">
    <div class="character-name">{{ character.name }}</div>
    <input
      type="number"
      :value="character.initiative"
      placeholder="Инициатива"
      @input="updateInitiative(($event.target as HTMLInputElement).value)"
    />
    <div class="status-indicators">
      <span class="health">❤️ {{ character.health }}</span>
      <span class="fatigue">💨 {{ character.fatigue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">

import type { BattleCharacter } from "@/types";

defineProps<{
  character: BattleCharacter
}>()

const emit = defineEmits<{
  (e: 'update-initiative', characterId: string, newInitiative: number): void
}>()

const updateInitiative = (newValue: string) => {
  const numValue = parseInt(newValue)

  if (!isNaN(numValue)) {
    emit('update-initiative', character.id, numValue)
  }
}
</script>

<style scoped>
.tracker-token {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.character-name {
  font-weight: bold;
  flex: 1;
}

input {
  width: 60px;
  margin: 0 10px;
}

.status-indicators {
  display: flex;
  gap: 10px;
}
</style>
