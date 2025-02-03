<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import BooksTable from '@/components/UI/BooksTable.vue'
import InputText from 'primevue/inputtext'
import BookDetails from '@/components/BookDetails.vue'
import { type Book } from '/types'
import debounce from '/utils/debounce'
import Button from 'primevue/button'

const API_KEY = 'AIzaSyBBkgwFwjf6YAtl_UTPEmsLtF9k3spG6IE'
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

const router = useRouter()
const route = useRoute()

const items = ref<Book[]>([])
const query = ref<string>('')
const maxResults = ref<number>(10)
const visible = ref<boolean>(false)
/**
 * Получает список книг из Google Books API.
 * @param {string} query - Поисковый запрос для поиска книг.
 * @param {number} maxResults - Максимальное количество результатов.
 * @returns {Promise<Book[]>} Массив объектов книг из API.
 */
const getBooks = async (query: string, maxResults: number): Promise<Book[]> => {
  // try {
  //   const response = await axios.get(BASE_URL, {
  //     params: {
  //       q: query,
  //       key: API_KEY,
  //       maxResults: maxResults,
  //     },
  //   })
  //   console.log(response)
  //   return response.data.items || []
  // } catch (error) {
  //   console.error('Ошибка при запросе к Google Books API:', error)
  //   return []
  // }
}

const debouncedGetBooks = debounce(async (newQuery: string, maxResults: number) => {
  if (newQuery) {
    items.value = await getBooks(newQuery, maxResults)
  }
}, 250)

watch([query, maxResults], async ([newQuery, newMaxResults]) => {
  await debouncedGetBooks(newQuery || query, newMaxResults || maxResults)
})

onMounted(async () => {
  items.value = await getBooks(query, maxResults.value)
})
const openBook = (id) => {
  router.push(`/book/${id}`)
}

const closeDialog = () => {
  router.push('/')
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      // selectedBook.value = books.value.find((book) => book.id === newId) || null
      console.log(newId)
      visible.value = true
      console.log(newId, visible.value)
    } else {
      visible.value = false
      console.log(newId, visible.value)
      // selectedBook.value = null
    }
  },
  { immediate: true },
)

</script>

<template>
  <main>
    <div class="my-2 flex gap-1.5 items-center">
      <div class="flex-1">
        <InputText
          v-model="query"
          type="text"
          size="small"
          placeholder="Введите название книги"
          class="border rounded-md border-gray-500 px-2 py-1 w-full"
        ></InputText>
      </div>

      <Button
        icon="pi pi-sparkles"
        class="border rounded-md border-gray-500 px-2 py-1 h-full hover:bg-gray-50 transition"
        variant="text"
        aria-label="Load Button"
        v-tooltip.bottom="{
          value: 'Загрузка по кнопке',
          pt: {
            text: 'px-2',
          },
          autoHide: false,
        }"
      />

      <Button
        icon="pi pi-play-circle"
        class="border rounded-md border-gray-500 px-2 py-1 h-full hover:bg-gray-50 transition"
        variant="text"
        aria-label="Endless Scroll"
        v-tooltip.bottom="{
          value: 'Бесконечная лента',
          pt: {
            text: 'px-2',
          },
          autoHide: false,
        }"
        @click="openBook(1)"
      />
    </div>
    <books-table :items="items"></books-table>
    <book-details :visible="visible" @update:visible="closeDialog"></book-details>
  </main>
</template>
