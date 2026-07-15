<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-brand">
        <img class="auth-logo" src="@/assets/logo/IMG_1115_tight.png" alt="logo">
      </div>
      <div class="auth-heading">
        <span>Login your account</span>
      </div>
      <div class="auth-form">
        <el-form :model="form" :rules="rules" ref="loginForm" hide-required-asterisk>
          <el-form-item prop="username" label="用户名：" label-width="100px">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：" label-width="100px">
            <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="auth-actions">
          <el-button type="primary" @click="submitForm">登陆</el-button>
      </div>
      <div class="auth-link-row">
        <router-link to="/user/register">注册账号</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if(sessionStorage.getItem('userid')) {
      this.$router.push('/user/manager');
    }
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if(valid) {
          axios.post('/flower/api/users/login', {
            username: this.form.username,
            password: this.form.password
          }).then(res => {
            ElMessage({
              message: '登陆成功！',
              type: 'success'
            })
            sessionStorage.setItem('userid', res.data.data[0].id);
            this.$router.push('/user/manager');
          }).catch(error => {
            if (error.response && error.response.status === 404) {
              ElMessage({
                message: '用户名不正确！',
                type: 'error'
              })
            } else if (error.response && error.response.status === 401) {
              ElMessage({
                message: '登陆密码不正确！',
                type: 'error'
              })
            } else {
              ElMessage.error(error)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: #EFEEED;
  color: #303030;
  overflow: hidden;
}

.auth-card {
  position: relative;
  width: min(100%, 440px);
  padding: 44px 42px 34px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 26px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.32)),
    linear-gradient(315deg, rgba(80, 80, 80, 0.14), rgba(255, 255, 255, 0));
  box-shadow:
    0 28px 80px rgba(48, 48, 48, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    inset 0 -24px 60px rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(24px) saturate(1.18);
}

.auth-card::before {
  content: "";
  position: absolute;
  inset: -45%;
  z-index: 0;
  background:
    conic-gradient(from 120deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.46), rgba(110, 110, 110, 0.16), rgba(255, 255, 255, 0)),
    repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0 1px, rgba(255, 255, 255, 0) 1px 18px);
  opacity: 0.7;
  filter: blur(18px);
  animation: glass-flow 8s ease-in-out infinite alternate;
}

.auth-card::after {
  content: "";
  position: absolute;
  inset: 1px;
  z-index: 0;
  border-radius: 25px;
  background: linear-gradient(115deg, rgba(255, 255, 255, 0.44), rgba(255, 255, 255, 0.04) 34%, rgba(64, 64, 64, 0.12) 100%);
  pointer-events: none;
}

.auth-brand,
.auth-heading,
.auth-form,
.auth-actions,
.auth-link-row {
  position: relative;
  z-index: 1;
}

.auth-brand {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.auth-logo {
  width: 160px;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.auth-heading {
  margin-bottom: 22px;
  text-align: center;
  font-size: 22px;
  line-height: 1.15;
  font-weight: 700;
  color: #2f2f2f;
}

.auth-form {
  margin-bottom: 6px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  height: 46px;
  line-height: 46px;
  color: #4f4f4f;
  font-weight: 600;
}

:deep(.el-input__wrapper) {
  min-height: 46px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.52);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.62) inset,
    0 12px 28px rgba(42, 42, 42, 0.06);
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.78);
  box-shadow:
    0 0 0 1px rgba(80, 80, 80, 0.32) inset,
    0 0 0 4px rgba(80, 80, 80, 0.1),
    0 16px 32px rgba(42, 42, 42, 0.08);
  transform: translateY(-1px);
}

:deep(.el-input__inner) {
  color: #2f2f2f;
  font-weight: 500;
}

:deep(.el-input__inner::placeholder) {
  color: #8f8f8f;
}

.auth-actions {
  margin-top: 8px;
}

.auth-actions :deep(.el-button) {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #1f1f1f, #6e6e6e);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 16px 32px rgba(40, 40, 40, 0.24);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}

.auth-actions :deep(.el-button:hover) {
  filter: brightness(1.06);
  box-shadow: 0 20px 38px rgba(40, 40, 40, 0.28);
  transform: translateY(-1px);
}

.auth-actions :deep(.el-button:active) {
  transform: translateY(0) scale(0.99);
}

.auth-link-row {
  margin-top: 24px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.auth-link-row a {
  color: #303030;
  font-weight: 700;
  text-decoration: none;
}

.auth-link-row a:hover {
  color: #000;
}

@keyframes glass-flow {
  from {
    transform: translate3d(-2%, -1%, 0) rotate(0deg) scale(1);
  }
  to {
    transform: translate3d(2%, 1.5%, 0) rotate(10deg) scale(1.04);
  }
}

@media (max-width: 640px) {
  .auth-page {
    padding: 28px 16px;
  }

  .auth-card {
    padding: 34px 22px 28px;
    border-radius: 22px;
  }

  .auth-heading {
    font-size: 20px;
  }

  .auth-logo {
    width: 136px;
  }

  :deep(.el-form-item) {
    display: block;
  }

  :deep(.el-form-item__label) {
    justify-content: flex-start;
    width: auto !important;
    margin-bottom: 6px;
  }
}

</style>
