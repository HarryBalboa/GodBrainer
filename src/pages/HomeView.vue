<script setup lang="ts">

import {nextTick, onMounted, watch} from "vue";
import {useRoute} from "vue-router";
const route = useRoute();

watch (() => route.params.data, (val) =>{
  console.log(val)
})
onMounted(() =>{
  nextTick(() =>{
    console.log(route.path);
  })

})
</script>

<template>
Home
</template>

<style scoped>

</style>