<template>
  <div class="main">
    <a-steps :current="current">
      <a-step title="填写运输位置"></a-step>
      <a-step title="确认运输位置"/>
      <a-step title="完成"/>
    </a-steps>
    <div class="steps-content">
      <div v-if="current === 0">
        <a-form-model :model="query" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm" :rules="rules">
          <a-form-model-item label="选择商品"  prop="id">
            <a-select v-model="query.id" placeholder="请选择商品" @change="OnDistributionChange">
              <a-select-option :value="item.id" v-for="(item, index) in distributions" :key="index" :label="item.cname" >
                {{ item.cname }} 
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="纬度"  prop="latitude">
            <a-input v-model="query.latitude"/>
          </a-form-model-item>
          <a-form-model-item label="经度"  prop="longitude">
            <a-input v-model="query.longitude"/>
          </a-form-model-item>
          <a-form-model-item label="位置"  prop="address">
            <a-input v-model="query.address" type="textarea" :rows="4" placeholder="如果经纬度不准确请填写具体位置"/>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
            <a-button type="primary" @click="next">
              下一步
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div v-if="current === 1" class="check">
        <p>商品： {{ query.cname }}</p>
        <p>定位位置: {{ query.address }}</p>
        <a-button type="danger" style="margin-right: 20px" :loading="loading" @click="submit">提交</a-button>
        <a-button @click="current = 0">上一步</a-button>
      </div>
      <div v-if="current === 2">
        <a-result
            status="success"
            title="Submitted Successfully"
        >
          <template #extra>
            <router-link to="/distributionManagement/list">
              <a-button key="console" type="primary">
                Go Distribution List
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
import {getLocation,selectDistribution,save,selectById} from "@/api/distribution";
export default {
  name:'Location',
  data() {
     const ruleLatitude=(rule,value,callback)=>{
      if(!/^[\-\+]?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$/.test(value) && value !='' && value !=null){
        callback(new Error('请输入正确的纬度'))
      }else{
        callback();
      }
    }
    const ruleLongitude=(rule,value,callback)=>{
      if(!/^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/.test(value) && value !='' && value !=null){
        callback(new Error('请输入正确的经度'))
      }else{
        callback();
      }
    }
    const ruleAddress=(rule,value,callback)=>{
      if(this.query.latitude===''&& this.query.longitude==='' && value===''){
        callback(new Error('如果经纬度不准确请填写具体地址'))
      }else{
        callback();
      }
    }
    return {
      loading: false,
      labelCol: {span: 6},
      wrapperCol: {span: 12},
      current: 0,
      distributions:[],
      query:{
        id:'',
        cname:'',
        latitude:'',
        longitude:'',
        address:''
      },
      data: {},
      rules:{
          id:[{required:true,message:'请选择配送商品',trigger:'blur'}],
          latitude:[{required:true,validator:ruleLatitude,trigger:'change'}],
          longitude:[{required:true,validator:ruleLongitude,trigger:'change'}],
          address:[{validator:ruleAddress,trigger:'blur'}]
      }
    }
  },
  created(){
    this.getDistributions()
  },
  
  //admin默认缓存路由
  //组件缓存时进入调用,刷新数据状态，防止出现重复添加
  activated(){
    this.getDistributions()
    this.current=0
  },
  methods: {
    getDistributions(){
        selectDistribution().then(res=>{
          if (res.status) this.distributions = res.data
          
          if(res.code===403){
            this.$router.push("/exception/403")
          }
          if(res.code===500){
            this.$router.push('/exception/500')
          }
        })
    },
    next() {
      this.$refs['ruleForm'].validate(vali=>{
          if(!vali) return;
          getLocation(this.query).then(res=>{
            if (res.status) this.query.address = res.data.location
            this.current = 1
          }) 
      })
    },
    submit() {
        selectById(this.query.id).then(res=>{
            console.log(res)
            if (res.status) this.data={...res.data}
            console.log(this.data)
            this.data.location=this.query.address
            this.loading = true
            save(this.data).then((res) => {
                if (res.status) {
                setTimeout(() => {
                    this.loading = false
                    this.current = 2
                    // this.cancel()
                    this.$message.success("提交成功")
                }, 800)
                } else {
                setTimeout(() => {
                    this.loading = false
                    this.$message.error("提交失败")
                }, 800)
                }
            })
        })
        
    },
    OnDistributionChange(alue,option){
      this.query.cname=option.componentOptions.propsData.label
    },
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