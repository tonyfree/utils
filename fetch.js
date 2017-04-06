import axios from 'axios'

function fetch(url, data = null) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then((response) => {
      let result = response.data
      if (result.status === 200) {
        resolve(result)
      } else if (result.status === 300) {
        // 未登录的处理
      } else {
        reject(result)
      }
    }).catch((error) => {
      reject({
        status: -1,
        message: '系统错误，请稍后重试'
      })
    })
  })
}


export default fetch
