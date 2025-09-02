<template>
  <div class="connection-form">
    <h2>Подключение к серверу</h2>
    <div class="connection-form__buttons">
      <input
        v-model="serverUrl"
        placeholder="URL сервера (например: http://192.168.1.42:3000)"
      />
      <SparkButton>
        <button
          class="spark-btn"
          :class="{ pulse: !isConnected }"
          @click="connect"
        >
          Подключиться 2
        </button>
      </SparkButton>
    </div>

    <div v-if="isConnected">
      <h3>Присоединиться к сессии</h3>
      <input v-model="playerName" placeholder="Ваше имя" />
      <input v-model="sessionCode" placeholder="Код сессии" />
      <button
        v-if="!sessionCode"
        class="btn btn-primary pulse"
        @click="createSession"
      >
        Создать новую сессию (стать мастером)
      </button>
      <button v-else @click="joinSession">
        Присоединиться как игрок
      </button>
    </div>

    <StanceChooseButton @change-stance="optionClick">
      <img src="../assets/image/Void.png" alt="">
    </StanceChooseButton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import SparkButton from "@/components/SparkButton.vue";
import StanceChooseButton from "@/components/StanceChooseButton.vue";
import { useSocketStore } from "@/stores/socket";
import "vue-css-donut-chart/dist/vcdonut.css";
import { Ring } from "@/types";

// Обработчик для touch-устройств
// document.querySelectorAll(".spark-btn").forEach(button => {
//   button.addEventListener("touchstart", function(e) {
//     e.preventDefault();
//     // animateSparks(this);
//   });
// });

// const serverUrl = ref("http://192.168.1.137:3000");
const serverUrl = ref("http://192.168.25.140:3000");
const playerName = ref("");
const sessionCode = ref("");
const socketStore = useSocketStore();

const isConnected = computed(() => socketStore.isConnected);

const connect = () => {
  socketStore.connect(serverUrl.value);
};

const createSession = () => {
  socketStore.createSession();
  socketStore.isMaster = true;
};

const joinSession = () => {
  console.log(sessionCode.value, playerName.value);
  if (sessionCode.value && playerName.value) {
    socketStore.joinSession(sessionCode.value, playerName.value);
    socketStore.isMaster = false;
  }
};

const optionClick = (stance: Ring, event) => {
  console.log("option click", stance);
};

</script>

<style lang="css">
.connection-form__buttons {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.spark-btn {
  position: relative;
  background: #2a2a2a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-size: 18px;
  cursor: pointer;
  overflow: visible;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.spark-btn:hover {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.choose-stance__icon {
  /*width: 30px;
  height: 30px;*/
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
