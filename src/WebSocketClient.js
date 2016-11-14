exports.init = (options) => {
  let path = options.path
  let ws = new window.WebSocket(path)
  ws.onopen = (e) => {
    options.open(e)
  }
  ws.onmessage = ({data}) => {
    options.message(data)
  }
  ws.onclose = (e) => {
    options.close(e)
  }
  ws.onerror = (e) => {
    options.error(e)
  }
  return ws
}
