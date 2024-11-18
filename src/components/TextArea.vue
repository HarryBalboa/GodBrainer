<script setup lang="ts">
const modelValue = defineModel<string>();
</script>

<template>
  <textarea
      v-model="modelValue"
      class="w-full p-1 bg-sky-300/30 rounded focus:outline-none"
  />
</template>

<style scoped>

</style>