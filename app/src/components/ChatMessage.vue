<template>
  <div class="mb-2 flex" :class="isUser ? 'justify-end' : 'justify-start'">
    <div class="flex items-end gap-2 min-w-0" :class="msg.role === 'user' && 'flex-row-reverse'">
        <component :is="msg.role === 'user' ? User : Bot" class="w-5 h-5 text-indigo-400" />
        <span
        class="px-3 py-2 rounded-lg text-sm shadow
                max-w-[100%] break-all w-fit whitespace-pre-wrap"
        :class="bubbleClass"
        >
        {{ msg.text }}
        </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { User, Bot } from 'lucide-vue-next'
const props = defineProps({
  msg: { type: Object, required: true },
  messageError: { type: Boolean, default: false },
})

const isUser = computed(() => props.msg.role === 'user')

const bubbleClass = computed(() => {
    if (props.messageError) {
        return isUser.value ? 'bg-indigo-500 text-white' : 'bg-red-500 text-white'
    }else{
        return isUser.value ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-white'
    }
})
</script>