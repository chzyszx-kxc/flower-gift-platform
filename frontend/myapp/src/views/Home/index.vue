<template>
  <div id="main">
    <video id="shadow_video" class="bg-video" autoplay muted loop playsinline preload="auto">
      <source src="@/assets/background/tree-shadow.mp4" type="video/mp4">
    </video>
    <div class="video-mask"></div>
    <img id="primary_picture" class="bg-img" src="@/assets/otherassets/pricture1.png" alt="">
    <div id="message_box" class="content">
      <h2>当季新品：枪炮玫瑰</h2>
      <p>每一季精选不同花材，按季节搭配花束。</p>

      <div class="content-card">
        <span>玫瑰在晨光里悄然盛放，像一份温柔的祝福来到你身旁。愿你往后的日子，有花开的浪漫，也有一路相随的幸运与美好。</span>
        <br/>
        <span>
          每一朵玫瑰都来自于我们的种植基地，经过筛选后、我们会取出整株玫瑰并尽可能保留它原本的生命力， 让他不知识在盛开的某一刻，也带着继续生长的可能来到你面前。
        </span>
        <button @click="Navagate_NewSeasonArrivals">了解更多</button>
        <button @click="Navagate_SubscribePage">订阅</button>
      </div>
    </div>
  </div>
  <div id="second_path">
    <video class="second-bg-video" autoplay muted loop playsinline preload="auto">
      <source src="@/assets/background/section-shadow.mp4" type="video/mp4">
    </video>
    <div class="story-section story-section--inspiration">
      <div class="story-copy inspiration-copy">
        <span class="story-kicker">设计灵感：</span>
        <span class="story-text">在花田中我被它的生命力深深的触动，我想我们可以以一种更加优雅的方式将它保存</span>
        <span class="story-author">—————花艺师：陈子乐</span>
      </div>
      <div class="story-image-frame inspiration-image-frame">
        <img class="story-image story-image--field" src="@/assets/otherassets/IMG_1116.jpg" alt="雨后玫瑰花田">
      </div>
    </div>
    <div class="story-section story-section--about">
      <div class="story-image-frame about-image-frame">
        <img class="story-image story-image--florist" src="@/assets/otherassets/1783420420217.jpg" alt="花艺师在玫瑰花田采花">
      </div>
      <div class="story-copy about-copy">
        <span class="about-title">关于我们</span>
        <span class="about-text">我们创造的每个产品都旨在超越单纯的“持续”。相反，我们希望积极改善我们周围的世界。通过采取季节性订阅的方法推广产品，我们相信我们可以加深会员与自然世界的关系。</span>
        <router-link to="/about_us" class="about-link">了解更多</router-link>
      </div>
      <div class="footer-row">
        <my-footer></my-footer>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MyFooter from '@/components/MyFooter.vue'

export default {
  name: 'HomePage',
  components: {
    MyFooter
  },
  methods: {
    Navagate_NewSeasonArrivals() {
      axios.get('/flower/api/Navegate_NewArrivals').then(res => {
        const flower = res.data.data

        if (!flower) {
          return
        }

        this.$router.push({
          name: 'ProductDetails',
          query: {
            flower_id: flower.id
          }
        })
      })
    },
    Navagate_SubscribePage() {
      this.$router.push({
        name: 'subscribe'
      })
    }
  }
}
</script>

<style scoped>
#main {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  isolation: isolate;
}

#second_path {
  position: relative;
  min-height: 100vh;
  padding: 110px 56px 120px;
  overflow: hidden;
  isolation: isolate;
  color: #242424;
}

.bg-img {
  display: block;
  width: auto;
  height: auto;
}

.bg-video {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100vh;
  object-fit: cover;
}

.video-mask {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgba(248, 244, 236, 0.18);
  pointer-events: none;
}

.second-bg-video {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-section {
  position: relative;
  z-index: 1;
  display: grid;
  align-items: center;
  width: min(100%, 1040px);
  margin: 0 auto;
}

.story-section--inspiration {
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 84px;
}

.story-section--about {
  grid-template-columns: minmax(420px, 560px) minmax(0, 1fr);
  gap: 76px;
  margin-top: 132px;
}

.story-image-frame {
  width: 100%;
  padding: 9px;
  background: rgba(255, 255, 255, 0.52);
  border: 1px solid rgba(150, 154, 158, 0.26);
  box-shadow: 0 18px 45px rgba(38, 41, 44, 0.08);
}

.inspiration-image-frame {
  align-self: start;
  justify-self: end;
  width: min(100%, 330px);
  aspect-ratio: 2 / 3;
}

.about-image-frame {
  align-self: center;
  width: 100%;
  aspect-ratio: 16 / 9;
}

.story-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-image--field {
  object-position: center 68%;
}

.story-image--florist {
  object-position: center 36%;
}

.story-copy span {
  display: block;
  letter-spacing: 0;
}

.inspiration-copy {
  justify-self: end;
  max-width: 500px;
  line-height: 2.15;
}

.story-kicker {
  margin-bottom: 14px;
  font-size: 18px;
  font-weight: 500;
  color: #4f5559;
}

.story-text {
  font-size: 25px;
  font-weight: 400;
  color: #222222;
}

.story-author {
  margin-top: 24px;
  font-size: 16px;
  color: #6d7175;
  text-align: right;
}

.about-copy {
  justify-self: start;
  max-width: 440px;
  text-align: left;
  line-height: 2.12;
}

.about-title {
  margin-bottom: 24px;
  font-size: 26px;
  font-weight: 500;
  color: #222222;
}

.about-text {
  font-size: 17px;
  color: #33383c;
}

.about-link {
  width: max-content;
  margin: 34px 0 0;
  padding-bottom: 4px;
  font-size: 17px;
  color: #4d5357;
  border-bottom: 1px solid rgba(77, 83, 87, 0.42);
}

.footer-row {
  grid-column: 1 / -1;
  width: calc(100% + 72px);
  margin-left: -36px;
}

#primary_picture {
  position: absolute;
  bottom: 0;
  left: 34%;
  z-index: 2;
  height: 100vh;
  transform: translateX(-50%);
}

.content {
  position: absolute;
  z-index: 3;
  top: 24%;
  right: 6%;
  width: min(500px, 40%);
  min-height: 620px;
  padding: 54px 48px 56px;
  color: #242424;
  text-align: center;
  line-height: 1.85;
  letter-spacing: 0;
  background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(222, 224, 226, 0.58)),
      rgba(235, 235, 235, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 14px;
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05),
      0 20px 48px rgba(0, 0, 0, 0.13);
  backdrop-filter: blur(18px) saturate(112%);
}

.content h2 {
  margin: 0 0 18px;
  color: #171717;
  font-size: 24px;
  font-weight: 600;
}

.content p {
  margin: 0;
  color: #444444;
  font-size: 16px;
}

.content-card {
  margin-top: 34px;
  padding: 30px 0 0;
  text-align: left;
  background: transparent;
  border-top: 1px solid rgba(35, 35, 35, 0.14);
  border-radius: 0;
}

.content-card span {
  display: block;
  color: #2d2d2d;
  font-size: 16px;
  line-height: 2.08;
}

.content-card ol {
  margin: 0;
  padding-left: 22px;
}

.content-card li {
  padding-left: 8px;
  font-size: 13px;
}

.content button {
  width: 100%;
  height: 52px;
  margin-top: 22px;
  color: #222222;
  background: rgba(255, 255, 255, 0.46);
  border: 1px solid rgba(255, 255, 255, 0.58);
  border-radius: 6px;
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      0 8px 18px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.content button:hover {
  background: rgba(255, 255, 255, 0.72);
  transform: translateY(-1px);
}

@media (max-width: 1180px) {
  #second_path {
    padding: 72px 24px 86px;
  }

  .story-section {
    width: min(100%, 680px);
  }

  .story-section--inspiration {
    grid-template-columns: minmax(0, 1fr) 210px;
    gap: 28px;
  }

  .story-section--about {
    grid-template-columns: minmax(230px, 260px) minmax(0, 1fr);
    gap: 28px;
    margin-top: 78px;
  }

  .inspiration-image-frame {
    width: min(100%, 210px);
  }

  .story-text {
    font-size: 20px;
  }

  .about-title {
    font-size: 22px;
  }

  .about-text {
    font-size: 15px;
  }
}

@media (max-width: 700px) {
  .story-section,
  .story-section--inspiration,
  .story-section--about {
    grid-template-columns: 1fr;
    gap: 28px;
    width: min(100%, 520px);
  }

  .story-section--about {
    margin-top: 78px;
  }

  .inspiration-image-frame {
    width: min(100%, 330px);
  }

  .story-text {
    font-size: 22px;
  }

  .about-title {
    font-size: 24px;
  }

  .about-text {
    font-size: 16px;
  }

  .story-author {
    text-align: left;
  }

  .footer-row {
    width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 900px) {
  .content {
    top: 8%;
    right: 5%;
    left: 5%;
    width: auto;
    min-height: 220px;
    padding: 24px;
  }
}
</style>
