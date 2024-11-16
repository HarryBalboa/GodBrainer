<script setup lang="ts">
import {useCounterStore} from "../stores/database.ts";

const store = useCounterStore();

console.log(store.count)
</script>

<template>
GameView
</template>

<style scoped>

</style>