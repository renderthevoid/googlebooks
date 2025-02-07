import axios from 'axios';

import { ref } from 'vue';

export const useBooks = () => {
  const loading = ref(false);
  const totalItems = ref(0);
  const error = ref<null | string>(null);

  /**
   * Получает список книг из Google Books API.
   * @param {string | object} query - Поисковый запрос для поиска книг.
   * @param {number} maxResults - Максимальное количество результатов.
   * @returns {Promise<Book[] | undefined>} Массив объектов книг из API.
   */
  const getBooks = async (
    query: string | object,
    maxResults: number,
    startIndex?: number
  ): Promise<Book[] | undefined> => {
    loading.value = true;
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL, {
        params: {
          q: query,
          key: import.meta.env.VITE_API_KEY,
          maxResults: maxResults,
          startIndex: startIndex || 0,
        },
      });

      totalItems.value = response.data.totalItems;

      return response.data.items || [];
    } catch (err) {
      if (err instanceof Error) {
        console.error('Ошибка при запросе к Google Books API:', err);
        error.value = err.message || 'Произошла ошибка';
        return [];
      }
    } finally {
      loading.value = false;
    }
  };

  /**
   * Получает информацию о книге по её ID.
   *
   * @param {string} id - Идентификатор книги.
   * @returns {Promise<Book | null>} Объект с данными книги или `null`, если произошла ошибка.
   */
  const getBookById = async (id: string): Promise<Book | null> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/${id}`,
        {
          params: {
            key: import.meta.env.VITE_API_KEY,
          },
        }
      );

      return response.data || null;
    } catch (err) {
      if (err instanceof Error) {
        console.error('Ошибка при получении книги по ID:', err);
        error.value = err.message || 'Произошла ошибка';
      }
      return null;
    }
  };

  return {
    loading,
    totalItems,
    error,
    getBooks,
    getBookById,
  };
};
