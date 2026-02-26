<template>
    <div v-if="showExecuteButton" class="flex flex-wrap justify-center gap-2 mb-1">
        <button
        @click="$emit('executeButton')"
        class="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500"
        >
        <span class="p-5">DOCUMENTAR</span>
        </button>
    </div>
</template>
<script setup>
const props = defineProps({
    showExecuteButton: { type: Boolean, required: true },
})
</script>