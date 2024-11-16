<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useDatabase} from "./stores/database.ts";

const isReady = ref(false)

onMounted(async () =>{
  try{
    useDatabase().database = await useDatabase().setupDB();
    isReady.value = true;
  } catch(err){
    console.error(err)
  }
})
</script>

<template>
  <div>
    <div class="flex gap-4">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/game-view">Game</RouterLink>
      <RouterLink to="/game-master-view">master</RouterLink>
      <RouterLink to="/management-view">management</RouterLink>
    </div>
    <div v-if="isReady">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped>

</style>
