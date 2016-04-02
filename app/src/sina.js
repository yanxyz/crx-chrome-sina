/**
 * Chrome Release Channels
 * https://www.chromium.org/getting-involved/dev-channel
 *
 * Sina download page：
 * - [Windows](http://down.tech.sina.com.cn/page/40975.html)
 * - [Mac OS X](http://down.tech.sina.com.cn/page/43718.html)
 * - [.rpm (For Fedora/openSUSE)](http://down.tech.sina.com.cn/page/43719.html)
 *
 */

const data = {
  pageUrl: 'http://down.tech.sina.com.cn/page/40975.html',
  downloadUrl: 'http://down.tech.sina.com.cn/download/d_load.php',
  exe: {
    id: 40975,
    x86: [5, 7, 9], // dev, beta, stable
    x64: [6, 8, 10]
  },
  dmg: {
    id: 43718,
    x64: [1, 3, 5]
  },
  rpm: {
    id: 43719,
    x64: [1, 3, 5]
  },
  // dmg: [
  //   'https://dl.google.com/chrome/mac/dev/googlechrome.dmg',
  //   'https://dl.google.com/chrome/mac/beta/googlechrome.dmg',
  //   'https://dl.google.com/chrome/mac/stable/googlechrome.dmg'
  // ],
  // rpm: [
  //   'https://dl.google.com/linux/direct/google-chrome-unstable_current_x86_64.rpm',
  //   'https://dl.google.com/linux/direct/google-chrome-beta_current_x86_64.rpm',
  //   'https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm'
  // ],
  deb: [
    'https://dl.google.com/linux/direct/google-chrome-unstable_current_amd64.deb',
    'https://dl.google.com/linux/direct/google-chrome-beta_current_amd64.deb',
    'https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb'
  ]
}

function getUrls (ext, channel, arch) {
  let idx

  switch (channel) {
    case 'dev':
      idx = 0
      break
    case 'beta':
      idx = 1
      break
    case 'stable':
      idx = 2
  }

  const urls = {
    channels: 'https://www.chromium.org/getting-involved/dev-channel'
  }

  if (ext === 'deb') {
    urls.download = data.deb[idx]
  } else {
    urls.sina = `http://down.tech.sina.com.cn/page/${data[ext].id}.html`
    urls.download = `${data.downloadUrl}?d_id=${data[ext].id}&down_id=${data[ext][arch][idx]}`
  }

  return urls
}

export default {
  pageUrl: data.pageUrl,
  getUrls
}
