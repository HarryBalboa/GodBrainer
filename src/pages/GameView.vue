<script setup lang="ts">
import {useCounterStore} from "../stores/database.ts";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const store = useCounterStore();

console.log(store.count)

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

onMounted(() =>{
  connectToBroadcastChannel();
})
</script>

<template>
<div>
  <RouterLink target="_blank" :to="{path: '/GodBrainer/game-master-view', query:{data: 'test'}}">open</RouterLink>
  <button @click="sendMessage('yay')"> send</button>
</div>
</template>

<style scoped>

</style>