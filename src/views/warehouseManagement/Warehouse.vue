<template>
    <div class="card-list">
      <div style="margin-top:20px;display:flex"> 
        <a-input v-model="searchName" placeholder="请输入仓库名称" style="width:400px;height:42px" ></a-input>
        <a-button @click="getWarehouseList()" type="primary" size="large" width="200px"><a-icon type="search" />搜索</a-button>
      </div>
      <a-list
        :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
        :dataSource="dataSource"
        :loading="loading"
        class="list"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <template v-if="item.add">
            <a-button class="new-btn" type="dashed" @click="handleCreate()">
              <a-icon type="plus" />新增仓库
            </a-button>
          </template>
          <template v-else>
            <a-card :hoverable="true">
              <a-card-meta >
                <div style="margin-bottom: 3px" slot="title">{{item.name}}</div>
                <a-avatar class="card-avatar" slot="avatar" :src="imgList[Math.floor(Math.random() * 3)]" size="large" />
                <div class="meta-content" slot="description">
                   <div>负责人:{{item.principle}}</div>
                   <div style="margin-top:10px" >联系电话:{{item.phone}}</div>
                </div>
               
              </a-card-meta>
              <a slot="actions" @click="handleUpdate(item)"><a-icon type="edit"/>修改</a>
              <a slot="actions" @click="handleDelete(item)"><a-icon type="delete"/>删除</a>
              <a slot="actions"> 
                <router-link :to="'/warehouseManagement/details/'+item.id">
                  <a-icon type="bar-chart"/> 库存管理
                </router-link>
              </a>
            </a-card>
          </template>
        </a-list-item>
      </a-list>
      <a-modal
        @cancel="onCancel"
        @ok="onOk"
        okText="保存"
        :visible="modalVisible"
        width="35%"
        title="新增仓库"
      >
        <a-form-model ref="ruleForm" :model="data" :rules="rules">
          <a-form-model-item ref="name" label="仓库名称" prop="name">
            <a-input v-model="data.name"/>
          </a-form-model-item>
          <a-form-model-item label="负责人" prop="principle">
            <a-input id="input" v-model="data.principle" />
          </a-form-model-item>
          <a-form-model-item ref="phone" label="电话" prop="phone">
            <a-input v-model="data.phone"/>
          </a-form-model-item>
          <a-form-model-item label="公司" prop="companyCode" v-if="showCompany">
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
import {save,selectWarehouseList,deleteWarehouse} from '@/api/warehouse'
import {getCompanys} from '@/api/company'
export default {
  name: 'Warehouse',
  data () {
    return {
      loading: false,
      showCompany:this.$store.state.user.details.companyCode==='001'?true:false,
      dataSource: [],
      modalVisible:false,
      rules:{
        name:[{required:true,message:'请填写仓库名称',trigger:'change'}],
        principle:[{required:true,message:'请填写负责人',trigger:'change'}],
        phone:[{required:true,message:'请填写电话',trigger:'change'}],
      },
      companys:[],
      data:{
          id:'',
          name:'',
          principle:'',
          phone:'',
          companyCode:'',
          companyName:'',
      },
       imgList: [
        require('@/assets/img/warehouse0.svg'),
        require('@/assets/img/warehouse1.svg'),
        require('@/assets/img/warehouse2.svg'),
        ],
      searchName:'',
    }
  },
  created(){
    this.getWarehouseList()
    this.getCompanys()
  },
  activated(){
    this.getWarehouseList()
    this.getCompanys()
  },
  methods:{
      getCompanys(){
        getCompanys().then(res=>{
           if (res.status) this.companys = res.data
        })
      },
      getWarehouseList(){
        this.loading = true
        selectWarehouseList(this.searchName).then(res=>{
          if(res.status){
            this.dataSource=res.data
            this.dataSource.unshift({add: true})
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
      handleCreate(){
        this.modalVisible=true;
      },
      cancel(){
        this.data.id=''
        this.data.name=''
        this.data.principle=''
        this.data.phone=''
        this.data.companyCode=''
        this.data.companyName=''
      },
      onCancel(){
         this.modalVisible=false;
         this.cancel();
      },
      onOk(){
         this.$refs['ruleForm'].validate(vali=>{
           if(!vali) return;
            save(this.data).then(res=>{
              if (res.status) {
                this.$message.success("添加成功")
                this.cancel()
                this.getWarehouseList()
              }
            })
         })
      },
      handleUpdate(item){
        this.modalVisible=true;
        this.data.id=item.id;
        this.data.name=item.name;
        this.data.principle=item.principle;
        this.data.phone=item.phone;
        this.data.companyCode=item.companyCode;
        this.data.companyName=item.companyName;
      },
      handleDelete(item){
         this.$confirm({
          content:'此操作将删除'+item.name+', 是否继续?',
          title:'提示', 
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          onOk:() => {
            deleteWarehouse(item.id).then(res=>{
              if(res.status){
                this.$message.success("删除成功")
                this.getWarehouseList()
              }else{
                this.$message.error("删除失败")
              }
            })
          }
        })
      },
      OnCompanyChange(value,option){
        this.data.companyName=option.componentOptions.propsData.label
      },
  }
}
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 100px;
    height: 100px;
    border-radius: 48px;
  }
  .new-btn{
    border-radius: 2px;
    width: 100%;
    height: 187px;
  }
  .meta-content{
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .list{
    margin-top: 20px;
  }

</style>
