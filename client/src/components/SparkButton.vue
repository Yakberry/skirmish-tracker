<template>
  <button
    class="spark-btn"
    :class="{ animating: isAnimating }"
    @mousedown="startAnimation"
    @touchstart="startAnimation"
    @mouseup="handleRelease"
    @touchend="handleRelease"
    @mouseleave="handleRelease"
  >
    <span class="spark-center"></span>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "SparkButton",
  data() {
    return {
      isAnimating: false,
      animationTimeout: null
    };
  },

  beforeUnmount() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  },
  methods: {
    startAnimation(event) {
      // if (event.type === "touchstart") event.preventDefault();

      // Останавливаем предыдущую анимацию если она есть
      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
        this.isAnimating = false;

        // Даём время для сброса анимации
        setTimeout(() => {
          this.startNewAnimation();
        }, 50);
      } else {
        this.startNewAnimation();
      }
    },

    startNewAnimation() {
      this.isAnimating = true;

      // Автоматически останавливаем анимацию через 2.1 секунды
      this.animationTimeout = setTimeout(() => {
        this.isAnimating = false;
        this.animationTimeout = null;
      }, 2100);
    },

    handleRelease() {
      // Не останавливаем анимацию сразу, ждём её завершения
    }
  }
};
</script>

<style scoped>
.spark-btn {
  position: relative;
  background: linear-gradient(145deg, #2a2a2a, #1f1f1f);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 20px 40px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  overflow: visible; /* Важно для выхода искр за границы */
  transition: all 0.4s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.spark-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  background: linear-gradient(145deg, #333, #252525);
}

.spark-btn:active {
  transform: translateY(1px);
}

.spark-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

/* Базовые стили для всех искр */
.spark-btn::before,
.spark-btn::after,
.spark-center::before,
.spark-center::after {
  content: "";
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 2; /* Важно: одинаковый z-index для всех искр */
}

/* Позиционирование каждой искры - ОБРАТИТЕ ВНИМАНИЕ НА ИСПРАВЛЕНИЯ */
.spark-btn::before {
  top: 50%;
  left: 50%;
  background: radial-gradient(circle, #ff8c00, #ff5500);
}

.spark-btn::after {
  top: 50%;
  left: 50%;
  background: radial-gradient(circle, #ff5500, #ff3300);
}

.spark-center::before {
  top: 50%;
  left: 50%;
  background: radial-gradient(circle, #ff7700, #ff4400);
}

.spark-center::after {
  top: 50%;
  left: 50%;
  background: radial-gradient(circle, #ff9900, #ff6600);
}

/* Анимации при активации - УБЕДИТЕСЬ, ЧТО ВСЕ АНИМАЦИИ ПРИМЕНЯЮТСЯ */
.spark-btn.animating .spark-center {
  animation: center-glow 2s ease-out forwards;
}

.spark-btn.animating::before {
  animation: spark-1 2s ease-out forwards;
}

.spark-btn.animating::after {
  animation: spark-2 2s ease-out 0.3s forwards;
}

.spark-btn.animating .spark-center::before {
  animation: spark-3 2s ease-out 0.6s forwards;
}

.spark-btn.animating .spark-center::after {
  animation: spark-4 2s ease-out 0.9s forwards;
}

/* Ключевые кадры анимации для всех искр */
@keyframes center-glow {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 100, 0, 0);
  }
  20% {
    box-shadow: 0 0 30px 15px rgba(255, 100, 0, 0.6),
      0 0 60px 30px rgba(255, 60, 0, 0.4), 0 0 100px 50px rgba(255, 40, 0, 0.2);
  }
  60% {
    box-shadow: 0 0 20px 10px rgba(255, 100, 0, 0.4),
      0 0 40px 20px rgba(255, 60, 0, 0.3), 0 0 70px 35px rgba(255, 40, 0, 0.15);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 100, 0, 0);
  }
}

@keyframes spark-1 {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    box-shadow: 0 0 20px 8px rgba(255, 140, 0, 0.9),
      0 0 40px 16px rgba(255, 85, 0, 0.6);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 15px 6px rgba(255, 140, 0, 0.8),
      0 0 30px 12px rgba(255, 85, 0, 0.5);
  }
  100% {
    top: 20%;
    left: 20%;
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0;
    box-shadow: 0 0 5px 2px rgba(255, 140, 0, 0.3),
      0 0 10px 4px rgba(255, 85, 0, 0.2);
  }
}

@keyframes spark-2 {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    box-shadow: 0 0 20px 8px rgba(255, 85, 0, 0.9),
      0 0 40px 16px rgba(255, 51, 0, 0.6);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 15px 6px rgba(255, 85, 0, 0.8),
      0 0 30px 12px rgba(255, 51, 0, 0.5);
  }
  100% {
    top: 80%;
    left: 80%;
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0;
    box-shadow: 0 0 5px 2px rgba(255, 85, 0, 0.3),
      0 0 10px 4px rgba(255, 51, 0, 0.2);
  }
}

@keyframes spark-3 {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    box-shadow: 0 0 20px 8px rgba(255, 119, 0, 0.9),
      0 0 40px 16px rgba(255, 68, 0, 0.6);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 15px 6px rgba(255, 119, 0, 0.8),
      0 0 30px 12px rgba(255, 68, 0, 0.5);
  }
  100% {
    top: 20%;
    left: 80%;
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0;
    box-shadow: 0 0 5px 2px rgba(255, 119, 0, 0.3),
      0 0 10px 4px rgba(255, 68, 0, 0.2);
  }
}

@keyframes spark-4 {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    box-shadow: 0 0 20px 8px rgba(255, 153, 0, 0.9),
      0 0 40px 16px rgba(255, 102, 0, 0.6);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 15px 6px rgba(255, 153, 0, 0.8),
      0 0 30px 12px rgba(255, 102, 0, 0.5);
  }
  100% {
    top: 80%;
    left: 20%;
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0;
    box-shadow: 0 0 5px 2px rgba(255, 153, 0, 0.3),
      0 0 10px 4px rgba(255, 102, 0, 0.2);
  }
}
</style>
