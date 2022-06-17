<template>
  <div class="common-layout">
    <div class="content"><slot></slot></div>
       <vue-particles
      color="#7caefa"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#7caefa"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.6"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <!-- <page-footer :link-list="footerLinks" :copyright="copyright">物流管理系统 - Copyright 2022 赖江锋</page-footer> -->
    <div class="des">物流管理系统 - Copyright 2022 赖江锋</div>
 
  </div>
</template>

<script>
// import PageFooter from '@/layouts/footer/PageFooter'
import {mapState} from 'vuex'

export default {
  name: 'CommonLayout',
  // components: {PageFooter},
  computed: {
    ...mapState('setting', ['footerLinks', 'copyright'])
  }
}
</script>

<style scoped lang="less">
.common-layout{
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background-color: @layout-body-background;
  background-image: url('../assets/img/bg.png');
  background-repeat: no-repeat;
  background-position-x: center;
  // background-position-y: 110px;
  background-size: 100%;
  .content{
    position: absolute;
    z-index: 100;
    padding: 32px 0;
    width: 380px;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    flex: 1;
    @media (min-width: 768px){

      padding: 112px 0 24px;
    }
  }
  .des{
    position: absolute;
    z-index: 100;
    left: 50%;
    top: 90%;
    transform: translate(-50%, -50%);
    padding-top: 25px;
    font-size: 13px;
    color: #91949c;
    letter-spacing: 2px;
  }
}
</style>
