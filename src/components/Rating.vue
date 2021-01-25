<template>
  <div class="rating">
    <div class="rating__stars">
      <div class="rating__stars__blank">
        <Icon v-for="i in max" :key="i" icon="star"></Icon>
      </div>
      <div class="rating__stars__filled">
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
      validator: prop => prop >= 0 && prop <= this.max
    },
    reviewsCount: {
      type: Number,
      validator: prop => prop >= 0
    }
  }
}
</script>

<style lang="scss" scoped>
.rating {
  &__stars {
    font-size: 0.625rem;
    position: relative;

    &__blank {
    }
    &__filled {
    }
  }
  &__reviews {
  }
}
</style>
