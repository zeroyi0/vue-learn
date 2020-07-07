<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item,index) in breadList"
                          :key="index" :to="{ path: item.path }">
        {{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data () {
    return {
      breadList: []
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    isHome (route) {
      return route.name === 'Home'
    },
    getBreadcrumb () {
      let match = this.$route.matched
      if (!this.isHome(match[0])) {
        match = [{ path: '/home', meta: { title: '首页' } }].concat(match)
      }
      this.breadList = match
    }
  },
  created () {
    this.getBreadcrumb()
  }
}
</script>

<style scoped>

</style>
