<template>
  <div style="padding: 0">
    <ag-grid-vue
      style="width: 100%; height: 72vh"
      :get-row-style="getRowStyle"
      class="ag-theme-material w-100 my-4 ag-grid-table vs-con-loading__container"
      :grid-options="gridOptions"
      :default-col-def="defaultColDef"
      :locale-text="localeText"
      :column-defs="columnDefs"
      col-resize-default="shift"
      :animate-rows="true"
      :pagination="true"
      :pagination-page-size="paginationPageSize"
      :cache-block-size="paginationPageSize"
      :framework-components="frameworkComponents"
      :infinite-initial-row-count="1"
      :max-blocks-in-cache="3"
      :suppress-pagination-panel="true"
      @grid-ready="onGridReady"
    >
    </ag-grid-vue>
    <el-pagination
      style="margin-top: 8px"
      background
      layout="prev, pager, next"
      :page-size="paginationPageSize"
      :total="totalCount"
      @current-change="onPageChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import moment from 'moment'
import { AgGridVue } from 'ag-grid-vue'
import { AllCommunityModules } from '@ag-grid-community/all-modules'
import DropdownFilter from './AgGrid/DropdownFilter.js'
import { localeText } from '~/utils/data'

export default {
  components: { AgGridVue },
  props: {
    columnDefs: {
      type: Array,
      required: true,
    },
    fetchData: {
      type: Function,
      required: true,
    },
  },
  data: () => {
    return {
      totalCount: 0,
      currentPage: 1,
      gridApi: null,
      modules: AllCommunityModules,
      frameworkComponents: null,
      defaultColDef: {
        width: 150,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        resizable: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
        cellStyle: { 'justify-content': 'flex-end' },
      },
      gridOptions: {
        rowModelType: 'infinite',
        suppressPropertyNamesCheck: true,
        overlayLoadingTemplate:
          '<span class="ag-overlay-loading-center">Подождите, пока загружаются ваши данные</span>',
        overlayNoRowsTemplate:
          '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">Нет данных по запросу</span>',
        suppressCellSelection: true,
      },
      localeText,
    }
  },
  computed: {
    paginationPageSize() {
      if (this.gridApi) return this.gridApi.paginationGetPageSize()
      else return 50
    },
  },
  beforeMount() {
    this.frameworkComponents = {
      dropdownFilter: DropdownFilter,
    }
  },
  mounted() {
    const that = this
    this.gridOptions.api.setDatasource(
      new (function () {
        this.getRows = async (params) => {
          this.applyFilters = (filters) => {
            const filterObject = {}
            Object.keys(filters).forEach((key) => {
              if (filters[key].filterType === 'date') {
                filterObject[key] = moment(filters[key].dateFrom).format(
                  'YYYY-MM-DD'
                )
              } else {
                filterObject[key] = filters[key].filter
              }
            })
            return filterObject
          }
          const queryData = {
            page: that.gridApi.paginationGetCurrentPage() + 1,
            limit: that.paginationPageSize,
            filter: this.applyFilters(params.filterModel),
            sort: {
              id: 'DESC',
            },
          }
          that.gridApi.showLoadingOverlay()
          const orders = await that.fetchData(queryData)
          that.totalCount = orders[1]
          if (orders[1] === 0) {
            that.gridApi.showNoRowsOverlay()
          } else {
            that.gridApi.hideOverlay()
          }
          params.successCallback(orders[0], orders[1])
        }
      })()
    )
  },
  methods: {
    onPageChange(val) {
      this.currentPage = val
      this.gridApi.paginationGoToPage(val - 1)
    },
    onGridReady(params) {
      this.gridApi = params.api
    },
    getRowStyle() {
      return {
        height: '36px',
        fontSize: '0.9rem',
        boxSizing: 'border-box',
        maxHeight: '100%',
      }
    },
  },
}
</script>
