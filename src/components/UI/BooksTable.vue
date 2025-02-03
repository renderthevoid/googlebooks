<template>
  <div>
    <DataTable
      :value="props.items"
      v-model:selection="selected"
      @update:selection="onSelection(selected['id'])"
      selectionMode="single"
      tableStyle="min-width: 50rem"
    >
      <template v-if="props.items">
        <Column field="title" header="Title">
          <template #body="slotProps">{{ slotProps.data.volumeInfo.title }}</template>
        </Column>
        <Column field="authors" header="Authors">
          <template #body="slotProps">
            {{ arrToString(slotProps.data.volumeInfo.authors) || 'Unknown author' }}
          </template>
        </Column>
        <Column field="categories" header="Categories">
          <template #body="slotProps">
            {{ slotProps.data.volumeInfo.categories?.join(' ') || 'No categories' }}
          </template>
        </Column>
        <Column field="publishedDate" header="Published Date">
          <template #body="slotProps">{{
            formatDate(slotProps.data.volumeInfo.publishedDate)
          }}</template>
        </Column>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import formatDate from '@/utils/formatDate'

interface IProps {
  items: Book[]
  selectedBook: Book | null
}

const arrToString = (arr: string[]) => arr?.map((item) => item.toString()).join(', ')
const selected = ref(null)
const props = defineProps<IProps>()
const emit = defineEmits(['update:selection'])
watch(
  () => props.selectedBook,
  (newValue) => {
    selected.value = newValue || null
  },
  { immediate: true },
)

const onSelection = (id: string) => {
  emit('update:selection', id)
}
</script>
