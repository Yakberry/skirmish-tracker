<template>
  <div class="stance-choose__container">
    <button ref="mainButton" @click="openChooseStance">
      <slot></slot>
    </button>
    <transition name="fade">
      <div
        v-if="isStanceChoosing"
        class="stance-choose__backdrop"
        @click="closeChooseStance"
      >
        <div ref="donut" class="stance-choose__donut-container">
          <vc-donut
            class="stance-choose__donut"
            size="160"
            unit="px"
            background="transparent"
            :thickness="40"
            :sections="sections"
            :total="100"
            :start-angle="0"
            auto-adjust-text-size
            :style="donutStyle"
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
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref
} from "vue";
import { VcDonut } from "vue-css-donut-chart";

export default defineComponent({
  name: "StanceChooseButton",
  components: { VcDonut },
  props: {
    size: {
      type: Number,
      default: 160
    }
  },
  emits: ["changeStance"],
  setup: (props, { emit }) => {
    const isStanceChoosing = ref(false);
    const mainButton = ref(null);
    const donut = ref(null);
    const donutStyle = ref<String>("");

    const sections = [
      { label: "fire", value: 20, color: "darkgoldenrod" },
      { label: "air", value: 20, color: "lightgray" },
      { label: "void", value: 20, color: "darkslategray" },
      { label: "water", value: 20, color: "violet" },
      { label: "earth", value: 20, color: "darkgreen" }
    ];

    const optionClick = (section, event) => {
      console.log("option click", section.label);
      emit("changeStance", section.label);
    };
    const openChooseStance = () => {
      isStanceChoosing.value = !isStanceChoosing.value;
      if (isStanceChoosing.value) {
        nextTick(() => {
          positionMenu();
        });
      }
    };

    const closeChooseStance = () => {
      isStanceChoosing.value = false;
    };

    onMounted(() => {
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    });

    const handleResize = () => {
      if (isStanceChoosing.value) {
        positionMenu();
      }
    };

    const positionMenu = () => {
      if (!donut.value || !mainButton.value) return;

      const buttonRect = mainButton.value.getBoundingClientRect();
      const menuSize = props.size;

      // Центрируем меню относительно кнопки
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;

      // Проверяем, чтобы меню не выходило за границы экрана
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = centerX - props.size / 2;
      let top = centerY - props.size / 2;

      // Корректируем позицию, если меню выходит за границы
      const padding = 20;

      if (left < padding) left = padding;
      if (top < padding) top = padding;
      if (left + menuSize > viewportWidth)
        left = viewportWidth - menuSize - padding;
      if (top + menuSize > viewportHeight)
        top = viewportHeight - menuSize - padding;

      donut.value.style.left = `${left}px`;
      donut.value.style.top = `${top}px`;
    };

    return {
      mainButton,
      donut,
      isStanceChoosing,
      sections,
      donutStyle,
      optionClick,
      closeChooseStance,
      openChooseStance
    };
  }
});
</script>

<style scoped>
.stance-choose__container {
  position: relative;
  display: inline-block;
}

.stance-choose__backdrop {
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

.sector-text {
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
  line-height: 1.1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.stance-choose__donut {
  position: fixed;
  border-radius: 50%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 101;
  transform-origin: center;
}

.stance-choose__donut-container {
  position: fixed;
}
</style>
