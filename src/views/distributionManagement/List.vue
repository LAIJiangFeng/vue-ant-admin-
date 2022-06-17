<template>
  <div class="table">
    <advance-table
      :columns="columns"
      :data-source="dataSource"
      title="配送列表"
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
    >    <span slot="urgent" slot-scope="r">
            <a-tag v-if="r.record.urgent" color="#f50">是</a-tag>
            <a-tag v-if="!r.record.urgent" color="#87d068">否</a-tag>
        </span>

        <span slot="status" slot-scope="r">
            <a-tag v-if="r.record.status===0" color="#f50">等待审核</a-tag>
            <a-tag v-if="r.record.status===1" color="#87d068">正在运输</a-tag>
            <a-tag v-if="r.record.status===2" color="#2db7f5">配送完成</a-tag>
        </span>
       <template slot="action" slot-scope="r">
        <a-button @click="examine(r)" type="link" v-if="r.record.status===0">审核</a-button>
        <a-button @click="examine(r)" type="link" v-if="r.record.status===1">配送</a-button>
        <a-button @click="examine(r)" type="link" v-if="r.record.status===2">查看</a-button>
        <!-- <a-button @click="handleUpdate(record)" type="link"><a-icon type="edit"/>Update</a-button> -->
      </template>
    </advance-table>

   <!--修改 -->
    <a-modal
      @cancel="onCancel"
      @ok="onOk"
      okText="保存"
      :visible="modalVisible"
      width="35%"
      title="修改配送信息"
    >
      <a-form-model ref="ruleForm" :model="data">
      </a-form-model>
    </a-modal>

    <!--审核  -->
    <a-modal
        title="审核"
        :visible="visible2"
        width="60%"
        :footer="null"
        @cancel="visible2 = false"
    >
      <a-steps :current="data.status" style="padding: 50px">
        <a-step title="确认信息无误"/>
        <a-step title="开始配送"/>
        <a-step title="配送完成"/>
      </a-steps>
      <div class="content">
        <div v-if="data.status === 0" class="check">
            <p>商品： {{ data.cname }}</p>
            <p>数量： {{ data.count }}</p>
            <p>送货司机： {{ data.driver }}</p>
            <p>车牌号码： {{ data.number }}</p>
            <p>加急处理： {{ data.urgent?'是':'否' }}</p>
            <p>注意事项： {{ data.care }}</p>
            <p v-if="showCompany">客户： {{ data.uid }}</p>
            <p>客户电话： {{ data.phone }}</p>
            <p>客户地址： {{ data.address }}</p>
            <p>预计送达： {{ data.time }}</p>
          <a-button type="danger" style="margin-right: 20px" :loading="loading" @click="agree">通过</a-button>
          <a-button @click="fail">不通过</a-button>
        </div>
        <div v-if="data.status === 1">
          <a-result
              status="success"
              title="Successfully passed the audit!"
              >
            <template #extra>
              <a-button @click="service" key="console" type="primary">
                已送达目的地
              </a-button>
            </template>
          </a-result>
        </div>
        <div v-if="data.status === 2">
          <a-result
              status="success"
              title="运输订单已成功送达"
          >
            <template #extra>
              <a-button @click="visible2 = false" key="console" type="primary">
                确定
              </a-button>
            </template>
          </a-result>
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script>
  import AdvanceTable from '@/components/table/advance/AdvanceTable'
  import {selectDistributionList,deleteDistribution,save} from '@/api/distribution'
  import {getCompanys} from '@/api/company'
  export default {
    name: 'List',
    components: {AdvanceTable},
    data() {
      return {
        loading: false,
        page: 1,
        pageSize: 10,
        total: 0,
        visible2:false,
        showCompany:this.$store.state.user.details.companyCode==='001'?true:false,
        columns: [
            {
                title: '商品名称',
                dataIndex: 'cname',
                searchAble: true,
            },
            {
                title: '配送数量',
                dataIndex: 'count'
            },
            {
                title: '配送地址',
                dataIndex: 'address'
            },
            {
                title: '注意',
                dataIndex: 'care'
            },
            {
                title: '配送员',
                dataIndex: 'driver'
            },
            {
                title: '车牌号',
                dataIndex: 'number'
            },
            {
                title: '客户电话',
                dataIndex: 'phone'
            },
            {
                title: '预计送达时间',
                dataIndex: 'time'
            },
            {
                title: '是否加急',
                dataIndex: 'urgent',
                scopedSlots: {customRender: 'urgent'},
            },
            this.$store.state.user.details.companyCode==='001'?{
                title: '公司',
                dataIndex: 'companyName',
                searchAble: true,
            }:{},
            {
                title: '备注',
                dataIndex: 'description'
            },
            {
                title: '当前状态',
                dataIndex: 'status',
                searchAble: true,
                dataType:'select',
                search: {
                    selectOptions: [
                        {title: '等待审核', value: 0},
                        {title: '正在运输', value: 1},
                        {title: '配送完成', value: 2},
                    ]
                },
                scopedSlots: {customRender: 'status'},
            },
            {
                title: '当前位置',
                dataIndex: 'location',
            },
            this.$store.state.user.details.type==='user'||this.$store.state.user.details.type==='driver'?{}:{
                title: '操作',
                dataIndex: 'action',
                scopedSlots: {customRender: 'action'},
            }
        ],
        dataSource: [],
        conditions: {},
        modalVisible:false,
        roles:[],
        companys:[],
        data:{
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
      }
    },
    created() {
      this.getDistributionList()
      this.getCompanys()
    },
    activated(){
      this.getDistributionList()
      this.getCompanys()
    },
    methods: {
      getCompanys(){
        getCompanys().then(res=>{
           if (res.status) this.companys = res.data
        })
      },
      getDistributionList() {
        this.loading = true
        const {page, pageSize, conditions} = this
        selectDistributionList({page, pageSize, ...conditions}).then(res=>{
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
        this.getDistributionList()
      },
      onSizeChange(current, size) {
        this.page = 1
        this.pageSize = size
        this.getDistributionList()
      },
      onRefresh(conditions) {
        this.conditions = conditions
        this.getDistributionList()
      },
      onReset(conditions) {
        this.conditions = conditions
        this.getDistributionList()
      },
      onPageChange(page, pageSize) {
        this.page = page
        this.pageSize = pageSize
        this.getDistributionList()
      },
      handleCreate(){
        this.modalVisible=true;
      },
      handleUpdate(r){
        // this.data.id=r.record.id
        // this.data.name=r.record.name
        // this.data.count=r.record.count
        // this.data.description=r.record.description
        // this.data.price=r.record.price
        // this.data.userId=r.record.userId
        // this.data.companyCode=r.record.companyCode
        // this.data.companyName=r.record.companyName
        this.modalVisible=true;
      },
      handleDelete(r){
      },
      cancel(){
        // this.data.id=''
        // this.data.name=''
        // this.data.count=''
        // this.data.description=''
        // this.data.price=''
        // this.data.userId=''
        // this.data.companyCode=''
        // this.data.companyName=''
      },
      onCancel(){
        // this.modalVisible=false
        // this.cancel()
        // this.getDistributionList()
      },
      onOk(){
        //  this.$refs['ruleForm'].validate(vali=>{
        //    if(!vali) return;
        //     save(this.data).then(res=>{
        //       if (res.status) {
        //         this.$message.success("保存成功")
        //         this.cancel()
        //         this.getDistributionList()
        //       }
        //     })
        //  })
      },
      examine(r){
          this.data=r.record
          this.visible2=true
      },
      agree(){
        this.data.status = 1
        save(this.data)
      },
      fail(){
        this.$confirm({
          content:'此操作将删除'+this.data.cname+'配送, 是否继续?',
          title:'提示', 
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          onOk:() => {
            deleteDistribution(this.data.id).then(res=>{
              if(res.status){
                this.$message.success("删除成功")
                this.getDistributionList()
                this.visible2=false
              }else{
                this.$message.error("删除失败")
              }
            })
          }
        })
      },
      service(){
        this.data.status = 2
        save(this.data)
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
.editable-add-btn {
  margin-bottom: 15px;
}

.editable-row-operations a {
  margin-right: 8px;
}

.content {
  padding: 50px 0;
}


.check {
  padding-left: 200px;
}

.check p {
  padding-bottom: 20px;
}
</style>