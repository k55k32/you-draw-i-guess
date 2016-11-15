exports.init = function (options) {
  let events = {}
  const init = () => {
    this._ws = new window.WebSocket(options.path)
    this._ws.onopen = (e) => {
      this.connnect = true
      options.open.call(this, e)
    }
    this._ws.onmessage = ({ data }) => {
      event('message', JSON.parse(data))
    }
    this._ws.onclose = (e) => {
      options._close()
      options.close.call(this, e)
    }
    this._ws.onerror = (e) => {
      options.error.call(this, e)
    }
  }

  const opt = {
    open () {},
    _close () {
      setTimeout(init, 1000)
    },
    close () {},
    message () {},
    error () {},
    header: {}
  }
  options = {...opt, ...options}

  this.setHeader = (key, value) => {
    if (typeof key === 'object') {
      options.header = {...options.header, ...key}
    } else {
      options.header[key] = value
    }
  }

  this.send = (data, type = -1) => {
    let msg = {data, type, header: options.header}
    this._ws.send(JSON.stringify(msg))
  }

  this.on = (name, fn) => {
    if (!events[name]) events[name] = []
    events[name].push(fn)
  }

  function event (name, data) {
    let eventsArray = events[name]
    eventsArray && eventsArray.forEach(fn => fn(data))
  }

  init()
  return this
}
