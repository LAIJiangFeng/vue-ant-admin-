<template>
  <div class="table">
    <a-button @click="handleCreate()" type="primary" size="large" width="200px"><a-icon type="plus" />创建</a-button>
    <advance-table
      :columns="columns"
      :data-source="dataSource"
      title="公司"
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
      title="添加公司"
    >
      <a-form-model ref="ruleForm" :model="company" :rules="rules">
        <a-form-model-item ref="companyCode" label="公司号" prop="companyCode">
          <a-input v-model.number="company.companyCode"/>
        </a-form-model-item>
        <a-form-model-item label="公司名" prop="companyName">
          <a-input id="input" v-model="company.companyName" />
        </a-form-model-item>
        <a-form-model-item label="地址" prop="address">
          <a-input v-model="company.address" />
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="phone">
          <a-input v-model="company.phone" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import AdvanceTable from '@/components/table/advance/AdvanceTable'
  // import {dataSource as ds} from '@/services'
  import {save,selectCompanyList,deleteCompany} from '@/api/company'
  export default {
    name: 'company',
    components: {AdvanceTable},
    data() {
      return {
        loading: false,
        page: 1,
        pageSize: 10,
        total: 0,
        columns: [
            {
                title: '公司号',
                dataIndex: 'companyCode',
            },
            {
                title: '公司名',
                dataIndex: 'companyName',
                searchAble: true,
            },
            {
                title: '地址',
                dataIndex: 'address',
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '创建时间',
                dataIndex: 'createAt'
            },
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
          companyCode:[{required:true,message:'请填写公司号',trigger:'blur'}],
          companyName:[{required:true,message:'请填写公司名',trigger:'blur'}],
          address:[{required:true,message:'请填写公司地址',trigger:'blur'}],
          phone:[{required:true,message:'请填写公司联系电话',trigger:'blur'}]
        },
        company:{
          id:'',
          companyCode:'',
          companyName:'',
          address:'',
          phone:'',
        },
      }
    },
    created() {
      this.getCompanyList()
    },
    activated(){
     this.getCompanyList()
    },
    methods: {
      getCompanyList() {
        this.loading = true
        const {page, pageSize, conditions} = this
        selectCompanyList({page, pageSize, ...conditions}).then(res=>{
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
        // console.log(searchOptions)
        this.page = 1
        this.conditions = conditions
        this.getCompanyList()
      },
      onSizeChange(current, size) {
        this.page = 1
        this.pageSize = size
        this.getCompanyList()
      },
      onRefresh(conditions) {
        this.conditions = conditions
        this.getCompanyList()
      },
      onReset(conditions) {
        this.conditions = conditions
        this.getCompanyList()
      },
      onPageChange(page, pageSize) {
        this.page = page
        this.pageSize = pageSize
        this.getCompanyList()
      },
      handleCreate(){
        this.modalVisible=true;
      },
      handleUpdate(r){
        this.company=r.record
        this.modalVisible=true;
      },
      handleDelete(r){
         this.$confirm({
          content:'此操作将删除'+r.record.companyName+', 是否继续?',
          title:'提示', 
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          onOk:() => {
            deleteCompany(r.record.id).then(res=>{
              if(res.status){
                this.$message.success("删除成功")
                this.getCompanyList()
              }else{
                this.$message.error("删除失败")
              }
            })
          }
        })
      },
      onCancel(){
        this.modalVisible=false;
        this.cancel()
        this.getCompanyList()
      },
      cancel(){
        this.company.id=''
        this.company.companyCode=''
        this.company.companyName=''
        this.company.address=''
        this.company.phone=''
      },
      onOk(){
         this.$refs['ruleForm'].validate(vali=>{
           if(!vali) return;
           save(this.company).then(res=>{
              if(res.status){
                this.$message.success("保存成功")
                this.cancel()
                this.getCompanyList()
              }else{
                this.$message.error("保存失败")
              }
           })
         })
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