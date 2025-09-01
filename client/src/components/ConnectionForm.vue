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
      <button v-else @click="joinSession">Присоединиться как игрок</button>
    </div>

    <CircularButton :options="options" :radius="140">
      <i class="fas"></i>
    </CircularButton>

    <div class="donut-container">
      <button @click="chooseStance">Выбрать стойку</button>
      <transition name="fade">
        <vc-donut
          v-show="isStanceChoosing"
          size="160"
          unit="px"
          background="transparent"
          :thickness="40"
          :sections="sections"
          :total="100"
          :start-angle="0"
          auto-adjust-text-size
          @section-click="optionClick"
        >
          <template #default>
            <div class="choose-stance__container">
              <div class="choose-stance__inner-container-top">
                <img
                  class="choose-stance__icon"
                  src="../assets/image/Earth.png"
                  alt="water"
                />
                <img
                  class="choose-stance__icon"
                  src="../assets/image/Fire.png"
                  alt="water"
                />
              </div>
              <div class="choose-stance__inner-container-center">
                <img
                  class="choose-stance__icon"
                  src="../assets/image/Water.png"
                  alt="water"
                />
                <img
                  class="choose-stance__icon"
                  src="../assets/image/Air.png"
                  alt="water"
                />
              </div>
              <img
                class="choose-stance__icon"
                src="../assets/image/Void.png"
                alt="water"
              />
            </div>
          </template>
        </vc-donut>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { VcDonut } from "vue-css-donut-chart";

import CircularButton from "@/components/CircularButton.vue";
import SparkButton from "@/components/SparkButton.vue";
import { useSocketStore } from "@/stores/socket";
import "vue-css-donut-chart/dist/vcdonut.css";

// Обработчик для touch-устройств
// document.querySelectorAll(".spark-btn").forEach(button => {
//   button.addEventListener("touchstart", function(e) {
//     e.preventDefault();
//     // animateSparks(this);
//   });
// });

const serverUrl = ref("http://192.168.1.137:3000");
// const serverUrl = ref("http://192.168.25.130:3000");
const playerName = ref("");
const sessionCode = ref("");
const socketStore = useSocketStore();

const isConnected = computed(() => socketStore.isConnected);
const isStanceChoosing = ref<boolean>(false);

const connect = () => {
  socketStore.connect(serverUrl.value);
};

const createSession = () => {
  socketStore.createSession();
  socketStore.isMaster = true;
};

const joinSession = () => {
  if (sessionCode.value && playerName.value) {
    socketStore.joinSession(sessionCode.value, playerName.value);
    socketStore.isMaster = false;
  }
};

const optionClick = (section, event) => {
  console.log("option click", section.label);
};
const chooseStance = () => {
  isStanceChoosing.value = !isStanceChoosing.value;
};

const sections = [
  { label: "Fire", value: 20, color: "darkgoldenrod" },
  { label: "Air", value: 20, color: "lightgray" },
  { label: "Void", value: 20, color: "darkslategray" },
  { label: "Water", value: 20, color: "violet" },
  { label: "Earth", value: 20, color: "darkgreen" }
];

const options = [
  {
    icon: "lion-icon",
    text: "Главная",
    action: () => console.log("Home clicked")
  },
  {
    icon: "fas fa-cog",
    text: "Настройки",
    bgClass: "bg-blue",
    action: () => console.log("Settings clicked")
  },
  {
    icon: "fas fa-user",
    text: "Профиль",
    bgClass: "bg-green",
    action: () => console.log("Profile clicked")
  },
  {
    icon: "fas fa-info",
    text: "О программе",
    bgClass: "bg-yellow",
    action: () => console.log("About clicked")
  },
  {
    icon: "fas fa-envelope",
    text: "Сообщения",
    bgClass: "bg-purple",
    action: () => console.log("Messages clicked")
  }
  // ... more options
];
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
