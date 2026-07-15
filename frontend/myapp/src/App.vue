<template>
 <div>
   <left-bar></left-bar>
   <my-navigate></my-navigate>
   <router-view></router-view>
 </div>
</template>

<script>
import MyNavigate from './components/MyNavigate.vue'
import LeftBar from './components/LeftBar.vue'

export default {
  name: 'App',
  components: {
    MyNavigate,
    LeftBar
  }
}
</script>

<style>
html,
body {
  margin: 0;
  min-height: 100%;
}

* {
  box-sizing: border-box;
}

#app,
#app > div {
  min-height: 100vh;
}

#app > div {
  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
}

#app > div > :first-child {
  position: sticky;
  top: 0;
  grid-column: 1;
  height: 100vh;
  overflow: auto;
  border-right: 1px solid lightgray;
}

#app > div > :last-child {
  grid-column: 2;
  min-width: 0;
}

</style>
