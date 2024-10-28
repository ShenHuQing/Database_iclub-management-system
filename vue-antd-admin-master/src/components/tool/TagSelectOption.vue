<template>
  <a-checkable-tag
      @change="$emit('click')"
      v-model="checked"
      class="tag-default"
      >
    <slot></slot>
  </a-checkable-tag>
</template>

<script>
export default {
  name: 'TagSelectOption',
  props: {
    size: {
      type: String,
      required: false,
      default: 'default'
    }
  },
  data () {
    return {
      checked: false,
      isTagSelectOption: true
    }
  },
}
</script>

<style lang="less" scoped>
  .tag-default{
    font-size: 14px;
    padding: 0 8px;
    height: auto;
    margin-right: 24px;
  }
  //.tag-checked{
  //  background-color: #1890ff;
  //  color: #fff;
  //}
</style>
