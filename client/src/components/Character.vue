<template>
  <div v-if="character" class="character__card scroll-effect" @click="openCharacterPage(character.name)">
    <StanceChooseButton class="stance-button" @change-stance="optionClick">
      <img
        id="stance-icon"
        class="character-stance__icon"
        :class="character.stance.toLowerCase()"
        :src="getImg"
        alt=""
      />
    </StanceChooseButton>

    <div class="character-info">
      <div class="character-name">
        {{ character.name }}
      </div>
      <div class="character-stress">
        Стресс: {{ character.strife }}/{{ character.maxStrife }}
      </div>
      <div class="character-initiative">
        Инициатива: {{ character.initiative }}
      </div>
    </div>

    <div class="small-conditions">
      <div
        v-for="condition in smallConditions"
        :key="condition"
        class="condition-small"
        :class="getConditionClass(condition)"
        :title="getConditionTitle(condition)"
      >
        <i :class="'fas fa-' + getConditionIcon(condition)"></i>
      </div>
    </div>

    <div class="large-conditions">
      <div
        v-for="condition in largeConditions"
        :key="condition"
        class="condition-large"
        :class="getConditionClass(condition)"
      >
        <i :class="'fas fa-' + getConditionIcon(condition)"></i> {{ getConditionLabel(condition) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from "vue";

import StanceChooseButton from "@/components/StanceChooseButton.vue";
import { useSocketStore } from "@/stores";
import { type CharacterData } from "@/types";

const props = defineProps({
  character: {
    type: Object as PropType<CharacterData>,
    required: true
  }
});

// const stanceIcon = ref<string>("Void");
const characterCurrent = ref<CharacterData>(props.character);

const socketStore = useSocketStore();
const emit = defineEmits(["update-character"]);

const getImg = computed(() => {
  return `/src/assets/image/${props.character?.stance}.png`;
});

// Получение иконки для текущей стойки
// const stanceIcon = computed(() => {
//   const icons = {
//     "water": "Water",
//     "fire": "fire",
//     "air": "wind",
//     "earth": "mountain",
//     "void": "circle"
//   };
//
//   return icons[props.character.stance] || "question";
// });

// Фильтрация маленьких состояний
const smallConditions = computed(() => {
  return props.character.conditions.filter(condition =>
    ["unmasked", "turn-ended", "counterattack-spent"].includes(condition)
  );
});

// Фильтрация больших состояний
const largeConditions = computed(() => {
  return props.character.conditions.filter(condition =>
    !["unmasked", "turn-ended", "counterattack-spent"].includes(condition)
  );
});

const optionClick = (stance: string, event) => {
  console.log("option click", stance);

  // stanceIcon.value = stance;
  characterCurrent.value.stance = stance.toLowerCase();
  updateCharacter();
};

const updateCharacter = () => {
  console.log("char upd", props.character);
  emit("update-character", characterCurrent.value);
};

// Получение класса для состояния
const getConditionClass = condition => {
  if (condition.includes("unconcious")) return "unconcious";
  if (condition.includes("burning")) return "burning";
  if (condition.includes("heavy wound")) return "heavy-wound";
  if (condition === "turn-ended") return "turn-ended";
  if (condition === "counterattack-spent") return "counterattack-spent";
  if (condition === "unmasked") return "unmasked";

  return "";
};

// Получение иконки для состояния
const getConditionIcon = condition => {
  if (condition.includes("unconcious")) return "bed";
  if (condition.includes("burning")) return "fire";
  if (condition.includes("heavy wound")) return "first-aid";
  if (condition === "turn-ended") return "flag-checkered";
  if (condition === "counterattack-spent") return "shield-alt";
  if (condition === "unmasked") return "theater-masks";

  return "exclamation-circle";
};

// Получение заголовка для состояния
const getConditionTitle = condition => {
  const titles = {
    "unmasked": "Маска снята",
    "turn-ended": "Ход завершён",
    "counterattack-spent": "Контратака потрачена",
    "unconcious": "Без сознания",
    "burning": "Горение",
    "heavy wound": "Тяжёлое ранение"
  };

  for (const [key, value] of Object.entries(titles)) {
    if (condition.includes(key)) return value;
  }

  return condition;
};

// Получение читаемого названия для состояния
const getConditionLabel = condition => {
  const labels = {
    "unmasked": "Маска снята",
    "turn-ended": "Ход завершён",
    "counterattack-spent": "Контратака потрачена",
    "unconcious": "Без сознания",
    "burning": "Горение"
  };

  for (const [key, value] of Object.entries(labels)) {
    if (condition.includes(key)) return value;
  }

  return condition;
};

const openCharacterPage = (characterName: string): void => {
  console.log("open character " + characterName);
  if (socketStore.isMaster || socketStore.playerName === characterName) {
    console.log("agreed to open!");
  }
};
</script>

<style scoped>
.character__card {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 15px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.7);
  border: 1px solid #756035;
  transition: transform 0.3s ease;
  height: 120px;
}

.character__card::before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 6px;
  pointer-events: none;
}

.character__card:hover {
  transform: translateY(-3px);
}

.stance-button {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  cursor: pointer;
  margin-right: 20px;
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.7);
}

.stance-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px currentColor;
}

.water { box-shadow: 0 0 20px blueviolet; }
.fire { box-shadow: 0 0 20px red; }
.air { box-shadow: 0 0 20px white; }
.earth { box-shadow: 0 0 20px brown; }
.void { box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); }

.character-info {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  min-width: 180px;
  flex-shrink: 0;
}

.character-name {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 5px;
  /*color: #d4af37;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);*/
  letter-spacing: 1px;
}

.character-stress, .character-initiative {
  font-size: 1.1rem;
  margin-bottom: 3px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.small-conditions {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  flex-shrink: 0;
}

.condition-small {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.large-conditions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  flex-grow: 1;
}

.condition-large {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.condition-large i {
  margin-right: 5px;
}

.unconcious { color: #e74c3c; }
.burning { color: #f39c12; }
.heavy-wound { color: #c0392b; }
.turn-ended { color: #7f8c8d; }
.counterattack-spent { color: #3498db; }
.unmasked { color: #9b59b6; }

.scroll-effect {
  position: relative;
  overflow: hidden;
}

.scroll-effect::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -50%;
  width: 30%;
  background: linear-gradient(90deg,
  transparent,
  rgba(255, 255, 255, 0.1),
  transparent);
  transform: skewX(-25deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.scroll-effect:hover::after {
  left: 120%;
  opacity: 1;
}

.character-stance__icon {
  width: 90px;
  border-radius: 50%;
}
</style>
