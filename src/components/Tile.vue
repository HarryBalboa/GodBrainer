<script setup lang="ts">
defineProps({
  icon: String,
  text: String,
});
</script>

<template>
  <div
      class="flex justify-center aspect-square rounded-lg bg-pink-500/70 text-white h-[200px] hover:bg-pink-400 transition-all hover:scale-105 cursor-pointer"
  >
    <div class="flex flex-col justify-center items-center">
        <v-icon :name="icon" scale="6"></v-icon>
      <div class="text-3xl">{{ text }}</div>
    </div>
  </div>
</template>

<style scoped>

</style>