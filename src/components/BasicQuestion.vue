<script setup>
	import { ref, computed, onMounted } from 'vue';

	const question = defineModel();

	const isActive = ref(false);

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
		<div v-if="!isActive" class="text-center">
			<div class="text-9xl animate-pulse">?</div>
<!--			<div class="text-4xl">{{ question.points }} Points</div>-->
		</div>
		<div
			v-else
			class="w-full h-full p-4 flex items-center justify-center text-6xl"
		>
			{{ question.text }}
		</div>
	</div>
</template>
