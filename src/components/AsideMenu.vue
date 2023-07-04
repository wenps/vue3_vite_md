<template>
  <div class="aside">
    <a-menu
      style="width: 256px"
      mode="inline"
    >
    
      <a-menu-item key="sub1">
        <template #icon>Navigation One</template>
      </a-menu-item>
      <a-menu-item key="sub2">
        <template #icon>
          Navigation Two
        </template>
      </a-menu-item>
      <a-menu-item key="sub3">
        <template #icon>Navigation Three</template>
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
  setup() {
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