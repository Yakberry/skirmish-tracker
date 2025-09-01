<template>
  <div v-if="character" class="tracker-token">
    <div class="character-main">
      <div class="character-name">{{ character.name }}</div>
      <img
        class="tracker-token__stance"
        src="../assets/image/Water.png"
        alt="water"
      />
      <img
        class="tracker-token__stance"
        src="../assets/image/Earth.png"
        alt="earth"
      />
      <img
        class="tracker-token__stance"
        src="../assets/image/Fire.png"
        alt="fire"
      />
      <img
        class="tracker-token__stance"
        src="../assets/image/Air.png"
        alt="air"
      />
      <img
        class="tracker-token__stance"
        src="../assets/image/Void.png"
        alt="void"
      />
      <div class="character-stats">
        <div class="stat-group">
          <label>Инициатива</label>
          <input
            type="number"
            :value="character.initiative"
            :disabled="!isMaster"
            @input="updateInitiative(($event.target as HTMLInputElement).value)"
          />
          <span class="default-value">({{ character.defaultInitiative }})</span>
        </div>

        <div class="stat-group">
          <label>Стресс</label>
          <input
            type="number"
            :value="character.stress"
            :disabled="!isMaster"
            @input="updateStress(($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="stat-group">
          <label>Здоровье</label>
          <span class="stat-value">❤️ {{ character.health }}</span>
        </div>

        <div class="stat-group">
          <label>Усталость</label>
          <span class="stat-value">💨 {{ character.fatigue }}</span>
        </div>
      </div>
    </div>

    <div class="character-rings">
      <div v-for="ring in rings" :key="ring.name" class="ring">
        <span class="ring-name">{{ ring.name }}</span>
        <img
          v-show="0"
          class="tracker-token__stance"
          :src="`../assets/image/${ring.alt}.png`"
          :alt="ring.alt"
        />
        <span class="ring-value">{{ ring.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { BattleCharacter } from "@/types";


const props = defineProps<{
  character: BattleCharacter;
  isMaster: boolean;
}>();

const emit = defineEmits<{
  (e: "update-initiative", characterId: string, newInitiative: number): void;
  (e: "update-stress", characterId: string, newStress: number): void;
}>();

const rings = computed(() => [
  { name: "Вода", value: props.character.water, alt: "Water" },
  { name: "Земля", value: props.character.earth, alt: "Earth" },
  { name: "Огонь", value: props.character.fire, alt: "Fire" },
  { name: "Воздух", value: props.character.air, alt: "Air" },
  { name: "Пустота", value: props.character.void, alt: "Void" }
]);

const updateInitiative = (newValue: string) => {
  const numValue = parseInt(newValue);

  if (!isNaN(numValue)) {
    emit("update-initiative", props.character.id!, numValue);
  }
};

const updateStress = (newValue: string) => {
  const numValue = parseInt(newValue);

  if (!isNaN(numValue)) {
    emit("update-stress", props.character.id!, numValue);
  }
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

.tracker-token__stance {
  width: 30px;
  height: 30px;
  margin-left: 6px;
}

.character-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.character-name {
  font-weight: bold;
  font-size: 16px;
  flex: 1;
}

.character-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.stat-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.stat-group label {
  font-size: 12px;
  color: #757575;
  margin-bottom: 4px;
}

.stat-group input {
  width: 50px;
  text-align: center;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.stat-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.default-value {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.stat-value {
  font-weight: bold;
}

.character-rings {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.ring {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ring-name {
  font-size: 11px;
  color: #757575;
}

.ring-value {
  font-weight: bold;
  font-size: 14px;
}
</style>
