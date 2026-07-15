<template>
  <footer id="box" class="liquid-glass">
    <div class="footer-info">
      <span>网站作者：陈子乐</span>
      <span>期望岗位：初级全栈工程师、前端开发</span>
      <span>联系方式：请通过 GitHub Profile 联系</span>
      <span>个人信息：广东理工学院27届本科应届生</span>
      <span class="more-line">了解更多：<a style="text-decoration: underline" href="http://115.29.203.212/portfolio/">个人作品集</a></span>
    </div>
    <div class="footer-media">
      <a class="media-box" href="https://github.com/chzyszx-kxc" target="_blank" rel="noreferrer">
        <img
          src="@/assets/otherassets/GitHub.png"
          alt="我的GitHub地址"
        >
      </a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'MyFooter'
}
</script>

<style scoped>
@font-face {
  font-family: "Helvetica Regular";
  src: url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.eot");
  src:
    url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.eot?#iefix") format("embedded-opentype"),
    url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.woff2") format("woff2"),
    url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.woff") format("woff"),
    url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.ttf") format("truetype"),
    url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.svg#Helvetica Regular") format("svg");
}

#box {
  width: min(100%, 1060px);
  min-height: 280px;
  margin: 104px auto 0;
  padding: 42px 56px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(42px, 7vw, 112px);
  color: rgba(72, 72, 72, 0.92);
  font-family: "Helvetica Regular", "Helvetica Neue", Arial, sans-serif;
}

.liquid-glass {
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.16);
  background-blend-mode: luminosity;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.34),
    inset 0 -1px 1px rgba(0, 0, 0, 0.05),
    0 24px 60px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px) saturate(112%);
  -webkit-backdrop-filter: blur(8px) saturate(112%);
}

.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.78) 0%,
    rgba(255, 255, 255, 0.28) 20%,
    rgba(255, 255, 255, 0) 40%,
    rgba(0, 0, 0, 0.02) 60%,
    rgba(255, 255, 255, 0.22) 80%,
    rgba(255, 255, 255, 0.68) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.liquid-glass::after {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.04)),
    rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.footer-info,
.footer-media {
  position: relative;
  z-index: 1;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: clamp(12px, 1.05vw, 15px);
  font-weight: 500;
  line-height: 1.22;
  letter-spacing: 0;
  white-space: nowrap;
}

.more-line {
  display: flex;
  align-items: center;
  gap: 28px;
}

.more-line a {
  color: rgba(58, 58, 58, 0.9);
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}

.more-line a:hover {
  color: #202020;
  transform: translateY(-1px);
}

.footer-media {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(28px, 4vw, 46px);
}

.media-box {
  width: clamp(108px, 10vw, 138px);
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.18);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.5),
    0 16px 34px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.media-box:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.26);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.62),
    0 20px 42px rgba(0, 0, 0, 0.15);
}

.media-box img {
  display: block;
  width: 74%;
  height: 74%;
  object-fit: contain;
}

.media-box:first-child img {
  width: 58%;
  height: 58%;
}

@media (max-width: 980px) {
  #box {
    grid-template-columns: 1fr;
    gap: 34px;
    width: min(100%, 680px);
  }

  .footer-media {
    justify-content: flex-start;
  }
}

@media (max-width: 620px) {
  #box {
    min-height: auto;
    margin-top: 64px;
    padding: 30px 24px;
    border-radius: 24px;
  }

  .footer-info {
    gap: 14px;
    white-space: normal;
  }

  .footer-media {
    width: 100%;
    gap: 18px;
  }

  .media-box {
    flex: 1;
    min-width: 0;
  }
}
</style>
