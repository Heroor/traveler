let displayUrls = []
const addBtn = document.querySelector('#add-btn')
const urlIpt = document.querySelector('#url-input')
const listWrap = document.querySelector('#list-wrap')

// 同步数据
chrome.storage.local.get('displayUrls', ({ displayUrls: list = [] }) => {
  console.log('displayUrls', (displayUrls = list))
  init(list)
})

addBtn.onclick = () => {
  if (!urlIpt.value) return

  add(urlIpt.value)
  displayUrls.push(urlIpt.value)
  urlIpt.value = ''
  chrome.storage.local.set({ displayUrls }, syncData)
}

function add(value) {
  const li = document.createElement('li')
  li.textContent = value
  listWrap.appendChild(li)
}

function init(list = []) {
  list.forEach(item => add(item))
}

function syncData() {
  chrome.runtime.sendMessage({
    type: '__sync__',
  })
}
