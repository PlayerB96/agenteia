<template>
  <div class="flex flex-wrap justify-center gap-2">
    <button
      v-for="action in actions"
      :key="action.id"
      @click="$emit('select', action)"
      class="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-sm"
    >
      {{ action.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  actions: { type: Array, required: true }
})
</script>