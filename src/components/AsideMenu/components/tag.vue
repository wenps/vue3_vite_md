<template>
  <div @click="jumpComponents">
    <span>{{en_name}}</span>
    <span class="chinese">{{zh_name}}</span>
  </div>
</template>
<script setup lang="ts">
  import { defineProps} from 'vue';
  import { interRouter } from "interface/router";
  import { useRouter } from 'vue-router'

  const router =  useRouter()
  const props = defineProps<{item: interRouter}>()
  const item = props.item
  const {en_name, zh_name} = item?.mate
  const jumpComponents = () => {
    router.push({name: item.name})
  }
  

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