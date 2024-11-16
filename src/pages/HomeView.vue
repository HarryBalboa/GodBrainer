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
  <div class="flex w-full h-full items-center justify-center">
    <Tile text="Game" icon="fa-gamepad"></Tile>
  </div>
</template>

<style scoped>

</style>