<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle"  style="backgroundColor:#87d068" icon="user" />
      <span class="name">{{this.$store.state.user.details.username}}</span>
       <!-- <span class="name">admin</span> -->
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item>
        <router-link to="/systemManagement/pwd">
          <a-icon type="edit" />
          <span style="margin-left: 8px;">密码修改</span>
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import {mapGetters} from 'vuex'
// import {logout} from '@/services/user'

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  methods: {
    logout() {
      // logout()
      this.$store.commit('user/userLogout')
      this.$router.push('/login')
    
    }
  }
}
</script>

<style lang="less">
  .header-avatar{
    display: inline-flex;
    .avatar, .name{
      align-self: center;
    }
    .avatar{
      margin-right: 8px;
    }
    .name{
      font-weight: 500;
    }
  }
  .avatar-menu{
    width: 150px;
  }

</style>
