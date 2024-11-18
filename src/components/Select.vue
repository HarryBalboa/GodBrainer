<script setup lang="ts">
import { ref, watch } from 'vue';
defineProps<{
  items: string[];
}>();

const modelValue = defineModel<string>('modelValue');
const isActive = ref(false);
const element = ref<HTMLElement>();
function checkClick(ev : Event) {
  if (!element.value) return;
  if (!element.value.contains(ev.target as HTMLElement)) {
    isActive.value = false;
  }
}

watch(isActive, (val) => {
  if (val) window.addEventListener('click', checkClick);
  else window.removeEventListener('click', checkClick);
});

function handleSelect(value : string) {
  modelValue.value = value;
  isActive.value = false;
}
</script>

<template>
  <div class="relative" ref="element">
    <div
        @click="isActive = true"
        class="w-full p-1 bg-cyan-500/30 rounded flex justify-between items-center cursor-pointer"
    >
      {{ modelValue }} <v-icon name="fa-chevron-down" />
    </div>
    <div v-if="isActive" class="absolute bg-cyan-500 rounded w-full top-9 z-10">
      <div
          v-for="item in items"
          :key="item"
          @click="handleSelect(item)"
          class="p-1 hover:bg-cyan-400 cursor-pointer"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>