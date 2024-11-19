<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useDatabase} from "../stores/database.ts";
import Select from "../components/Select.vue";
import TextField from "../components/TextField.vue";
import Button from "../components/Button.vue";

const broadcastChannel = ref();
const database = useDatabase();
const games = ref<(TGame & TDBEntry)[]>([]);
const selectedGame = ref("");
const curGame = ref<(TGame & TDBEntry)>();
const curQuestion = ref<TQuestion & TDBEntry>();

function selectGame(){
  const game = games.value.find(g => g.name === selectedGame.value);
  if(!game) return;
  curGame.value = game;
}

function connectToBroadcastChannel(){
  broadcastChannel.value = new BroadcastChannel("GodBrainer");
  broadcastChannel.value.onmessage =(ev: MessageEvent) =>{
    const msg = JSON.parse(ev.data) as TMessage
    if(msg.sender === "player"){
      if(msg.command === "selectQuestion"){
        curQuestion.value = msg.data;
      }
    }
  }
}

function sendMessage(msg: TMessage){
  broadcastChannel.value.postMessage(JSON.stringify(msg));
}

function startGame(){
  sendMessage({
    sender: "master",
    command: "updateGame",
    data: curGame.value
  })
}

function closeQuestion(){
  if(!curGame.value || !curQuestion.value) return;
  curGame.value.questionData[curQuestion.value.id] = true;
  curQuestion.value = undefined;
  sendMessage({
    sender: "master",
    command: "closeQuestion",
    data: null
  })
}

function resetGame(){
  Object.keys(curGame.value!.questionData).forEach((q) => {
    curGame.value!.questionData[parseInt(q)] = false;
  })
}

watch(curGame, async () =>{
  if(curGame){
    try{
      sendMessage({
        sender: "master",
        command: "updateGame",
        data: curGame.value
      });
      const game = JSON.parse(JSON.stringify(curGame.value))
      await database.updateGame(game)
    }catch(err){
      console.error(err);
    }
  }
}, {deep: true});

onMounted(async () =>{
  try{
    connectToBroadcastChannel();
    games.value = await database.getGames();
  }catch(err){
    console.error(err);
  }
})
</script>

<template>
  <div class="h-full w-full">
    <div class="flex gap-2 items-center">
      <Select class="w-48" placeholder="Select Game" v-model="selectedGame" :items="games.map(g => g.name)" @change="selectGame"></Select>
      <RouterLink target="_blank" to="/" class="hover:bg-white/20 flex items-center justify-center rounded-full h-8 w-8 cursor-pointer">
        <v-icon name="fa-external-link-alt"></v-icon>
      </RouterLink>
      <div class="hover:bg-white/20 flex items-center justify-center rounded-full h-8 w-8 cursor-pointer" @click="resetGame">
        <v-icon name="fa-undo-alt"></v-icon>
      </div>
      <div v-if="curGame" class="hover:bg-white/20 flex items-center justify-center rounded-full h-8 w-8 cursor-pointer" @click="startGame">
        <v-icon name="fa-play"></v-icon>
      </div>
    </div>
    <div v-if="curGame" class="flex gap-2">
      <div>
        <div>
          Players
        </div>
        <div v-for="player in curGame.players" :key="player.id">
          <div>
            <text-field type="number" v-model="curGame.playerData[player.id].score"></text-field>
          </div>
          <div class="flex gap-2">
            <div class="cursor-pointer" >
              -
            </div>
            <div>
              {{player.name}}
            </div>
            <div class="cursor-pointer">
              +
            </div>
          </div>

        </div>
      </div>
      <div>
        <div>
          Current Question
        </div>
        <div v-if="curQuestion">
          <div>{{ curQuestion.name }}</div>
          <div>{{ curQuestion?.gameMasterInfo }}</div>
          <div>{{ curQuestion?.playerInfo }}</div>
          <div>{{ curQuestion?.points }} / {{ curQuestion?.penalty }}</div>
          <Button @click="closeQuestion"></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>