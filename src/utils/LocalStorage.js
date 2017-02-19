/**
* 使用 html5 提供的 localStorage来缓存数据
**/
const localStorage = window.localStorage
const SPLIT_STR = '@'

const DATA_PROCESS_MAPPING = {
  'number': {
    save: data => data,
    parse: data => Number.parseFloat
  },
  'object': {
    save: data => JSON.stringify(data),
    parse: data => JSON.parse(data)
  },
  'default': {
    save: data => data,
    parse: data => data
  }
}

function getProcess (type) {
  return DATA_PROCESS_MAPPING[type] || DATA_PROCESS_MAPPING['default']
}

export default{
  get (key) {
    let stringData = localStorage.getItem(key)
    if (stringData) {
      const indexSPL = stringData.indexOf(SPLIT_STR)
      const type = stringData.substr(0, indexSPL)
      let data = stringData.substr(indexSPL + 1)
      data = getProcess(type).parse(data)
      return data
    }
    return null
  },
  put (key, value) {
    const type = typeof value
    const process = getProcess(type)
    value = type + SPLIT_STR + process.save(value)
    localStorage.setItem(key, value)
  },
  clear () {
    localStorage.clear()
  }
}
