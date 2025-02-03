<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import axios from 'axios'
import BooksTable from '@/components/UI/BooksTable.vue'
import InputText from 'primevue/inputtext'
import BookDetails from '@/components/BookDetails.vue'
import debounce from '@/utils/debounce'
import Button from 'primevue/button'

const API_KEY = 'AIzaSyBBkgwFwjf6YAtl_UTPEmsLtF9k3spG6IE'
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

const router = useRouter()
const route = useRoute()

const items = ref<Book[]>([])
const selectedBook = ref<Book | null>(null)
const query = ref<string>('')
const totalItems = ref<number>(1)
const currentPage = ref<number | null>(null)
const maxResults = ref<number>(20)
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const hasMore = ref(true)
const startIndex = ref<number>(maxResults.value)

const totalPages = computed(() => Math.round(totalItems.value / maxResults.value))

/**
 * Получает список книг из Google Books API.
 * @param {string} query - Поисковый запрос для поиска книг.
 * @param {number} maxResults - Максимальное количество результатов.
 * @returns {Promise<Book[]>} Массив объектов книг из API.
 */
const getBooks = async (query: string, maxResults: number): Promise<Book[]> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        key: API_KEY,
        maxResults: maxResults,
      },
    })
    console.log(response)
    totalItems.value = response.data.totalItems
    return response.data.items || []
  } catch (error) {
    console.error('Ошибка при запросе к Google Books API:', error)
    return []
  }
}

// const loadMoreBooks = async () => {
//   if (loading.value || !hasMore.value) {
//     return
//   }
//   loading.value = true
//   try {
//     maxResults.value += 20
//     const newBooks = await getBooks(query.value, maxResults.value)

//     items.value = [...items.value, ...newBooks]
//   } catch (error) {
//     console.error('Ошибка загрузки:', error)
//   } finally {
//     loading.value = false
//   }
// }
const debouncedGetBooks = debounce(async (newQuery: string, maxResults: number) => {
  if (newQuery) {
    items.value = await getBooks(newQuery, maxResults)
  }
}, 250)

const updateQueryInUrl = (newQuery: string) => {
  router.push({
    path: route.path,
    query: { ...route.query, query: newQuery },
  })
}
watch([query, maxResults], async ([newQuery, newMaxResults]) => {
  await debouncedGetBooks(newQuery || query, newMaxResults || maxResults)
})

onMounted(async () => {
  query.value = await route.query.query
  if (!items.value.length) {
    items.value = await getBooks(query, maxResults.value)
  }
})

onBeforeRouteUpdate((to, from, next) => {
  if (to.path !== from.path) {
    next({ path: to.path, query: { ...to.query, query: query.value } })
  } else {
    next()
  }
})

const openBook = (id: string) => {
  router.push({
    path: `/books/${id}`,
    query: { query: query.value },
  })
}

const closeDialog = () => {
  router.push({
    path: '/books',
    query: { query: query.value },
  })
}

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      if (!items.value.length) {
        query.value = route.query.query
        items.value = await getBooks(query.value, maxResults.value)
      }
      selectedBook.value = items.value.find((book) => book.id === newId) || null
      visible.value = true
    } else {
      selectedBook.value = null
      visible.value = false
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
          @input="updateQueryInUrl(query)"
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
      />
    </div>
    <books-table
      :items="items"
      :selectedBook="selectedBook"
      @update:selection="(id) => openBook(id)"
    ></books-table>

    <div
      v-infinite-scroll="loadMoreBooks"
      class="observer-element"
      style="height: 20px; background: transparent"
    ></div>

    <book-details
      :visible="visible"
      :data="selectedBook"
      @update:visible="closeDialog"
    ></book-details>
  </main>
</template>

<style scoped>
.loading-indicator {
  padding: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9em;
}
</style>
