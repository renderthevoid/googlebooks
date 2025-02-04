<script setup lang="ts">
import BooksContainer from '@/components/UI/BooksContainer.vue' 
import { RouterView } from 'vue-router'
</script>

<template>
  <section>
    <BooksContainer>
      <RouterView />
    </BooksContainer>
  </section>
</template>

<style scoped></style>
