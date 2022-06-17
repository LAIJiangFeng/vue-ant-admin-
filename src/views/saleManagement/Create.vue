<template>
  <div class="main">
    <a-steps :current="current">
      <a-step title="填写开票信息"></a-step>
      <a-step title="确认开票信息"/>
      <a-step title="完成"/>
    </a-steps>
    <div class="steps-content">
      <div v-if="current === 0">
        <a-form-model :model="data" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm" :rules="rules">
          <a-form-model-item label="选择销售商品"  prop="cid">
            <a-select v-model="data.cid" placeholder="请选择销售商品"  @change="OnCommodityChange">
              <a-select-option :value="item.id" v-for="(item, index) in commoditys" :key="index" :label="item.name" >
                {{ item.name }} 
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="数量" prop="count">
            <a-input-number id="inputNumber" v-model="data.count"  :min="1" />
          </a-form-model-item>
          <a-form-model-item label="选择销售客户" required>
            <a-select v-model="data.uid" placeholder="选择销售客户" @change="OnUserChange">
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
          <a-form-model-item label="打款账号"  prop="number">
            <a-input v-model="data.number"/>
          </a-form-model-item>
          <a-form-model-item label="预留电话"  prop="phone">
            <a-input v-model="data.phone"/>
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
        <p>打款账号: {{ data.number }}</p>
        <p >销售客户： {{ data.saleUser }}</p>
        <p>预留电话： {{ data.phone }}</p>
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
            <router-link to="/saleManagement/sale/list">
              <a-button key="console" type="primary">
                Go Back
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
import{getUser} from '@/api/employee'
import {save} from "@/api/sale";
export default {
  name:'saleCreate',
  data() {
    return {
      loading: false,
      labelCol: {span: 6},
      wrapperCol: {span: 12},
      showCompany:this.$store.state.user.details.companyCode==='001'?true:false,
      current: 0,
      commoditys:[],
      companys:[],
      users:[],
      data: {
        id: '',
        phone: '',
        cid:'',
        cname:'',
        count:1,
        uid:'',
        saleUser:'',
        companyCode:'',
        companyName:'',
        description:'',
      },
      rules:{
          phone:[{required:true,message:'请输入预留电话',trigger:'blur'}],
          number:[{required:true,message:'请输入打款账号',trigger:'blur'}],
          cid:[{required:true,message:'请选择配送商品',trigger:'blur'}],
          count:[{required:true,message:'请输入数量',trigger:'blur'}],
      }
    }
  },
  created(){
    this.getCompanys()
    this.getCommoditys()
    this.getUsers()
  },
  
  //admin默认缓存路由
  //组件缓存时进入调用,刷新数据状态，防止出现重复添加
  activated(){
    this.getCompanys()
    this.getCommoditys()
    this.getUsers()
    this.current=0
    // this.cancel()
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
    getUsers(){
        getUser().then(res=>{
          if (res.status) this.users = res.data
        })
    },
    next() {
      this.$refs['ruleForm'].validate(vali=>{
          if(!vali) return;
           this.current = 1
      })
    },
    cancel(){
      this.data.id=''
      this.data.phone= ''
      this.data.cid=''
      this.data.cname=''
      this.data.count=1
      this.data.uid=''
      this.data.saleUser=''
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
            this.$message.success("提交成功")
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
    OnUserChange(value,option){
      this.data.saleUser=option.componentOptions.propsData.label
    },
    OnCompanyChange(value,option){
      this.data.companyName=option.componentOptions.propsData.label
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