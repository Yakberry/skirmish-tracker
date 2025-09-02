<template>
  <div class="character-library">
    <h2>Библиотека персонажей</h2>

    <div>
      <CharacterCard
        v-for="character in characters"
        :key="character.id"
        :character="character"
        @change-stance="changeStance(character.id)"
      />
    </div>

    <div v-if="libraryStore.error" class="error-message">
      {{ libraryStore.error }}
    </div>

    <div class="characters-list">
      <div class="list-header">
        <h3>Доступные персонажи</h3>
        <button :disabled="libraryStore.isLoading" @click="refreshCharacters">
          {{ libraryStore.isLoading ? "Обновление..." : "Обновить" }}
        </button>
      </div>

      <div
        v-if="libraryStore.isLoading && libraryStore.characters.length === 0"
        class="loading"
      >
        Загрузка персонажей...
      </div>

      <div v-else-if="libraryStore.characters.length === 0" class="empty-state">
        Нет созданных персонажей. Создайте первого персонажа!
      </div>

      <div v-else class="characters-grid">
        <div
          v-for="character in libraryStore.characters"
          :key="character.id"
          class="card character-card"
        >
          <div class="character-info">
            <h4>{{ character.name }}</h4>
            <div class="stats">
              <span class="stat">❤️ {{ character.health }}</span>
              <span class="stat">💨 {{ character.fatigue }}</span>
            </div>
            <div class="rings">
              <span class="ring">В{{ character.water }}</span>
              <span class="ring">З{{ character.earth }}</span>
              <span class="ring">О{{ character.fire }}</span>
              <span class="ring">В{{ character.air }}</span>
              <span class="ring">П{{ character.void }}</span>
            </div>
          </div>

          <div class="character-actions">
            <button
              :disabled="!socketStore.isConnected || !socketStore.sessionId"
              class="add-button"
              @click="addToBattle(character.id!)"
            >
              Добавить в бой
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="create-form">
      <header class="add-character-form__header" @click="toggleSection">
        <h3>Создать нового персонажа</h3>
        <img
          :class="{ 'add-character-form__header-icon_opened': isSectionOpened }"
          class="add-character-form__header-icon"
          src="../assets/svg/chevron.svg"
          alt=""
        />
      </header>

      <form v-show="isSectionOpened" @submit.prevent="createCharacter">
        <input v-model="newCharacter.name" placeholder="Имя" required />
        <input
          v-model.number="newCharacter.health"
          type="number"
          placeholder="Здоровье"
          required
        />
        <input
          v-model.number="newCharacter.fatigue"
          type="number"
          placeholder="Усталость"
          required
        />
        <input
          v-model.number="newCharacter.water"
          type="number"
          placeholder="Вода"
          required
        />
        <input
          v-model.number="newCharacter.earth"
          type="number"
          placeholder="Земля"
          required
        />
        <input
          v-model.number="newCharacter.fire"
          type="number"
          placeholder="Огонь"
          required
        />
        <input
          v-model.number="newCharacter.air"
          type="number"
          placeholder="Воздух"
          required
        />
        <input
          v-model.number="newCharacter.void"
          type="number"
          placeholder="Пустота"
          required
        />

        <div class="form-actions">
          <button type="submit" :disabled="libraryStore.isLoading">
            {{ libraryStore.isLoading ? "Создание..." : "Создать" }}
          </button>
          <button type="button" @click="resetForm">
            Сбросить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import CharacterCard from "@/components/Character.vue";
import { useLibraryStore } from "@/stores/library";
import { useSocketStore } from "@/stores/socket";

import type { Character } from "@/types";

const libraryStore = useLibraryStore();
const socketStore = useSocketStore();

const newCharacter = ref<Partial<Character>>({
  name: "",
  health: 10,
  fatigue: 10,
  water: 2,
  earth: 2,
  fire: 2,
  air: 2,
  void: 2
});

const isSectionOpened = ref<boolean>(false);

const characters = ref([
  {
    id: 1,
    name: "Цукико",
    stress: 4,
    maxStress: 12,
    initiative: 18,
    stance: "water",
    conditions: ["unmasked", "turn-ended", "counterattack-spent", "unconcious", "burning", "heavy wound: Fire"]
  },
  {
    id: 2,
    name: "Кенширо",
    stress: 8,
    maxStress: 10,
    initiative: 15,
    stance: "fire",
    conditions: ["turn-ended", "burning"]
  }
]);

const changeStance = characterId => {
  const character = characters.value.find(c => c.id === characterId);

  if (!character) return;

  const stances = ["water", "fire", "air", "earth", "void"];
  const currentIndex = stances.indexOf(character.stance);
  const nextIndex = (currentIndex + 1) % stances.length;

  character.stance = stances[nextIndex];
};

onMounted(() => {
  refreshCharacters();
});

const refreshCharacters = () => {
  libraryStore.loadCharacters();
};

const toggleSection = () => {
  isSectionOpened.value = !isSectionOpened.value;
};

const createCharacter = () => {
  if (!newCharacter.value.name) {
    libraryStore.setError("Имя персонажа обязательно");

    return;
  }

  libraryStore.createCharacter(newCharacter.value);
  resetForm();
};

const resetForm = () => {
  newCharacter.value = {
    name: "",
    health: 10,
    fatigue: 10,
    water: 2,
    earth: 2,
    fire: 2,
    air: 2,
    void: 2
  };
};

const addToBattle = (characterId: string) => {
  socketStore.addCharacterToBattle(characterId);
};
</script>

<style scoped>
.character-library {
  margin: 20px 0;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.create-form {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.create-form h3 {
  margin-block: 0;
}

.create-form input {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 8px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  margin-top: 15px;
}

.form-actions button {
  margin-right: 10px;
  padding: 8px 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.list-header h3 {
  margin: 0;
}

.loading,
.empty-state {
  text-align: center;
  padding: 30px;
  color: #757575;
}

.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.character-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.character-info h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.stats {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.stat {
  font-size: 14px;
}

.rings {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.ring {
  font-size: 12px;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
}

.character-actions {
  margin-top: 15px;
}

.add-button {
  width: 100%;
  padding: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.add-character-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-character-form__header-icon {
  color: red;
  transition: transform 0.5s ease;
  transform: rotate(90deg);
  display: block;
  height: 22px;
  width: 22px;
}

.add-character-form__header-icon_opened {
  transform: rotate(-450deg);
}
</style>
