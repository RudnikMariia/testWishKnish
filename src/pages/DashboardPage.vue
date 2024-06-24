<template>
  <div ref="chatContainer" class="chat-container">
    <q-page>
      <div class="chat-header">
      </div>
      <chat-secure :messages="dltStore.messages" @sendMessage="sendMessage"/>
    </q-page>
  </div>
</template>

<script setup>
import hasDltStore from 'src/mixins/hasDltStore'
import ChatSecure from 'components/chat/ChatSecure.vue'
import { ref, onMounted, watch } from 'vue'

const { dltStore } = hasDltStore()
const chatContainer = ref(null)

watch(() => dltStore.messages, () => {
  scrollToBottom()
}, { deep: true })

onMounted(() => {
  loadMessages()
})

function scrollToBottom () {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

async function loadMessages () {
  await dltStore.getMessages(1, 20)
  scrollToBottom()
}

async function sendMessage (msg) {
  await dltStore.createMessage(msg)
  await dltStore.getMessages(1, 20)
  scrollToBottom()
}
</script>

<style scoped>
.chat-container {
  height: 93vh;
  overflow-y: auto;
}

.chat-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>
