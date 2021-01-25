<template>
  <div class="rating">
    <div class="rating__stars">
      <div class="rating__stars__blank">
        <Icon v-for="i in max" :key="i" icon="star"></Icon>
      </div>
      <div class="rating__stars__filled" :style="filledStarsStyle">
        <Icon v-for="i in max" :key="i" icon="starFill"></Icon>
      </div>
    </div>
    <div class="rating__reviews">
      {{ reviewsCount }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rating',
  props: {
    max: {
      type: Number,
      default: 5
    },
    value: {
      type: Number,
      default: 0
      // validator: prop => prop >= 0 && prop <= this.max
    },
    reviewsCount: {
      type: Number,
      validator: prop => prop >= 0
    }
  },
  computed: {
    filledStarsStyle() {
      return {
        width: `${(100 * Math.min(this.value, this.max)) / this.max}%`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rating {
  display: flex;
  align-items: center;

  &__stars {
    font-size: 0.75rem;
    position: relative;

    &__blank {
      display: flex;
      flex-wrap: nowrap;
      color: rgb(200, 200, 200);
    }

    &__filled {
      display: flex;
      flex-wrap: nowrap;
      position: absolute;
      overflow: hidden;
      top: 0;
      left: 0;
      color: $primary;
    }
  }

  &__reviews {
    margin-left: 8px;
    font-weight: bold;
    font-size: 0.75rem;
    line-height: 1;
    color: $text-secondary;
  }
}
</style>
