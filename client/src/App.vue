<template>
  <div id="app">
    <h1>L5R Трекер Инициативы</h1>
    <ConnectionForm />
    <TrackerList v-if="socketStore.isConnected && socketStore.sessionId" />
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

input,
button {
  padding: 8px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
