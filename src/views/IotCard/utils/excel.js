import XLSX from 'xlsx'
export function exportExcel (json, fileName) {
  const data = []
  const keyArray = []

  for (const key1 in json) {
    // eslint-disable-next-line no-prototype-builtins
    if (json.hasOwnProperty(key1)) {
      const element = json[key1]
      const rowDataArray = []
      for (const key2 in element) {
        // eslint-disable-next-line no-prototype-builtins
        if (element.hasOwnProperty(key2)) {
          const element2 = element[key2]
          rowDataArray.push(element2)
          if (keyArray.length < getLength(element)) {
            keyArray.push(key2)
          }
        }
      }
      data.push(rowDataArray)
    }
  }
  data.splice(0, 0, keyArray)
  const ws = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJs')
  XLSX.writeFile(wb, fileName + '.xlsx')
}

function getLength (obj) {
  let count = 0
  for (const i in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(i)) {
      count++
    }
  }
  return count
}

function importExcel (callback) {
  const inputObj = document.createElement('input')
  inputObj.setAttribute('type', 'file')
  inputObj.setAttribute('name', 'file')
  inputObj.setAttribute('style', 'visibility:hidden')
  inputObj.setAttribute('accept', '.xlsx,.xls,.csv')
  // inputObj.addEventListener('change', ev => {
  //   const files = ev.target.files[0]
  //   console.log(files)
  //   // const data = { uploadFile: files }
  //   const data = new FormData()
  //   data.append('file', files)
  //   console.log(data.get('file'))
  //   const formData = {
  //     uploadFile: files,
  //   }
  //   const dataObj = qs.stringify(formData)
  //   // const dataObj = formData
  //   importCardList(dataObj).then(res => {
  //     console.log(res)
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // })
  inputObj.addEventListener('change', evt => {
    const files = evt.target.files
    const fileReader = new FileReader()
    fileReader.onload = ev => {
      const data = ev.target.result
      const workbook = XLSX.read(data, {
        type: 'binary',
      })
      const wsname = workbook.SheetNames[0]
      const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
      ws.forEach((value) => {
        callback(value)
      })
    }
    fileReader.readAsBinaryString(files[0])
  })
  document.body.appendChild(inputObj)
  inputObj.click()
}

export default { exportExcel, importExcel }
