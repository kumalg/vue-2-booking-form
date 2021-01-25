<template>
  <div></div>
</template>

<script>
export default {
  name: 'Rating',
  props: {
    value: {
      type: Number,
      validator: prop => prop >= 0 && prop <= 5
    },
    reviewsCount: {
      type: Number,
      validator: prop => prop >= 0
    }
  }
}
</script>

<style></style>
