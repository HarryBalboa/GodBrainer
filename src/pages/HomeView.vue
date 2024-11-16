<script setup lang="ts">


import {useDatabase} from "../stores/database.ts";
import Tile from "../components/Tile.vue";
const database = useDatabase();

async function getPlayers(){
  const players = await database.getPlayers();
  console.log(players);
}



</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="flex-col gap-4 w-[800px] flex items-center justify-center p-4 bg-sky-700/60 rounded-lg">
      <div class="text-center mb-8 text-2xl w-[600px]">
        <p>
          Welcome to the amazing, the incredible, the magnificent battle through the realms of knowledge and wisdom.
        </p>
        <p class="text-5xl font-black flex items-center justify-center gap-2">
<!--          <v-icon name="gi-brain" scale="4"></v-icon>-->
          Welcome to the GodBrainer!!
        </p>
      </div>
      <div class="flex gap-4 justify-center">
        <RouterLink to="/game-view">
          <Tile text="Game view" icon="fa-gamepad"></Tile>
        </RouterLink>
        <RouterLink to="/game-master-view">
          <Tile text="Quiz master" icon="fa-user-tie"></Tile>
        </RouterLink>
        <RouterLink to="/management-view">
          <Tile text="Game creator" icon="fa-edit"></Tile>
        </RouterLink>
      </div>
      <div class="text-center mt-8">

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>