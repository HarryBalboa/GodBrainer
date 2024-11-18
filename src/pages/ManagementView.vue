<script setup lang="ts">
import { ref } from 'vue';
import PlayerManager from "../components/PlayerManager.vue";
import QuestionManager from "./QuestionManager.vue";
import GameManager from "../components/GameManager.vue";

const tabs = [{text: "Players", icon: "fa-user-alt"}, {text: "Questions", icon: "fa-question-circle"}, {text: "Games", icon: "fa-gamepad"}]
const currentTab = ref("Players");
</script>

<template>
  <div class="h-full">
    <div class="flex border-b border-white">
      <div
          v-for="tab in tabs"
          :key="tab.text"
          class="w-full justify-center flex items-center gap-2 rounded-t-lg cursor-pointer"
          :class="currentTab === tab.text ? 'bg-white/20' : ''"
          @click="currentTab = tab.text"
      >
        <v-icon :name="tab.icon"></v-icon>
        {{ tab.text }}
      </div>
    </div>
    <div>
      <template v-if="currentTab === 'Players'">
        <PlayerManager></PlayerManager>
      </template>
      <template v-if="currentTab === 'Questions'">
        <question-manager></question-manager>
      </template>
      <template v-if="currentTab === 'Games'">
        <game-manager></game-manager>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>