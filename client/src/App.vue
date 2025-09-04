<template>
  <div id="layout">
    <h1>L5R Трекер Инициативы</h1>
    <ConnectionForm />
    <TrackerList v-if="socketStore.isConnected" />
    <CharacterLibrary />
  </div>
</template>

<script setup lang="ts">
import CharacterLibrary from "@/components/CharacterLibrary.vue";
import { useSocketStore } from "@/stores/socket";

import ConnectionForm from "./components/ConnectionForm.vue";
import TrackerList from "./components/TrackerList.vue";

const socketStore = useSocketStore();
</script>

<style>
#layout {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background: silver;
}

input,
button {
  padding: 8px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: var(--color-dark);
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: var(--color-tertiary-dark);
}

* {
  -webkit-tap-highlight-color: transparent;
}

.choose-stance__icon {
  width: 40px;
  height: 40px;
}

.choose-stance__container {
  display: flex;
  position: absolute;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.choose-stance__inner-container-top {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.choose-stance__inner-container-center {
  gap: 65px;
  display: flex;
  margin-top: 20px;
}

.cdc-overlay {
  pointer-events: none;
  overflow: visible;
}
</style>
