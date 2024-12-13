<script setup lang="ts">
import {onMounted, ref, computed} from "vue";

import BasicImage from "../components/BasicImage.vue";
import ZoomImage from "../components/ZoomImage.vue";
import AudioPlayer from "../components/AudioPlayer.vue";
import VideoPlayer from "../components/VideoPlayer.vue";
import BasicQuestion from "../components/BasicQuestion.vue";

const broadcastChannel = ref();
const curGame = ref<TGame & TDBEntry>();
const currentQuestion = ref<TQuestion & TDBEntry>();
const componentMapping = {
  img: BasicImage,
  zoom: ZoomImage,
  audio: AudioPlayer,
  video: VideoPlayer,
  text: BasicQuestion,
};

function connectToBroadcastChannel(){
  broadcastChannel.value = new BroadcastChannel("GodBrainer");
  broadcastChannel.value.onmessage = (ev: MessageEvent) =>{
    const msg = JSON.parse(ev.data) as TMessage
    if(msg.command === "updateGame"){
      console.log(msg.data);
      if(curGame.value?.id && curGame.value.id !== msg.data.id){
        console.log(curGame.value.id, msg.data.id)
        currentQuestion.value = undefined;
      }
      curGame.value = msg.data;
      if(curGame.value && curGame.value.type === "basic"){
        currentQuestion.value = curGame.value!.questions![curGame.value!.currentQuestion!]
      }
    } else if(msg.command === "closeQuestion"){
      currentQuestion.value = undefined;
    } else if(msg.command === "selectQuestion"){
      currentQuestion.value = msg.data;
    }
  }
}

function sendMessage(msg : TMessage){
  broadcastChannel.value.postMessage(JSON.stringify(msg));
}

function selectQuestion(question : TQuestion & TDBEntry){
  currentQuestion.value = question;
  sendMessage({
    sender: "player",
    command: "selectQuestion",
    data: question,
  })
}

const playerRanking = computed(() =>{
  if(!curGame.value) return [];
  const game = JSON.parse(JSON.stringify(curGame.value))
  if(!game) return [];
  return game.players.sort((a,b) => game.playerData[a.id].score > game.playerData[b.id].score ? 1 : -1)
})

onMounted(() =>{
  connectToBroadcastChannel();
})
</script>

<template>
<div class="h-full w-full overflow-hidden">
  <template v-if="curGame">
    <div class="h-[85%]">
      <template v-if="curGame.type==='jeopardy'">
        <template v-if="!currentQuestion">
          <div class="flex gap-4">
            <div
                v-for="category in curGame.categories"
                class="grow shrink basis-0 text-center text-4xl"
            >
              <div class="bg-emerald-500/80 px-3 py-5 rounded mt-4 mb-8">
                {{ category.name }}
              </div>
              <div
                  v-for="question in category.questions"
                  class="p-3 rounded mt-4"
                  :class="
								curGame.questionData[question.id]
									? 'bg-cyan-500/10'
									: 'bg-cyan-500/80 hover:bg-cyan-400/80 cursor-pointer'
							"
                  @click="selectQuestion(question)"
              >
                {{ question.points * curGame.multiplier }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="h-[95%]">
            <component
                :is="componentMapping[currentQuestion.type]"
                v-model="currentQuestion"
            ></component>
          </div>
        </template>
      </template>
      <template v-if="curGame.type==='basic'">
        <div v-if="currentQuestion" class="h-[95%]">
          <component
              :is="componentMapping[currentQuestion.type]"
              v-model="currentQuestion"
          ></component>
        </div>
      </template>
    </div>
    <div class="h-[15%] flex justify-center">
      <div class="flex gap-4">
        <div v-for="(player, i) in playerRanking" class="flex flex-col justify-center items-center" :key="player.id">
          <div class="text-lg">
            {{ player.name }}
            <v-icon v-if="i === playerRanking.length - 1" name="fa-crown" :class="i === playerRanking.length - 1 ? 'animate-bounce' : '' "></v-icon>
          </div>
          <img v-if="player.profilePicture" :src="player.profilePicture" alt="" class="h-12 w-12 rounded-full" >
          <div>
            {{ curGame.playerData[player.id].score }}
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="h-full w-full flex justify-center items-center">
      Start a game via the play button in the Quizmaster view located in another window
    </div>
  </template>
</div>
</template>

<style scoped>

</style>