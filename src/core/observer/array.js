/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

// 数组原型
const arrayProto = Array.prototype
// 在arrayMethods重定义数组方法
// 数组的这些方法做了个中间层去间接调用
// 原来是arr.method => arr.__proto__.method = Array.prototype.method
// 现在是arr.method => arr.__proto__.method = arrayMethods.method => Array.prototype.method
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]

  // 定义数据解释器
  def(arrayMethods, method, function mutator (...args) {
    // 调用原生方法
    const result = original.apply(this, args)
    const ob = this.__ob__
    // 新插入的数据
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 监听新插入的数据
    if (inserted) ob.observeArray(inserted)
    // notify change
    // 通知订阅者更新
    ob.dep.notify()
    return result
  })
})
