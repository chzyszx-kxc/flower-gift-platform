<template>
  <div id="page">
    <div id="frame">
      <div>
        <span>Welcome Back</span>
      </div>
      <div id="left_bar">
        <span>id:{{ managerInfo.user_id }}</span>
        <span>账号:{{ managerInfo.username }}</span>
        <span>订阅状态:{{ managerInfo.subscription_status }}</span>
        <span>{{ managerInfo.current_season_reservation_status }}</span>
      </div>
      <div id="right_chunk">
        <div id="delivery_information_box">
          <button
            type="button"
            :class="{ 'is-open': deliveryOpen }"
            :aria-expanded="deliveryOpen"
            @click="deliveryOpen = !deliveryOpen"
          >
            <span>配送地址</span>
            <span>expand_more</span>
          </button>
          <Transition
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            @before-leave="beforeLeave"
            @leave="leave"
            @after-leave="afterLeave"
          >
            <div v-show="deliveryOpen" class="manager-panel">
              <div v-if="hasDeliveryInfo" class="delivery-info-content">
                <div>
                  <span>联系人：</span><span>{{ deliveryInfo.receiver_name }}</span>
                </div>
                <div>
                  <span>联系电话：</span><span>{{ deliveryInfo.receiver_phone }}</span>
                </div>
                <div>
                  <span>配送地址：</span><span>{{ deliveryInfo.address }}</span>
                </div>
              </div>
              <div v-else>
                <el-form :model="deliveryInfo" :rules="rules" ref="deliveryForm">
                  <el-form-item class="ele" prop="receiver_name" label="联系人：" label-width="100px">
                    <el-input v-model="deliveryInfo.receiver_name" placeholder="联系人"></el-input>
                  </el-form-item>
                  <el-form-item class="ele" prop="receiver_phone" label="联系电话：" label-width="100px">
                    <el-input v-model="deliveryInfo.receiver_phone" placeholder="联系电话"></el-input>
                  </el-form-item>
                  <el-form-item class="ele" prop="address" label="配送地址：" label-width="100px">
                    <el-input v-model="deliveryInfo.address" placeholder="配送地址"></el-input>
                  </el-form-item>
                  <el-form-item class="ele">
                    <el-button type="primary" @click="saveDeliveryInfo">保存</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </Transition>
        </div>
        <div id="my_collect">
          <button
            type="button"
            :class="{ 'is-open': collectOpen }"
            :aria-expanded="collectOpen"
            @click="collectOpen = !collectOpen"
          >
            <span>我搜集的花礼</span>
            <span>expand_more</span>
          </button>
          <transition
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            @before-leave="beforeLeave"
            @leave="leave"
            @after-leave="afterLeave"
          >
            <div v-show="collectOpen" class="manager-panel">
              <p>当前功能尚未开放</p>
            </div>
          </transition>
        </div>
        <div id="my_desire">
          <button
            type="button"
            :class="{ 'is-open': desireOpen }"
            :aria-expanded="desireOpen"
            @click="desireOpen = !desireOpen"
          >
            <span>心愿清单</span>
            <span>expand_more</span>
          </button>
          <transition
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            @before-leave="beforeLeave"
            @leave="leave"
            @after-leave="afterLeave"
          >
            <div v-show="desireOpen" class="manager-panel">
              <p>当前功能尚未开放</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  data() {
    let validatorPhone = (rule, value, callback) => {
      if (!/^1[345789]\d{9}$/.test(this.deliveryInfo.receiver_phone)) {
        callback(new Error('请输入正确的手机号！'));
      } else {
        callback();
      }
    }

    return {
      userid: sessionStorage.getItem('userid'),
      managerInfo: {
        user_id: '',
        username: '',
        subscription_status: '',
        current_season_reservation_status: ''
      },
      hasDeliveryInfo: false,
      deliveryOpen: false,
      collectOpen: false,
      desireOpen: false,
      deliveryInfo: {
        receiver_name: '',
        receiver_phone: '',
        address: ''
      },
      rules: {
        receiver_name: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        receiver_phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatorPhone, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入配送地址', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if (!this.userid) {
      ElMessage({
        message: '请您先登陆',
        type: 'warning'
      })
      this.$router.push('/user/login');
      return;
    }

    this.getDeliveryInfo();
    this.getManagerInfo();
  },
  methods: {
    getManagerInfo() {
      // 从数据库读取左侧栏只需要的三项信息：用户id、当季订阅状态、当季是否已预约。
      axios.get('/flower/api/users/manager-info/' + this.userid).then(res => {
        this.managerInfo = res.data.data;
      }).catch(error => {
        ElMessage.error('获取用户信息失败');
        return error;
      })
    },
    getDeliveryInfo() {
      // 从数据库读取用户默认配送信息；如果已有信息，回填表单，用户可在预约前继续修改。
      axios.get('/flower/api/users/delivery-info/' + this.userid).then(res => {
        const data = res.data.data;

        if (data) {
          this.hasDeliveryInfo = true;
          this.deliveryInfo = {
            receiver_name: data.receiver_name,
            receiver_phone: data.receiver_phone,
            address: data.address
          };
        }
      }).catch(error => {
        ElMessage.error('获取配送信息失败');
        return error;
      })
    },
    saveDeliveryInfo() {
      this.$refs.deliveryForm.validate((valid) => {
        if (valid) {
          // 保存默认配送信息；后续预约成功时，后端会把这份信息复制为配送快照。
          axios.post('/flower/api/users/delivery-info', {
            userid: this.userid,
            receiver_name: this.deliveryInfo.receiver_name,
            receiver_phone: this.deliveryInfo.receiver_phone,
            address: this.deliveryInfo.address
          }).then(res => {
            if (res.status === 201) {
              ElMessage({
                message: '配送信息保存成功',
                type: 'success'
              })
              this.hasDeliveryInfo = true;
            }
          }).catch(error => {
            ElMessage.error('配送信息保存失败');
            return error;
          })
        }
      })
    },
    beforeEnter(el) {
      el.style.height = '0';
      el.style.opacity = '0';
    },
    enter(el, done) {
      el.style.transition = 'height 220ms ease-out, opacity 220ms ease-out';
      el.style.height = el.scrollHeight + 'px';
      el.style.opacity = '1';
      this.finishOnHeightTransition(el, done);
    },
    afterEnter(el) {
      el.style.height = '';
      el.style.opacity = '';
      el.style.transition = '';
    },
    beforeLeave(el) {
      el.style.height = el.scrollHeight + 'px';
      el.style.opacity = '1';
      void el.offsetHeight;
    },
    leave(el, done) {
      el.style.transition = 'height 220ms ease-out, opacity 220ms ease-out';
      el.style.height = '0';
      el.style.opacity = '0';
      this.finishOnHeightTransition(el, done);
    },
    afterLeave(el) {
      el.style.height = '';
      el.style.opacity = '';
      el.style.transition = '';
    },
    finishOnHeightTransition(el, done) {
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;
        el.removeEventListener('transitionend', onEnd);
        window.clearTimeout(timer);
        done();
      };

      const onEnd = (event) => {
        if (event.target !== el || event.propertyName !== 'height') return;
        finish();
      };

      const timer = window.setTimeout(finish, 280);
      el.addEventListener('transitionend', onEnd);
    }
  }
}
</script>

<style scoped>
#page {
  position: relative;
  min-height: 100vh;
  padding: 72px 28px 88px;
  overflow: hidden;
  color: #171717;
  background: #EFEEED;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#page,
#page * {
  box-sizing: border-box;
}

#frame {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 304px minmax(0, 1fr);
  column-gap: 38px;
  row-gap: 38px;
  width: min(1180px, 100%);
  min-height: 720px;
  margin: 0 auto;
  padding: 58px 60px 64px;
  background: #dedbd7;
  border: 1px solid rgba(24, 24, 24, 0.12);
  border-radius: 8px;
  box-shadow:
    0 28px 80px rgba(20, 20, 20, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.48);
}

#frame > div {
  position: relative;
  z-index: 1;
}

#frame > div:first-child {
  grid-column: 1 / -1;
}

#frame > div:first-child span {
  display: block;
  margin: 0;
  color: #080808;
  font-size: clamp(3.8rem, 6.2vw, 6.8rem);
  font-weight: 500;
  line-height: 0.9;
  letter-spacing: 0;
}

#left_bar {
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-height: 512px;
  padding: 38px 34px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.08)),
    #d0cdc8;
  border: 1px solid rgba(24, 24, 24, 0.16);
  border-radius: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.36);
}

#left_bar span {
  display: block;
  max-width: 100%;
  color: rgba(24, 24, 24, 0.58);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: 0;
  overflow-wrap: anywhere;
}

#left_bar span:first-child {
  text-transform: uppercase;
}

#right_chunk {
  --manager-text: #171717;
  --manager-muted: rgba(23, 23, 23, 0.56);
  --manager-line: rgba(23, 23, 23, 0.12);
  --manager-line-strong: rgba(23, 23, 23, 0.2);
  --manager-surface: #f7f6f4;
  --manager-surface-hover: #efeeeb;

  width: 100%;
  min-height: 512px;
  margin: 0;
  padding: 0;
  color: var(--manager-text);
  background: var(--manager-surface);
  border: 1px solid var(--manager-line);
  border-radius: 8px;
  box-shadow:
    0 18px 50px rgba(20, 20, 20, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  animation: right-chunk-enter 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

#right_chunk > div {
  position: relative;
  overflow: hidden;
  background: transparent;
  border: 0;
  border-radius: 0;
  transition:
    background-color 220ms ease,
    box-shadow 220ms ease;
  animation: right-card-enter 440ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

#right_chunk > div + div {
  margin-top: 0;
  border-top: 1px solid var(--manager-line);
}

#right_chunk > div:nth-child(2) {
  animation-delay: 70ms;
}

#right_chunk > div:nth-child(3) {
  animation-delay: 140ms;
}

#right_chunk > div:hover {
  background: var(--manager-surface-hover);
  box-shadow: inset 3px 0 0 #1c1c1c;
}

#right_chunk > div > button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 86px;
  padding: 0 34px;
  color: inherit;
  font: inherit;
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
}

#right_chunk > div > button span:first-child {
  color: #111111;
  font-size: 17px;
  font-weight: 650;
  letter-spacing: 0;
}

#right_chunk > div > button span:last-child {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  margin-left: 18px;
  color: rgba(23, 23, 23, 0.62);
  font-size: 0;
  line-height: 1;
  background: rgba(23, 23, 23, 0.04);
  border: 1px solid rgba(23, 23, 23, 0.12);
  border-radius: 50%;
  transition:
    color 200ms ease,
    background-color 200ms ease,
    border-color 200ms ease,
    transform 200ms ease;
}

#right_chunk > div > button span:last-child::before {
  content: "";
  display: block;
  width: 8px;
  height: 8px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg) translate(-1px, -1px);
}

#right_chunk > div:hover > button span:last-child {
  color: #111111;
  background: rgba(23, 23, 23, 0.08);
  border-color: rgba(23, 23, 23, 0.22);
}

#right_chunk > div > button.is-open span:last-child {
  color: #111111;
  background: rgba(23, 23, 23, 0.08);
  border-color: rgba(23, 23, 23, 0.22);
  transform: rotate(180deg);
}

#right_chunk > div > .manager-panel {
  overflow: hidden;
  padding: 0 34px 34px;
  color: var(--manager-muted);
  font-size: 14px;
  line-height: 1.8;
  border-top: 1px solid rgba(23, 23, 23, 0.08);
  will-change: height, opacity;
}

#right_chunk .delivery-info-content > div {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  column-gap: 16px;
  padding: 8px 0;
}

#right_chunk .delivery-info-content > div:first-child {
  padding-top: 20px;
}

#right_chunk .delivery-info-content > div span:first-child {
  color: rgba(23, 23, 23, 0.48);
}

#right_chunk .delivery-info-content > div span:last-child {
  color: rgba(23, 23, 23, 0.82);
  word-break: break-word;
}

#right_chunk p {
  margin: 20px 0 0;
  color: rgba(23, 23, 23, 0.52);
}

#right_chunk :deep(.el-form) {
  padding-top: 22px;
}

#right_chunk :deep(.el-form-item) {
  margin-bottom: 18px;
}

#right_chunk :deep(.el-form-item__label) {
  color: rgba(23, 23, 23, 0.58);
  font-size: 14px;
  justify-content: flex-start;
  text-align: left;
}

#right_chunk :deep(.el-form-item.is-required.asterisk-left > .el-form-item__label::before) {
  display: none;
  content: "";
}

#right_chunk :deep(.el-form-item:last-child .el-form-item__content) {
  justify-content: flex-end;
}

#right_chunk :deep(.el-input__wrapper) {
  min-height: 42px;
  background: #ffffff;
  border: 1px solid rgba(23, 23, 23, 0.14);
  border-radius: 8px;
  box-shadow: none;
  transition:
    background-color 180ms ease,
    border-color 180ms ease;
}

#right_chunk :deep(.el-input__wrapper:hover),
#right_chunk :deep(.el-input__wrapper.is-focus) {
  background: #ffffff;
  border-color: rgba(23, 23, 23, 0.42);
  box-shadow: none;
}

#right_chunk :deep(.el-input__inner) {
  color: #171717;
}

#right_chunk :deep(.el-input__inner::placeholder) {
  color: rgba(23, 23, 23, 0.36);
}

#right_chunk :deep(.el-button) {
  min-width: 132px;
  min-height: 42px;
  color: #ffffff;
  font-weight: 600;
  background: #151515;
  border: 1px solid #151515;
  border-radius: 8px;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;
}

#right_chunk :deep(.el-button:hover) {
  color: #ffffff;
  background: #000000;
  border-color: #000000;
  transform: translateY(-1px);
}

@keyframes right-chunk-enter {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes right-card-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
