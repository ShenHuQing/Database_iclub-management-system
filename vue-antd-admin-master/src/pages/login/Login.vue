<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{systemName}}</span>
      </div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <!-- 使用 v-model 来绑定当前的 tab 状态 -->
        <a-tabs v-model="activeTab" size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
          <!-- 登录 Tab -->
          <a-tab-pane tab="登录" key="login">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
            <a-form-item>
              <a-input
                  autocomplete="autocomplete"
                  size="large"
                  placeholder="账户"
                  v-decorator="['name', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                  size="large"
                  placeholder="密码"
                  autocomplete="autocomplete"
                  type="password"
                  v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
            <a-radio-group v-model="userRole">
              <a-radio value="student">学生</a-radio>
              <a-radio value="admin">管理员</a-radio>
            </a-radio-group>
            <a-form-item>
              <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
            </a-form-item>
          </a-tab-pane>
          <!-- 注册 Tab -->
          <a-tab-pane tab="注册" key="register">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
            <a-form-item>
              <a-input
                  autocomplete="autocomplete"
                  size="large"
                  placeholder="账户"
                  v-decorator="['name', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                  size="large"
                  placeholder="密码"
                  autocomplete="autocomplete"
                  type="password"
                  v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">注册</a-button>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '../../layouts/CommonLayout'
import { login } from '../../services/user'
import { setAuthorization } from '../../utils/request'
import {mapGetters, mapMutations} from 'vuex'
// import { getRoutesConfig } from "@/services/user";
import axios from "axios";
// import {loadRoutes} from "@/utils/routerUtil";

export default {
  name: 'Login',
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: '',
      form: this.$form.createForm(this),
      userRole: 'student',
      activeTab: 'login'  // 默认选中的 Tab
    }
  },
  computed: {
    ...mapGetters('account', ['user']),
    isStudent() {
      return this.user.role === 'student'; // 假设角色为 'student'
    },
    systemName() {
      return this.$store.state.setting.systemName;
    }
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue('name');
          const password = this.form.getFieldValue('password');
          const role = this.userRole;
          // 根据 activeTab 判断是登录还是注册
          if (this.activeTab === 'login') {
            login(name, password, role).then(this.afterLogin);
          } else if (this.activeTab === 'register') {
            this.register(name, password);
          }
        }
      });
    },
    register(name, password) {
      // 注册逻辑
      axios.post('http://localhost:8080/register', { name, password })
          .then(response => {
            const res = response.data;
            if (res.code === 0) {  // 假设返回 code 为 0 代表成功
              this.$message.success('注册成功！请登录。', 3);
              // 注册成功后切换到登录 Tab
              this.activeTadatb = 'login';
              this.form.resetFields();  // 重置表单
            } else {
              this.error = '注册失败，该用户已存在。';
            }
          })
          .catch(error => {
            console.error('注册失败:', error);
            this.error = '注册失败，服务器出错，请稍后再试。';
          })
          .finally(() => {
            this.logging = false;  // 无论成功与否都重置 loading 状态
          });
    },
    afterLogin(res) {
      this.logging = false;
      const loginRes = res.data;
      if (loginRes.code >= 0) {
        const { user, permissions, roles } = loginRes.data;
        this.setUser(user);
        this.setPermissions(permissions);
        this.setRoles(roles);
        setAuthorization({ token: loginRes.data.token, expireAt: new Date(loginRes.data.expireAt) });
        this.$router.push({ path: '/dashboard/workplace' });
        console.log(user);
        console.log(permissions);
        console.log(roles);
        this.$message.success(loginRes.message, 3);
      } else {
        this.error = "登录失败，账号或密码错误";
      }
    }
  }
}
</script>



<style lang="less" scoped>
.common-layout{
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 100px; /* 增加高度以放大图片 */
        width: auto; /* 自动宽度以保持比例 */
        vertical-align: top; /* 顶部对齐 */
        margin-right: 16px; /* 右边距 */
        margin-top: -43px;
      }
      .title {
        font-size: 33px;
        color: /*@title-color*/#B9C2E3;
        font-family: /*'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif*/'Great Vibes', cursive;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login{
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button{
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>