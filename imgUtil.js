/*
 * imgUtil JavaScript Library v1.0.0
 * Author: rayleigh
 * Date: 2017-01-11
 */

let imgUtil = {

  /**
   * 压缩图片
   * @param {File || HTMLImageElement} source_img_obj  待压缩的图片文件或者图片元素
   * @param {Number} quality 图片的压缩质量比
   * @param {String} output_format 图片的输出格式
   * @return {Promise} Promise实例 resolve状态返回的数据为图片元素
   */
  compress(source_img_obj, quality = 30, output_format = '') {
    return new Promise((resolve, reject) => {

      // canvas.toDataURL(type, encoderOptions)默认type为png格式
      // 如果传入的类型非“image/png”，但是返回的值以“data:image/png”开头，那么该传入的类型是不支持的
      let mime_type = 'image/jpeg'
      if (output_format == 'png') {
        mime_type = 'image/png'
      }

      // 如果source是图片文件
      if (source_img_obj instanceof File) {
        let reader = new FileReader()
        reader.readAsDataURL(source_img_obj)
        reader.addEventListener('load', () => {
          let image = new Image()
          image.src = reader.result
          this.compressUitl(image, quality, mime_type, resolve)
        }, false)
      }

      // 如果source是图片元素
      if (source_img_obj instanceof HTMLImageElement) {
        this.compressUitl(source_img_obj, quality, mime_type, resolve)
      }
    })

  },

  compressUitl(source_img_obj, quality, mime_type, resolve) {
    let cvs = document.createElement('canvas')
      // 获取图片的原始大小(不论是文件还是元素)
    cvs.width = source_img_obj.naturalWidth
    cvs.height = source_img_obj.naturalHeight
    let ctx = cvs.getContext('2d').drawImage(source_img_obj, 0, 0)
    let newImageData = cvs.toDataURL(mime_type, quality / 100)
    let result_image_obj = new Image()
    result_image_obj.src = newImageData
    resolve(result_image_obj)
  },

  /**
   * 把src为base64格式的图片元素转化为Blob实例
   * @param {String} result_image_obj src为base64格式的图片元素
   * @param {String} contentType 放入到blob中的数组内容的MIME类型
   * @param {sliceSize} 
   * @return {Blob} Blob实例
   */
  b64toBlob(result_image_obj, contentType = 'image/jpeg', sliceSize = 512) {
    // 从图片元素获取src的base64数据
    let data = result_image_obj.src
    let b64Data = data.replace('data:' + contentType + ';base64,', '')

    // 解码被base-64编码过的数据
    let byteCharacters = atob(b64Data)
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize)

      let byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      // 8位无符号整型数组
      let byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)
    }
    // Blob 对象是包含有只读原始数据的类文件对象
    let blob = new Blob(byteArrays, { type: contentType })
    return blob
  },

  upload(file, compress = true) {
    return new Promise((resolve, reject) => {
      let formData = new FormData()
      if (compress) {
        this.compress(file).then(res => {
          this.uploadAction(this.b64toBlob(res), resolve, reject)
        })
      } else {
        this.uploadAction(file, resolve, reject)
      }
    })
  },

  uploadAction(file, resolve, reject) {
    let formData = new FormData()
    formData.append("userfile", file)
    fetch('/file/addFile.do', formData).then(res => {
      resolve(res)
    }, res => {
      reject(res)
    })
  }
}


function fetch(url, data = null) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
      resolve(JSON.parse(xhr.responseText))
    }
    xhr.error = function() {
      reject(JSON.parse(xhr.responseText))
    }
    xhr.open("POST", url, true)
    xhr.send(data)
  })
}


export default imgUtil


/**
 * 参考资料
 * https://github.com/brunobar79/J-I-C
 * https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs
 * https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsDataURL
 * http://www.cnblogs.com/snandy/p/3704218.html
 * https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/atob
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Blob
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
 */
