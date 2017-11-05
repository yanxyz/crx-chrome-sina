function restoreOptions() {
  chrome.storage.sync.get(null, opts => {
    if (opts.channel) {
      document.getElementById('channel').value = opts.channel
    } else {
      chrome.storage.sync.set({ channel: 'dev' })
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  restoreOptions()

  document.getElementById('channel').addEventListener('change', event => {
    chrome.storage.sync.set({
      channel: event.target.value
    })
  })
})
