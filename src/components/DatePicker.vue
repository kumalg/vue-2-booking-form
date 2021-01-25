<template>
  <input type="text" v-model="tempDateFrom" />
  <input type="text" v-model="tempDateTo" />
</template>

<script>
export default {
  props: {
    dateFrom: {
      type: String
    },
    dateTo: {
      type: String
    }
  },
  data() {
    return {
      tempDateFrom: this.dateFrom,
      tempDateTo: this.dateTo
    }
  },
  watch: {
    tempDateFrom(newValue) {
      this.$emit('update:dateFrom', newValue)
    },
    tempDateTo(newValue) {
      this.$emit('update:dateTo', newValue)
    }
  }
}
</script>

<style></style>
