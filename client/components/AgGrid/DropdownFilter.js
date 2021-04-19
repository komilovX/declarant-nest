import Vue from 'vue'
export default Vue.component('DropDownFloatingFilter', {
  data() {
    return {
      options: [],
      selectedOption: '',
      optionsLable: '',
      foreignKeySet: false,
    }
  },
  beforeMount() {
    this.options = this.params.options
    this.optionsLabel = this.params.optionsLabel || 'Select'
    this.selectedOption = null
  },

  methods: {
    valueChanged(value) {
      this.selectedOption = value
      const that = this
      this.params.parentFilterInstance(function (instance) {
        if (that.foreignKeySet) {
          instance.onFloatingFilterChanged('isNotNullFloating', value)
        } else {
          instance.onFloatingFilterChanged('equals', value)
        }
      })
    },
  },
  template: `
  <el-select 
    v-model="selectedOption" 
    clearable size="small" 
    @change="valueChanged" 
    filterable :placeholder="optionsLabel"
  >
    <el-option
      v-for="(el, index) in options"
      :key="index"
      :value="el.value"
      :label="el.label"
    >
    </el-option>
  </el-select>`,
})
