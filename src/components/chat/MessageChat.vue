<template>
  <q-chat-message
    :name="author"
    :stamp="formatTimestamp(stamp)"
    :sent="myMessage"
    text-color="white"
    :bg-color="colorBackground"
  >
    <div>
      {{ message }}
    </div>
  </q-chat-message>
</template>

<script setup>
import { computed } from 'vue'
import { date } from 'quasar'

const props = defineProps({
  myMessage: {
    type: Boolean,
    default: true
  },
  author: {
    type: String,
    default: 'unknown'
  },
  message: {
    type: String,
    required: true
  },
  stamp: {
    type: String,
    required: true
  }
})

function formatTimestamp (timestamp) {
  const timeMsg = new Date(Number(timestamp))
  return date.formatDate(timeMsg, 'MM-DD HH:mm')
}

const colorBackground = computed(() => {
  return props.myMessage ? 'primary' : 'amber'
})
</script>

<style scoped>
.message {
  background-color: #f0f0f0;
  padding: 10px;
  margin: 5px;
  border-radius: 8px;
}
</style>
