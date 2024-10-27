<template>
  <a-checkable-tag
      @change="$emit('click')"
      class="tag-default"
      v-model="checked">
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
  methods: {
    toggleChecked() {
      // 切换选中状态
      this.checked = !this.checked;
      // 触发父组件的 change 事件
      this.$emit('change', this.checked);
      this.$parent.emitChange(); // 通知父组件更新所有选项状态
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
</style>
