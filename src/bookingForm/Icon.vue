<template>
  <div class="icon-wrapper" v-if="iconObject">
    <svg version="1.1" :viewBox="iconObject.viewBox" :innerHTML="iconObject.content"></svg>
  </div>
</template>

<script>
import * as svgIcons from './icons'

export default {
  name: 'Icon',
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  computed: {
    iconObject() {
      return svgIcons[this.icon]
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-wrapper {
  display: inline-flex;
}

svg {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
