<template>
  <v-container
    id="login-view"
    class="fill-height"
    fluid
  >
    <v-row class="logo">
      <v-col>
        <v-img
          class="ma-sm-8"
          contain
          max-width="400"
          src="~@/assets/logo-name.png"
        />
      </v-col>
    </v-row>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        lg="3"
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title>电气火灾智能监控管理平台</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form
              ref="loginForm"
              v-model="canLogin"
            >
              <v-text-field
                v-model="account"
                label="账号"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                :rules="accountRules"
              />

              <v-text-field
                v-model="password"
                label="密码"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="passwordRules"
              />
              <v-row
                align="center"
                justify="space-between"
              >
                <v-col cols="6">
                  <v-checkbox
                    v-model="remember"
                    label="记住密码"
                  />
                </v-col>
                <div
                  class="mb-0 mr-4 text-body-1"
                  :style="{ cursor: 'pointer' }"
                  @click="navToResetPsword"
                  v-text="'忘记密码'"
                />
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :disabled="!canLogin"
              @click="loginHandle"
            >
              登录
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { maxLen, minLen } from '@/util/validate'
  import { loginFetch } from '@/service'
  export default {
    name: 'LoginView',
    data () {
      let account
      let password
      let remember
      let userAccount = localStorage.getItem('lys@userAccount')
      if (userAccount) {
        userAccount = JSON.parse(userAccount)
        account = userAccount.account || ''
        password = userAccount.password || ''
        remember = true
      }
      return {
        account,
        accountRules: [
          (v) => !!v || '账号不能为空',
          (v) => maxLen(v, 16) || '账号最多16位',
        ],
        password,
        passwordRules: [
          (v) => !!v || '密码不能为空',
          (v) => minLen(v, 6) || '密码最少6位',
        ],
        remember,
        canLogin: false,
      }
    },
    methods: {
      loginHandle () {
        const url = this.$route?.query?.redirectUrl || '/'
        loginFetch
          .done({
            account: this.account,
            password: this.password,
          })
          .then(({ code, data, message }) => {
            if (code !== 200) {
              return { code, message }
            }
            localStorage.setItem('lys@Authorization', data.token)
            if (this.remember) {
              localStorage.setItem(
                'lys@userAccount',
                JSON.stringify({
                  account: this.account,
                  password: this.password,
                }),
              )
            } else {
              localStorage.removeItem('lys@userAccount')
            }
            this.$router.push(url)
          })
          .then((err) => {
            if (!err) return
            console.log(err)
          })
      },
      navToResetPsword () {},
    },
  }
</script>

<style lang="sass">
#login-view
  background: url('~@/assets/login-bg.jpg')
  .logo
    position: fixed
    top: 0
</style>
