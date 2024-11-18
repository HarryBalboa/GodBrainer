<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {useDatabase} from "../stores/database.ts";
import AudioInput from "../components/AudioInput.vue";
import VideoInput from "../components/VideoInput.vue";
import ImageInput from "../components/ImageInput.vue";
import TextField from "../components/TextField.vue";
import TextArea from "../components/TextArea.vue";
import Select from "../components/Select.vue";
import Button from "../components/Button.vue";

const database = useDatabase();
const isEditMode = ref(false);
const questions = ref<(TQuestion & TDBEntry)[]>([]);
const curQuestion = ref<TQuestion | (TQuestion & TDBEntry)>({
  name: "",
  type: "text",
  file: "",
  points: 100,
  penalty: 50,
  gameMasterInfo: "",
  playerInfo: "",
})
const questionTypes = ref([
  "text",
  "video",
  "audio",
  "img",
  "zoom",
])

function resetQuestion(){
  curQuestion.value = {
    name: "",
    type: "text",
    text: "",
    file: "",
    gameMasterInfo: "",
    playerInfo: "",
    points: 100,
    penalty: 50
  }
}

async function editQuestion(question : (TQuestion & TDBEntry)){
  isEditMode.value = true;
  curQuestion.value = question;
}

async function removeQuestion(questionId : number){
  try{
    await database.removeQuestion(questionId);
    const index = questions.value.findIndex(question => question.id === questionId);
    if(index > -1) questions.value.splice(index, 1);
  }catch(err){
    console.error(err);
  }
}

async function updateQuestion(){
  try{
    const question = JSON.parse(JSON.stringify(curQuestion.value));
    await database.updateQuestion(question);
    resetQuestion();
    isEditMode.value = false;
  }catch(err){
    console.error(err);
  }
}

async function createNewQuestion(){
  try{
    const question = JSON.parse(JSON.stringify(curQuestion.value));

    await database.addQuestion(question);
    questions.value = await database.getQuestions();
    resetQuestion();
  }catch(err){
    console.error(err);
  }
}

watch(() => curQuestion.value.type, () =>{
  curQuestion.value.file = "";
  curQuestion.value.text = "";
})

onMounted(async() => {
  try{
    questions.value = await database.getQuestions();
  }catch(err){
    console.error(err);
  }
})

</script>

<template>
  <div class="flex gap-2">
    <div class="w-full">
      <div class="mt-2">
        Question name
      </div>
      <div>
        <TextField v-model="curQuestion.name"></TextField>
      </div>
      <div class="mt-2">
         Quizmaster notes
      </div>
      <div>
        <TextArea v-model="curQuestion.gameMasterInfo"></TextArea>
      </div>
      <div class="mt-2">
        Player notes
      </div>
      <div>
        <TextArea v-model="curQuestion.playerInfo"></TextArea>
      </div>
      <div class="mt-2">
        Points / Penalty
      </div>
      <div class="flex gap-2">
        <TextField type="number" v-model="curQuestion.points"></TextField>
        <TextField type="number" v-model="curQuestion.penalty"></TextField>
      </div>
      <div class="mt-2">
        Question type
      </div>
      <div>
        <Select v-model="curQuestion.type" :items="questionTypes"></Select>
      </div>
      <div class="mt-2">
        {{ curQuestion.type === 'text' ? 'Question text' : 'File' }}
      </div>
      <div>
        <TextArea v-if="curQuestion.type === 'text'" v-model="curQuestion.text"></TextArea>
        <ImageInput v-if="['zoom', 'img'].includes(curQuestion.type)" v-model="curQuestion.file"></ImageInput>
        <VideoInput v-if="curQuestion.type === 'video'" v-model="curQuestion.file"></VideoInput>
        <AudioInput v-if="curQuestion.type === 'audio'" v-model="curQuestion.file"></AudioInput>
      </div>

      <Button
          v-if="isEditMode"
          class="mt-4"
          @click="updateQuestion"
      >
        Update Question
      </Button>
      <Button
          v-else class="mt-4"
          @click="createNewQuestion"
      >
        Create Question
      </Button>
    </div>
    <div class="w-full bg-white/10 mt-2 p-2">
      <div class="flex justify-between items-center border-b mb-2">
        <div class="flex">
          Question
        </div>
      </div>
      <div
          v-for="question in questions"
          :key="question.name"
          class="flex justify-between items-center"
      >
        <div class="flex gap-2 items-center">
          <div>{{ question.name }}</div>
        </div>
        <div class="flex gap-2">
          <div @click="editQuestion(question)" class="cursor-pointer">
            <v-icon name="fa-edit"></v-icon>
          </div>
          <div @click="removeQuestion(question.id)" class="cursor-pointer">
            <v-icon name="fa-trash-alt"></v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>