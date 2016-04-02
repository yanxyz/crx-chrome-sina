/* global fetch TextDecoder */

import sina from './sina'
import settings from './settings'

// convert gbk to utf-8
// https://developers.google.com/web/updates/2014/08/Easier-ArrayBuffer-String-conversion-with-the-Encoding-API
export default function () {
  return fetch(sina.pageUrl, {
    headers: {
      'content-type': 'arraybuffer'
    }
  }).then(status).then(parse).then(compare)
}

function status (res) {
  if (!res.ok) {
    throw new Error(`Failed to get page from Sina: ${res.statusText}`)
  }

  return res.arrayBuffer().then((buf) => {
    const dataView = new DataView(buf)
    const decoder = new TextDecoder('gbk')
    return decoder.decode(dataView)
  })
}

function parse (html) {
  const re = /<title>.*中文版 (.*) 下载.*<\/title>/
  const m = html.match(re)
  if (!m) {
    throw new Error('matching none')
  }

  const info = m[1]
  const dev = match(info, /\d[\d.]+(?= Dev)/)
  const beta = match(info, /\d[\d.]+(?= Beta)/)
  const stable = match(info, /\d[\d.]+(?=$)/)

  // console.log(info)

  return {
    info,
    dev,
    beta,
    stable
  }

  function match (str, re) {
    const m = str.match(re)
    if (m) return m[0]
  }
}

function compare (versions) {
  return new Promise((resolve, reject) => {
    settings.get((options) => {
      const {channel, linux} = options

      const v = versions[channel]
      if (!v) {
        throw new Error(`Missing ${channel} in ${versions.info}`)
      }

      const {version, arch, ext} = getBrowserInfo(linux)
      if (!ext) {
        throw new Error('Your OS is not supportted')
      }

      const data = {
        info: versions.info,
        version,
        arch,
        channel,
        isDeb: ext === 'deb',
        hasUpdates: compareVersion(v, version) > 0,
        urls: sina.getUrls(ext, channel, arch)
      }

      // console.log(data)
      resolve(data)
    })
  })
}

function getBrowserInfo (linux) {
  const ua = navigator.userAgent
  const version = ua.match(/Chrome\/([\d.]+)/)[1]
  let arch = 'x64'
  let ext

  if (ua.includes('Windows')) {
    ext = 'exe'
    arch = ua.includes('x64') ? 'x64' : 'x86'
  } else if (ua.includes('Mac')) {
    ext = 'dmg'
  } else if (ua.includes('Linux')) {
    ext = linux
  }

  return {
    version,
    arch,
    ext
  }
}

function compareVersion (v1, v2) {
  if (v1 === v2) return 0

  const a1 = v1.split('.')
  const a2 = v2.split('.')
  for (let i = 0, len = a1.length; i < len; ++i) {
    let delta = a1[i] - a2[i]
    if (delta) return delta
  }
}
