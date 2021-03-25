<template>
  <div class="flex items-center mb-2">
    <h4 class="mr-4">{{ headerText }}</h4>
    <app-add-button @on-click="$emit('on-click')" />
  </div>
</template>

<script>
export default {
  props: {
    headerText: {
      type: String,
      required: true,
    },
  },
}
</script>
