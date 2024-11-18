<script setup lang="ts">
const modelValue = defineModel<string>('modelValue');
defineProps<{
  type?: string
}>();
</script>

<template>
  <input
      v-model="modelValue"
      :type="type || 'text'"
      class="w-full p-1 bg-sky-300/30 rounded focus:outline-none"
  />
</template>

<style scoped>

</style>