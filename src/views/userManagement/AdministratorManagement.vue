<template>
  <div class="table">
    <a-button @click="handleCreate()" type="primary" size="large" width="200px"><a-icon type="plus" />创建</a-button>
    <advance-table
      :columns="columns"
      :data-source="dataSource"
      title="管理员"
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
      title="添加管理员"
    >
      <a-form-model ref="ruleForm" :model="admin" :rules="rules">
        <a-form-model-item ref="username" label="用户名" prop="username">
          <a-input v-model="admin.username"/>
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input id="input" v-model="admin.password" />
        </a-form-model-item>
        <a-form-model-item label="公司" prop="companyCode">
          <!-- <a-input v-model="admin.companyCode" /> -->
          <a-select
              v-model="admin.companyCode"
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
        <a-form-model-item label="权限" prop="selectRoles">
          <a-select
              v-model="admin.selectRoles"
              mode="multiple"
              style="width: 100%"
              placeholder="select one country"
              option-label-prop="label"
          >
            <a-select-option :value="item.value"
                            :label="item.value"
                            v-for="(item ,index) in roles"
                            :key="index">
              <span role="img" :aria-label="item.value">🇨🇳</span>{{ item.value + ' (描述: ' + item.description + ')' }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import AdvanceTable from '@/components/table/advance/AdvanceTable'
  // import {dataSource as ds} from '@/services'
  import {selectAdminList,save,deleteAdmin} from '@/api/admin'
  import {getRoles} from '@/api/role'
  import {getCompanys} from '@/api/company'
  export default {
    name: 'AdministratorManagement',
    components: {AdvanceTable},
    data() {
      return {
        loading: false,
        page: 1,
        pageSize: 10,
        total: 0,
        columns: [
            {
                title: '用户名',
                dataIndex: 'username',
                searchAble: true,
            },
            {
                title: '创建时间',
                dataIndex: 'createAt'
            },
            {
                title: '公司',
                dataIndex: 'companyName',
                searchAble: true,
            },
            {
                title: '权限',
                dataIndex: 'roles'
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
          username:[{required:true,message:'请填写用户名',trigger:'change'}],
          password:[{required:true,message:'请填写密码',trigger:'change'}],
          companyCode:[{required:true,message:'请选择公司',trigger:'change'}],
          selectRoles:[{required:true,message:'请选择权限',trigger:'change'}]
        },
        roles:[],
        companys:[],
        admin:{
          id:'',
          username:'',
          password:'',
          companyName:'',
          companyCode:'',
          selectRoles:[],
          roles:'',
        },
      }
    },
    created() {
      this.getAdminList()
      this.getRoles()
      this.getCompanys()
    },
    activated(){
      this.getAdminList()
      this.getRoles()
      this.getCompanys()
    },
    methods: {
      getRoles(){
        getRoles().then(res=>{
          if (res.status) this.roles = res.data
        })
      },
      getCompanys(){
        getCompanys().then(res=>{
           if (res.status) this.companys = res.data
        })
      },
      getAdminList() {
        this.loading = true
        const {page, pageSize, conditions} = this
        selectAdminList({page, pageSize, ...conditions}).then(res=>{
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
        this.getAdminList()
      },
      onSizeChange(current, size) {
        this.page = 1
        this.pageSize = size
        this.getAdminList()
      },
      onRefresh(conditions) {
        this.conditions = conditions
        this.getAdminList()
      },
      onReset(conditions) {
        this.conditions = conditions
        this.getAdminList()
      },
      onPageChange(page, pageSize) {
        this.page = page
        this.pageSize = pageSize
        this.getAdminList()
      },
      handleCreate(){
        this.modalVisible=true;
      },
      handleUpdate(r){
        this.admin.id=r.record.id
        this.admin.username=r.record.username
        this.admin.password=r.record.password
        this.admin.companyName=r.record.companyName
        this.admin.companyCode=r.record.companyCode
        var roles=r.record.roles.split(';')
        this.admin.selectRoles=[]
        for(let i=0;i<roles.length;i++){
         this.admin.selectRoles[i]=roles[i]
        }
        this.modalVisible=true;
      },
      handleDelete(r){
        this.$confirm({
          content:'此操作将删除'+r.record.username+', 是否继续?',
          title:'提示', 
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          onOk:() => {
            deleteAdmin(r.record.id).then(res=>{
              if(res.status){
                this.$message.success("删除成功")
                this.getAdminList()
              }else{
                this.$message.error("删除失败")
              }
            })
          }
        })
      },
      cancel(){
        this.admin.id=''
        this.admin.username=''
        this.admin.password=''
        this.admin.companyName=''
        this.admin.companyCode=''
        this.admin.selectRoles=[]
        this.admin.roles=''
      },
      onCancel(){
        this.modalVisible=false
        this.cancel()
        this.getAdminList()
      },
      onOk(){
         this.$refs['ruleForm'].validate(vali=>{
           console.log('点击保存')
           if(!vali) return;
             let str = ''
            for (let i = 0; i < this.admin.selectRoles.length; i++) {
              if (i === this.admin.selectRoles.length - 1) {
                str += this.admin.selectRoles[i]
              } else {
                str += this.admin.selectRoles[i] + ";"
              }
            }
            this.admin.roles=str
            save(this.admin).then(res=>{
              if (res.status) {
                this.$message.success("保存成功")
                this.cancel()
                this.getAdminList()
              }
            })
         })
      },
      OnCompanyChange(value,option){
        this.admin.companyName=option.componentOptions.propsData.label
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