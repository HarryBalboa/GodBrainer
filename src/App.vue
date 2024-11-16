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
  <div class="font-brand text-white h-screen w-screen bg-gradient-to-t from-cyan-800 to-emerald-600">
    <div class="flex items-center gap-4 p-2 h-[48px] text-xl">
      <div class="flex items-center gap-1">
<!--        <img src="/favicon.png" alt="" class="w-8">-->

        <RouterLink class="hover:scale-105 hover:bg-white/20 rounded-full" to="/">
          <v-icon name="gi-brain" scale="2"></v-icon>
        </RouterLink>
      </div>
      <div class="flex items-center gap-2 h-8">

        <RouterLink class="hover:bg-white/20 hover:scale-105 p-2 rounded-b-lg" to="/game-view">Game</RouterLink>
        <RouterLink class="hover:bg-white/20 hover:scale-105 p-2 rounded-b-lg" to="/game-master-view">master</RouterLink>
        <RouterLink class="hover:bg-white/20 hover:scale-105 p-2 rounded-b-lg" to="/management-view">management</RouterLink>
      </div>
    </div>
    <div class="h-[calc(100%-48px)] px-4 pb-2" v-if="isReady">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped>

</style>
