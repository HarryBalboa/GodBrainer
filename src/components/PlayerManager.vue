<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useDatabase} from "../stores/database.ts";
import TextField from "./TextField.vue";
import Button from "./Button.vue";
import ImageInput from "./ImageInput.vue";

const database = useDatabase();
const players = ref<(TPlayer & TDBEntry)[]>([]);
const curPlayer = ref<TPlayer | (TPlayer & TDBEntry)>({
  name: "",
  profilePicture: undefined
});
const isEditMode = ref(false);

function resetPlayer(){
  curPlayer.value = {
    name: "",
    profilePicture: undefined
  }
}

async function createNewPlayer(){
  try{
    const player = JSON.parse(JSON.stringify(curPlayer.value));
    await database.addPlayer(player);
    players.value = await database.getPlayers();
    resetPlayer();
  }catch(err){
    console.error(err);
  }
}

async function removePlayer(playerId : number){
  try{
    await database.removePlayer( playerId);
    const index = players.value.findIndex(player => player.id === playerId);
    if(index > -1) players.value.splice(index, 1);
  }catch(err){
    console.error(err);
  }

}

function editPlayer(player : TPlayer & TDBEntry){
  isEditMode.value = true;
  curPlayer.value = player;
}

async function updatePlayer(){
  try{
    const player = JSON.parse(JSON.stringify(curPlayer.value));
    await database.updatePlayer(player);
    resetPlayer();
    isEditMode.value = false;
  }catch(err){
    console.error(err);
  }
}

async function clearDatabase(){
  try{
    for (const player of players.value) {
      await database.removePlayer(player.id);
      players.value = await database.getPlayers();
    }
  }catch(err){
    console.error(err);
  }
}

onMounted(async () =>{
  try{
    players.value = await database.getPlayers();
  } catch(err){
    console.error(err);
  }
})
</script>

<template>
  <div class="flex gap-2">
    <div class="w-full">
      <div class="mt-2">
        Player name
      </div>
      <div>
        <TextField v-model="curPlayer.name"></TextField>
      </div>
      <div class="mt-2">
        Profile picture
      </div>
      <div>
        <ImageInput v-model="curPlayer.profilePicture"></ImageInput>
      </div>
      <Button v-if="isEditMode" class="mt-4" @click="updatePlayer"> Update Player </Button>
      <Button v-else class="mt-4" @click="createNewPlayer"> Create Player </Button>
    </div>
    <div class="w-full bg-white/10 mt-2 p-2">
      <div class="flex justify-between items-center border-b mb-2">
        <div class="flex">
          Player
        </div>
        <div @click="clearDatabase()" class="cursor-pointer">
          <span> Clear all </span>
          <v-icon name="fa-trash-alt"></v-icon>
        </div>
      </div>
      <div
          v-for="player in players"
          :key="player.name"
          class="flex justify-between items-center"
      >
        <div class="flex gap-2 items-center">
          <img v-if="player.profilePicture"  :src="player.profilePicture" alt="" class="h-4 w-4 rounded-full">
          <div>{{ player.name }}</div>
        </div>
        <div class="flex gap-2">
          <div @click="editPlayer(player)" class="cursor-pointer">
            <v-icon name="fa-edit"></v-icon>
          </div>
          <div @click="removePlayer(player.id)" class="cursor-pointer">
            <v-icon name="fa-trash-alt"></v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>