<template>
  <div v-if="character" class="tracker-token">
    <div class="character-header">
      <h3>{{ character.name }}</h3>
      <span class="stance">{{ character.stance }}</span>
    </div>

    <div class="character-stats">
      <div class="stat-row">
        <label>Инициатива:</label>
        <input
          type="number"
          :value="character.initiative"
          :disabled="!isMaster"
          @input="updateField('initiative', $event)"
        >
        <span class="default">({{ character.defaultInitiative }})</span>
      </div>

      <div class="stat-row">
        <label>Стресс:</label>
        <input
          type="number"
          :value="character.strife"
          :disabled="!isMaster"
          @input="updateField('strife', $event)"
        >
        <span>/ {{ character.maxStrife }}</span>
      </div>

      <div class="rings">
        <div v-for="ring in rings" :key="ring.name" class="ring">
          <span class="ring-name">{{ ring.name }}</span>
          <span class="ring-value">{{ ring.value }}</span>
        </div>
      </div>

      <div v-if="character.conditions.length" class="conditions">
        <h4>Состояния:</h4>
        <div class="condition-list">
          <span v-for="condition in character.conditions" :key="condition" class="condition">
            {{ condition }}
          </span>
        </div>
      </div>

      <div v-if="character.notes" class="notes">
        <h4>Заметки:</h4>
        <textarea
          :value="character.notes"
          :disabled="!isMaster"
          placeholder="Заметки о персонаже"
          @input="updateField('notes', $event)"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useSocketStore } from "@/stores/socket";
import type { BattleCharacter } from "@/types";

const props = defineProps<{
  character: BattleCharacter
  isMaster: boolean
}>();

const socketStore = useSocketStore();

const rings = computed(() => [
  { name: "Вода", value: props.character.water },
  { name: "Земля", value: props.character.earth },
  { name: "Огонь", value: props.character.fire },
  { name: "Воздух", value: props.character.air },
  { name: "Пустота", value: props.character.void }
]);

const updateField = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  const value = field === "notes" ? target.value : Number(target.value);

  socketStore.updateCharacter(props.character.id!, {
    [field]: value
  });
};
</script>

<style scoped>
.tracker-token {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.character-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.character-header h3 {
  margin: 0;
  font-size: 18px;
}

.stance {
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.stat-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.stat-row label {
  width: 80px;
  font-weight: bold;
}

.stat-row input {
  width: 60px;
  padding: 4px;
  margin: 0 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.stat-row input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.default {
  font-size: 12px;
  color: #888;
}

.rings {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  padding: 10px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.ring {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ring-name {
  font-size: 12px;
  color: #666;
}

.ring-value {
  font-weight: bold;
  font-size: 16px;
}

.conditions, .notes {
  margin-top: 15px;
}

.conditions h4, .notes h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.condition-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.condition {
  background-color: #e3f2fd;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.notes textarea {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.notes textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
