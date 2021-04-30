<template>
  <v-container
    id="iot-card-view"
    fluid
    tag="section"
  >
    <v-data-table
      v-model="selected"
      item-key="id"
      :headers="headers"
      :items="filterItems"
      :search="search"
      show-select
      class="elevation-2"
    >
      <template v-slot:top>
        <v-toolbar flat>
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
          />
          <v-spacer />
          <v-select
            v-model="selectedStatus"
            :items="cardsStatus"
            label="筛选"
            single-line
            hide-details
          />
          <v-spacer />
          <v-btn
            color="primary"
            class="mr-6"
            @click="importTable"
          >
            导入
          </v-btn>
          <v-btn
            color="primary"
            class="mr-6"
            @click="exportTable"
          >
            导出
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">
                编辑
              </span>
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
                      label="ID"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.iccid"
                      label="ICCID"
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
                      v-model="editedItem.startTime"
                      label="开卡时间"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.balance"
                      label="余额"
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
          v-model="dialogShow"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">
                查看
              </span>
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
                      label="ID"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.iccid"
                      label="ICCID"
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
                      v-model="editedItem.startTime"
                      label="开卡时间"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.balance"
                      label="余额"
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
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="headline">
              <v-spacer />
              确定要删除此 Iot Card 吗？
              <v-spacer />
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue darken-1"
                text
                @click="closeDelete"
              >
                取消
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="deleteItemConfirm"
              >
                确定
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-icon
          small
          class="mr-2"
          color="blue"
          @click="editItem(item)"
        >
          编辑
        </v-icon>
        <v-icon
          small
          class="mr-2"
          color="blue"
          @click="showItem(item)"
        >
          查看
        </v-icon>
        <v-icon
          small
          color="red"
          @click="deleteItem(item)"
        >
          删除
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  import excel from '@/views/IotCard/excel'
  export default {
    name: 'IotCard',
    data () {
      return {
        selected: [],
        search: '',
        cardsStatus: ['未激活', '使用中', '停机'],
        selectedStatus: '',
        dialog: false,
        dialogShow: false,
        dialogDelete: false,
        editedIndex: -1,
        editedItem: {
          id: 0,
          iccid: 0,
          status: '',
          startTime: '',
          balance: '',
          remark: '',
        },
        defaultItem: {
          id: 0,
          iccid: 0,
          status: '',
          startTime: '',
          balance: '',
          remark: '',
        },
        headers: [
          { text: 'ID', value: 'id', align: 'start', sortable: false },
          { text: 'ICCID', value: 'iccid', sortable: false },
          { text: '状态', value: 'status', sortable: false },
          { text: '开卡时间', value: 'startTime', sortable: false },
          { text: '余额', value: 'balance', sortable: false },
          { text: '备注', value: 'remark', sortable: false },
          { text: '操作', value: 'actions', sortable: false },
        ],
        cards: [
          {
            id: 1,
            iccid: '898600MFSSYYGXXXXXXP',
            status: '未激活',
            startTime: '2021-04-25 12:10:16',
            balance: '400.00元',
            remark: '备注1',
          },
          {
            id: 2,
            iccid: '898601YY8SSXXXXXXXXP',
            status: '使用中',
            startTime: '2020-12-11 14:13:25',
            balance: '3000.00元',
            remark: '备注2',
          },
          {
            id: 3,
            iccid: '898603YYXMHHHXXXXXXP',
            status: '停机',
            startTime: '2018-04-23 19:20:58',
            balance: '12540.00元',
            remark: '备注3',
          },
        ],
      }
    },
    computed: {
      filterItems () {
        return this.cards.filter((card) => {
          return !this.selectedStatus || this.selectedStatus.indexOf(card.status) !== -1
        })
      },
    },
    methods: {
      editItem (item) {
        this.editedIndex = this.cards.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      showItem (item) {
        this.editedIndex = this.cards.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogShow = true
      },
      deleteItem (item) {
        this.editedIndex = this.cards.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      deleteItemConfirm () {
        this.cards.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      close () {
        this.dialog = false
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
      exportTable () {
        excel.exportExcel(this.cards, 'IotCard')
      },
      importTable () {
        excel.importExcel((value) => {
          this.cards.push(value)
        })
      },
    },
  }
</script>
