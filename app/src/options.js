chrome.runtime.getBackgroundPage((bg) => {
  const settings = bg.settings

  const vm = new Vue({
    el: document.body,
    data: {
      channel: '',
      linux: ''
    },
    methods: {
      save () {
        settings.set(this.$data)
      }
    }
  })

  settings.get((options) => {
    vm.$data = options
  })
})
