<template>
  <nav class="navigate" aria-label="主导航">
    <button
      class="navigate-button"
      type="button"
      aria-label="打开导航"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div v-show="isOpen" class="navigate-menu">
      <router-link
        v-for="item in navList"
        :key="item.path"
        :to="item.path"
        @click="isOpen = false"
      >
        {{ item.name }}
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'MyNavigate',
  data() {
    return {
      isOpen: false,
      navList: [
        {name: '首页', path: '/'},
        {name: '往季产品', path: '/ArchiveProducts'},
        {name: '我的', path: '/user/login'},
        {name: '关于我们', path: '/about_us'}
      ]
    }
  }
}
</script>

<style scoped>
.navigate {
  position: fixed;
  top: 28px;
  right: 28px;
  z-index: 1000;
}

.navigate-button {
  width: 46px;
  height: 46px;
  border: 1px solid rgba(30, 30, 30, 0.22);
  border-radius: 50%;
  background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.82), rgba(220, 222, 224, 0.66)),
      rgba(242, 242, 242, 0.72);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.72),
      0 8px 22px rgba(0, 0, 0, 0.14);
  backdrop-filter: blur(14px) saturate(112%);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.navigate-button:hover {
  background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(205, 207, 209, 0.76)),
      rgba(238, 238, 238, 0.84);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.82),
      0 10px 26px rgba(0, 0, 0, 0.18);
  transform: translateY(-1px);
}

.navigate-button span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 4px auto;
  background: #2c2c2c;
  border-radius: 999px;
}

.navigate-menu {
  position: absolute;
  top: 56px;
  right: 0;
  width: 116px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.62);
  border-radius: 8px;
  background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(218, 220, 222, 0.64)),
      rgba(236, 236, 236, 0.76);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.72),
      0 12px 30px rgba(0, 0, 0, 0.14);
  backdrop-filter: blur(16px) saturate(112%);
}

.navigate-menu a {
  display: block;
  padding: 10px 12px;
  border-radius: 6px;
  color: #222222;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.navigate-menu a:hover,
.navigate-menu a.router-link-exact-active {
  color: #111111;
  background: rgba(255, 255, 255, 0.58);
}
</style>
