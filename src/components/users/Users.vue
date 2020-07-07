<template>
  <div class="users">
    <el-card class="box-card">
      <el-row :gutter="15" class="head-form">
        <el-col :span="6">
          <el-input @clear="getUserList" placeholder="请输入内容" v-model="pageInfo.query" size="small" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" @click="addUserFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="users" stripe border style="width: 100%">
        <el-table-column label="#" type="index" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="联系方式" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-switch @change="changeUserState(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑用户" :enterable="false" placement="top">
              <el-button type="primary" icon="el-icon-edit"
                         @click="getUserInfo(scope.row.id)" size="small" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" :enterable="false" placement="top">
              <el-button type="danger" icon="el-icon-delete"
                         @click="delUser(scope.row)" size="small" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" :enterable="false" placement="top">
              <el-button type="warning" icon="el-icon-star-off"
                         @click="editUser(scope.row)" size="small" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-nation">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :pager-count="5"
                       :page-sizes="[2, 4, 6, 8]" :current-page="pageInfo.pagenum" :page-size="pageInfo.pagesize"
                       :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
      </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog @close="resetAddUserForm" title="添加用户" :visible.sync="addUserFormVisible" width="40%">
      <el-form :model="add_user_form" :rules="add_form_rules" ref="add_user_form_ref" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="add_user_form.username" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="add_user_form.password" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="add_user_form.email" type="email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="add_user_form.mobile" type="tel" autocomplete="off"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog @close="resetUpUserForm" title="修改用户" :visible.sync="upUserFormVisible" width="40%">
      <el-form :model="up_user_form" :rules="up_form_rules" ref="up_user_form_ref" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="up_user_form.username" type="text" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="up_user_form.email" type="email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="up_user_form.mobile" type="tel" autocomplete="off"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    // 邮箱校验
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      const emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/
      if (!emailReg.test(value)) {
        return callback(new Error('邮箱格式不正确'))
      }
      return callback()
    }
    // 手机号校验
    const checkTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      const telReg = /^1[3456789]\d{9}$/
      if (!telReg.test(value)) {
        return callback(new Error('手机号格式不正确'))
      }
      return callback()
    }
    return {
      // 分页信息
      pageInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6
      },
      total: 0,
      users: [],
      // 添加用户
      addUserFormVisible: false,
      add_user_form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      add_form_rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 4, max: 16, message: '用户名长度应该4~16', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度应该8~16', trigger: 'change' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkTel, trigger: 'change' }
        ]
      },
      // 修改用户
      upUserFormVisible: false,
      up_user_form: {},
      up_form_rules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkTel, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      const that = this
      this.$http
        .get('users', { params: this.pageInfo })
        .then(resp => {
          const { data: res } = resp
          console.log(res)
          if (res.meta.status !== 200) {
            that.$message.error(res.meta.msg)
            return
          }
          that.users = res.data.users
          that.total = res.data.total
        })
    },
    // 页码变化
    handleCurrentChange (curPage) {
      this.pageInfo.pagenum = curPage
      this.getUserList()
    },
    // 每页数据量改变
    handleSizeChange (curSize) {
      this.pageInfo.pagesize = curSize
      this.getUserList()
    },
    // 修改用户状态
    changeUserState (row) {
      console.log(row)
      const that = this
      this.$http.put(`users/${row.id}/state/${row.mg_state}`)
        .then(resp => {
          const { data: res } = resp
          if (res.meta.status !== 200) {
            that.$message.error(res.meta.msg)
            row.mg_state = !row.mg_state
            return
          }
          that.$message.success(res.meta.msg)
        }).catch(() => {
          row.mg_state = !row.mg_state
        })
    },
    // 重置添加用户表单
    resetAddUserForm () {
      this.$refs.add_user_form_ref.resetFields()
    },
    // 添加用户
    addUser () {
      const that = this
      this.$refs.add_user_form_ref.validate(valid => {
        if (!valid) return
        that.$http.post('users', that.add_user_form)
          .then(resp => {
            const { data: res } = resp
            console.log(res)
            if (res.meta.status !== 201) {
              return that.$message.error(res.meta.msg)
            }
            // 隐藏对话框
            that.addUserFormVisible = false
            that.$message.success(res.meta.msg)
            // 刷新用户列表
            that.getUserList()
          })
      })
    },
    // 重置修改用户表单
    resetUpUserForm () {
      this.$refs.up_user_form_ref.resetFields()
    },
    getUserInfo (id) {
      const that = this
      this.upUserFormVisible = true
      this.$http.get(`users/${id}`)
        .then(resp => {
          const { data: res } = resp
          if (res.meta.status !== 200) {
            return that.$message.error(res.meta.msg)
          }
          that.up_user_form = res.data
          that.up_user_form.id = id
        })
    },
    updateUser () {
      const that = this
      const id = this.up_user_form.id
      this.$refs.up_user_form_ref.validate(valid => {
        if (!valid) return
        this.$http.put(`users/${id}`, that.up_user_form)
          .then(resp => {
            const { data: res } = resp
            if (res.meta.status !== 200) {
              return that.$message.error(res.meta.msg)
            }
            that.$message.success(res.meta.msg)
            // 隐藏对话框
            that.upUserFormVisible = false
            // 更新表格数据
            that.getUserList()
          })
      })
    },
    delUser (user) {
      const that = this
      this.$confirm('此操作将永久删除该用户, 是否继续?', `删除用户${user.username}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('delete user')
        that.$http.delete(`users/${user.id}`)
          .then(resp => {
            const { data: res } = resp
            if (res.meta.status !== 200) {
              return that.$message.error(`删除失败：${res.meta.msg}`)
            }
            that.$message.success(res.meta.msg)
            that.getUserList()
          }).catch(err => {
            return that.$message.error(`删除失败：${err}`)
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .users {
    .page-nation {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
