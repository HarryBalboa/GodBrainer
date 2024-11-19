<script setup>
	import { ref, computed } from 'vue';
	const question = defineModel();

	function handleRightClick() {
		question.value = null;
	}

	const isActive = ref(false);
	const source = computed(() => {
		return question.value.file;
	});
</script>
<template>
	<div
		class="h-full w-full flex justify-center items-center bg-cyan-500/40 rounded-xl cursor-pointer"
		@click="isActive = !isActive"
		@contextmenu.prevent="handleRightClick"
	>
		<div class="text-center">
			<div class="text-9xl animate-pulse">?</div>
<!--			<div class="text-4xl">{{ question.points }} Points</div>-->
			<div v-if="isActive" class="w-full h-full p-4">
				<audio controls :src="source" />
			</div>
		</div>
	</div>
</template>
