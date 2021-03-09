<template>
  <v-menu
    bottom
    left
    offset-y
    origin="top right"
    transition="scale-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        class="ml-2"
        min-width="0"
        text
        v-bind="attrs"
        v-on="on"
      >
        <v-badge
          bordered
          color="red"
          overlap
        >
          <template v-slot:badge>
            <span>5</span>
          </template>

          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-list
      flat
      nav
    >
      <app-bar-item
        v-for="(n, i) in notifications"
        :key="i"
        link
      >
        <v-list-item-content>
          <v-list-item-title>{{ n }} </v-list-item-title>
        </v-list-item-content>
      </app-bar-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'DefaultNotifications',

    data: () => ({
      notifications: [
        '消息一消息一消息一',
        '消息二消息二消息二',
        '消息三消息三消息三',
        '消息四消息四消息四',
        '消息五消息五消息五消息五',
      ],
    }),
  }
</script>
