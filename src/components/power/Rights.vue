<template>
    <div>
      <el-card>
        <el-table :data="rightsList" stripe border>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column label="权限等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level==='0'">一级权限</el-tag>
              <el-tag type="success" v-else-if="scope.row.level==='1'">二级权限</el-tag>
              <el-tag type="warning" v-else>三级权限</el-tag>
            </template>
          </el-table-column>
<!--          <el-table-column prop="pid" label="父ID"></el-table-column>-->
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Permissions',
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    getRightsList () {
      const that = this
      this.$http.get('/rights/list')
        .then(resp => {
          const { data: res } = resp
          if (res.meta.status !== 200) {
            return that.$message.error(res.meta.msg)
          }
          that.rightsList = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>

</style>
