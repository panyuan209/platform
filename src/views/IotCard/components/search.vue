<template>
  <v-container>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="搜索"
      single-line
      hide-details
    />
  </v-container>
</template>

<script>
  export default {
    name: 'Search',
    data () {
      return {
        search: '',
      }
    },
  }
</script>

<style scoped>

</style>
