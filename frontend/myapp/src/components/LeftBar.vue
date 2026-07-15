<template>
  <div id="left-bar" class="left-bar">
    <div class="logo-box">
      <img class="logo-img" src="../assets/logo/IMG_1115.png" alt="logoflower">
    </div>

    <div class="season-info">
      <div class="season-row">
        <span class="season-label">当前季节：</span>
        <span class="season-value">{{ currentSeasonText }}</span>
      </div>

      <div class="season-row">
        <span class="season-label">距离下一季度：</span>
        <span class="season-value">{{ nextSeasonCountdownText }}</span>
      </div>

      <div class="season-row">
        <span class="season-label">订阅名单：</span>
        <span class="season-value">{{ waitingListText }}</span>
      </div>

      <div class="season-row">
        <span class="season-label">名单截至日期：</span>
        <span class="season-value">{{ subscribeLastDate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      currentSeason: null,
      nextSeasonCountdownText: '待定',
      countdownTimer: null
    }
  },
  computed: {
    currentSeasonText() {
      if (!this.currentSeason) {
        return '待定'
      }

      return this.currentSeason.season_name || this.currentSeason.season_code || '待定'
    },
    subscribeLastDate() {
      if (!this.currentSeason) {
        return '待定'
      }

      return this.currentSeason.subscribe_last_date || '待定'
    },
    waitingListText() {
      if (!this.currentSeason) {
        return '待定'
      }

      return this.currentSeason.is_subscribe_window_open ? '开放中' : '已关闭'
    },
  },
  mounted() {
    // 从数据库读取当前季信息；这里使用 subscribe_end_date - 1 天后的 subscribe_last_date 做页面显示。
    axios.get('/flower/api/current-season').then(res => {
      this.currentSeason = res.data.data
      this.startCountdown()
    }).catch(error => {
      return error
    })
  },
  beforeUnmount() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },
  methods: {
    startCountdown() {
      // 当前季数据来自 tb_flower_season；用当前季 end_date 的下一天 0 点作为“下一季度”开始时间。
      this.updateNextSeasonCountdown()
      this.countdownTimer = setInterval(() => {
        this.updateNextSeasonCountdown()
      }, 1000)
    },
    updateNextSeasonCountdown() {
      const nextSeasonStartDate = this.getNextSeasonStartDate()

      if (!nextSeasonStartDate) {
        this.nextSeasonCountdownText = '待定'
        return
      }

      const diff = nextSeasonStartDate.getTime() - Date.now()

      if (diff <= 0) {
        this.nextSeasonCountdownText = '0D 0H 0M 0S'
        return
      }

      // 把毫秒差拆成页面展示用的天、时、分、秒，模仿 Ffern 的 73D 16H 48M 2S 结构。
      const totalSeconds = Math.floor(diff / 1000)
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      this.nextSeasonCountdownText = days + 'D ' + hours + 'H ' + minutes + 'M ' + seconds + 'S'
    },
    getNextSeasonStartDate() {
      if (!this.currentSeason || !this.currentSeason.end_date) {
        return null
      }

      const currentSeasonEndDate = this.parseDate(this.currentSeason.end_date)

      if (!currentSeasonEndDate) {
        return null
      }

      currentSeasonEndDate.setDate(currentSeasonEndDate.getDate() + 1)
      return currentSeasonEndDate
    },
    parseDate(dateText) {
      const dateParts = String(dateText).split('-').map(Number)

      if (dateParts.length !== 3 || dateParts.some(part => Number.isNaN(part))) {
        return null
      }

      return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 0, 0, 0)
    }
  }
}
</script>

<style scoped>
.left-bar {
  min-height: 100vh;
  padding: 32px 48px 32px;
  background: #f7f7f7;
  color: #111111;
  font-family: "Courier New", Courier, monospace;
}

.logo-box {
  display: flex;
  justify-content: center;
  padding-top: 24px;
}

.logo-img {
  display: block;
  width: 400px;
  height: auto;
}

.season-info {
  margin-top: -42px;
  padding-top: 0;
  padding-bottom: 28px;
  border-bottom: 1px solid #d8d8d8;
}

.season-row {
  display: grid;
  grid-template-columns: 128px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.season-row:last-child {
  margin-bottom: 0;
}

.season-label {
  color: #111111;
  font-size: 13px;
  line-height: 1;
  white-space: nowrap;
}

.season-value {
  display: block;
  min-height: 30px;
  padding: 9px 14px 8px;
  border-radius: 4px;
  background: #e8e8e8;
  color: #555555;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
