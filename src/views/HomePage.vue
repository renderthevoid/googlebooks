<script setup lang="ts">
import BookDetails from '@/components/BookDetails.vue'
import BookEdit from '@/components/BookEdit.vue'
import BooksTable from '@/components/UI/BooksTable.vue'
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
const editedBook = ref<Book | null>(null)
const query = ref<string>('')
const totalItems = ref<number>(1)

const editedTitle = ref<string>('')
const maxResults = ref<number>(20)
const startIndex = ref<number>(maxResults.value)
const visible = ref<boolean>(false)
const loading = ref<boolean>(true)
const visibleEdit = ref<boolean>(false)

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
  loading.value = true
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
    loading.value = false
    return response.data.items || []
  } catch (error) {
    console.error('Ошибка при запросе к Google Books API:', error)
    return []
  } finally {
    loading.value = false
  }
}

/**
 * Получает информацию о книге по её ID.
 *
 * @param {string} id - Идентификатор книги.
 * @returns {Promise<Book | null>} Объект с данными книги или `null`, если произошла ошибка.
 */
const getBookById = async (id: string): Book => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`)
    return response.data || null
  } catch (e) {
    console.log(e)
    return null
  }
}

/**
 * Обновляет параметры запроса, модифицируя или удаляя параметр 'query'
 *
 * @param {Record<string, any>} currentQuery - Текущие параметры запроса
 * @param {string} [queryValue] - Новое значение для параметра 'query'.
 *                               Если значение пустое или не передано - параметр 'query' будет удалён
 * @returns {Record<string, any>} Новый объект параметров запроса с обновлённым 'query'
 */
function getUpdatedQueryParams(currentQuery: Record<string, any>, queryValue?: string) {
  const newQuery = { ...currentQuery }

  if (queryValue) {
    newQuery.query = queryValue
  } else {
    delete newQuery.query
  }

  return newQuery
}

/**
 * Загружает дополнительные книги и добавляет их в список.
 * Увеличивает индекс для получения следующей порции книг и проверяет,
 * были ли загружены все книги.
 *
 * @async
 * @returns {Promise<void>} Возвращает промис, который разрешается, когда загрузка завершена.
 */
const loadMoreBooks = async () => {
  startIndex.value += maxResults.value

  const newBooks = await getBooks(query, maxResults.value, startIndex.value)

  if (newBooks.length > 0) {
    items.value = [...items.value, ...newBooks]
  }
  if (items.value === totalItems.value) {
    return
  }
}

const debouncedGetBooks = debounce(async (newQuery: string, maxResults: number) => {
  if (newQuery) {
    items.value = await getBooks(newQuery, maxResults)
  }
}, 250)

const updateQueryInUrl = (newQuery: string) => {
  const newQueryParams = getUpdatedQueryParams(route.query, newQuery)
  router.push({ path: route.path, query: newQueryParams })
}

const openEdit = (item: Book) => {
  visibleEdit.value = true
  editedBook.value = item
}

const closeEdit = () => {
  visibleEdit.value = false
  editedTitle.value = ''
}

const saveEdit = (item: Book) => {
  const savedBooks = JSON.parse(localStorage.getItem('editedBooks') || '{}')
  savedBooks[item.id] = item
  localStorage.setItem('editedBooks', JSON.stringify(savedBooks))

  items.value = items.value.map((book: Book) => (book.id === item.id ? item : book))
  visibleEdit.value = false
  editedTitle.value = ''
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

    if (!query.value) {
      items.value = await getBooks(query, maxResults.value)
    }
  },
  { deep: true },
)

const itemsWithEdits = computed(() => {
  const savedBooks = JSON.parse(localStorage.getItem('editedBooks') || '{}')
  return items.value.map((book: Book) => (savedBooks[book.id] ? savedBooks[book.id] : book))
})

onMounted(async () => {
  query.value = route.query.query as string
  items.value = await getBooks(query, maxResults.value)
})

onBeforeRouteUpdate((to) => {
  const newQuery = getUpdatedQueryParams(to.query, query.value)

  if (JSON.stringify(newQuery) !== JSON.stringify(to.query)) {
    router.replace({ path: to.path, query: newQuery })
  }
})

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

      <RouterLink :to="{ name: 'about' }">
        <Button
          icon="pi pi-play-circle"
          class="border rounded-md border-gray-500 px-2 py-1 h-full hover:bg-gray-50 transition"
          variant="text"
          aria-label="About me"
          v-tooltip.bottom="{
            value: 'Информация обо мне',
            pt: {
              text: 'px-2',
            },
            autoHide: false,
          }"
        />
      </RouterLink>
    </div>

    <books-table
      :loading="loading"
      :items="itemsWithEdits"
      :selectedBook="selectedBook"
      @update:selection="(id) => openBook(id)"
      @update:edit="(item) => openEdit(item)"
    ></books-table>

    <div v-infinite-scroll="loadMoreBooks" class="h-5 bg-transparent" v-if="!loading"></div>

    <book-details
      :visible="visible"
      :data="selectedBook"
      @update:visible="closeDialog"
    ></book-details>

    <book-edit
      v-model="editedTitle"
      :visible="visibleEdit"
      :data="editedBook"
      @update:visible="closeEdit"
      @update:item="(item) => saveEdit(item)"
    ></book-edit>
  </main>
</template>
