<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-brand">
        <img class="auth-logo" src="@/assets/logo/IMG_1115_tight.png" alt="logo">
      </div>
      <div class="auth-heading">
        <span>Register your account</span>
      </div>
      <div class="auth-form">
        <el-form :model="form" :rules="rules" ref="registerForm" hide-required-asterisk>
          <el-form-item class="ele" prop="username" label="用户名：" label-width="100px">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item class="ele" prop="password" label="密码：" label-width="100px">
            <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item class="ele" prop="rePassword" label="确认密码：" label-width="100px">
            <el-input type="password" v-model="form.rePassword" placeholder="确认密码"></el-input>
          </el-form-item>
          <el-form-item class="ele" prop="email" label="邮箱：" label-width="100px">
            <el-input v-model="form.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item class="ele auth-submit-item">
            <el-button type="primary" @click="submitForm">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="auth-link-row">
        <span>已有账户</span><router-link to="/user/login">立即登陆</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  data() {
    let validatorPass = (rule, value, callback) => {
      if (value.length < 6 || value.length > 15) {
        callback(new Error('密码必须为6~15个字符'));
      } else {
        if (this.form.rePassword !== '') {
          this.$refs.registerForm.validateField('rePassword', () => null);
        }
        callback();
      }
    }
    let validatorRePass = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致！'));
      } else {
        callback();
      }
    }
    return {
      form: {
        username: '',
        password: '',
        rePassword: '',
        email: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '用户名为3~15个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatorPass, trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatorRePass, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          axios.get('/flower/api/users', {
            params: {
              username: this.form.username
            }
          }).then(res => {
            if (res.data.IsExists) {
              ElMessage({
                message: '用户名已存在！',
                type: 'error'
              })
            } else {
              axios.post('/flower/api/users', {
                username: this.form.username,
                password: this.form.password,
                email: this.form.email
              }).then(res => {
                if(res.status === 201) {
                  ElMessage({
                    message: '注册成功',
                    type: 'success'
                  })
                  this.$router.push('/user');
                }
              }).catch(error => {
                ElMessage.error('注册失败' + error);
              })
            }
          }).catch(error => {
            ElMessage.error('查询用户名出现错误：' + error)
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
  width: min(100%, 500px);
  padding: 42px 44px 32px;
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
.auth-link-row {
  position: relative;
  z-index: 1;
}

.auth-brand {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
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
  margin-bottom: 20px;
  text-align: center;
  font-size: 22px;
  line-height: 1.15;
  font-weight: 700;
  color: #2f2f2f;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
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

.auth-submit-item {
  margin-top: 6px;
  margin-bottom: 0;
}

.auth-submit-item :deep(.el-form-item__content) {
  width: 100%;
}

.auth-submit-item :deep(.el-button) {
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

.auth-submit-item :deep(.el-button:hover) {
  filter: brightness(1.06);
  box-shadow: 0 20px 38px rgba(40, 40, 40, 0.28);
  transform: translateY(-1px);
}

.auth-submit-item :deep(.el-button:active) {
  transform: translateY(0) scale(0.99);
}

.auth-link-row {
  margin-top: 24px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.auth-link-row span {
  margin-right: 8px;
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
    padding: 32px 22px 26px;
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
