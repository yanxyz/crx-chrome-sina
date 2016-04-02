chrome.runtime.getBackgroundPage((bg) => {
  const vm = new Vue({
    el: document.body,
    data: {
      ok: false,
      error: ''
    }
  })

  bg.check()
    .then((data) => {
      vm.$data = Object.assign({
        ok: true
      }, data)
    })
    .catch((err) => {
      // console.log(err)
      vm.$data = {
        ok: false,
        error: err.message
      }
    })
})
