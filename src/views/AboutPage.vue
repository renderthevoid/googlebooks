<template>
  <div>
    <!-- <Fieldset
      :toggleable="true"
      class="px-4 py-4 border rounded-md border-gray-500 mb-4"
      :collapsed="true"
    >

      <template #legend>
        <div class="flex items-center gap-2">
          <i class="pi pi-trophy text-primary"></i>
          <span class="font-bold text-lg">Игровые достижения</span>
        </div>
      </template>


      <template #toggleIcon="{ collapsed }">
        <i
          :class="collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'"
          class="text-gray-600 hover:text-primary transition-colors"
        />
      </template>


      <template #content>
        <div class="achievement-list">
          <div class="achievement-item flex items-center gap-3 mb-3">
            <i class="pi pi-check-circle text-green-500"></i>
            <div>
              <h4 class="m-0 font-medium">Платина в Fallout 4</h4>
              <p class="text-sm text-gray-600 mt-1">Получено 15.03.2023</p>
            </div>
          </div>

          <div class="achievement-item flex items-center gap-3">
            <i class="pi pi-star-fill text-yellow-500"></i>
            <div>
              <h4 class="m-0 font-medium">Легенда Skyrim</h4>
              <p class="text-sm text-gray-600 mt-1">Все квесты завершены</p>
            </div>
          </div>
        </div>
      </template>
    </Fieldset> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Fieldset from 'primevue/fieldset'

const data = ref([
  {
    label: 'USA',
    data: 'us',
    children: [
      {
        label: 'California',
        data: 'ca',
        children: [
          {
            label: 'Los Angeles',
            data: 'la',
          },
          {
            label: 'San Francisco',
            data: 'sf',
          },
        ],
      },
      {
        label: 'New York',
        data: 'ny',
        children: [
          {
            label: 'New York City',
            data: 'nyc',
          },
          {
            label: 'Buffalo',
            data: 'buffalo',
          },
        ],
      },
    ],
  },
  {
    label: 'Canada',
    data: 'ca',
    children: [
      {
        label: 'Ontario',
        data: 'on',
        children: [
          {
            label: 'Toronto',
            data: 'toronto',
          },
          {
            label: 'Ottawa',
            data: 'ottawa',
          },
        ],
      },
      {
        label: 'British Columbia',
        data: 'bc',
        children: [
          {
            label: 'Vancouver',
            data: 'vancouver',
          },
          {
            label: 'Victoria',
            data: 'victoria',
          },
        ],
      },
    ],
  },
])
</script>

<style></style>
