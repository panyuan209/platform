<template>
  <v-container
    id="user-view"
    fluid
    tag="section"
  >
    <v-data-table
      v-model="selected"
      show-select
      :search="search"
      :headers="headers"
      :items="filterItems"
      item-key="id"
      dense
      fixed-header
      class="elevation-2"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>用户</v-toolbar-title>
          <v-divider
            vertical
            inset
            class="mx-4"
          />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="搜索"
            single-line
            hide-details
            class="mr-2"
          />
          <v-spacer />
          <v-select
            v-model="selectedStatus"
            :items="cardsStatus"
            label="筛选"
            single-line
            hide-details
            class="mr-2"
          />
          <v-spacer />
          <v-btn
            color="primary"
            class="mr-6"
            @click="exportTable"
          >
            导出数据
          </v-btn>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mr-6"
                v-bind="attrs"
                v-on="on"
              >
                新增用户
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.id"
                        label="id"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.account"
                        label="登录账号"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.permission"
                        label="权限"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.phoneNumber"
                        label="联系电话"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.startTime"
                        label="创建时间"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.founder"
                        label="创建人"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.remark"
                        label="备注"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  取消
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  保存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="dialogDelete"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="text-h5">
                您确定要删除被选中的用户吗？
              </v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="closeDelete"
                >
                  放弃
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="deleteItemConfirm"
                >
                  确定删除
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{item}">
        <v-icon
          small
          color="blue darken-1"
          class="mr-2"
          @click="editItem(item)"
        >
          编辑
        </v-icon>
        <v-icon
          small
          color="red darken-1"
          @click="deleteItem(item)"
        >
          删除
        </v-icon>
      </template>
      <template v-slot:item.permission="{item}">
        <v-chip
          :color="getColor(item.permission)"
          dark
        >
          {{ item.permission }}
        </v-chip>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          刷新
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  // import { exportCardList } from '.IotCard/network'
  import { exportCardList } from './IotCard/network'

  export default {
    name: 'IotCard',
    data () {
      return {
        selected: [],
        search: '',
        cardsStatus: ['不限', '超级管理员', '区域管理员', '用户'],
        selectedStatus: '',
        headers: [
          { text: 'ID', value: 'id', sortable: false },
          { text: '登录账号', value: 'account', sortable: false },
          { text: '权限', value: 'permission', sortable: false },
          { text: '联系电话', value: 'phoneNumber', sortable: false },
          { text: '创建时间', value: 'startTime', sortable: false },
          { text: '创建人', value: 'founder', sortable: false },
          { text: '备注', value: 'remark', sortable: false },
          { text: '操作', value: 'actions', sortable: false },
        ],
        users: [
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '超级管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 2,
            account: 'lysqzcs',
            permission: '用户',
            phoneNumber: '18860112055',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
          {
            id: 1,
            account: '润祥科技',
            permission: '区域管理员',
            phoneNumber: '13566325513',
            startTime: '2019-04-02 16:41:09',
            founder: 'lysgl',
            remark: '市场部-庄杰',
          },
        ],
        dialog: false,
        dialogDelete: false,
        editedIndex: -1,
        editedItem: {
          id: '',
          account: '',
          permission: '',
          phoneNumber: '',
          startTime: '',
          founder: '',
          remark: '',
        },
        defaultItem: {
          id: '',
          account: '',
          permission: '',
          phoneNumber: '',
          startTime: '',
          founder: '',
          remark: '',
        },
      }
    },
    computed: {
      filterItems () {
        return this.users.filter((user) => {
          if (this.selectedStatus === '不限') {
            this.selectedStatus = ''
            return user
          } else {
            return !this.selectedStatus || this.selectedStatus.indexOf(user.status) !== -1
          }
        })
      },
      formTitle () {
        return this.editedIndex === -1 ? '新增' : '编辑'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    methods: {
      getColor (perm) {
        if (perm === '超级管理员') return 'red'
        else if (perm === '区域管理员') return 'orange'
        else return 'green'
      },
      exportTable () {
        exportCardList()
      },
      editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        this.users.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.editedItem)
        } else {
          this.users.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
