<template>
  <div class="login">
    <el-form
      class="login-form"
      label-position="top"
      ref="form"
      :model="form"
      label-width="80px"
      :rules="rules"
    >
      <h1 class="login-title">Edu Boss 管理系统</h1>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          :loading="isLoginLoading"
          @click="onSubmit"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { login } from '@/services/user'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '15510792995',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 8 个字符', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        this.isLoginLoading = true
        // 1.表单验证
        await (this.$refs['form'] as Form).validate()
        // 2. 验证通过 -> 提交表单
        const { data } = await login(this.form)
        // 3. 处理请求结果
        //    成功：跳转到首页
        //    失败：给出提示
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          // 1. 登陆成功，记录登录状态，状态需要能够全局访问（放到 Vuex 容器中）
          this.$store.commit('setUser', data.content)
          // 2. 然后再访问需要登录的页面的时候判断有没有登录状态（路由拦截器）
          this.$router.push(this.$route.query.redirect as string || '/')
          // this.$router.push({
          //   name: 'home'
          // })
          this.$message.success('登陆成功')
        }
      } catch (error) {
        console.log('登录失败', error)
      }
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-form {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
  }
  .login-btn {
    width: 100%;
  }
  .login-title {
    text-align: center;
  }
}
</style>
