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
    console.log(`object`)
    this.options = this.params.options
    this.optionsLabel = this.params.optionsLabel
    this.selectedOption = null

    if (!this.params.options) {
      this.options = [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ]
    }
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
    filterable placeholder="Статус"
  >
    <el-option
      v-for="(el, index) in [{value: 'finished', label: 'Yes'}, {value: 'new', label: 'No'}]"
      :key="index"
      :value="el.value"
      :label="el.label"
    >
    </el-option>
  </el-select>`,
})
