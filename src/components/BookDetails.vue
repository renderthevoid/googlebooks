<template>
  <Dialog
    v-model:visible="modalVisible"
    modal
    @update:visible="onClick"
    class="px-4 py-3 w-4xl"
    :header="modalData?.volumeInfo.title || ''"
  >
    <div>
      <span>{{ formatDate(modalData?.volumeInfo.publishedDate) }}</span>
    </div>
    <div>
      <p class="font-semibold">Описание</p>
      <template v-if="modalData?.volumeInfo.description">
        <p>{{ modalData?.volumeInfo.description }}</p>
      </template>
      <template v-else><p>Нет описания</p></template>
    </div>

    <div>
      <p class="font-semibold">Автор</p>
      <template v-if="modalData?.volumeInfo.authors">
        <template v-if="modalData?.volumeInfo.authors.length">
          <p>{{ arrayToString(modalData?.volumeInfo.authors) }}</p>
        </template>
        <p v-else>Автор неизвестен</p>
      </template>
    </div>

    <div>
      <p class="font-semibold">Категории</p>
      <template v-if="modalData?.volumeInfo.description">
        <template v-if="modalData?.volumeInfo.categories.length">
          <p>{{ modalData?.volumeInfo.categories[0] }}</p>
        </template>
        <p v-else>Нет категорий</p>
      </template>
      <template v-else><p>Нет категорий</p></template>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import arrayToString from '@/utils/arrayToString'
import formatDate from '@/utils/formatDate'
import Dialog from 'primevue/dialog'
import { ref, watch } from 'vue'

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
