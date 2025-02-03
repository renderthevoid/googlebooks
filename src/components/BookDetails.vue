<template>
  <Dialog 
    v-model:visible="modalVisible" 
    modal 
    @update:visible="onClick" 
    header="Edit Profile" 
    :style="{ width: '25rem' }"
  >
    эм)
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { defineEmits, defineProps, watch, ref } from 'vue'

interface IProps {
  visible: boolean
}
const emit = defineEmits(['update:visible'])
const props = defineProps<IProps>()


watch(() => props.visible, (newValue) => {
  modalVisible.value = newValue
})

const modalVisible = ref(props.visible)

const onClick = () => {
  emit('update:visible') 
}
</script>

<style scoped></style>
