<template>
  <el-menu mode="horizontal">
    <div class="logo">
      <img src="../assets/img/logo.png" alt="LOGO">
    </div>
    <el-menu-item index="1">处理中心</el-menu-item>
    <el-menu-item index="3">消息中心</el-menu-item>
    <el-menu-item index="4">订单管理</el-menu-item>
    <el-menu-item class="right-item" @click="logout">退出</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    logout () {
      // 清空token等缓存信息
      window.sessionStorage.clear()
      // 跳转登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
  .el-menu {
    padding: 0 5% 0 30%;
    position: relative;
    .logo {
      height: 100%;
      left: 10%;
      position: absolute;
      img {
        height: 100%;
      }
    }
    .right-item {
      float: right;
    }
  }
</style>
