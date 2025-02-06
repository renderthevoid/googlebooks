<template>
  <div>
    <DataTable
      :value="props.items"
      v-model:selection="selected"
      @update:selection="onSelection(selected!['id'])"
      selectionMode="single"
      tableStyle="min-width: 50rem"
    >
      <template>
        <Column field="title" header="Title">
          <template #body="slotProps">
            <Skeleton v-if="props.loading" height="2rem" class="mb-2" />
            <div class="flex items-center gap-2" v-else>
              <Button
                icon="pi pi-pencil"
                class="border rounded-md border-gray-500 px-2 py-1 h-full hover:bg-gray-50 transition min-w-[40px]"
                variant="text"
                aria-label="Load Button"
                v-tooltip.bottom="{
                  value: 'Редактировать название',
                  pt: {
                    text: 'px-2',
                  },
                  autoHide: true,
                }"
                @click="editTitle(slotProps.data)"
              />
              <span>{{ slotProps.data.volumeInfo.title }}</span>
            </div>
          </template>
        </Column>

        <Column field="authors" header="Authors">
          <template #body="slotProps">
            <Skeleton v-if="props.loading" height="2rem" class="mb-2" />
            <span v-else>{{
              arrayToString(slotProps.data.volumeInfo.authors) || 'Unknown author'
            }}</span>
          </template>
        </Column>

        <Column field="categories" header="Categories">
          <template #body="slotProps">
            <Skeleton v-if="props.loading" height="2rem" class="mb-2" />
            <span v-else>{{
              slotProps.data.volumeInfo.categories?.join(' ') || 'No categories'
            }}</span>
          </template>
        </Column>

        <Column field="publishedDate" header="Published Date">
          <template #body="slotProps">
            <Skeleton v-if="props.loading" height="2rem" class="mb-2" />
            <span v-else>{{ formatDate(slotProps.data.volumeInfo.publishedDate) }}</span>
          </template>
        </Column>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { arrayToString, formatDate } from '@/utils'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Skeleton from 'primevue/skeleton'
import { ref, watch } from 'vue'

interface IProps {
  loading?: boolean
  items: Book[]
  selectedBook: Book | null
}

const selected = ref(null)
const props = defineProps<IProps>()
const emit = defineEmits(['update:selection', 'update:edit'])
watch(
  () => props.selectedBook,
  (newValue) => {
    selected.value = newValue || null
  },
  { immediate: true },
)
const editTitle = (item: Book) => {
  emit('update:edit', item)
}
const onSelection = (id: string) => {
  emit('update:selection', id)
}
</script>
