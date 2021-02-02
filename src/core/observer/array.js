/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

// 数组原型
const arrayProto = Array.prototype
// 在arrayMethods重定义数组方法
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
    // 发布数组发生改变的通知
    ob.dep.notify()
    return result
  })
})
