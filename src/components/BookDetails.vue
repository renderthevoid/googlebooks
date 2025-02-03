<template>
  <Dialog
    v-model:visible="modalVisible"
    modal
    @update:visible="onClick"
    class="px-4 py-3"
    :header="modalData?.volumeInfo.title || ''"
    :style="{ width: '25rem' }"
  >
    <template v-if="modalData?.volumeInfo.description">
      {{ modalData?.volumeInfo.description }}
    </template>
    <template v-else>
      Нет описания
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { defineEmits, defineProps, watch, ref } from 'vue'

interface IProps {
  data: Book | ''
  visible: boolean
}
const emit = defineEmits(['update:visible'])
const props = defineProps<IProps>()

const modalVisible = ref(props.visible)
const modalData = ref(props.data)

watch(
  () => props.visible,
  (newValue) => {
    modalVisible.value = newValue
  },
)
watch(
  () => props.data,
  (newValue) => {
    modalData.value = newValue
  },
)

const onClick = () => {
  emit('update:visible')
}
</script>

<style scoped></style>
