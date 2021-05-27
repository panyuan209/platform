import { request } from './request'
import { exportExcel } from '../utils/excel'

export function getCardList () {
  return request({
    url: '/card/cardList',
    // data: {
    //   page: 1,
    //   limit: 101,
    // },
  })
}
export function deleteCard (data) {
  return request({
    url: '/card/delCard',
    data: data,
    // headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
}

export function exportCardList () {
  return request({
    url: '/card/exportCardList',
  }).then(res => {
    const exportData = res.data.list
    exportExcel(exportData, 'IotCardList')
  }).catch(err => {
    console.log(err)
  })
}
export function importCardList (data) {
  return request({
    url: '/card/readExcel',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
