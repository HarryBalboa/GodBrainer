<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useDatabase} from "../stores/database.ts";

const router = useRouter();


const broadcastChannel = ref();

function connectToBroadcastChannel(){
  broadcastChannel.value = new BroadcastChannel("BrainBrawl");
  broadcastChannel.value.onmessage = (ev) =>{
    console.log(ev)
  };
}

function sendMessage(msg){
  const msgObj = {
    sender: "manager",
    message: msg
  }

  broadcastChannel.value.postMessage(JSON.stringify(msgObj));
}


const database = useDatabase();

async function getPlayers(){
  const players = await database.getPlayers();
  console.log(players);
}

onMounted(() =>{
  connectToBroadcastChannel();
})
</script>

<template>
<div>
  <RouterLink target="_blank" :to="{path: '/GodBrainer/game-master-view', query:{data: 'test'}}">open</RouterLink>
  <button @click="sendMessage('yay')"> send</button>
  <button @click="getPlayers">get</button>
</div>
</template>

<style scoped>

</style>