<template>
  <section ref="accordionSection" class="platform-accordion" id="about-platform">
    <h2 class="sr-only">关于 LogoFlower</h2>

    <div class="accordion-inner">
      <div class="accordion-nav" role="tablist" aria-label="LogoFlower 关于我们目录">
        <button
          v-for="panel in panels"
          :key="panel.key"
          class="accordion-tab"
          :class="{ active: activePanelKey === panel.key }"
          :data-accordion-tab="panel.key"
          type="button"
          role="tab"
          :aria-selected="String(activePanelKey === panel.key)"
          @click="scrollToPanel(panel.key)"
        >
          {{ panel.nav }}
        </button>
      </div>

      <div ref="accordionStack" class="accordion-stack" aria-live="polite">
        <article
          v-for="(panel, index) in panels"
          :key="panel.key"
          class="accordion-card"
          :class="{ active: activePanelKey === panel.key }"
          :data-accordion-card="panel.key"
          :style="cardStyles[index]"
        >
          <div class="accordion-copy">
            <span class="accordion-kicker">{{ panel.kicker }}</span>
            <h3>{{ panel.title }}</h3>
            <p>{{ panel.description }}</p>

            <div class="accordion-points">
              <span v-for="point in panel.points" :key="point">{{ point }}</span>
            </div>
          </div>

          <div class="accordion-visual">
            <figure class="image-window">
              <img :src="panel.image" :alt="panel.imageAlt">
              <figcaption v-if="panel.caption">{{ panel.caption }}</figcaption>
            </figure>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

import natureImage from '@/assets/AboutUs/nature/1783758845179.jpg'
import teamImage from '@/assets/AboutUs/OurTeam/IMG_1165.jpg'
import deliveryImage from '@/assets/AboutUs/DeliveryArea/img.png'
import venueImage from '@/assets/AboutUs/VenueInformation/IMG_1167.jpg'

const panels = [
  {
    key: 'nature',
    nav: '对自然的承诺',
    kicker: 'Seasonal Ethics',
    title: '对自然的承诺',
    description: 'LogoFlower 相信每一束花都应该回到季节本身。我们以销售批次规划花材，优先选择可追溯种植、低损耗采配与节制包装，让花礼从生长、采摘到抵达都保留自然的节奏。',
    points: ['当季批次发布', '减少过量备货', '保留植物生命力'],
    image: natureImage,
    imageAlt: 'LogoFlower 种植基地中的花材养护现场',
    caption: '从种植基地开始记录每一季花材。'
  },
  {
    key: 'team',
    nav: '花艺师团队',
    kicker: 'Floral Studio',
    title: '花艺师团队',
    description: 'LogoFlower 的花艺师团队负责观察花材状态、建立本季主题，并将色彩、枝条形态和礼赠场景整理成三款当季花礼。每一次发布都来自样枝测试、造型评审和团队共同校准。',
    points: ['主题策划', '花材筛选', '三款花礼定稿'],
    image: teamImage,
    imageAlt: '花艺师团队在工作室制作花礼',
    caption: '花艺师在工作台上完成当季花礼设计。'
  },
  {
    key: 'delivery',
    nav: '配送范围',
    kicker: 'Delivery Network',
    title: '配送范围',
    description: '全国可达',
    points: [],
    image: deliveryImage,
    imageAlt: 'LogoFlower 配送范围示意图',
    caption: ''
  },
  {
    key: 'venue',
    nav: '门店信息',
    kicker: 'Store Information',
    title: '门店信息',
    description: '联系方式：GitHub Profile\n所在地区：九州大陆·东荒域·青玄州·云岚城\n详细地址：天剑山脉以南，星落河畔，太虚仙宗外门弟子居第七峰青竹院三号',
    points: ['到店咨询', '订阅服务', '花礼预约'],
    image: venueImage,
    imageAlt: 'LogoFlower 门店外观',
    caption: '门店承接咨询、预约和当季花礼展示。'
  }
]

const accordionSection = ref(null)
const accordionStack = ref(null)
const activePanelKey = ref(panels[0].key)
const cardStyles = ref(createInitialCardStyles())

function createInitialCardStyles() {
  return panels.map((_, index) => ({
    '--card-y': index === 0 ? '0px' : '100%',
    '--card-clip-bottom': '0px',
    zIndex: String(index + 1)
  }))
}

function updateScrollAccordion() {
  const section = accordionSection.value
  const stack = accordionStack.value

  if (!section || !stack) {
    return
  }

  const rect = section.getBoundingClientRect()
  const scrollable = Math.max(1, rect.height - window.innerHeight)
  const progress = Math.min(1, Math.max(0, -rect.top / scrollable))
  const maxIndex = panels.length - 1
  const rawIndex = progress * maxIndex
  const activeIndex = Math.min(maxIndex, Math.max(0, Math.round(rawIndex)))
  const stackHeight = stack.clientHeight || window.innerHeight * 0.74
  const collapsedHeight = window.innerWidth <= 820 ? 96 : 84

  const cardPositions = panels.map((_, index) => {
    if (index === 0) {
      return 0
    }

    const segmentProgress = Math.min(1, Math.max(0, rawIndex - (index - 1)))
    const startY = stackHeight + collapsedHeight
    const endY = index * collapsedHeight

    return Math.round(startY + (endY - startY) * segmentProgress)
  })

  cardStyles.value = panels.map((_, index) => {
    const y = cardPositions[index]
    const nextY = cardPositions[index + 1]
    const visibleHeight = typeof nextY === 'number'
      ? Math.max(collapsedHeight, Math.min(stackHeight, nextY + 2))
      : stackHeight
    const clipBottom = Math.max(0, stackHeight - visibleHeight)

    return {
      '--card-y': `${Math.round(y)}px`,
      '--card-clip-bottom': `${Math.round(clipBottom)}px`,
      zIndex: String(index + 1)
    }
  })

  activePanelKey.value = panels[activeIndex].key
}

function scrollToPanel(panelKey) {
  const section = accordionSection.value

  if (!section) {
    return
  }

  const index = panels.findIndex(panel => panel.key === panelKey)

  if (index === -1) {
    return
  }

  const maxIndex = panels.length - 1
  const scrollable = section.offsetHeight - window.innerHeight
  const targetTop = section.offsetTop + (index / maxIndex) * scrollable

  window.scrollTo({
    top: targetTop,
    behavior: 'smooth'
  })
}

onMounted(() => {
  nextTick(updateScrollAccordion)
  window.addEventListener('scroll', updateScrollAccordion, { passive: true })
  window.addEventListener('resize', updateScrollAccordion)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollAccordion)
  window.removeEventListener('resize', updateScrollAccordion)
})
</script>

<style scoped>
.platform-accordion {
  color-scheme: light;
  --bg: #EFEEED;
  --ink: #111111;
  --muted: #555555;
  --line: rgba(23, 23, 23, 0.14);
  --glass: rgba(255, 255, 255, 0.52);
  --glass-strong: rgba(255, 255, 255, 0.7);
  --accent: #1f2d22;
  --accent-2: #513f34;
  --deep: #dedbd7;
  --radius: 8px;
  --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;
  --font-mono: "Courier New", Courier, monospace;

  position: relative;
  min-height: 420svh;
  border-top: 1px solid #d8d8d8;
  background:
    radial-gradient(circle at 88% 22%, rgba(255, 255, 255, 0.72), transparent 24rem),
    radial-gradient(circle at 12% 78%, rgba(208, 205, 200, 0.64), transparent 22rem),
    var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.375;
  letter-spacing: 0.0175rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.platform-accordion,
.platform-accordion * {
  box-sizing: border-box;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.accordion-inner {
  position: sticky;
  top: 0;
  display: grid;
  grid-template-columns: minmax(160px, 0.22fr) minmax(0, 0.78fr);
  gap: clamp(28px, 5vw, 72px);
  height: 100svh;
  padding: clamp(48px, 7vw, 86px) clamp(20px, 5vw, 72px);
  overflow: hidden;
}

.accordion-nav {
  align-self: start;
  display: grid;
  gap: 16px;
  padding-top: 14px;
}

.accordion-tab {
  position: relative;
  border: 0;
  background: transparent;
  color: rgba(23, 23, 23, 0.42);
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1rem;
  letter-spacing: 0.08rem;
  text-align: left;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 160ms ease, transform 160ms ease;
}

.accordion-tab::before {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 12px;
  border-radius: 1px;
  background: currentColor;
  vertical-align: 1px;
}

.accordion-tab.active {
  color: var(--accent);
  transform: translateX(2px);
}

.accordion-stack {
  position: relative;
  height: min(80svh, 820px);
  align-self: center;
  overflow: hidden;
}

.accordion-card {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: grid;
  grid-template-columns: minmax(220px, 0.35fr) minmax(340px, 0.65fr);
  height: max(0px, calc(100% - var(--card-y, 0px)));
  border-top: 1px solid var(--line);
  background: var(--bg);
  transform: translateY(var(--card-y, 100%));
  clip-path: inset(0 0 var(--card-clip-bottom, 0px) 0);
  will-change: transform, clip-path;
}

.accordion-copy {
  padding: 26px 30px 0 0;
}

.accordion-kicker {
  display: block;
  margin-bottom: 24px;
  color: rgba(81, 63, 52, 0.72);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
}

.accordion-card h3 {
  margin: 0 0 28px;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: clamp(24px, 2.2vw, 40px);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.0125rem;
}

.accordion-card p {
  max-width: 360px;
  margin: 0;
  color: var(--muted);
  font-size: clamp(15px, 1.4vw, 22px);
  line-height: 1.55;
  white-space: pre-line;
}

.accordion-points {
  display: grid;
  gap: 10px;
  max-width: 340px;
  margin-top: 34px;
}

.accordion-points span {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(23, 23, 23, 0.58);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.45;
  letter-spacing: 0.035rem;
}

.accordion-points span::before {
  content: "";
  flex: 0 0 6px;
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background: var(--accent);
}

.accordion-visual {
  min-height: 0;
  padding: clamp(34px, 5vw, 64px);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.5), rgba(222, 221, 219, 0.92)),
    #dedbd7;
  overflow: hidden;
}

.image-window {
  position: relative;
  width: min(520px, 100%);
  height: 100%;
  min-height: 0;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: var(--radius);
  background: #f7f6f4;
  box-shadow:
    0 28px 70px rgba(20, 20, 20, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.image-window::before {
  content: "";
  position: absolute;
  top: 18px;
  left: 20px;
  z-index: 2;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(17, 17, 17, 0.56);
  box-shadow:
    12px 0 0 rgba(17, 17, 17, 0.34),
    24px 0 0 rgba(17, 17, 17, 0.18);
}

.image-window img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
  object-position: center;
  filter: saturate(0.94) contrast(1.01);
}

.image-window figcaption {
  position: absolute;
  right: 18px;
  bottom: 18px;
  left: 18px;
  z-index: 2;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.62);
  border-radius: 6px;
  background: rgba(247, 246, 244, 0.78);
  color: rgba(23, 23, 23, 0.72);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.5;
  backdrop-filter: blur(14px);
}

@media (max-width: 820px) {
  .platform-accordion {
    min-height: 420svh;
  }

  .accordion-inner {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: 22px;
    padding: 34px 20px;
  }

  .accordion-nav {
    align-self: start;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    padding-top: 0;
  }

  .accordion-stack {
    height: 78svh;
    align-self: stretch;
  }

  .accordion-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .accordion-copy {
    padding: 22px 0 24px;
  }

  .accordion-card p {
    max-width: 620px;
  }

  .accordion-points {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    max-width: none;
    margin-top: 22px;
  }

  .accordion-visual {
    min-height: 0;
    padding: 28px;
  }

  .image-window {
    width: 100%;
    min-height: 0;
  }
}

@media (max-width: 520px) {
  .accordion-nav {
    grid-template-columns: 1fr;
  }

  .accordion-inner {
    padding-inline: 18px;
  }

  .accordion-card h3 {
    margin-bottom: 18px;
    font-size: 26px;
  }

  .accordion-card p {
    font-size: 14px;
  }

  .accordion-points {
    grid-template-columns: 1fr;
  }

  .accordion-visual {
    padding: 18px;
  }

  .image-window figcaption {
    right: 12px;
    bottom: 12px;
    left: 12px;
    font-size: 11px;
  }
}
</style>
