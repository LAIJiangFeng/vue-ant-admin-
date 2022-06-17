<template>
  <div class="main">
    <div class="title">系统权限列表</div>
    <a-spin size="large" :spinning="spinning">
      <div v-for="(item, index) in roles" :key="index">
        <a class="item-title" type="link">{{ item.value }}</a>
        <p class="des">描述信息： {{ item.description }}</p>
        <a-divider/>
      </div>
    </a-spin>
  </div>
</template>

<script>

import {getRoles} from "@/api/role";

export default {
  name: "Me",

  data() {
    return {
      roles: [],
      spinning: false,
    }
  },

  mounted() {
    this.spinning = true
    getRoles().then((res) => {
        if (res.status) this.roles = res.data

        if(res.code===403){
            this.$router.push("/exception/403")
        }
        if(res.code===500){
            this.$router.push('/exception/500')
        }
      setTimeout(() => {
        this.spinning = false
      }, 500)
    })
  },

}
</script>

<style scoped>
.main {
  background: #ffffff;
  padding: 50px 70px;
}

.title {
  letter-spacing: 1px;
  font-size: 20px;
  font-weight: bolder;
  color: #000000;
  margin-bottom: 30px;
}

.btn {
  float: right;
}

.item-title {
  color: rgba(0, 0, 0, .8);
  line-height: 35px;
}

.item-title:hover {
  color: #5a84fd;
}

.des {
  color: rgba(0, 0, 0, .5);
}

</style>