<template>
  <el-select v-model="value" size="small" @change="valueChanged" filterable placeholder="Select">
    <el-option
      v-for="key in Object.keys(params.options)"
      :key="key"
      :label="params.options[key]"
      :value="key">
    </el-option>
  </el-select>
</template>

<script>
import Vue from 'vue'
export default Vue.component('drop-down-floating-filter',{
  data() {
    return {
      value: null
    }
  },
  methods: {
    valueChanged(value) {
      this.params.parentFilterInstance(function (instance) {
        instance.onFloatingFilterChanged('equals', value);
      });
    },
  },
})
</script>
