<template>
  <div class="table">
    <a-button @click="handleCreate()" type="primary" size="large" width="200px"><a-icon type="plus" />添加商品</a-button>
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
     <!-- <span slot="status" slot-scope="status">
        <a-tag v-if="status.record.status===1" color="#87d068">已入库</a-tag>
        <a-tag v-else color="#f50">未入库</a-tag>
      </span> -->
       <template slot="action" slot-scope="record">
         <a-button @click="handleUpdate(record)" type="link"><a-icon type="edit"/>Update</a-button>
         <a-button @click="handleDelete(record)" type="link"><a-icon type="delete"/> Delete</a-button>
      </template>
    </advance-table>
    <a-modal
      @cancel="onCancel"
      @ok="onOk"
      okText="保存"
      :visible="modalVisible"
      width="35%"
      title="添加商品"
    >
      <a-form-model ref="ruleForm" :model="data" :rules="rules">
        <a-form-model-item ref="name" label="商品名称" prop="name">
          <a-input v-model="data.name"/>
        </a-form-model-item>
        <!-- <a-form-model-item label="数量" prop="count">
          <a-input id="input" v-model="data.count" />
        </a-form-model-item> -->
         <a-form-model-item ref="description" label="描述" prop="description">
          <a-input v-model="data.description"/>
        </a-form-model-item>
         <a-form-model-item ref="price" label="单价" prop="price">
          <a-input v-model="data.price"/>
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
  </div>
</template>

<script>
  import AdvanceTable from '@/components/table/advance/AdvanceTable'
  import {selectCommodityList,save,deleteCommodity} from '@/api/commodity'
  import {getCompanys} from '@/api/company'
  export default {
    name: 'Commodity',
    components: {AdvanceTable},
    data() {
      return {
        loading: false,
        page: 1,
        pageSize: 10,
        total: 0,
        showCompany:this.$store.state.user.details.companyCode==='001'?true:false,
        columns: [
            {
                title: '商品名称',
                dataIndex: 'name',
                searchAble: true,
            },
            {
                title: '库存数量',
                dataIndex: 'count'
            },
            this.$store.state.user.details.companyCode==='001'?{
                title: '公司',
                dataIndex: 'companyName',
                searchAble: true,
            }:{},
            {
                title: '修改时间',
                dataIndex: 'updateAt'
            },
            {
                title: '描述',
                dataIndex: 'description'
            },
            {
                title: '单价',
                dataIndex: 'price',
                searchAble: true,
            },
            // {
            //     title: '状态',
            //     dataIndex: 'status',
            //     scopedSlots: {customRender: 'status'},
            // },
            {
                title: '操作',
                dataIndex: 'action',
                scopedSlots: {customRender: 'action'},
            }
        ],
        dataSource: [],
        conditions: {},
        modalVisible:false,
        rules:{
          name:[{required:true,message:'请填写商品名称',trigger:'change'}],
          // count:[{required:true,message:'请填写数量',trigger:'change'}],
          price:[{required:true,message:'请填写单价',trigger:'change'}],
        },
        roles:[],
        companys:[],
        data:{
            id:'',
            name:'',
            count:'',
            description:'',
            companyCode:'',
            companyName:'',
            price:'',
            userId:'',
        },
      }
    },
    created() {
      this.getCommodityList()
      this.getCompanys()
    },
    activated(){
      this.getCommodityList()
      this.getCompanys()
    },
    methods: {
      getCompanys(){
        getCompanys().then(res=>{
           if (res.status) this.companys = res.data
        })
      },
      getCommodityList() {
        this.loading = true
        const {page, pageSize, conditions} = this
        selectCommodityList({page, pageSize, ...conditions}).then(res=>{
          console.log(res.status)
          if(res.status){
            const {list, page, pageSize, total} = res.data
            this.dataSource=list
            this.page=page
            this.pageSize=pageSize
            this.total=total
            this.loading = false
          }

          if(res.code===403){
            this.$router.push("/exception/403")
          }
          if(res.code===500){
            this.$router.push('/exception/500')
          }
        })
      },
      onSearch(conditions, searchOptions) {
        if(conditions.price &&!/^[0-9]+(.[0-9]{2})?$/.test(conditions.price)){
            this.$message.error('价格必须为数字')
            return
        }
        this.page = 1
        this.conditions = conditions
        this.getCommodityList()
      },
      onSizeChange(current, size) {
        this.page = 1
        this.pageSize = size
        this.getCommodityList()
      },
      onRefresh(conditions) {
        if(conditions.price &&!/^[0-9]+(.[0-9]{2})?$/.test(conditions.price)){
            this.$message.error('价格必须为数字')
            return
        }
        this.conditions = conditions
        this.getCommodityList()
      },
      onReset(conditions) {
       if(conditions.price &&!/^[0-9]+(.[0-9]{2})?$/.test(conditions.price)){
            this.$message.error('价格必须为数字')
            return
        }
        this.conditions = conditions
        this.getCommodityList()
      },
      onPageChange(page, pageSize) {
        this.page = page
        this.pageSize = pageSize
        this.getCommodityList()
      },
      handleCreate(){
        this.modalVisible=true;
      },
      handleUpdate(r){
        this.data.id=r.record.id
        this.data.name=r.record.name
        this.data.count=r.record.count
        this.data.description=r.record.description
        this.data.price=r.record.price
        this.data.userId=r.record.userId
        this.data.companyCode=r.record.companyCode
        this.data.companyName=r.record.companyName
        this.modalVisible=true;
      },
      handleDelete(r){
        this.$confirm({
          content:'此操作将删除'+r.record.name+', 是否继续?',
          title:'提示', 
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          onOk:() => {
            deleteCommodity(r.record.id).then(res=>{
              if(res.status){
                this.$message.success("删除成功")
                this.getCommodityList()
              }else{
                this.$message.error("删除失败")
              }
            })
          }
        })
      },
      cancel(){
        this.data.id=''
        this.data.name=''
        this.data.count=''
        this.data.description=''
        this.data.price=''
        this.data.userId=''
        this.data.companyCode=''
        this.data.companyName=''
      },
      onCancel(){
        this.modalVisible=false
        this.cancel()
        this.getCommodityList()
      },
      onOk(){
         this.$refs['ruleForm'].validate(vali=>{
           if(!vali) return;
            save(this.data).then(res=>{
              if (res.status) {
                this.$message.success("保存成功")
                this.cancel()
                this.getCommodityList()
              }
            })
         })
      },
      OnCompanyChange(value,option){
        this.data.companyName=option.componentOptions.propsData.label
      },
    }
  }
</script>

<style scoped lang="less">
.table{
  background-color: @base-bg-color;
  padding: 24px;
}
</style>