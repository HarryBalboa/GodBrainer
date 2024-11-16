<script setup lang="ts">


import {useDatabase} from "../stores/database.ts";
const database = useDatabase();

async function getPlayers(){
  const players = await database.getPlayers();
  console.log(players);
}



</script>

<template>
  <div>
    test
    <button @click="getPlayers">get</button>
  </div>
</template>

<style scoped>

</style>