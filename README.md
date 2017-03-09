# utils
Utils Class for JavaScript commonly used in work

## Install
```
$ npm install --save qc-utils
```

## Util List
+ imgUtil.js 图片压缩与上传
+ flexible.js 移动端适配
+ utils.js 


## Usage
```
import Utils from 'qc-utils'

Utils.setQuery('https://www.npmjs.com/~tonyfree',{
    msg: 'utils class'
})
// https://www.npmjs.com/~tonyfree?msg=utils class

Utils.getQuery()
// {msg:'utils class'}
```