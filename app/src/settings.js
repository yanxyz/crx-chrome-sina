export default {
  get (callback) {
    chrome.storage.sync.get({
      channel: 'dev',
      linux: 'deb'
    }, callback)
  },
  set (data, callback) {
    chrome.storage.sync.set(data, callback)
  }
}
