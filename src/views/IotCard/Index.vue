<template>
  <v-container
    id="iot-card-view"
    fluid
    tag="section"
  >
    <v-data-table
      v-model="selected"
      show-select
      :search="search"
      :loading="isLoading"
      :headers="headers"
      :items="filterItems"
      fixed-header
      item-key="id"
      class="elevation-2"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>物联卡管理</v-toolbar-title>
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
            @click="importTable"
          >
            导入数据
          </v-btn>
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
                新增
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
                        v-model="editedItem.iccid"
                        label="iccid"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.busiNumber"
                        label="业务号码"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.status"
                        label="状态"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.beginTime"
                        label="开始时间"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.endTime"
                        label="结束时间"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.operators"
                        label="运营商"
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
                您确定要删除被选中的Iot Card吗？
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
  import { deleteCard, exportCardList, getCardList } from './network'
  import qs from 'qs'
  import excel from './utils/excel'

  export default {
    name: 'IotCard',
    data () {
      return {
        selected: [],
        search: '',
        cardsStatus: ['全部状态', '已激活', '静默期'],
        selectedStatus: '',
        isLoading: false,
        headers: [
          { text: 'ICCID', value: 'iccid' },
          { text: '业务号码', value: 'busiNumber' },
          { text: '状态', value: 'status', sortable: false },
          { text: '开始时间', value: 'beginTime' },
          { text: '到期时间', value: 'endTime' },
          { text: '运营商', value: 'operators', sortable: false },
          { text: '操作', value: 'actions', sortable: false },
        ],
        page: 1,
        cards: [],
        exportCards: [],
        dialog: false,
        dialogDelete: false,
        editedIndex: -1,
        editedItem: {
          iccid: '',
          busiNumber: '',
          status: '',
          beginTime: '',
          endTime: '',
          operators: '',
        },
        defaultItem: {
          iccid: '',
          busiNumber: '',
          status: '',
          beginTime: '',
          endTime: '',
          operators: '',
        },
      }
    },
    computed: {
      filterItems () {
        return this.cards.filter((card) => {
          if (this.selectedStatus === '全部状态') {
            this.selectedStatus = ''
            return card
          } else {
            return !this.selectedStatus || this.selectedStatus.indexOf(card.status) !== -1
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
    mounted () {
      this.getCardList()
    },
    methods: {
      getCardList () {
        this.isLoading = true
        getCardList().then(res => {
          const data = res.data.list
          this.cards.push(...data)
          this.isLoading = false
        }).catch(err => {
          console.log(err)
        })
        // axios({
        //   method: 'post',
        //   url: 'https://bird.ioliu.cn/v1/?url=http://121.204.204.8:8082/card/cardList',
        // }).then(r => {
        //   console.log(r)
        // }).catch(e => {
        //   console.log(e)
        // })
        // this.isLoading = false
      },
      exportTable () {
        exportCardList()
      },
      importTable () {
        excel.importExcel((value) => {
          console.log(value)
          this.cards.push(value)
        })
      },
      // importTable () {
      //   excel.importExcel()
      // },
      editItem (item) {
        this.editedIndex = this.cards.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.cards.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        this.cards.splice(this.editedIndex, 1)
        const formData = {
          id: this.editedItem.id,
        }
        const dataObj = qs.stringify(formData)
        deleteCard(dataObj)
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
          Object.assign(this.cards[this.editedIndex], this.editedItem)
        } else {
          this.cards.push(this.editedItem)
        }
        this.close()
      },
      initialize () {
        getCardList()
      },
    },
  }
</script>
