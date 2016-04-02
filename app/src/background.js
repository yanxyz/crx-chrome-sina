import check from './check'
import settings from './settings'

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.getPlatformInfo((platformInfo) => {
    const os = platformInfo.os
    settings.get((items) => {
      if (!items.channel || (os === 'linux' && !items.linux)) {
        chrome.runtime.openOptionsPage()
      }
    })
  })
})

// for popup and option page
window.check = check
window.settings = settings
