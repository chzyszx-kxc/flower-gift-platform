<template>
  <div id="product_details_page">
    <div style="height: 60px"></div>
    <div id="main">
      <div id="primary_picture">
        <img v-if="CurrentImageUrl" :src="CurrentImageUrl" :alt="flower.flower_name">
        <div v-show="IsShow" class="picture_buttons">
          <button type="button" class="picture_button" aria-label="上一张图片" @click="PrevPicture">‹</button>
          <button type="button" class="picture_button" aria-label="下一张图片" @click="NextPicture">›</button>
        </div>
      </div>
      <div id="describe">
        <div>
          <span>{{flower.theme_name}}</span>
          <span>第 {{flower.season_id}} 季花礼</span>
          <span>品类：</span><span>{{flower.category}}</span>
        </div>
        <div>
          <span>{{flower.product_detail_description}}</span>
        </div>
      </div>
      <div id="mybutton">
        <el-button
          type="primary"
          :disabled="subscriptionButtonDisabled"
          @click="handleSubscriptionButton"
        >{{ subscriptionButtonText }}</el-button>
      </div>
    </div>
    <div style="height: 60px"></div>
    <div id="secondary">
      <div>
        <span>本季其它花礼</span>
      </div>
      <div>
        <router-link
            v-for="otherFlower in otherFlowers"
            :key="otherFlower.id"
            :to="{ path: '/flowers/product_details_page', query: { flower_id: otherFlower.id } }"
        >
          <img :src="otherFlower.cover_image" :alt="otherFlower.flower_name">
        </router-link>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import { ElMessage } from 'element-plus';

export default {
  name: 'ProductDetailsPage',
  data() {
    return {
      userid: sessionStorage.getItem('userid'),
      flower: {},
      IsShow: false,
      pictureIndex: 0,
      otherFlowers: [],
      subscriptionButtonText: '订阅',
      subscriptionButtonDisabled: false,
      subscriptionButtonAction: 'subscribe'
    }
  },
  computed: {
    FlowerImages() {
      return Array.isArray(this.flower.images) ? this.flower.images : []
    },
    CurrentImage() {
      return this.FlowerImages[this.pictureIndex] || null
    },
    CurrentImageUrl() {
      if (this.CurrentImage) {
        return this.CurrentImage.image_url
      }

      return this.flower.cover_image || ''
    }
  },
  watch: {
    '$route.query.flower_id'() {
      this.GetFlowersMessage()
      this.GetOtherFlowersPictureBySeason()
    }
  },
  created() {
    this.GetFlowersMessage()
    this.GetOtherFlowersPictureBySeason()
  },
  methods: {
    // 获取flower元信息
    GetFlowersMessage() {
      const flower_id = this.$route.query.flower_id

      if (!flower_id) {
        return
      }

      axios.get('/flower/api/GetOtherMessageById', {
        params: {
          flower_id: flower_id
        }
      }).then(res => {
        this.flower = res.data.data || {}
        this.pictureIndex = 0
        this.IsShow = this.FlowerImages.length > 1
        this.GetDesciption()
        this.GetSubscriptionButtonStatus()
      })
    },
    // 跳转到上一页
    PrevPicture() {
      if (this.FlowerImages.length === 0) {
        return
      }

      if (this.pictureIndex === 0) {
        this.pictureIndex = this.FlowerImages.length - 1
        return
      }

      this.pictureIndex--
    },
    // 跳转到下一页
    NextPicture() {
      if (this.FlowerImages.length === 0) {
        return
      }
      if (this.pictureIndex === this.FlowerImages.length - 1) {
        this.pictureIndex = 0
        return
      }

      this.pictureIndex++
    },

    // 获取flower描述信息
    GetDesciption() {
      const flower_id = this.$route.query.flower_id

      if (!flower_id) {
        return
      }

      axios.get('/flower/api/GetDescription', {
        params: {
          flower_id: flower_id
        }
      }).then(res => {
        const flowerDescription = res.data.data || {}

        this.flower = {
          ...this.flower,
          category: flowerDescription.category || '',
          product_detail_description: flowerDescription.product_detail_description || ''
        }
      })
    },

    // 获取按钮状态
    GetSubscriptionButtonStatus() {
      const flower_id = this.$route.query.flower_id

      if (!flower_id) {
        return
      }

      // 从数据库读取当前用户对当前 flower 的资格状态；结果直接决定按钮文案和是否禁用。
      axios.get('/flower/api/users/subscription/product-status', {
        params: {
          userid: this.userid,
          flower_id: flower_id
        }
      }).then(res => {
        const data = res.data.data || {}

        this.subscriptionButtonText = data.buttonText || '订阅'
        this.subscriptionButtonDisabled = data.buttonDisabled === true
        this.subscriptionButtonAction = data.action || 'subscribe'
      }).catch(error => {
        ElMessage.error('获取订阅状态失败')
        return error
      })
    },
    handleSubscriptionButton() {
      if (this.subscriptionButtonAction === 'subscribe') {
        this.$router.push('/user/subscribe')
        return
      }

      if (this.subscriptionButtonAction === 'reserve') {
        this.reserveDelivery()
      }
    },
    reserveDelivery() {
      if (!this.userid) {
        ElMessage({
          message: '请您先登陆',
          type: 'warning'
        })
        this.$router.push('/user/login')
        return
      }

      // 提交预约时，后端会再次检查资格、读取默认配送信息，并把配送信息复制成快照。
      axios.post('/flower/api/users/subscription/reserve', {
        userid: this.userid,
        flower_id: this.flower.id
      }).then(res => {
        if (res.status === 201) {
          ElMessage({
            message: '预约成功',
            type: 'success'
          })
          this.subscriptionButtonText = '预约成功'
          this.subscriptionButtonDisabled = true
          this.subscriptionButtonAction = 'reserved'
        }
      }).catch(error => {
        if (error.response && error.response.status === 404) {
          ElMessage({
            message: '请先填写配送信息',
            type: 'warning'
          })
          this.$router.push('/user/manager')
        } else if (error.response && error.response.status === 409) {
          ElMessage.error('当前季已经预约过产品')
          this.GetSubscriptionButtonStatus()
        } else if (error.response && error.response.status === 403) {
          const message = error.response.data && error.response.data.message
              ? error.response.data.message
              : '当前产品不可预约'
          ElMessage.error(message)
          this.GetSubscriptionButtonStatus()
        } else {
          ElMessage.error('预约失败')
        }
      })
    },
    GetOtherFlowersPictureBySeason() {
      const flower_id = this.$route.query.flower_id

      if (!flower_id) {
        this.otherFlowers = []
        return
      }

      axios.get('/flower/api/GetOtherFlowersPictureBySeason', {
        params: {
          flower_id: flower_id
        }
      }).then(res => {
        this.otherFlowers = res.data.data || []
      })
    }
  }
}
</script>


<style scoped>
#product_details_page {
  min-height: 100vh;
  background: #EFEEED;
}

#main {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(440px, 620px) minmax(340px, 460px);
  grid-template-rows: auto auto;
  gap: 28px clamp(48px, 6vw, 96px);
  align-content: start;
  align-items: start;
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: clamp(32px, 4vw, 56px) clamp(24px, 5vw, 72px) 16px;
  color: #111;
  background: #EFEEED;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#primary_picture {
  grid-row: 1 / 3;
  position: relative;
  align-self: center;
  width: 100%;
}

#primary_picture img {
  display: block;
  width: min(100%, 380px);
  height: 560px;
  margin: 0 auto;
  background: #000;
  object-fit: contain;
  object-position: center;
}

#describe {
  text-align: left;
}

#describe > div:first-child {
  padding-bottom: 18px;
  border-bottom: 1px solid #d3d3d3;
}

#describe > div:first-child span:nth-child(1) {
  display: block;
  margin-bottom: 10px;
  color: #111;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  line-height: 1.2;
}

#describe > div:first-child span:nth-child(2) {
  display: block;
  margin-bottom: 14px;
  color: #555;
  font-size: 13px;
  line-height: 1.4;
}

#describe > div:first-child span:nth-child(3),
#describe > div:first-child span:nth-child(4) {
  color: #333;
  font-size: 14px;
  line-height: 1.7;
}

#describe > div:nth-child(2) {
  padding-top: 18px;
}

#describe > div:nth-child(2) span {
  color: #555;
  font-size: 13px;
  line-height: 1.85;
}

#mybutton {
  width: 100%;
}

#mybutton :deep(.el-button) {
  width: 100%;
  height: 52px;
  color: #fff;
  background: #111;
  border: 1px solid #111;
  border-radius: 0;
}

#mybutton :deep(.el-button:hover),
#mybutton :deep(.el-button:focus) {
  color: #fff;
  background: #333;
  border-color: #333;
}

#mybutton :deep(.el-button.is-disabled),
#mybutton :deep(.el-button.is-disabled:hover) {
  color: #888;
  background: #e1e1e1;
  border-color: #d2d2d2;
}

#secondary {
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 72px) clamp(56px, 6vw, 80px);
  color: #111;
  background: #EFEEED;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#secondary > div:first-child {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 14px 0 16px;
}

#secondary > div:first-child::after {
  flex: 1;
  height: 1px;
  background: #d3d3d3;
  content: "";
}

#secondary > div:first-child span {
  flex: none;
  color: #111;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 22px;
  line-height: 1.2;
}

#secondary > div:nth-child(2) {
  display: grid;
  grid-template-columns: repeat(2, minmax(280px, 420px));
  justify-content: center;
  gap: clamp(20px, 4vw, 52px);
}

#secondary a {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  min-width: 0;
  background: #000;
  overflow: hidden;
}

#secondary img {
  display: block;
  width: 100%;
  height: 100%;
  background: #000;
  object-fit: contain;
  object-position: center;
}

.picture_buttons {
  position: absolute;
  bottom: 24px;
  left: 50%;
  z-index: 2;
  display: flex;
  gap: 16px;
  transform: translateX(-50%);
}

.picture_button {
  width: 64px;
  height: 64px;
  padding: 0;
  color: #fff;
  font-size: 44px;
  line-height: 1;
  background: transparent;
  border: 2px solid #fff;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 150ms, background-color 150ms;
}

.picture_button:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: scale(1.08);
}

@media (max-width: 900px) {
  #main {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 24px;
    padding: 28px 20px 16px;
  }

  #primary_picture {
    grid-row: auto;
  }

  #primary_picture img {
    width: min(100%, 320px);
    height: 460px;
  }

  #secondary {
    padding: 0 20px 48px;
  }

  #secondary > div:first-child {
    padding-top: 14px;
  }

  #secondary > div:nth-child(2) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  #secondary img {
    height: 100%;
  }
}
</style>
