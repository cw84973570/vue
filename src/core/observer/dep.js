/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
// 通过Dep通知watcher数据更新，依赖管理器
// 挂载在Observe上面
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

// target是当前处理的watcher
// targetStack好像永远只有一个元素？
export function pushTarget (target: ?Watcher) {
  // 将当前元素加入到目标栈中
  // target不是必传参数
  console.log('watcher', target)
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  // 处理完成弹出完成的watcher
  // 将下一个watch挂载到Dep上
  // 好像每次targetStack里只有一个元素
  // 所以targetStack[targetStack.length - 1]是undefined
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
