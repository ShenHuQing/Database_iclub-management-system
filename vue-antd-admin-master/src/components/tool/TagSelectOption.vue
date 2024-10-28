<template>
  <a-checkable-tag
      @change="$emit('click')"
      v-model="checked"
      class="tag-default"
      @click="toggleCheck"
      :checked="checked">
    <slot></slot>
  </a-checkable-tag>
</template>

<script>
export default {
  name: 'TagSelectOption',
  props: {
    value: {
      type: String,
      required: false
    },
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
  methods: {
    toggleCheck() {
      // 切换选中状态
      this.checked = !this.checked;
      // 触发父组件的 change 事件
      this.$emit('change', this.value, this.checked);
    }
  }
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
