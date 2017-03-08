# utils
Utils Class for JavaScript commonly used in work

## Install
```
$ npm install --save qc-utils
```

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