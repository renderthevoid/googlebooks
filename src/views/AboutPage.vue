<template>
  <main class="my-5">
    <h2 class="font-bold text-5xl mb-2">Всем здравствуйте!</h2>
    <div class="text-2xl">
      <p class="mb-2">Меня зовут Владислав, мне 21 год</p>

      <div class="flex justify-center mb-2">
        <img src="https://99px.ru/sstorage/86/2015/10/image_861810152238237421056.gif" alt="" />
      </div>

      <div>
        <p class="mb-3">Выставлю оценку своим навыкам и не только</p>

        <div class="border rounded-xl p-4 w-4xl m-auto">
          <div class="flex justify-between items-center py-2">
            <span class="text-sm font-bold">HTML</span>
            <Rating v-model="data.rating_1">
              <template #onicon>🥶</template>
              <template #officon>🙄</template>
            </Rating>
          </div>

          <div class="flex justify-between items-center py-2">
            <span class="text-sm font-bold">Vue</span>
            <Rating v-model="data.rating_2">
              <template #onicon>🥶</template>
              <template #officon>🙄</template>
            </Rating>
          </div>

          <div class="flex justify-between items-center py-2">
            <span class="text-sm font-bold">Docker???</span>
            <Rating v-model="data.rating_3">
              <template #onicon>🥶</template>
              <template #officon>🙄</template>
            </Rating>
          </div>

          <div class="flex justify-between items-center py-2">
            <span class="text-sm font-bold">Коммуникабельность</span>
            <Rating v-model="data.rating_4">
              <template #onicon>🥶</template>
              <template #officon>🙄</template>
            </Rating>
          </div>

          <div class="flex justify-between items-center py-2">
            <span class="text-sm font-bold">Платина в Fallout 4</span>
            <Rating v-model="data.rating_5">
              <template #onicon>🥶</template>
              <template #officon>🙄</template>
            </Rating>
          </div>
        </div>
      </div>


      <p class="mb-2 text-center">Всем спасибо!</p>
      <div class="flex justify-center">
        <RouterLink :to="{ name: 'home' }">
          <Button
            class="bg-gray-800 text-white border rounded-md py-1 px-3 mt-3 hover:bg-gray-400"
            label="Вернуться книжки посмотреть"
          />
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Rating from 'primevue/rating'
import { reactive } from 'vue'

const data = reactive({
  rating_1: 4,
  rating_2: 3,
  rating_3: 1,
  rating_4: 5,
  rating_5: 5,
})
</script>

<style></style>
