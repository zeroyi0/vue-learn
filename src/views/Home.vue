<template>
  <div class="home">
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-container>
        <!-- 左侧菜单栏 -->
        <el-aside>
          <LeftMenu/>
        </el-aside>
        <!-- 左侧菜单栏:END -->
        <el-container class="body">
          <!-- 中间ViewContainer -->
          <el-main>
            <Breadcrumb/>
            <router-view></router-view>
          </el-main>
          <!-- 中间ViewContainer:END -->
        </el-container>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>

import Header from '../components/Header'
import LeftMenu from '../components/LeftMenu'
import Breadcrumb from '../components/Breadcrumb'
export default {
  name: 'Home',
  components: {
    Breadcrumb,
    LeftMenu,
    Header
  }
}
</script>

<style lang="less" scoped>
  .home {
    width: 100%;
    height: 100%;
  }
</style>
