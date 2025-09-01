<template>
  <div class="circular-button-container">
    <button
      ref="mainButtonRef"
      class="main-button"
      @click="toggleMenu"
      @touchstart="toggleMenu"
    >
      <slot></slot>
    </button>

    <transition name="fade">
      <div
        v-if="isOpen"
        class="circle-backdrop"
        @click="closeMenu"
        @touchstart="handleBackdropTouch"
      >
        <div ref="menuRef" class="circle-menu" :style="circleStyle">
          <div
            v-for="(option, index) in options"
            :key="index"
            class="sector"
            :class="option.bgClass"
            :style="getSectorStyle(index)"
            @click="handleSectorClick(option)"
            @touchstart="handleSectorTouch(option, $event)"
          >
            <div class="sector-content" :style="getContentStyle(index)">
              <i v-if="option.icon" :class="option.icon"></i>
              <span v-if="option.text" class="sector-text">{{
                option.text
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

export default {
  name: "CircularButton",
  props: {
    options: {
      type: Array,
      required: true,
      validator: value => {
        return value.every(
          option =>
            typeof option.action === "function" &&
            (option.icon ? typeof option.icon === "string" : true) &&
            (option.text ? typeof option.text === "string" : true) &&
            (option.bgClass ? typeof option.bgClass === "string" : true)
        );
      }
    },
    radius: {
      type: Number,
      default: 160
    }
  },
  setup(props) {
    const isOpen = ref(false);
    const mainButtonRef = ref(null);
    const menuRef = ref(null);

    const circleStyle = computed(() => ({
      width: `${props.radius * 2}px`,
      height: `${props.radius * 2}px`
    }));

    const toggleMenu = () => {
      isOpen.value = !isOpen.value;

      if (isOpen.value) {
        nextTick(() => {
          positionMenu();
        });
      }
    };

    const closeMenu = () => {
      isOpen.value = false;
    };

    const handleSectorClick = option => {
      option.action();
      closeMenu();
    };

    const handleSectorTouch = (option, event) => {
      event.stopPropagation();
      option.action();
      closeMenu();
    };

    const handleBackdropTouch = event => {
      event.stopPropagation();
      closeMenu();
    };

    const getSectorStyle = index => {
      const total = props.options.length;
      const anglePerSector = 360 / total;
      const startAngle = index * anglePerSector;

      return {
        transform: `rotate(${startAngle}deg)`,
        overflow: "hidden"
      };
    };

    const getContentStyle = index => {
      const total = props.options.length;
      const anglePerSector = 360 / total;
      const contentAngle = -anglePerSector * index;

      return {
        transform: `rotate(${contentAngle}deg)`
      };
    };

    const positionMenu = () => {
      if (!menuRef.value || !mainButtonRef.value) return;

      const buttonRect = mainButtonRef.value.getBoundingClientRect();
      const menuSize = props.radius * 2;

      // Центрируем меню относительно кнопки
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;

      // Проверяем, чтобы меню не выходило за границы экрана
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = centerX - props.radius;
      let top = centerY - props.radius;

      // Корректируем позицию, если меню выходит за границы
      const padding = 20;

      if (left < padding) left = padding;
      if (top < padding) top = padding;
      if (left + menuSize > viewportWidth)
        left = viewportWidth - menuSize - padding;
      if (top + menuSize > viewportHeight)
        top = viewportHeight - menuSize - padding;

      menuRef.value.style.left = `${left}px`;
      menuRef.value.style.top = `${top}px`;
    };

    const handleResize = () => {
      if (isOpen.value) {
        positionMenu();
      }
    };

    onMounted(() => {
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    });

    return {
      isOpen,
      mainButtonRef,
      menuRef,
      circleStyle,
      toggleMenu,
      closeMenu,
      handleSectorClick,
      handleSectorTouch,
      handleBackdropTouch,
      getSectorStyle,
      getContentStyle
    };
  }
};
</script>

<style scoped>
.circular-button-container {
  position: relative;
  display: inline-block;
}

.main-button {
  position: relative;
  z-index: 10;
  padding: 16px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: transform 0.2s ease;
}

.main-button:active {
  transform: scale(0.95);
}

.circle-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.circle-menu {
  position: fixed;
  border-radius: 50%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 101;
  transform-origin: center;
}

.sector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
  cursor: pointer;
  transition: all 0.2s ease;
  clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%);
}

.sector:hover {
  filter: brightness(1.15);
}

.sector:active {
  filter: brightness(0.9);
}

.sector-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  width: 60px;
  margin-left: -30px;
  margin-top: -30px;
}

.sector-content i {
  font-size: 20px;
  margin-bottom: 4px;
}

.sector-text {
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
  line-height: 1.1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Цветовые классы по умолчанию */
.bg-red {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.bg-blue {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.bg-green {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.bg-yellow {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.bg-purple {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.bg-orange {
  background: linear-gradient(135deg, #e67e22, #d35400);
}

/* Анимация появления */
.sector {
  opacity: 0;
  transform: rotate(var(--start-angle)) scale(0.8);
  transition: all 0.3s ease;
}

.circle-menu .sector {
  opacity: 1;
  transform: rotate(var(--start-angle)) scale(1);
}

.sector-content {
  opacity: 0;
  transform: rotate(var(--content-angle)) scale(0.8);
  transition: all 0.3s ease 0.1s;
}

.circle-menu .sector-content {
  opacity: 1;
  transform: rotate(var(--content-angle)) scale(1);
}
</style>
