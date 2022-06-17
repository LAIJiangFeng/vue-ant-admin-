<template>
  <div class="main">
    <a-steps :current="current">
      <a-step title="填写申请信息"></a-step>
      <a-step title="确认配送信息"/>
      <a-step title="完成申请"/>
    </a-steps>
    <div class="steps-content">
      <div v-if="current === 0">
        <a-form-model :model="data" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm" :rules="rules">
          <a-form-model-item label="选择配送商品"  prop="cid">
            <a-select v-model="data.cid" placeholder="请选择配送商品"  @change="OnCommodityChange">
              <a-select-option :value="item.id" v-for="(item, index) in commoditys" :key="index" :label="item.name" :disabled="item.count===0"  >
                {{ item.name }} 
                <i class="dis" v-if="item.count===0">
                  <a-icon type="close-circle"/>
                  商品库存不足</i>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="数量" prop="count">
            <a-input-number id="inputNumber" v-model="data.count"  :min="1" />
          </a-form-model-item>
          <a-form-model-item label="选择司机"  prop="did">
            <a-select v-model="data.did" placeholder="请选择配送司机" @change="OnDriverChange">
              <a-select-option :value="item.id" v-for="(item, index) in drivers" :key="index" :label="item.name" :disabled="item.status===1"  >
                {{ item.name }}
                <i class="dis" v-if="item.status===1">
                  <a-icon type="close-circle"/>
                  正在途中</i>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="选择运输车辆"  prop="vid"  >
            <a-select v-model="data.vid" placeholder="请选择配送车辆" @change="OnVehicleChange">
              <a-select-option :value="item.id" v-for="(item, index) in vehicles" :key="index" :label="item.number" :disabled="item.driving" >
                {{ item.type }} : {{ item.number }}
                <i class="dis" v-if="item.driving">
                  <a-icon type="close-circle"/>
                  正在途中</i>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="预计交货时间"  prop="time">
            <a-date-picker
                v-model="data.time"
                show-time
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                @change="onTimeChange"
            />
          </a-form-model-item>
          <a-form-model-item label="加急处理">
            <a-switch v-model="data.urgent"/>
          </a-form-model-item>
          <a-form-model-item label="注意事项">
            <a-checkbox-group v-model="data.cares">
              <a-checkbox value="冰柜冷藏" name="type">
                冰柜冷藏
              </a-checkbox>
              <a-checkbox value="注意易碎" name="type">
                注意易碎
              </a-checkbox>
              <a-checkbox value="防止高温" name="type">
                防止高温
              </a-checkbox>
            </a-checkbox-group>
          </a-form-model-item>
          <a-form-model-item label="选择客户"  v-if="showUser" required>
            <a-select v-model="data.uid" placeholder="请选择客户" @change="OnUserChange">
              <a-select-option :value="item.id" v-for="(item, index) in users" :key="index"  :label="item.name">
                {{ item.name }} 
              </a-select-option>
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
          <a-form-model-item label="客户电话"  prop="phone">
            <a-input v-model="data.phone"/>
          </a-form-model-item>
          <a-form-model-item label="客户地址"  prop="address">
            <a-input v-model="data.address" type="textarea" :rows="4"/>
          </a-form-model-item>
            <a-form-model-item label="备注" >
            <a-input v-model="data.description" type="textarea" :rows="4"/>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
            <a-button type="primary" @click="next">
              下一步
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div v-if="current === 1" class="check">
        <p>商品： {{ data.cname }}</p>
        <p>数量： {{ data.count }}</p>
        <p>送货司机： {{ data.driver }}</p>
        <p>车牌号码： {{ data.number }}</p>
        <p>加急处理： {{ data.urgent?'是':'否' }}</p>
        <p>注意事项： {{ data.care }}</p>
        <p v-if="showCompany">客户： {{ data.uname }}</p>
        <p>客户电话： {{ data.phone }}</p>
        <p>客户地址： {{ data.address }}</p>
        <p>预计送达： {{ data.time }}</p>
        <p>备注： {{ data.description }}</p>
        <a-button type="danger" style="margin-right: 20px" :loading="loading" @click="submit">提交</a-button>
        <a-button @click="current = 0">上一步</a-button>
      </div>
      <div v-if="current === 2">
        <a-result
            status="success"
            title="Submitted Successfully"
            sub-title="Please wait for the administrator to review the delivery request."
        >
          <template #extra>
            <router-link to="/distributionManagement/list">
              <a-button key="console" type="primary">
                Go Console
              </a-button>
            </router-link>
            <a-button key="buy" @click="current = 0">
              Submit Again
            </a-button>
          </template>
        </a-result>
      </div>
    </div>
  </div>
</template>

<script>

import {getCompanys} from '@/api/company'
import{findByCompanyCode} from '@/api/commodity'
import{getDriver,getUser} from '@/api/employee'
import{selectVehicleList} from '@/api/vehicle'
import {save} from "@/api/distribution";
export default {
  name:'distributionCreate',
  data() {
    return {
      loading: false,
      labelCol: {span: 6},
      wrapperCol: {span: 12},
      showCompany:this.$store.state.user.details.companyCode==='001'?true:false,
      showUser:this.$store.state.user.details.type==='user'?false:true,
      current: 0,
      commoditys:[],
      companys:[],
      drivers:[],
      vehicles:[],
      users:[],
      data: {
        id: '',
        did: '',
        vid: '',
        driver: '',
        number: '',
        phone: '',
        address: '',
        urgent: false,
        cares: [],
        care: '',
        time: '',
        status: 0,
        cid:'',
        cname:'',
        count:1,
        uid:'',
        uname:'',
        location:'',
        companyCode:'',
        companyName:'',
        description:'',
      },
      rules:{
          did:[{required:true,message:'请选择驾驶员',trigger:'blur'}],
          vid:[{required:true,message:'请选择运输工具',trigger:'blur'}],
          phone:[{required:true,message:'请输入客户电话',trigger:'blur'}],
          address:[{required:true,message:'请输入配送地址',trigger:'blur'}],
          time:[{required:true,message:'请选择预计交货时间',trigger:'change'}],
          cid:[{required:true,message:'请选择配送商品',trigger:'blur'}],
          count:[{required:true,message:'请输入数量',trigger:'blur'}],
      }
    }
  },
  created(){
    this.getCompanys()
    this.getCommoditys()
    this.getDrivers()
    this.getVehicles()
    this.getUsers()
  },
  
  //admin默认缓存路由
  //组件缓存时进入调用,刷新数据状态，防止出现重复添加
  activated(){
    this.getCompanys()
    this.getCommoditys()
    this.getDrivers()
    this.getVehicles()
    this.getUsers()
    this.current=0
    this.cancel()
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
    getDrivers(){
        getDriver().then(res=>{
          if (res.status) this.drivers = res.data
        })
    },
    getVehicles(){
        selectVehicleList().then(res=>{
          if (res.status) this.vehicles = res.data
          if(res.code===403){
            this.$router.push("/exception/403")
          }
          if(res.code===500){
            this.$router.push('/exception/500')
          }
        })
    },
    getUsers(){
        getUser().then(res=>{
          if (res.status) this.users = res.data
        })
    },
    next() {
      let care = ''
      for (let i = 0; i < this.data.cares.length; i++) {
        care += this.data.cares[i] + ", "
      }
      this.data.care = care
      this.$refs['ruleForm'].validate(vali=>{
          if(!vali) return;
           this.current = 1
      })
    },
    cancel(){
      this.data.id=''
      this.data.did= ''
      this.data.vid= ''
      this.data.driver= ''
      this.data.number= ''
      this.data.phone= ''
      this.data.address= ''
      this.data.urgent= false
      this.data.cares= []
      this.data.care= ''
      this.data.time= ''
      this.data.status= 0
      this.data.cid=''
      this.data.cname=''
      this.data.count=1
      this.data.uid=''
      this.data.uname=''
      this.data.location=''
      this.data.companyCode=''
      this.data.companyName=''
      this.data.description=''
    },
    submit() {
      this.loading = true
      save(this.data).then((res) => {
        if (res.status) {
          setTimeout(() => {
            this.loading = false
            this.current = 2
            // this.cancel()
            this.$message.success("提交成功，请等待审核")
          }, 800)
        } else {
          setTimeout(() => {
            this.loading = false
            this.$message.error("提交失败")
          }, 800)
        }
      })
    },
    OnCommodityChange(alue,option){
      this.data.cname=option.componentOptions.propsData.label
    },
    OnDriverChange(value,option){
       this.data.driver=option.componentOptions.propsData.label
    },
    OnVehicleChange(value,option){
       this.data.number=option.componentOptions.propsData.label
    },
    OnUserChange(value,option){
      this.data.uname=option.componentOptions.propsData.label
    },
    OnCompanyChange(value,option){
      this.data.companyName=option.componentOptions.propsData.label
    },
    onTimeChange(v){
      this.data.time=v.format("YYYY-MM-DD HH:mm:ss")
    }
  },

}
</script>

<style scoped>
.main {
  padding: 50px 180px;
  background: #ffffff;
}

.steps-content {
  margin-top: 40px;
}

.check {
  padding-left: 200px;
}

.check p {
  padding-bottom: 10px;
}

.dis {
  padding-left: 10px;
  font-size: 10px;
  letter-spacing: 1px;
  color: red;
}

</style>