<template>
  <div class="table">
    <a-button @click="handleCreate()" type="primary" size="large" width="200px"><a-icon type="plus" />创建</a-button>
    <advance-table
      :columns="columns"
      :data-source="dataSource"
      title="员工管理"
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
     <template slot="status" slot-scope="record">
        <a-tag :color=" record.text===1? 'orange': 'green'">{{record.text===1 ? '忙碌' : '空闲' }}</a-tag>
      </template>
      
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
      title="添加员工"
    >
      <a-form-model ref="ruleForm" :model="employee" :rules="rules">
        <a-form-model-item ref="name" label="员工/用户名" prop="username">
          <a-input v-model="employee.name"/>
        </a-form-model-item>
        <a-form-model-item ref="username" label="账号" prop="username">
          <a-input v-model="employee.username"/>
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input id="input" v-model="employee.password" />
        </a-form-model-item>
        <a-form-model-item label="公司" prop="companyCode" v-if="showCompany">
          <!-- <a-input v-model="admin.companyCode" /> -->
          <a-select
              v-model="employee.companyCode"
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
              v-model="employee.selectRoles"
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
        <a-form-model-item label="类型" prop="type">
          <a-select
              v-model="employee.type"
              style="width: 100%"
              placeholder="select one country"
              option-label-prop="label"
          >
            <a-select-option :value="item.value"
                            :label="item.label"
                            v-for="(item ,index) in types"
                            :key="index">
                {{item.label}}
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
  import {selectUserList,save,deleteUser} from '@/api/employee'
  import {getRoles} from '@/api/role'
  import {getCompanys} from '@/api/company'
  export default {
    name: 'EmployeeManagement',
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
                title: '员工/用户名',
                dataIndex: 'name',
                searchAble: true,
            },
            {
                title: '账号',
                dataIndex: 'username',
                searchAble: true,
            },
            {
                title: '创建时间',
                dataIndex: 'createAt'
            },
            this.$store.state.user.details.companyCode==='001'?{
                title: '公司',
                dataIndex: 'companyName',
                searchAble: true,
            }:{},
            {
                title: '权限',
                dataIndex: 'roles'
            },
            {
                title: '类型',
                dataIndex: 'type',
                searchAble: true,
                dataType:'select',
                search: {
                    selectOptions: [
                        {title: '用户', value: 'user'},
                        {title: '驾驶员', value: 'driver'},
                        {title: '管理员', value: 'admin'},
                    ]
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                scopedSlots: {customRender: 'status'},
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
        //   companyCode:[{required:true,message:'请选择公司',trigger:'change'}],
          selectRoles:[{required:true,message:'请选择权限',trigger:'change'}],
          type:[{required:true,message:'请选择类型',trigger:'change'}],
          name:[{required:true,message:'请填写员工/用户名',trigger:'change'}]
        },
        roles:[],
        companys:[],
        types:[
            {label: '用户', value: 'user'},
            {label: '驾驶员', value: 'driver'},
            {label: '管理员', value: 'admin'},
            {label: '普通员工', value: 'employee'},
        ],
        employee:{
          id:'',
          name:'',
          username:'',
          password:'',
          companyName:'',
          companyCode:'',
          selectRoles:[],
          roles:'',
          type:'',
          status:'',
        },
      }
    },
    created() {
      this.getUserList()
      this.getRoles()
      this.getCompanys()
    },
    //admin默认缓存路由
    //组件缓存时进入调用,刷新数据
    activated(){
      this.getUserList()
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
      getUserList() {
        this.loading = true
        const {page, pageSize, conditions} = this
        selectUserList({page, pageSize, ...conditions}).then(res=>{
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
        this.getUserList()
      },
      onSizeChange(current, size) {
        this.page = 1
        this.pageSize = size
        this.getUserList()
      },
      onRefresh(conditions) {
        this.conditions = conditions
        this.getUserList()
      },
      onReset(conditions) {
        this.conditions = conditions
        this.getUserList()
      },
      onPageChange(page, pageSize) {
        this.page = page
        this.pageSize = pageSize
        this.getUserList()
      },
      handleCreate(){
        this.modalVisible=true;
      },
      handleUpdate(r){
        this.employee.id=r.record.id
        this.employee.username=r.record.username
        this.employee.password=r.record.password
        this.employee.companyName=r.record.companyName
        this.employee.companyCode=r.record.companyCode
        this.employee.type=r.record.type
        this.employee.name=r.record.name
        this.employee.status=r.record.status
        var roles=r.record.roles.split(';')
        this.employee.selectRoles=[]
        for(let i=0;i<roles.length;i++){
         this.employee.selectRoles[i]=roles[i]
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
            deleteUser(r.record.id).then(res=>{
              if(res.status){
                this.$message.success("删除成功")
                this.getUserList()
              }else{
                this.$message.error("删除失败")
              }
            })
          }
        })
      },
      cancel(){
        this.employee.id=''
        this.employee.username=''
        this.employee.password=''
        this.employee.companyName=''
        this.employee.companyCode=''
        this.employee.selectRoles=[]
        this.employee.roles=''
        this.employee.type=''
        this.employee.name=''
        this.employee.status=''
      },
      onCancel(){
        this.modalVisible=false
        this.cancel()
        this.getUserList()
      },
      onOk(){
         this.$refs['ruleForm'].validate(vali=>{
           if(!vali) return;
             let str = ''
            for (let i = 0; i < this.employee.selectRoles.length; i++) {
              if (i === this.employee.selectRoles.length - 1) {
                str += this.employee.selectRoles[i]
              } else {
                str += this.employee.selectRoles[i] + ";"
              }
            }
            this.employee.roles=str
            save(this.employee).then(res=>{
              if (res.status) {
                this.$message.success("保存成功")
                this.cancel()
                this.getUserList()
              }
            })
         })
      },
      OnCompanyChange(value,option){
        this.employee.companyName=option.componentOptions.propsData.label
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