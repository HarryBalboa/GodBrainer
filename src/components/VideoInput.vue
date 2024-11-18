<script setup lang="ts">
import {ref} from "vue";

const model = defineModel<string>();

const input = ref();

function onInputChanged(){

  const reader = new FileReader();
  reader.onload = (ev) => {
    model.value = ev.target!.result as string;
  }
  reader.readAsDataURL(input.value.files[0]);
}

function clearInput(){
  model.value = "";
  input.value.value = "";
}
</script>

<template>
  <div class="flex items-center gap-2">
    <input
        ref="input"
        type="file"
        class="w-full p-1 bg-sky-300/30 rounded focus:outline-none"
        accept="video/*"
        @change="onInputChanged"
    />
    <div v-if="model" @click="clearInput" class="cursor-pointer">
      <v-icon name="fa-times"></v-icon>
    </div>
  </div>
</template>

<style scoped>

</style>