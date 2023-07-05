<template>
  <div class="aside">
    <a-menu
      style="width: 256px"
      mode="inline"
    >
      <a-menu-item v-for="item in coreRoutes" :key="item.name">
        <template #icon><tag :item="item"/></template>
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import tag from "./components/tag.vue";
import { routes } from "/@/router/index";
export default defineComponent({
  components: {
    tag,
  },
  setup() {
    let coreRoutes:Array<object> = reactive([])
    routes.forEach((element:any) => {
      if(element?.mate?.isCore) {
        coreRoutes = element.children
      }
    })
    return {
      coreRoutes
    }
  },
});
</script>
<style lang="scss" scoped>
.aside {
  height: 100%;
  :deep(.ant-menu) {
    height: 100%;
  }
}
</style>