<template>
  <Dialog
    v-model:visible="modalVisible"
    modal
    @update:visible="onClick"
    class="px-4 py-3 w-3xl"
    header="Редактировать название"
  >
    <div class="flex flex-col mb-3">
      <span class="font-semibold text-md"> Нынешнее название </span>
      <span class="text-sm">
        {{ modalData.volumeInfo.title }}
      </span>
    </div>
    <div class="flex flex-col items-end">
      <InputText
        v-model="newTitle"
        type="text"
        placeholder="Введите новое название"
        class="border rounded-md border-gray-500 px-2 py-1 w-full"
        @input="titleUpdate"
        :maxlength="250"
        :disabled="disabledInput"
      />
      <span>{{ newTitle.length }}/250 символов</span>
    </div>
    <Button
      class="bg-gray-500 text-amber-50 border rounded-md py-1 px-3 mt-3"
      label="Сохранить"
      @click="objectUpdate"
      :disabled="disabledButton"
    />
  </Dialog>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { ref, watch } from 'vue'

interface IProps {
  data?: Book | ''
  visible: boolean
  modelValue: string
}
const emit = defineEmits(['update:visible', 'update:modelValue', 'update:item'])
const props = defineProps<IProps>()
const disabledButton = ref<boolean>(false)
const disabledInput = ref<boolean>(false)
const modalVisible = ref(props.visible)
const modalData = ref(props.data)
const newTitle = ref(props.modelValue || '')
watch(
  () => props.visible,
  (newValue) => {
    modalVisible.value = newValue
  },
)
watch(
  () => props.modelValue,
  (newValue) => {
    newTitle.value = newValue
    disabledButton.value = newTitle.value.length === 0
  },
  { immediate: true },
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
const titleUpdate = () => {
  if (newTitle.value.length > 250) {
    newTitle.value = newTitle.value.slice(0, 250)
  }
  emit('update:modelValue', newTitle.value)
}
const objectUpdate = () => {
  modalData.value.volumeInfo.title = newTitle.value
  emit('update:item', modalData.value)
}
</script>

<style scoped></style>
