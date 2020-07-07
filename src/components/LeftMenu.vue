<template>
  <div class="left-menu">
    <el-menu :unique-opened="true" :router="true" :default-active="active_index"
             class="el-menu-vertical-demo" :collapse="isCollapse">
      <div @click="toggleCollapse" class="el-menu-item coll-btn">
        <i class="el-icon-s-unfold" v-if="isCollapse"></i>
        <i class="el-icon-s-fold" v-else></i>
      </div>
      <!-- 一级菜单 -->
      <template v-for="item in menu_items">
        <el-submenu v-if="item.children" :key="item.id" :index="'/'+item.path">
          <template slot="title">
            <i :class="icons[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item-group>
            <el-menu-item v-for="sub_item in item.children" :key="sub_item.id"
                          :index="'/'+sub_item.path" @click="saveActivePath('/'+sub_item.path)">
              <i class="el-icon-menu"></i>
              <span>{{sub_item.authName}}</span>
            </el-menu-item>
          </el-menu-item-group>
          <!-- 二级菜单END -->
        </el-submenu>
        <el-menu-item v-else :key="item.id" :index="'/'+item.path">
          <i :class="icons[item.id]"></i>
          <span>{{item.authName}}</span>
        </el-menu-item>
      </template>
      <!-- 一级菜单END -->
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'LeftMenu',
  data () {
    return {
      isCollapse: false,
      menu_items: [],
      active_index: '',
      icons: {
        125: 'el-icon-user-solid',
        103: 'el-icon-set-up',
        101: 'el-icon-shopping-bag-1',
        102: 'el-icon-tickets',
        145: 'el-icon-data-analysis'
      }
    }
  },
  created () {
    const that = this
    this.$http.get('/menus')
      .then(res => {
        const { data } = res
        console.log(data)
        if (data.meta.status !== 200) {
          that.$message.error(data.meta.msg)
          return
        }
        that.menu_items = data.data
      })
    this.active_index = window.sessionStorage.getItem('activePath')
  },
  methods: {
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveActivePath (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.active_index = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .left-menu {
    .coll-btn {
      text-align: center;
    }
  }
  .el-menu {
    background: transparent;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
