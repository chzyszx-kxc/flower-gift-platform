<template>
  <div class="subscribe-wrap">
    <div class="subscribe-body">
      <section class="page">
        <div class="shell">
          <header class="header">
            <div>
              <span class="eyebrow">Seasonal Bloom</span>
              <h1>订阅花礼</h1>
            </div>
            <p>按季锁定新品花礼、专属客服与预约配送服务。</p>
          </header>

          <div class="watermark">Subscribe</div>

          <div class="grid">
            <article
                v-for="plan in subscriptionPlans"
                :key="plan.type"
                class="card"
                :class="{
                  'card-pro': plan.type === 'four_season',
                  'card-active': subscribedPlanType === plan.type
                }"
            >
              <div class="card-head">
                <span class="tier-small">{{ plan.badge }}</span>
                <h2 class="tier-title">{{ plan.title }}</h2>
              </div>

              <div class="price">{{ plan.price }}</div>
              <p class="desc">{{ plan.description }}</p>

              <ul class="list">
                <li v-for="feature in plan.features" :key="feature">
                  <span class="check"></span>
                  <span>{{ feature }}</span>
                </li>
              </ul>

              <div class="action">
                <button
                    v-show="!hasCurrentSeasonSubscription && isSubscribeWindowOpen"
                    class="btn"
                    type="button"
                    @click="submitSubscription(plan.type)"
                >
                  {{ plan.buttonText }}
                </button>

                <div
                    v-show="subscribedPlanType === plan.type"
                    class="status status-success"
                >
                  <span>订阅成功</span>
                </div>

                <div
                    v-show="!hasCurrentSeasonSubscription && !isSubscribeWindowOpen"
                    class="status status-closed"
                >
                  <span>订阅名单已关闭，请静候下期花礼</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="footer">
        <div>
          <span>订阅须知</span>
          <span>每一季花礼发布后，订阅用户可在当季三款花礼中选择其中一款进行预约配送。每位用户每一季仅可获取一款花礼，预约成功后不可更换为其他款式。</span>
          <span>订阅仅在当季订阅名单开放期间进行。若订阅名单已关闭，则本季不再接受新的订阅，请静候下一期花礼开放。</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      userid: sessionStorage.getItem('userid'),
      currentSeason: null,
      hasCurrentSeasonSubscription: false,
      subscribedPlanType: '',
      isSubscribeWindowOpen: false,
      subscriptionPlans: [
        {
          type: 'current_season',
          badge: 'Current Season',
          title: '当季订阅',
          price: '¥ 9.9',
          description: '订阅即可获取本季新品',
          buttonText: '当季订阅',
          features: [
            '专属客服',
            '当季可获取花礼 * 1',
            '预约配送服务',
            '贺卡定制'
          ]
        },
        {
          type: 'four_season',
          badge: 'four Seasons',
          title: '四季订阅',
          price: '¥ 27.9',
          description: '订阅即可获取本季以及未来三个季度的新品',
          buttonText: '四季订阅',
          features: [
            '专属客服',
            '当季与往后三个季度可获取花礼 * 1',
            '预约配送服务',
            '贺卡定制'
          ]
        }
      ]
    }
  },
  mounted() {
    if(!this.userid) {
      ElMessage({
        message: '请您先登陆',
        type: 'warning'
      })
      this.$router.push('/user/login');
      return;
    }

    this.getSubscriptionStatus();
  },
  methods: {
    getSubscriptionStatus() {
      // 从订阅主表拿当前季有效订阅和订阅窗口；配送资格与地址不影响这里的显示。
      axios.get('/flower/api/users/subscription/current/' + this.userid).then(res => {
        const data = res.data.data || {};

        this.currentSeason = data.currentSeason;
        this.hasCurrentSeasonSubscription = data.hasCurrentSeasonSubscription;
        this.subscribedPlanType = data.planType || '';
        this.isSubscribeWindowOpen = data.isSubscribeWindowOpen;
      }).catch(error => {
        ElMessage.error('获取订阅状态失败');
        return error;
      })
    },
    submitSubscription(planType) {
      // 设置订阅状态
      axios.post('/flower/api/users/subscription', {
        userid: this.userid,
        plan_type: planType
        // planType是"curren_season"或"four season"
      }).then(res => {
        if (res.status === 201) {
          ElMessage({
            message: '订阅成功',
            type: 'success'
          })
          this.getSubscriptionStatus();
        }
      }).catch(error => {
        if (error.response && error.response.status === 403) {
          ElMessage.error('订阅名单已关闭，请静候下期花礼');
        } else if (error.response && error.response.status === 409) {
          ElMessage.error('当前季已经订阅');
          this.getSubscriptionStatus();
        } else {
          ElMessage.error('订阅失败');
        }
      })
    }
  }
}
</script>

<style scoped>
.subscribe-wrap {
  min-height: 100vh;
  background: #EFEEED;
  overflow-x: hidden;
}

.subscribe-body {
  transform: translateY(150px);
}

.page {
  min-height: auto;
  background: #EFEEED;
  color: #18181b;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.shell {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 20px 24px;
}

.header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 56px;
}

.eyebrow {
  display: inline-flex;
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.header h1 {
  margin: 0;
  color: #111827;
  font-size: clamp(3rem, 8vw, 7.4rem);
  font-weight: 800;
  line-height: 0.9;
}

.header p {
  max-width: 320px;
  margin: 0 0 12px;
  color: #525252;
  font-size: 1rem;
  line-height: 1.8;
}

.watermark {
  position: absolute;
  top: 96px;
  right: 0;
  z-index: 1;
  color: rgba(17, 24, 39, 0.05);
  font-size: clamp(5rem, 14vw, 11rem);
  font-weight: 800;
  line-height: 0.8;
  pointer-events: none;
}

.grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.card {
  position: relative;
  display: flex;
  min-height: 540px;
  flex-direction: column;
  overflow: hidden;
  padding: 42px 28px 30px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 34px;
  background:
      linear-gradient(145deg, rgba(250, 250, 250, 0.98) 0%, rgba(232, 232, 232, 0.94) 48%, rgba(245, 245, 245, 0.92) 100%);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.12);
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.6s, box-shadow 0.6s;
}

.card::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0) 52%);
  content: "";
  pointer-events: none;
}

.card:hover {
  transform: translateY(-10px) scale(1.01);
  border-color: rgba(0, 0, 0, 0.24);
  box-shadow: 0 34px 80px rgba(0, 0, 0, 0.18);
}

.card-pro {
  background:
      linear-gradient(145deg, rgba(229, 229, 229, 0.98) 0%, rgba(203, 203, 203, 0.94) 48%, rgba(242, 242, 242, 0.92) 100%);
  color: #18181b;
}

.card-active {
  border-color: rgba(24, 24, 27, 0.65);
}

.card-head,
.price,
.desc,
.list,
.action {
  position: relative;
  z-index: 1;
}

.tier-small {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
}

.card-pro .tier-small {
  color: #4b5563;
}

.tier-title {
  margin: 12px 0 0;
  font-size: 2.45rem;
  font-weight: 700;
  line-height: 1;
}

.price {
  margin-top: 32px;
  font-size: 3.1rem;
  font-weight: 700;
  letter-spacing: 0;
}

.desc {
  min-height: 3.2em;
  margin: 14px 0 34px;
  color: #5f6368;
  font-size: 0.95rem;
  line-height: 1.7;
}

.card-pro .desc {
  color: #4b5563;
}

.list {
  display: grid;
  gap: 18px;
  margin: 0 0 34px;
  padding: 0;
  list-style: none;
}

.list li {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #242424;
  font-size: 0.96rem;
  line-height: 1.5;
}

.card-pro .list li {
  color: #242424;
}

.check {
  position: relative;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.08);
}

.check::after {
  position: absolute;
  top: 8px;
  left: 7px;
  width: 12px;
  height: 7px;
  border-bottom: 3px solid currentColor;
  border-left: 3px solid currentColor;
  color: #18181b;
  content: "";
  transform: rotate(-45deg);
}

.card-pro .check {
  background: rgba(0, 0, 0, 0.1);
}

.card-pro .check::after {
  color: #18181b;
}

.action {
  display: flex;
  min-height: 46px;
  align-items: center;
  margin-top: auto;
  padding-top: 24px;
}

.btn,
.status {
  min-height: 46px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
}

.btn {
  width: 100%;
  border: 0;
  background: #111827;
  color: #fff;
  cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s, background 0.25s;
}

.btn:hover {
  background: #000;
  box-shadow: 0 12px 26px rgba(17, 24, 39, 0.22);
  transform: scale(1.02);
}

.card-pro .btn {
  background: #18181b;
  color: #fff;
}

.card-pro .btn:hover {
  background: #000;
}

.status {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
}

.status-success {
  background: rgba(0, 0, 0, 0.1);
  color: #18181b;
}

.status-closed {
  background: rgba(0, 0, 0, 0.08);
  color: #4b5563;
}

.card-pro .status-success {
  background: rgba(0, 0, 0, 0.12);
  color: #18181b;
}

.card-pro .status-closed {
  background: rgba(0, 0, 0, 0.08);
  color: #4b5563;
}

.footer {
  background: #EFEEED;
  color: #18181b;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 0 20px 72px;
}

.footer > div {
  position: relative;
  max-width: 1100px;
  min-height: 220px;
  margin: 0 auto;
  overflow: hidden;
  padding: 34px 38px 36px;
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 20px;
  background: linear-gradient(145deg, #e8e7e5 0%, #dedddb 52%, #eeeeec 100%);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.1);
  animation: footerFadeUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.footer > div::before {
  position: absolute;
  inset: 14px;
  z-index: 0;
  background:
      radial-gradient(circle at 0 0, #c7c7c7 0 3px, transparent 3.5px),
      radial-gradient(circle at 100% 0, #c7c7c7 0 3px, transparent 3.5px),
      radial-gradient(circle at 0 100%, #c7c7c7 0 3px, transparent 3.5px),
      radial-gradient(circle at 100% 100%, #c7c7c7 0 3px, transparent 3.5px);
  content: "";
  pointer-events: none;
}

.footer > div::after {
  position: absolute;
  right: 30px;
  bottom: -18px;
  z-index: 0;
  color: rgba(0, 0, 0, 0.04);
  content: "Notes";
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 800;
  line-height: 0.8;
  pointer-events: none;
}

.footer span {
  position: relative;
  z-index: 1;
  display: block;
  max-width: 720px;
}

.footer span:first-child {
  margin-bottom: 18px;
  color: #2a2a2a;
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.footer span:not(:first-child) {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.8;
}

.footer span:nth-child(3) {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

@keyframes footerFadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 860px) {
  .shell {
    padding-top: 42px;
  }

  .header {
    display: block;
    margin-bottom: 34px;
  }

  .header p {
    margin-top: 18px;
  }

  .watermark {
    top: 126px;
    right: 20px;
  }

  .grid {
    display: flex;
    width: calc(100vw - 20px);
    margin-left: -10px;
    overflow-x: auto;
    padding: 0 10px 18px;
    scroll-snap-type: x mandatory;
  }

  .grid::-webkit-scrollbar {
    display: none;
  }

  .card {
    flex: 0 0 320px;
    min-height: 500px;
    scroll-snap-align: center;
  }

  .footer {
    padding: 0 20px 48px;
  }

  .footer > div {
    min-height: 0;
    padding: 28px 24px 30px;
  }

  .footer span {
    max-width: none;
  }

  .footer > div::after {
    right: 20px;
    bottom: -10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer > div {
    animation: none;
  }
}
</style>
