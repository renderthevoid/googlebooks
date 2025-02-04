<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import BooksContainer from '@/components/ui/BooksContainer.vue'
const isDark = ref(false)

// Функция для переключения темы
const toggleTheme = () => {
  const rootElement = document.documentElement 
  if (isDark.value) {
    rootElement.classList.remove('dark')
  } else {
    rootElement.classList.add('dark')
  }
  isDark.value = !isDark.value
}
</script>

<template>
  <section ref="rootSection">
    <button @click="toggleTheme">2</button>
    <BooksContainer>
      <RouterView />
    </BooksContainer>
  </section>
</template>

<style scoped></style>
