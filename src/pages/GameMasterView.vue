<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
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
  if(game.type === "basic"){
    if(!game.currentQuestion) game.currentQuestion = 0;
    curQuestion.value = game.questions![game.currentQuestion];
  }
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

  if(curGame.value.type === 'jeopardy'){
    curGame.value.questionData[curQuestion.value.id] = true;
    curQuestion.value = undefined;
    sendMessage({
      sender: "master",
      command: "closeQuestion",
      data: null
    })
  } else if(curGame.value.type === "basic"){
    if(curGame.value.currentQuestion! + 1 >= curGame.value.questions!.length) return;
    curQuestion.value = curGame.value.questions![curGame.value.currentQuestion! + 1]
    curGame.value.currentQuestion! ++;
  }

}

function cancelQuestion(){
  if(!curGame.value || !curQuestion.value) return;
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
  curGame.value!.multiplier = 1;
  if(curGame.value!.type === "basic"){
    curGame.value!.currentQuestion = 0;
    curQuestion.value = curGame.value!.questions![curGame.value!.currentQuestion!]
  }
}

function removeFromScore(playerId : number){
  if(!curQuestion.value) return;
  curGame.value!.playerData[playerId].score -= curQuestion.value.penalty * curGame.value!.multiplier;
}

function addToScore(playerId: number){
  if(!curQuestion.value) return;
  curGame.value!.playerData[playerId].score += curQuestion.value.points * curGame.value!.multiplier;
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

onUnmounted( async () =>{
  sendMessage({
    sender: "master",
    command: "updateGame",
    data: undefined
  });
  sendMessage({
    sender: "master",
    command: "closeQuestion",
    data: undefined
  });
})

</script>

<template>
  <div class="h-full w-full">
    <div class="flex gap-2 items-center h-[40px]">
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
    <div v-if="curGame" class="flex gap-2 h-[calc(100%-48px)]">
      <div class="bg-white/20 p-2 rounded-lg mt-2 h-full">
        <div class="text-2xl">
          Scores
        </div>
        <div>
          Multiplier
        </div>
        <div>
          <text-field v-model="curGame.multiplier" type="number"></text-field>
        </div>
        <div v-for="player in curGame.players" :key="player.id" class="mb-2">
          <div class="flex gap-2 ">
            {{player.name}}
          </div>
          <div class="flex gap-2">
            <div class="cursor-pointer w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center" @click="removeFromScore(player.id)">
              <v-icon name="fa-thumbs-down"></v-icon>
            </div>
            <div class="flex gap-1">
              <img :src="player.profilePicture" alt="" class="h-8 w-8 rounded-lg">
              <text-field class="w-24" type="number" v-model="curGame.playerData[player.id].score"></text-field>
            </div>

            <div class="cursor-pointer w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center" @click="addToScore(player.id)">
              <v-icon name="fa-thumbs-up"></v-icon>
            </div>
          </div>

        </div>
      </div>
      <div class="bg-white/20 p-2 rounded-lg mt-2 h-full">
        <div class="text-2xl">
          Current Question {{ curGame.type === "basic" ? `${curGame.currentQuestion! + 1}/${curGame.questions!.length}`: ''}}
        </div>
        <div v-if="curQuestion">
          <div>{{ curQuestion.name }} ({{ curQuestion?.points }} / {{ curQuestion?.penalty }})</div>
          <div class="border-b"></div>
          <div>{{ curQuestion?.gameMasterInfo }}</div>
          <div class="border-b"></div>
          <div v-if="curQuestion.type === 'text'" class="p-2 h-[200px]">
            {{ curQuestion.text }}
          </div>
          <div v-if="curQuestion.type === 'audio'" class="p-2 h-[200px]">
            <audio controls :src="curQuestion.file" />
          </div>
          <div v-if="['img', 'zoom'].includes(curQuestion.type)" class="p-2">
            <img :src="curQuestion.file" alt="" class="h-[200px]">
          </div>
          <div v-if="curQuestion.type === 'video'" class="p-2">
            <video controls class="h-[200px]">
              <source :src="curQuestion.file">
            </video>
          </div>
          <div class="flex gap-2">
            <Button v-if="curGame.type === 'jeopardy'" @click="cancelQuestion">Cancel</Button>
            <Button @click="closeQuestion">Complete</Button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>