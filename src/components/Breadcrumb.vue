<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item v-for="(item,index) in breadList"
                          :key="index" :to="{ path: item.path }">
        {{item.title ? item.title : item}}</el-breadcrumb-item>
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
      this.breadList.length = 0
      for (const item of match) {
        if (item.meta.title instanceof Array) {
          this.breadList = this.breadList.concat(item.meta.title)
        } else {
          this.breadList.push({ path: item.path, title: item.meta.title })
        }
      }
    }
  },
  created () {
    this.getBreadcrumb()
  }
}
</script>

<style scoped>

</style>
