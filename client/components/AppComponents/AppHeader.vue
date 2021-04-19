<template>
  <div>
    <div class="flex items-center">
      <h2 class="mr-2 text-lg font-medium">{{ headerText }}</h2>
      <app-add-button
        v-if="button"
        size="small"
        @on-click="$emit('on-click')"
      />
    </div>
    <hr class="my-2" />
  </div>
</template>

<script>
import AppAddButton from './AppAddButton.vue'
export default {
  components: { AppAddButton },
  props: {
    headerText: {
      type: String,
      required: true,
    },
    button: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
