<template>
  <div class="character__card scroll-effect">
    <div
      class="stance-button"
      :class="character.stance"
      @click="$emit('change-stance')"
    >
      <i :class="'fas fa-' + stanceIcon">{{ stanceIcon }}</i>
    </div>

    <div class="character-info">
      <div class="character-name">
        {{ character.name }}
      </div>
      <div class="character-stress">
        Стресс: {{ character.stress }}/{{ character.maxStress }}
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
import { computed } from "vue";

const props = defineProps({
  character: {
    type: Object,
    required: true,
    default: () => ({
      name: "",
      stress: 0,
      maxStress: 0,
      initiative: 0,
      stance: "water",
      conditions: []
    })
  }
});

defineEmits(["change-stance"]);

// Получение иконки для текущей стойки
const stanceIcon = computed(() => {
  const icons = {
    "water": "tint",
    "fire": "fire",
    "air": "wind",
    "earth": "mountain",
    "void": "circle"
  };

  return icons[props.character.stance] || "question";
});

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

.water { background: #3498db; }
.fire { background: #e74c3c; }
.air { background: #f1c40f; }
.earth { background: #2ecc71; }
.void { background: #9b59b6; }

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
  color: #d4af37;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
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
</style>
