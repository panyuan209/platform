<template>
  <v-app>
    <default-view />
  </v-app>
</template>

<script>
  export default {
    name: 'FullscreenLayout',

    components: {
      DefaultView: () => import(
        /* webpackChunkName: "default-view" */
        './View'
      ),
    },
  }
</script>
