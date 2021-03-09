// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  drawer: null,
  mini: false,
  items: [
    {
      title: '首页',
      icon: 'mdi-view-dashboard',
      to: '/',
    },
    {
      title: '用户管理',
      icon: 'mdi-account',
      to: '/user',
    },
    {
      title: '物联卡管理',
      icon: 'mdi-smart-card ',
      to: '/iot-card',
    },
    {
      title: '公众号管理',
      icon: 'mdi-apple-icloud',
      items: [
        {
          title: 'Banner管理',
          icon: 'mdi-card-plus',
          to: '/wechat-official/banner',
        },
        {
          title: '公告管理',
          icon: 'mdi-tooltip-minus-outline ',
          to: '/wechat-official/notice',
        },
      ],
    },
  ],
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
