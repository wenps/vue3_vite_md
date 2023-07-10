<template>
  <div>
    <aside><AsideMenu/></aside>
    <content>
      <router-view></router-view>
    </content>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import AsideMenu from "components/AsideMenu/index.vue";
export default defineComponent({
  components: {
    AsideMenu,
  },
});
</script>
<style lang="scss" scoped>
  div {
    width: 100%;
    height: 100%;
    display: flex;
    aside {
      
    }
    content {
      flex: 1;
      padding: 20px;
    }
  }
</style>

