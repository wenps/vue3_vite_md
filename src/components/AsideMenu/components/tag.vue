<template>
  <span>{{item?.mate?.en_name}}</span>
  <span class="chinese">{{item?.mate?.zh_name}}</span>
</template>
<script setup lang="ts">
  import { defineProps} from 'vue';
  import { interRouter } from "../../../interface/router";
  const props = defineProps<{item: interRouter}>()
  const item = props.item
</script>
<style lang="scss" scoped>
span {
    font-size: 16px;
}
.chinese {
  margin-left: 6px;
  font-weight: 400;
  font-size: 14px;
  opacity: .67;
}
</style>