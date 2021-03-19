module.exports = {
  devServer: {
    disableHostCheck: true,
    before: require('./mock/index.js'), // 引入mock/index.js
  },

  transpileDependencies: ['vuetify'],
}
