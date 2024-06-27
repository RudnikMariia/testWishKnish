<template>
  <div class="q-pa-md row justify-center">
    <div class="full-width">
      <message-chat
        v-for="msg in messages"
        :key="msg.id"
        :author="msg.author"
        :message="msg.message"
        :stamp="msg.createdAt"
        :myMessage="msg.myMessage"
      />
      <q-input
        v-model="newMessageText"
        outlined
        dense
        placeholder="Enter your message..."
        @keydown.enter="sendMessage"
        class="q-mt-md"
      />
      <q-btn @click="sendMessage" color="primary" label="Send" class="q-mt-md" />
    </div>
  </div>
</template>

<script setup>
import MessageChat from 'components/chat/MessageChat.vue'
import { ref } from 'vue'

defineProps({
  messages: {
    type: Array
  }
})

const emits = defineEmits(['sendMessage'])

const newMessageText = ref('')

function sendMessage () {
  if (newMessageText.value.trim() === '') return

  emits('sendMessage', newMessageText.value.trim())

  newMessageText.value = ''
}
</script>
