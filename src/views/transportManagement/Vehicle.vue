<template>
    <div class="card-list">
      <div style="margin-top:20px;display:flex"> 
        <a-input v-model="searchName" placeholder="请输入运输工具牌号或者类型" style="width:400px;height:42px" ></a-input>
        <a-button @click="getVehicleList()" type="primary" size="large" width="200px"><a-icon type="search" />搜索</a-button>
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
              <a-icon type="plus" />新增运输工具
            </a-button>
          </template>
          <template v-else>
            <a-card :hoverable="true">
              <a-card-meta >
                <div style="margin-bottom: 3px" slot="title">{{item.number}}</div>
                <a-avatar class="card-avatar" slot="avatar" :src="imgList[Math.floor(Math.random() * 3)]" size="large" />
                <div class="meta-content" slot="description">
                   <div>类型:{{item.type}}</div>
                   <div style="margin-top:10px" >状态:<a-tag :color=" item.driving ? 'orange': 'green'">{{ item.driving ? '正在途中' : '正在休息' }}</a-tag></div>
                </div>
              </a-card-meta>
              <a slot="actions" @click="handleUpdate(item)"><a-icon type="edit"/>修改</a>
              <a slot="actions" @click="handleDelete(item)"><a-icon type="delete"/>删除</a>
              <a slot="actions"> 
                  <span> 使用记录</span>
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
        title="新增运输工具"
      >
        <a-form-model ref="ruleForm" :model="data" :rules="rules">
          <a-form-model-item ref="number" label="运输工具牌号" prop="number">
            <a-input v-model="data.number"/>
          </a-form-model-item>
          <a-form-model-item label="车辆类型" prop="type">
            <a-select v-model="data.type">
                <a-select-option value="小型汽车">小型汽车</a-select-option>
                <a-select-option value="货车">货车</a-select-option>
                <a-select-option value="卡车">卡车</a-select-option>
            </a-select>
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
import {save,selectVehicleList,deleteVehicle} from '@/api/vehicle'
import {getCompanys} from '@/api/company'
import { es } from 'date-fns/locale'
export default {
  name: 'Warehouse',
  data () {
    return {
      loading: false,
      showCompany:this.$store.state.user.details.companyCode==='001'?true:false,
      dataSource: [],
      modalVisible:false,
      rules:{
        number:[{required:true,message:'请填写运输工具牌号',trigger:'change'}],
        type:[{required:true,message:'请选择类型',trigger:'change'}],
      },
      companys:[],
      data:{
          id:'',
          number:'',
          type:'',
          companyCode:'',
          companyName:'',
      },
       imgList: [
        require('@/assets/img/货车.svg'),
        require('@/assets/img/卡车.svg'),
        require('@/assets/img/小型汽车.svg'),
        ],
      searchName:'',
    }
  },
  created(){
    this.getVehicleList()
    this.getCompanys()
  },
  //admin默认缓存路由
  //组件缓存时进入调用,刷新数据
  activated(){
    this.getVehicleList()
  },
  methods:{
      getCompanys(){
        getCompanys().then(res=>{
           if (res.status) this.companys = res.data
        })
      },
      getVehicleList(){
        this.loading = true
        selectVehicleList(this.searchName).then(res=>{
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
        this.data.number=''
        this.data.type=''
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
                if(this.data.id==='')
                    this.$message.success("添加成功")
                else
                    this.$message.success("修改成功")
                this.cancel()
                this.getVehicleList()
              }
            })
         })
      },
      handleUpdate(item){
        this.modalVisible=true;
        this.data.id=item.id;
        this.data.number=item.number;
        this.data.type=item.type;
        this.data.companyCode=item.companyCode;
        this.data.companyName=item.companyName;
      },
      handleDelete(item){
         this.$confirm({
          content:'此操作将删除'+item.number+''+item.type+', 是否继续?',
          title:'提示', 
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          onOk:() => {
            deleteVehicle(item.id).then(res=>{
              if(res.status){
                this.$message.success("删除成功")
                this.getVehicleList()
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
