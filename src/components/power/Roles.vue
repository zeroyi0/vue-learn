<template>
    <div>
      <el-card>
        <el-table border stripe :data="rolesList">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id"
                      :class="['bd-bottom', i1===0 ? 'bd-top':'', 'vcenter']">
                <el-col :span="5">
                  <el-tag closable>{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="(item2, i2) in item1.children" :key="item2.id"
                          :class="[i2===0 ? '':'bd-top', 'vcenter']">
                    <el-col :span="6">
                      <el-tag closable type="success">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag closable type="warning" v-for="(item3) in item2.children"
                              :key="item3.id" @close="removeRightById(scope.row, item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="editRole(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="editRole(scope.row)">删除</el-button>
              <el-button type="warning" icon="el-icon-s-tools" size="small" @click="editRole(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      rolesList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    getRolesList () {
      const that = this
      that.$http.get('/roles')
        .then(resp => {
          const { data: { data, meta } } = resp
          if (meta.status !== 200) {
            return that.$message.error(`ROLES ERR: ${meta.msg}`)
          }
          that.rolesList = data
        })
    },
    removeRightById (role, rightId) {
      const that = this
      this.$confirm('此操作将永久删除该权限, 是否继续?', '删除权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        that.$http.delete(`roles/${role.id}/rights/${rightId}`)
          .then(resp => {
            const { data: { data, meta } } = resp
            if (meta.status !== 200) {
              return that.$message.error(meta.msg)
            }
            that.$message.success(meta.msg)
            role.children = data
          })
      }).catch(() => {
        this.$message.info('删除已经取消')
      })
    }
  }
}
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }
  .bd-top {
    border-top: 1px solid #eeeeee;
  }
  .bd-bottom {
    border-bottom: 1px solid #eeeeee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
