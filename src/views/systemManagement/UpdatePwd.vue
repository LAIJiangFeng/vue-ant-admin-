<template>
  <a-form-model :model="data" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm" :rules="rules"  style="width:60%;margin-left:20%;">
        <a-form-model-item label="原密码"  prop="password">
            <a-input v-model="data.password"/>
        </a-form-model-item>
        <a-form-model-item label="新密码"  prop="newPassword">
            <a-input v-model="data.newPassword"/>
        </a-form-model-item>
        <a-form-model-item label="确认密码"  prop="comfirmPassword">
            <a-input v-model="data.comfirmPassword"/>
        </a-form-model-item>
         <a-form-model-item  style="text-align:center;display:flex;justify-content:space-around">
            <a-button type="primary" @click="update">更新</a-button>
            <a-button type="disabled" @click="cancel"  style="margin-left:10%">重置</a-button>
        </a-form-model-item>
  </a-form-model>
</template>

<script>
import {updatePwd} from '@/api/admin'
export default {
    data(){
        let confirm = (rule, value, callback) => {
            if (value != this.data.newPassword ){
                 callback(new Error("确认密码与新密码不一致"))
            } else {
                callback()
            }
        };
        return{
            labelCol: {span: 6},
            wrapperCol: {span: 12},
            data:{
                password:'',
                newPassword:'',
                comfirmPassword:''
            },
            rules:{
                password:[{required:true,message:'请输入原密码',trigger:'change'}],
                newPassword:[{required:true,message:'请输入新密码',trigger:'change'}],
                comfirmPassword:[
                    {required:true,message:'请输入确认密码',trigger:'change'},
                    {required:true,validator:confirm,trigger:'blur'}
                ],
            }
        }
    },
    methods:{
        update(){ 
            this.$refs['ruleForm'].validate(vali=>{
                if(!vali) return;
                updatePwd(this.data).then(res=>{
                    console.log(res)
                    if(res.status) this.$message.success("更新成功")
                })
            })
        },
        cancel(){
            this.data.password=''
            this.data.newPassword=''
            this.data.comfirmPassword=''
        },
    }
}
</script>

<style>
</style>