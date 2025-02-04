<script setup lang="ts">
import BookDetails from '@/components/BookDetails.vue'
import BooksTable from '@/components/ui/BooksTable.vue'
import debounce from '@/utils/debounce'
import axios from 'axios'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed, onMounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

const router = useRouter()
const route = useRoute()

const items = ref<Book[]>([])
const selectedBook = ref<Book | null>(null)
const query = ref<string>('')
const totalItems = ref<number>(1)

const maxResults = ref<number>(20)
const startIndex = ref<number>(maxResults.value)
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)

const totalPages = computed(() => Math.round(totalItems.value / maxResults.value))

/**
 * Получает список книг из Google Books API.
 * @param {string | object} query - Поисковый запрос для поиска книг.
 * @param {number} maxResults - Максимальное количество результатов.
 * @returns {Promise<Book[]>} Массив объектов книг из API.
 */
const getBooks = async (
  query: string | object,
  maxResults: number,
  startIndex?: number,
): Promise<Book[]> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        key: import.meta.env.VITE_API_KEY,
        maxResults: maxResults,
        startIndex: startIndex || 0,
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

const getBookById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`)
    return response.data || null
  } catch (e) {
    console.log(e)
    return null
  }
}

const debouncedGetBooks = debounce(async (newQuery: string, maxResults: number) => {
  if (newQuery) {
    items.value = await getBooks(newQuery, maxResults)
  }
}, 250)

const updateQueryInUrl = (newQuery: string) => {
  const newQueryParams = { ...route.query };

  if (newQuery) {
    newQueryParams.query = newQuery;
  } else {
    delete newQueryParams.query; 
  }

  router.push({ path: route.path, query: newQueryParams });
};


const loadMoreBooks = async () => {
  startIndex.value += 20
  const newBooks = await getBooks(query.value, maxResults.value, 28)
  items.value = [...items.value, ...newBooks]
}

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
  [query, maxResults],
  async ([newQuery, newMaxResults]) => {
    debouncedGetBooks(newQuery || '', newMaxResults || maxResults.value)

    if (!query.value.length) {
      items.value = await getBooks(query, maxResults.value)
    }
  },
  { deep: true },
)

onMounted(async () => {
  query.value = route.query.query as string
  items.value = await getBooks(query, maxResults.value)
})

onBeforeRouteUpdate((to) => {
  const newQuery = { ...to.query };

  if (!query.value) {
    delete newQuery.query;
  } else {
    newQuery.query = query.value;
  }

  if (JSON.stringify(newQuery) !== JSON.stringify(to.query)) {
    router.replace({ path: to.path, query: newQuery });
  }
});


watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      selectedBook.value = (await getBookById(newId as string)) || null
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

    <!-- <div
      v-infinite-scroll="loadMoreBooks"
      class="observer-element"
      style="height: 20px; background: transparent"
    ></div> -->

    <button @click="loadMoreBooks">еще</button>

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
