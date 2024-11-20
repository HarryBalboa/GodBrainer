<script setup lang="ts">
	import { ref, computed } from 'vue';

	const question = defineModel();

	const isActive = ref(false);
	const source = computed(() => {
		return question.value.file;
	});

	function handleRightClick() {
		question.value = null;
	}
</script>
<template>
	<div
		class="h-full w-full flex justify-center items-center bg-gradient-to-br from-cyan-500/40 to-emerald-500/40 rounded-xl cursor-pointer"
		@click="isActive = !isActive"
		@contextmenu.prevent="handleRightClick"
	>
    <div v-if="!isActive" class="flex flex-col items-center justify-center">
      <div class="text-9xl animate-bounce">?</div>
      <div class="text-4xl">
        {{ question.playerInfo }}
      </div>
    </div>
		<div v-else class="w-full h-full p-4">
			<img class="w-full h-full object-contain" :src="source" alt="" />
		</div>
	</div>
</template>
