<script setup lang="ts">
import {onMounted, ref, computed, watch} from "vue";
import TextField from "./TextField.vue";
import Select from "./Select.vue";
import Button from "./Button.vue";
import {useDatabase} from "../stores/database.ts";


const database = useDatabase();
const isEditMode = ref(false);
const selectedQuestion = ref("");
const players = ref<(TPlayer & TDBEntry)[]>([]);
const questions = ref<(TQuestion & TDBEntry)[]>([]);
const isModalActive = ref(false);
const curModal = ref<"player" | "question">("player");
const gameTypes = ["basic", "jeopardy"]
const games = ref<( TGame & TDBEntry)[]>([]);
const curGame = ref<(TGame & TDBEntry) | TGame>({
  name: "",
  type: "basic",
  players: [],
  multiplier: 0,
  playerData:{},
  questionData:{},
  currentQuestion: 0,
  questions: [],
});

const filteredPlayers = computed(() =>{
  return players.value.filter(player => !curGame.value.players.some(p => p.id === player.id));
})

const filteredQuestions = computed(() =>{
  if(curGame.value.type === "basic"){
    return questions.value.filter(question => !curGame.value.questions!.some(q => q.id === question.id));
  } else if(curGame.value.type === "jeopardy"){
    return questions.value.filter(question => !curGame.value.categories!.some(c => c.questions.some(q => q.id === question.id)));
  }
  return questions.value;
})

function resetGame(){
  curGame.value = {
    name: "",
    type: "basic",
    players: [],
    multiplier: 0,
    playerData:{},
    questionData:{},
    currentQuestion: 0,
    questions: [],
  }
}

function openPlayerModal(){
  curModal.value = "player";
  isModalActive.value = true;
}

function openQuestionModal(){
  curModal.value = "question";
  isModalActive.value = true;
}

function closeModal(){
  isModalActive.value = false;
}

function addPlayer(player : (TPlayer & TDBEntry)){
  curGame.value.players.push(player);
  curGame.value.playerData[player.id] = {
    score: 0
  }
  if(filteredPlayers.value.length === 0) closeModal();
}

function removePlayer(playerId : number){
  const index = curGame.value.players.findIndex(player => player.id === playerId );
  if(index > -1){
    curGame.value.players.splice(index, 1);
    delete curGame.value.playerData[playerId]
  }
}

function addQuestion(question : (TQuestion & TDBEntry)){
  if(!curGame.value.questions) return;
  curGame.value.questions.push(question);
  curGame.value.questionData[question.id] = false;
  if(filteredQuestions.value.length === 0) closeModal();
}

function addQuestionToCategory(categoryIndex: number){
  if(!curGame.value.categories) return;
  const question = questions.value.find(q => q.name === selectedQuestion.value);
  if(!question) return;
  curGame.value.categories[categoryIndex].questions.push(question);
  selectedQuestion.value = ""
}

function removeQuestionFromCategory(categoryIndex : number, questionIndex : number){
  if(!curGame.value.categories) return;
  curGame.value.categories[categoryIndex].questions.splice(questionIndex, 1);
}

function addCategory(){
  if(!curGame.value.categories) return;
  curGame.value.categories.push({
    name: "",
    questions:[]
  })
}

function removeQuestion(questionId : number){
  if(!curGame.value.questions) return;
  const index = curGame.value.questions.findIndex(question => question.id === questionId );
  if(index > -1){
    curGame.value.questions.splice(index, 1);
    delete curGame.value.questionData[questionId];
  }
}

async function createGame(){
  try{
    const game = JSON.parse(JSON.stringify(curGame.value));
    await database.addGame(game);
    games.value = await database.getGames();
    resetGame();
  }catch(err){
    console.error(err);
  }
}

async function removeGame(gameId : number){
  try{
    await database.removeGame(gameId);
    games.value = await database.getGames();
  }catch(err){
    console.error(err);
  }
}

function editGame(game : (TGame & TDBEntry)){
  isEditMode.value = true;
  curGame.value = game;
}

async function updateGame(){
  try{
    const game = JSON.parse(JSON.stringify(curGame.value));
    await database.updateGame(game);
    isEditMode.value = false;
    resetGame();
  }catch(err){
    console.error(err);
  }
}

watch(() => curGame.value.type, (val) =>{
  if(isEditMode.value) return;
  if(val === "basic"){
    delete curGame.value.categories
    curGame.value.questions = []
    curGame.value.questionData = {}
  } else if(val === "jeopardy"){
    delete curGame.value.questions
    curGame.value.categories = [{
      name: "",
      questions: []
    }]
    curGame.value.questionData = {}
  }
})

onMounted(async () =>{
  try{
    games.value = await database.getGames();
    players.value = await database.getPlayers();
    questions.value = await database.getQuestions();
  }catch(err){
    console.error(err);
  }
})
</script>

<template>
<div class="h-full gap-2 flex">
  <div v-if="isModalActive" @click="closeModal" class=" z-10 absolute top-0 left-0 h-screen w-screen flex items-center justify-center bg-black/20">
    <div v-if="curModal === 'player'" class="w-[600px]  bg-sky-500 rounded-lg p-2">
      <div class="flex justify-between">
        <div class="text-lg">
          Add Players
        </div>
        <div class="cursor-pointer" @click="closeModal">
          <v-icon name="fa-times"></v-icon>
        </div>
      </div>
      <div class="flex flex-col gap-2 w-full min-h-[200px] max-h-[300px] mt-4 overflow-auto">
        <div
            v-for="player in filteredPlayers"
            :key="player.id"
            class="flex justify-between items-center gap-4 p-2 pr-4 bg-white/20 rounded-full cursor-pointer hover:bg-white/50"
            @click.stop="addPlayer(player)"
        >
          <div class="flex gap-2 items-center justify-between">
            <img v-if="player.profilePicture"  :src="player.profilePicture" alt="" class="h-8 w-8 rounded-full">
            <span>{{ player.name }}</span>
          </div>
          <div>
            <v-icon name="fa-plus"></v-icon>
          </div>
        </div>
      </div>
    </div>
    <template v-if="curModal === 'question'">
      <div v-if="curGame.type === 'basic'" class="w-[600px]  bg-sky-500 rounded-lg p-2">
        <div class="flex justify-between">
          <div class="text-lg">
            Add Questions
          </div>
          <div class="cursor-pointer" @click="closeModal">
            <v-icon name="fa-times"></v-icon>
          </div>
        </div>
        <div class="flex flex-col gap-2 w-full min-h-[200px] max-h-[300px] mt-4 overflow-auto">
          <div
              v-for="question in filteredQuestions"
              :key="question.id"
              class="flex justify-between items-center gap-4 p-2 pr-4 bg-white/20 rounded-full cursor-pointer hover:bg-white/50"
              @click.stop="addQuestion(question)"
          >
            <div class="flex gap-2 items-center justify-between">
              <span>{{ question.name }}</span>
            </div>
            <div>
              <v-icon name="fa-plus"></v-icon>
            </div>
          </div>
        </div>
      </div>
      <div v-if="curGame.type === 'jeopardy'" class="w-[calc(100%-50px)] h-[calc(100%-50px)] bg-sky-500 rounded-lg p-2" @click.stop>
        <div class="flex justify-between">
          <div class="text-lg">
            Add categories
          </div>
          <div class="cursor-pointer" @click="closeModal">
            <v-icon name="fa-times"></v-icon>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <div v-for="(category, i) in curGame.categories" :key="i">
            <div>
              Category {{ i + 1 }}
            </div>
            <div class="mb-2">
              <TextField v-model="category.name"></TextField>
            </div>
            <div v-for="(question, j) in category.questions" :key="question.id" class="bg-white/20 p-2 rounded-full mb-1 flex justify-between">
              {{ question.name }}
              <div class="px-1 cursor-pointer" @click="removeQuestionFromCategory(i, j)">
                <v-icon name="fa-trash-alt"></v-icon>
              </div>
            </div>
            <div class="mt-1">
              <Select v-if="category.questions.length < 5 && filteredQuestions.length > 0" v-model="selectedQuestion" placeholder="add question" :items="filteredQuestions.map(q => q.name)" @change="addQuestionToCategory(i)"></Select>
            </div>
          </div>
          <div>
            <Button v-if="curGame.categories!.length < 5" class="mt-6" @click="addCategory"> Add category </Button>
          </div>

        </div>
      </div>
    </template>
  </div>
  <div class="h-full w-1/3">
    <div>
      Game name
    </div>
    <div>
      <TextField v-model="curGame.name"></TextField>
    </div>
    <div>
      Game type
    </div>
    <div>
      <Select :items="gameTypes" v-model="curGame.type"></Select>
    </div>
    <div class="flex justify-between py-1">
      Players
      <div class="hover:bg-white/20 rounded-full h-6 w-6 cursor-pointer flex items-center justify-center" @click="openPlayerModal">
        <v-icon name="fa-plus"></v-icon>
      </div>
    </div>
    <div class="h-[100px] bg-white/10 overflow-auto p-1">
      <div v-for="player in curGame.players" :key="player.id" class="grid grid-cols-[2fr_3fr_1fr] mb-1 items-center">
        <div class="flex gap-1 items-center">
          <img v-if="player.profilePicture"  :src="player.profilePicture" alt="" class="h-4 w-4 rounded-full">
          <div>{{ player.name }}</div>
        </div>
        <div>
          <text-field v-if="curGame.playerData[player.id]" type="number" v-model="curGame.playerData[player.id].score"></text-field>
        </div>
        <div>
          <div class="text-center cursor-pointer" @click="removePlayer(player.id)">
            <v-icon name="fa-trash-alt"></v-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between py-1">
      {{ curGame.type === "basic" ? 'Questions' : 'Categories' }}
      <div class="hover:bg-white/20 rounded-full h-6 w-6 cursor-pointer flex items-center justify-center" @click="openQuestionModal">
        <v-icon :name="curGame.type === 'basic' ? 'fa-plus' : 'fa-edit'"></v-icon>
      </div>
    </div>
    <div class="h-[100px] bg-white/10 overflow-auto p-1">
      <template v-if="curGame.type === 'basic'">
        <div v-for="question in curGame.questions" :key="question.id" class="flex justify-between mb-1 items-center">
          <div class="flex gap-1 items-center">
            <div>{{ question.name }}</div>
          </div>

          <div>
            <div class="text-center cursor-pointer" @click="removeQuestion(question.id)">
              <v-icon name="fa-trash-alt"></v-icon>
            </div>
          </div>
        </div>
      </template>
      <template v-if="curGame.type === 'jeopardy'">
        <div v-for="category in curGame.categories" :key="category.name" class="flex justify-between mb-1 items-center">
          <div class="flex gap-1 items-center">
            <div>{{ category.name }}</div>
          </div>
        </div>
      </template>

    </div>
    <div class="mt-2">
      <Button v-if="!isEditMode" @click="createGame">Create Game</Button>
      <Button v-if="isEditMode" @click="updateGame">Update game</Button>
    </div>
  </div>
  <div class="h-full w-2/3">
    <div>
      Games
    </div>
    <div class="bg-white/10 p-2">
      <div class="grid grid-cols-[2fr_2fr_2fr_2fr_1fr] border-b">
        <div>Game</div>
        <div>Type</div>
        <div>Players</div>
        <div>Questions / Categories </div>
      </div>
      <div v-for="game in games" :key="game.id" class="grid grid-cols-[2fr_2fr_2fr_2fr_1fr]">
        <div>{{ game.name }}</div>
        <div>{{ game.type }}</div>
        <div>{{ game.players.length }}</div>
        <div>{{ game.questions ? game.questions.length : game.categories!.length }}</div>
        <div class="flex gap-1">
          <div class="cursor-pointer" @click="editGame(game)">
            <v-icon name="fa-edit"></v-icon>
          </div>
          <div class="cursor-pointer" @click="removeGame(game.id)">
            <v-icon name="fa-trash-alt"></v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>


</div>
</template>

<style scoped>

</style>