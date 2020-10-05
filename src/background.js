let displayUrls = []
let sourceUrls = ['https://juejin.im']
let displayTabIds = new Set()
let sourceTabIds = new Set()

// 初始化配置
function init() {
  chrome.storage.local.get('displayUrls', ({ displayUrls: list = [] }) => {
    console.log('displayUrls', (displayUrls = list))
  })
}
init()

// 监听页面url变化，记录tab id
chrome.tabs.onUpdated.addListener(async (id, info, tab) => {
  if (info.status === 'complete') {
    console.log(id, tab.url, tab, info)
    if (matchUrl(displayUrls, tab.url)) {
      // 展示页
      console.log('display tab')
      displayTabIds.add(id)

      // 通知数据页获取数据
      const ids = [...sourceTabIds.values()]
      for (let i = 0; i < ids.length; i++) {
        const tab = await getTab(ids[i])
        if (tab) {
          // 通知tab获取数据
          dispatchTab(tab.id, {
            type: '__request__',
          })
          break
        }
      }
    } else if (matchUrl(sourceUrls, tab.url)) {
      // 数据获取页
      console.log('source tab')
      sourceTabIds.add(id)
    }
  }
})

chrome.runtime.onMessage.addListener(data => {
  if (data.type === '__sync__') {
    init()
  } else {
    displayTabIds.forEach(id => {
      dispatchTab(id, data)
    })
  }
})

function dispatchTab(id, data) {
  chrome.tabs.sendMessage(id, data)
}

function getTab(id) {
  return new Promise(resolve => {
    chrome.tabs.get(id, resolve)
  })
}

function matchUrl(rules, url) {
  return rules.some(u => url.includes(u))
}
