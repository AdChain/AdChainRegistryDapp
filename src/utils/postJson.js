async function postJson (url, data) {
  return new Promise((resolve, reject) => {
    const http = new window.XMLHttpRequest()
    http.open('POST', url, true)

    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        resolve(http.responseText)
      } else if (http.status !== 200) {
        reject(new Error(http.responseText))
      }
    }

    http.setRequestHeader('Content-Type', 'application/json')
    http.send(JSON.stringify(data))
  })
}

export default postJson
