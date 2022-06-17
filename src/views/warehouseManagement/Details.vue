<template>
  <div class="table">
    <div class="header">
      <router-link to="/warehouseManagement/warehouse" style="color:#000">
        <a-icon type="arrow-left" style="padding-right: 5px"/>
        返回上一页
      </router-link>
    </div>
    <div style="display: flex">
      <a-button class="editable-btn" @click="handleSubmit('in')">
        入库商品
      </a-button>
      <a-button class="editable-btn" @click="handleSubmit('out')">
        出库商品
      </a-button>
      <download-excel
          class="export-excel-wrapper"
          :data="excelData"
          :fields="json_fields"
          name="库存报表.xls">
        <a-button class="editable-btn">
          <a-icon type="cloud-download"/>
          下载库存报表 Excel
        </a-button>
      </download-excel>
      <a-button class="editable-btn" @click="recordVisible = true">
        <a-icon type="retweet"/>
        出入库记录 Excel
      </a-button>
    </div>
    <advance-table
      :columns="columns"
      :data-source="dataSource"
      title="商品管理"
      :loading="loading"
      rowKey="id"
      @search="onSearch"
      @refresh="onRefresh"
      :format-conditions="true"
      @reset="onReset"
      :pagination="{
        current: page,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }"
    >
     <span slot="count" slot-scope="r">
        <a-tag  color="#108ee9">{{r.text}}</a-tag>
      </span>
       <!-- <template slot="action" slot-scope="record">
         <a-button @click="handleUpdate(record)" type="link"><a-icon type="edit"/>Update</a-button>
         <a-button @click="handleDelete(record)" type="link"><a-icon type="delete"/> Delete</a-button>
      </template> -->
    </advance-table>
    <a-modal
      @cancel="onCancel"
      @ok="onOk"
      okText="保存"
      :visible="modalVisible"
      width="35%"
      title="入库 | 出库"
    >
      <a-form-model ref="ruleForm" :model="data" :rules="rules">
        <a-form-model-item ref="cid" label="商品名称" prop="cid">
           <a-select
              v-model="data.cid"
              style="width: 100%"
              placeholder="select company"
              option-label-prop="label"
              @change="OnCommodityChange"
          >
            <a-select-option :value="item.id"
                            :label="item.name"
                            v-for="(item ) in commoditys"
                            :key="item.id">
              <span>{{item.name}}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="数量" prop="count">
          <a-input-number id="inputNumber" v-model="data.count"  :min="1"/>
        </a-form-model-item>
         <a-form-model-item ref="description" label="描述" prop="description">
          <a-input v-model="data.description"/>
        </a-form-model-item>
        <a-form-model-item label="公司" prop="companyCode" v-if="showCompany">
          <!-- <a-input v-model="admin.companyCode" /> -->
          <a-select
              v-model="data.companyCode"
              style="width: 100%"
              placeholder="select company"
              option-label-prop="label"
              @change="OnCompanyChange"
          >
            <a-select-option :value="item.companyCode"
                            :label="item.companyName"
                            v-for="(item ) in companys"
                            :key="item.id">
              <span>{{item.companyName}}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

     <a-modal
        title="出入库记录"
        width="80%"
        :visible="recordVisible"
        :footer="null"
        @cancel="recordVisible = false"
    >
      <InventoryRecords :warehouse-id="data.wid"/>
    </a-modal>
  </div>
</template>

<script>
  import AdvanceTable from '@/components/table/advance/AdvanceTable'
  import{findByCompanyCode} from '@/api/commodity'
  import {selectInventoryList,inAndOut,selectByWid} from '@/api/Inventory'
  import {getCompanys} from '@/api/company'
  import InventoryRecords from '@/views/warehouseManagement/InventoryRecords'
  export default {
    name: 'Commodity',
    components: {AdvanceTable,InventoryRecords},
    data() {
      return {
        loading: false,
        page: 1,
        pageSize: 10,
        total: 0,
        showCompany:this.$store.state.user.details.companyCode==='001'?true:false,
        columns: [
           {
                title: '商品ID',
                dataIndex: 'cid',
            },
            {
                title: '商品名称',
                dataIndex: 'name',
                searchAble: true,
            },
            {
                title: '库存数量',
                dataIndex: 'count',
                scopedSlots: {customRender: 'count'},
            },
            this.$store.state.user.details.companyCode==='001'?{
                title: '公司',
                dataIndex: 'companyName',
            }:{},
            {
                title: '修改时间',
                dataIndex: 'updateTime'
            },
            {
                title: '描述',
                dataIndex: 'description'
            },
        ],
        dataSource: [],
        conditions: {},
        modalVisible:false,
        recordVisible:false,
        rules:{
          cid:[{required:true,message:'请选择商品名称',trigger:'change'}],
          // count:[{required:true,message:'请填写数量',trigger:'change'}],
          count:[{required:true,message:'请填写商品数量',trigger:'change'}],
        },
        roles:[],
        companys:[],
        commoditys:[],
        data:{
            id:'',
            wid:this.$route.params.id,
            cid:'',
            name:'',
            count:50,
            description:'',
            companyCode:'',
            companyName:'',
            submitType:'',
        },
        excelData:[],
        json_fields:{
          "商品ID": "cid",
          "商品名称": "name",
          "库存盘点数量": "count",
          "公司名":"companyName",
          "时间": "updateTime",
        },
      }
    },
    created() {
      this.getInventoryList()
      this.getCompanys()
      this.getCommoditys()
      this.getExcelData()
    },
    methods: {
      getCompanys(){
        getCompanys().then(res=>{
           if (res.status) this.companys = res.data
        })
      },
      getCommoditys(){
        findByCompanyCode().then(res=>{
          if (res.status) this.commoditys = res.data
        })
      },
      getExcelData(){
        selectByWid(this.data.wid).then(res=>{
          if (res.status) this.excelData = res.data
        })
      },
      getInventoryList() {
        this.loading = true
        const {page, pageSize, conditions} = this
        selectInventoryList({page, pageSize, ...conditions},this.data.wid).then(res=>{
         if(res.status){
            const {list, page, pageSize, total} = res.data
            this.dataSource=list
            this.page=page
            this.pageSize=pageSize
            this.total=total
            this.loading = false
          }
        })
      },
      onSearch(conditions, searchOptions) {
        this.page = 1
        this.conditions = conditions
        this.getInventoryList()
      },
      onSizeChange(current, size) {
        this.page = 1
        this.pageSize = size
        this.getInventoryList()
      },
      onRefresh(conditions) {
        this.conditions = conditions
        this.getInventoryList()
      },
      onReset(conditions) {
        this.conditions = conditions
        this.getInventoryList()
      },
      onPageChange(page, pageSize) {
        this.page = page
        this.pageSize = pageSize
        this.getInventoryList()
      },
      cancel(){
        this.data.id=''
        this.data.cid=''
        this.data.name=''
        this.data.count=''
        this.data.description=''
        this.data.companyCode=''
        this.data.companyName=''
      },
      onCancel(){
        this.modalVisible=false
        this.cancel()
        this.getInventoryList()
      },
      handleSubmit(type) {
        this.submitType = type
        this.modalVisible = true
      },
      onOk(){
         this.$refs['ruleForm'].validate(vali=>{
           if(!vali) return;
            inAndOut(this.submitType,this.data).then(res=>{
              if (res.status) {
                if(this.submitType==='in')
                this.$message.success("入库成功")
                if(this.submitType==='out')
                this.$message.success("出库成功")
                this.cancel()
                this.getInventoryList()
                //刷新excel数据
                this.getExcelData()
              }
            })
         })
      },
      OnCompanyChange(value,option){
        this.data.companyName=option.componentOptions.propsData.label
      },
      OnCommodityChange(value,option){
        this.data.name=option.componentOptions.propsData.label
      }
    }
  }
</script>

<style scoped lang="less">
.table{
  background-color: @base-bg-color;
  padding: 24px;
}
.editable-btn {
  margin-bottom: 20px;
  margin-right: 10px;
}
.header {
  font-size: 18px;
  margin-bottom: 40px;
}

</style>