const sina = {
  pageUrl: 'http://down.tech.sina.com.cn/page/40975.html',
  downloadUrl: 'http://down.tech.sina.com.cn/download/d_load.php?d_id=40975&down_id=',
  exe: {
    x86: [5, 7, 9], // dev, beta, stable
    x64: [6, 8, 10]
  }
}

const loader = {
  timeout: 0,
  start() {
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => document.body.classList.add('loading'), 500)
  },
  stop() {
    if (this.timeout) clearTimeout(this.timeout)
    document.body.classList.remove('loading')
  }
}

document.getElementById('sina').href = sina.pageUrl
loader.start()
fetch(sina.pageUrl)
  .then(res => {
    if (!res.ok) {
      throw new Error(`Failed to fetch page: ${res.statusText}`)
    }
    return res.text()
  })
  .then(html => {
    const versions = getVersions(html)
    const browserInfo = getBrowserInfo()
    // console.log(versions)
    return getSettings().then(settings => {
      browserInfo.channel = settings.channel
      return check(versions, browserInfo)
    })
  })
  .catch(err => {
    loader.stop()
    const elem = document.getElementById('error')
    elem.innerText = err.message
    elem.style.display = 'block'
    console.error(err)
  })

/**
 * functions
 */

function getVersions(html) {
  // sina page 是 GBK，fetch 得到的是乱码 html，不过不影响 ASCII
  // page title 包含版本信息
  // 三个版本不一定都有
  const title = html.match(/<title>(.*?)<\/title>/)[1]
  const text = title.match(/\d[./\w ]+\d/)[0]
  let dev, beta, stable
  text.split('/').forEach(test)
  return { dev, beta, stable, text }

  function test(item) {
    if (item.endsWith('Dev')) {
      dev = item.slice(0, -3).trim()
    } else if (item.endsWith('Beta')) {
      beta = item.slice(0, -4).trim()
    } else {
      stable = item.trim()
    }
  }
}

function getBrowserInfo(linux) {
  const ua = navigator.userAgent
  const version = ua.match(/Chrome\/([\d.]+)/)[1]
  // Chrome 和 OS 的 arch 可能不一致，优先使用 OS arch
  const arch = ua.includes('x64') ? 'x64' : 'x86'
  return { version, arch }
}

function getSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, resolve)
  })
}

function check(versions, browserInfo) {
  const { version: cv, channel, arch } = browserInfo
  const channelName = startCase(channel)
  let html = `
<p>Sina   : ${versions.text}</p>
<p>Current: ${cv} ${startCase(channelName)}</p>
`
  const v = versions[channel]
  if (v) {
    const result = compareVersion(v, cv)
    if (result === 0) {
      html += '<p>No updates</p>'
    } else if (result > 0) {
      html += `<p><a href="${getDownloadUrl(arch, channel)}" target="_blank">Download new version</a></p>`
    }
  } else {
    html += `<p>No ${channelName} data</p>`
  }

  loader.stop()
  document.getElementById('results').innerHTML = html
}

function startCase(word) {
  return word[0].toUpperCase() + word.slice(1)
}

function compareVersion(v1, v2) {
  if (v1 === v2) return 0

  const a1 = v1.split('.')
  const a2 = v2.split('.')
  for (let i = 0, len = a1.length; i < len; ++i) {
    let delta = a1[i] - a2[i]
    if (delta) return delta
  }
}

function getDownloadUrl(arch, channel) {
  let i = 0
  if (channel === 'beta') {
    i = 1
  } else if (channel === 'stable') {
    i = 2
  }
  return sina.downloadUrl + sina.exe[arch][i]
}
