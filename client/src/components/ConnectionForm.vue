<template>
  <div class="connection-form">
    <h2>Подключение к серверу</h2>
    <div class="connection-form__buttons">
      <input
        v-model="serverUrl"
        placeholder="URL сервера (например: http://192.168.1.42:3000)"
      />
      <button @click="connect">Подключиться</button>
    </div>

    <div v-if="isConnected">
      <h3>Присоединиться к сессии</h3>
      <input v-model="playerName" placeholder="Ваше имя" />
      <input v-model="sessionCode" placeholder="Код сессии (если есть)" />
      <button v-if="!sessionCode" @click="createSession">
        Создать новую сессию
      </button>
      <button v-else @click="joinSession">Присоединиться</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import { useSocketStore } from "@/stores/socket";

const serverUrl = ref("http://192.168.25.130:3000");
const playerName = ref("");
const sessionCode = ref("");
const socketStore = useSocketStore();

const isConnected = computed(() => socketStore.isConnected);

const connect = () => {
  socketStore.connect(serverUrl.value);
};

const createSession = () => {
  socketStore.createSession();
};

const joinSession = () => {
  if (sessionCode.value && playerName.value) {
    socketStore.joinSession(sessionCode.value, playerName.value);
  }
};
</script>

<style lang="css">
.connection-form__buttons {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
