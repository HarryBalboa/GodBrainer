<script setup lang="ts">
import {onMounted, ref} from "vue";

const broadcastChannel = ref();
function connectToBroadcastChannel(){
  broadcastChannel.value = new BroadcastChannel("BrainBrawl");
  broadcastChannel.value.onmessage =(ev) =>{
    console.log(ev)
  }
}

onMounted(async () =>{
  try{
    connectToBroadcastChannel();
  }catch(err){
    console.error(err);
  }

})
</script>

<template>
  Master
  <RouterLink target="_blank" to="/">Home</RouterLink>
</template>

<style scoped>

</style>