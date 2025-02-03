<template>
  <div>
    <DataTable :value="props.items" tableStyle="min-width: 50rem">
      <template v-if="items">
        <Column field="title" header="Title">
          <template #body="slotProps">{{ slotProps.data.volumeInfo.title }}</template>
        </Column>
        <Column field="authors" header="Authors">
          <template #body="slotProps">
            {{ arrToString(slotProps.data.volumeInfo.authors) || 'Unknown author' }}
          </template>
        </Column>
        <Column field="categories" header="Categories">
          <template #body="slotProps">{{
            slotProps.data.volumeInfo.categories?.join(' ') || 'No categories'
          }}</template>
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Row from 'primevue/row'
import { type Book } from '/types'
import formatDate from '/utils/formatDate'

interface IProps {
  items: Book[]
}

const arrToString = (arr: string[]) => arr?.map((item) => item.toString()).join(', ')
const props = defineProps<IProps>()
</script>

<style scoped></style>
