// 接收消息
chrome.runtime.onMessage.addListener(data => {
  console.log('from BG', data)
  if (data.type === '__request__') {
    console.log('source', data)
    // 数据页
    request().then(res => {
      // 交给bg
      chrome.runtime.sendMessage({
        type: '__response__',
        value: res.data.phone,
      })
    })
  } else if (data.type === '__response__') {
    // 展示页
    console.log('display', data)
    handleData(data)
  }
})

function request() {
  return fetch('https://apinew.juejin.im/user_api/v1/user/get', {
    credentials: 'include',
  })
    .then(res => res.json())
    .catch(console.error)
}

function handleData(data) {
  document.querySelector('input').value = data.value
}
