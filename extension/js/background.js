chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(opts => {
    if (!opts.channel) {
      chrome.runtime.openOptionsPage()
    }
  })
})
