<template>
  <div>
    <download-excel
        class="export-excel-wrapper"
        :data="data"
        :fields="json_fields"
        name="出入库记录.xls">
      <a-button class="btn" icon="download" type="primary">下载Excel表格</a-button>
    </download-excel>
    <a-table :columns="columns" :data-source="data" rowKey="id">
      <span slot="type" slot-scope="type">
        <a-tag :color="type === -1 ? 'green' : 'cyan'">{{ type === -1 ? '出库' : '入库' }}</a-tag>
      </span>
    </a-table>
  </div>
</template>

<script>
import {selectByWid} from "@/api/inventoryRecord";


export default {

  components: {},

  props: {
    warehouseId: {type: String, default: ''},
  },

  data() {
    return {
      data: [],
      columns:[
        {
            dataIndex: 'name',
            key: 'name',
            title: '商品',
        },
        {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: '时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        },
        {
            title: '类型',
            key: 'type',
            dataIndex: 'type',
            scopedSlots: {customRender: 'type'},
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        this.$store.state.user.details.companyCode==='001'?{
            title: '公司',
            dataIndex: 'companyName',
        }:{},
    ],
      json_fields: {
        "商品ID": "cid",
        "商品名称": "name",
        "类型": {
          field: 'type',
          callback: (value) => {
            return value === -1 ? '出库' : '入库'
          }
        },
        "数量": "count",
        "描述": "description",
        "时间": "updateTime",
      },
    }
  },

  mounted() {
    selectByWid(this.warehouseId).then((res) => {
      this.data = res.data
    })
  },

}
</script>

<style scoped>
.btn {
  margin-bottom: 15px;
  letter-spacing: 1px;
}
</style>