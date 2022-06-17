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
    > 
        <span slot="status" slot-scope="r">
            <a-tag v-if="!r.record.pay" color="#f50">等待结款</a-tag>
            <a-tag v-if="r.record.pay" color="#87d068">结款完成</a-tag>
        </span>
       <template slot="action" slot-scope="r">
        <a-button @click="confirm(r)" type="link" v-if="!r.record.pay">结款</a-button>
        <a-tag  v-if="r.record.pay" color="#87d068">已入账</a-tag>
      </template>
    </advance-table>

  </div>
</template>

<script>
  import AdvanceTable from '@/components/table/advance/AdvanceTable'
  import {selectSaleList,deleteSale,save} from '@/api/sale'
  import {getCompanys} from '@/api/company'
  export default {
    name: 'saleList',
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
                title: '销售数量',
                dataIndex: 'count'
            },
            {
                title: '预留电话',
                dataIndex: 'phone'
            },
            {
                title: '总价',
                dataIndex: 'price'
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
                title: '结款状态',
                dataIndex: 'pay',
                scopedSlots: {customRender: 'status'},
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
        companys:[],
        data:{
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
      }
    },
    created() {
      this.getSaleList()
      this.getCompanys()
    },
    activated(){
      this.getSaleList()
      this.getCompanys()
    },
    methods: {
      getCompanys(){
        getCompanys().then(res=>{
           if (res.status) this.companys = res.data
        })
      },
      getSaleList() {
        this.loading = true
        const {page, pageSize, conditions} = this
        selectSaleList({page, pageSize, ...conditions}).then(res=>{
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
        this.page = 1
        this.conditions = conditions
        this.getSaleList()
      },
      onSizeChange(current, size) {
        this.page = 1
        this.pageSize = size
        this.getSaleList()
      },
      onRefresh(conditions) {
        this.conditions = conditions
        this.getSaleList()
      },
      onReset(conditions) {
        this.conditions = conditions
        this.getSaleList()
      },
      onPageChange(page, pageSize) {
        this.page = page
        this.pageSize = pageSize
        this.getSaleList()
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
      confirm(r){
        this.$confirm({
            title: '销售结款',
            content: '我已确定' + r.record.saleUser + '的销售金额 ¥' + r.record.price + '已经打入账户!',
            okText: '确认',
            cancelText: '取消',
            onOk:() => {
                r.record.pay=true
                save(r.record).then(res=>{
                    if(res.status){
                        this.$message.success("结款成功")
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