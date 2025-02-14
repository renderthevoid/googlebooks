<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';

import { useBooks, useModalState } from '@/composables';

import { debounce, getUpdatedQueryParams } from '@/utils';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

import BookDetails from '@/components/BookDetails.vue';
import BookEdit from '@/components/BookEdit.vue';
import BooksTable from '@/components/BooksTable.vue';

const router = useRouter();
const route = useRoute();

const items = ref<Book[]>([]);
const selectedBook = ref<Book | null>(null);
const query = ref<string>('');

const editedTitle = ref<string>('');
const maxResults = ref<number>(20);
const startIndex = ref<number>(maxResults.value);
const visible = ref<boolean>(false);

const { loading, totalItems, getBooks, getBookById } = useBooks();
const { openModal, closeModal, isVisible, dialogData } = useModalState();

const loadMoreBooks = async () => {
  try {
    startIndex.value += maxResults.value;
    const newBooks =
      (await getBooks(query, maxResults.value, startIndex.value)) || [];

    if (newBooks.length === 0) {
      return;
    }

    items.value = [...items.value, ...newBooks];

    if (items.value.length >= totalItems.value) {
      return;
    }
  } catch (error) {
    console.error('Ошибка при загрузке книг:', error);
  }
};

const debouncedGetBooks = debounce(
  async (newQuery: string, maxResults: number) => {
    if (newQuery) {
      items.value = await getBooks(newQuery, maxResults);
    }
  },
  250
);

const updateQueryInUrl = (newQuery: string) => {
  const newQueryParams = getUpdatedQueryParams(route.query, newQuery);
  router.push({ path: route.path, query: newQueryParams });
};

const saveEdit = (item: Book) => {
  const savedBooks = JSON.parse(localStorage.getItem('editedBooks') || '{}');
  savedBooks[item.id] = item;
  localStorage.setItem('editedBooks', JSON.stringify(savedBooks));

  items.value = items.value.map((book: Book) =>
    book.id === item.id ? item : book
  );
  closeModal();
};

const openBook = (id: string) => {
  const queryParams = query.value ? { query: query.value } : {};
  router.push({
    path: `/books/${id}`,
    query: queryParams,
  });
};

const closeDialog = () => {
  const queryParams = query.value ? { query: query.value } : {};
  router.push({
    path: '/books',
    query: queryParams,
  });
};

watch(
  [query, maxResults],
  async ([newQuery, newMaxResults]) => {
    debouncedGetBooks(newQuery || '', newMaxResults || maxResults.value);

    if (!query.value) {
      items.value = await getBooks(query, maxResults.value);
    }
  },
  { deep: true }
);

const itemsWithEdits = computed(() => {
  const savedBooks = JSON.parse(localStorage.getItem('editedBooks') || '{}');
  return items.value.map((book: Book) =>
    savedBooks[book.id] ? savedBooks[book.id] : book
  );
});

onMounted(async () => {
  query.value = (route.query.query as string) || '';
  await getBooks(query, maxResults.value, 0);
});

onBeforeRouteUpdate((to) => {
  const newQuery = getUpdatedQueryParams(to.query, query.value);

  if (JSON.stringify(newQuery) !== JSON.stringify(to.query)) {
    router.replace({ path: to.path, query: newQuery });
  }
});

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      selectedBook.value = (await getBookById(newId as string)) || null;
      visible.value = true;
    } else {
      selectedBook.value = null;
      visible.value = false;
    }
  },
  { immediate: true }
);
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
          class="border rounded-md border-gray-500 px-2 py-1 w-full"></InputText>
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
          }" />
      </RouterLink>
    </div>

    <books-table
      :loading="loading"
      :items="itemsWithEdits"
      :selectedBook="selectedBook"
      @update:selection="(id) => openBook(id)"
      @update:edit="(item) => openModal(item)"></books-table>

    <div
      v-infinite-scroll="loadMoreBooks"
      class="h-5 bg-transparent"
      v-if="!loading"></div>

    <book-details
      :visible="visible"
      :data="selectedBook"
      @update:visible="closeDialog"></book-details>

    <book-edit
      v-model="editedTitle"
      :visible="isVisible"
      :data="dialogData"
      @update:visible="closeModal"
      @update:item="(item) => saveEdit(item)"></book-edit>
  </main>
</template>
