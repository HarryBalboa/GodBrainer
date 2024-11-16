<script setup lang="ts">

</script>

<template>
  <div>
    <div class="flex gap-4">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/game-view">Game</RouterLink>
      <RouterLink to="/game-master-view">master</RouterLink>
      <RouterLink to="/management-view">management</RouterLink>
    </div>
    <div>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped>

</style>
