<template>
  <section class="archive-products">
    <div class="archive-products__inner">
      <div class="archive-products__intro">
        <span class="archive-products__intro-line archive-products__intro-line--lead">这里收藏着那些曾经盛放过的往季花礼。它们代表着不同季度里的心意、故事与片刻的美好，也承载着我们对于永恒的向往</span>
        <span class="archive-products__intro-line">每一个季节，我们都会推出一组专属花礼，将当季的色彩、气息与情绪，凝结成独特的记忆</span>
        <span class="archive-products__intro-line">若有可能，我们会在未来的某个时刻，让它们再次被复现、再次盛放</span>
      </div>

      <div class="archive-products__cards">
        <!-- 跳转到商品详情页 -->
        <router-link
          v-for="(flower, index) in flowers"
          :key="flower.id"
          class="archive-flower-card"
          :style="{ '--delay': `${index * 0.1}s` }"
          :to="`/flowers/product_details_page?flower_id=${flower.id}`"
        >
          <div class="archive-flower-card__inner">
            <img
              class="archive-flower-card__image"
              :src="flower.cover_image"
              :alt="flower.flower_name"
            >
            <span class="archive-flower-card__overlay"></span>

            <div class="archive-flower-card__top">
              <span class="archive-flower-card__tag">{{ flower.season_name }}</span>
            </div>

            <div class="archive-flower-card__content">
              <span class="archive-flower-card__theme">{{ flower.theme_name }}</span>
              <span class="archive-flower-card__name">{{ flower.flower_name }}</span>
              <p class="archive-flower-card__description">{{ flower.theme_description }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data()  {
    return {
      flowers: []
    }
  },
  created() {
    this.GetPartingFlowersList()
  },
  
  methods: {
    GetPartingFlowersList() {
      axios.get('/flower/api/parting_flowers').then(res => {
        this.flowers = res.data.data.filter(function(flower) {
          return flower.product_role === 'primary'
        })
      })
    }
  }
}
</script>

<style scoped>
.archive-products {
  --archive-products-y: -60px; /* 负数上移，正数下移 */
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 100vh;
  padding: 58px 28px;
  background: #EFEEED;
}

.archive-products__inner {
  width: 100%;
  max-width: 1420px;
  margin: 0 auto;
  transform: translateY(var(--archive-products-y));
}

.archive-products__intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 940px;
  margin: 0 auto 34px;
  color: #513f34;
  text-align: center;
}

.archive-products__intro-line {
  display: block;
  font-size: 15px;
  line-height: 1.9;
  letter-spacing: 0;
}

.archive-products__intro-line--lead {
  color: #1f2d22;
  font-family: Georgia, serif;
  font-size: 19px;
  line-height: 1.8;
}

.archive-products__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 26px;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}

.archive-flower-card {
  display: block;
  color: inherit;
  text-decoration: none;
  opacity: 0;
  filter: blur(8px);
  transform: translateY(24px);
  animation: archiveFadeUp 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  animation-delay: var(--delay);
}

.archive-flower-card:focus-visible {
  outline: 3px solid rgba(8, 21, 12, 0.35);
  outline-offset: 5px;
  border-radius: 16px;
}

.archive-flower-card__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 3 / 4;
  min-height: 540px;
  overflow: hidden;
  border-radius: 16px;
  background: #08150C;
  box-shadow: 0 18px 42px rgba(8, 21, 12, 0.12);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.archive-flower-card:hover .archive-flower-card__inner {
  transform: translateY(-8px) scale(1.015);
  box-shadow: 0 28px 58px rgba(8, 21, 12, 0.2);
}

.archive-flower-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s ease, filter 0.55s ease;
}

.archive-flower-card:hover .archive-flower-card__image {
  transform: scale(1.08);
  filter: saturate(1.08);
}

.archive-flower-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(8, 21, 12, 0.84),
    rgba(8, 21, 12, 0.24) 54%,
    rgba(8, 21, 12, 0.02)
  );
}

.archive-flower-card__top,
.archive-flower-card__content {
  position: relative;
  z-index: 1;
  padding: 22px;
}

.archive-flower-card__tag {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 5px 10px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  background: rgba(8, 21, 12, 0.18);
  backdrop-filter: blur(8px);
}

.archive-flower-card__theme,
.archive-flower-card__name {
  display: block;
  color: #fff;
  letter-spacing: 0;
}

.archive-flower-card__theme {
  font-family: Georgia, serif;
  font-size: 34px;
  font-weight: 600;
  line-height: 1.15;
}

.archive-flower-card__name {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 15px;
  font-weight: 500;
}

.archive-flower-card__description {
  display: -webkit-box;
  margin: 14px 0 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.82);
  font-size: 15px;
  line-height: 1.7;
  letter-spacing: 0;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

@keyframes archiveFadeUp {
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0px);
  }
}

@media (min-width: 640px) {
  .archive-products {
    padding-right: 40px;
    padding-left: 40px;
  }

  .archive-products__intro {
    margin-bottom: 42px;
  }

  .archive-products__intro-line--lead {
    font-size: 22px;
  }

  .archive-products__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .archive-flower-card__theme {
    font-size: 38px;
  }

  .archive-flower-card__description {
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .archive-products {
    padding-right: 48px;
    padding-left: 48px;
  }

  .archive-products__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 639px) {
  .archive-flower-card__inner {
    min-height: 470px;
  }
}
</style>
