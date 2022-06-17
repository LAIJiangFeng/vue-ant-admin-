<template>
  <page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
    <keep-alive exclude="Exp403,Exp404,Exp500">
      <router-view />
    </keep-alive>
  </page-toggle-transition>
</template>

<script>
import PageToggleTransition from '../components/transition/PageToggleTransition';
import {mapState} from 'vuex'

export default {
  name: 'BlankView',
  components: {PageToggleTransition},
  computed: {
    ...mapState('setting', ['multiPage', 'animate'])
  }
}
</script>

<style scoped>

</style>
