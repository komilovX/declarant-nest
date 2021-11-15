<template>
  <div>
    <h2 class="font-medium text-lg">Все твои задачи</h2>
    <dl class="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <svg
                class="h-6 w-6 text-white"
                x-description="Heroicon name: users"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M3 4H16M3 8H12M3 12H12M17 8V20M17 20L13 16M17 20L21 16"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">
                В процессе
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ TASK }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div
              class="flex-shrink-0 bg-purple-600 bg-opacity-75 rounded-md p-3"
            >
              <svg
                class="h-6 w-6 text-white"
                x-description="Heroicon name: users"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M3 4H16M3 8H12M3 12H9M13 12L17 8M17 8L21 12M17 8V20"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">Дано</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ DONE }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg
                class="h-6 w-6 text-white"
                x-description="Heroicon name: users"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M11 15L8 12M8 12L11 9M8 12L16 12M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Вернулся
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ RETURNED }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg
                class="h-6 w-6 text-white"
                x-description="Heroicon name: users"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">Готово</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ FINISHED }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>
    </dl>
  </div>
</template>

<script>
import { DocumentStatus } from '~/utils/data'
export default {
  props: {
    tasks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      TASK: 0,
      DONE: 0,
      RETURNED: 0,
      FINISHED: 0,
    }
  },
  mounted() {
    this.tasks.forEach((task) => {
      switch (task.status) {
        case DocumentStatus.TASK:
          this.TASK = task.count
          return
        case DocumentStatus.DONE:
          this.DONE = task.count
          return
        case DocumentStatus.RETURNED:
          this.RETURNED = task.count
          return
        case DocumentStatus.FINISHED:
          this.FINISHED = task.count
      }
    })
  },
}
</script>
