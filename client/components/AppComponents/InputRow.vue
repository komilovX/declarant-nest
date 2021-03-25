<template>
  <div>
    <app-input
      v-if="row.changed"
      :value="value"
      :type="inputType"
      @on-change="$emit('on-change', $event)"
    />
    <span v-else>
      {{ value }}
    </span>
  </div>
</template>

<script>
import AppInput from './AppInput.vue'
export default {
  components: { AppInput },
  props: {
    inputType: {
      type: String,
      default: 'input',
    },
    row: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
}
</script>
