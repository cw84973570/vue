
Vue.component('child', {
  // 这里实际的方法是getter，祖先类的方法是间接调用的
  inject: ['change', 'foo', 'bar'], // 依赖注入，方法的this在声明的时候就已经绑定到祖先元素上，所以这里的this指向祖先元素
  template: `
    <div>
      <button @click="$parent.change()">调用父组件方法</button>
      <button @click="$emit('change')">通知父组件</button>
      <button @click="change">依赖注入</button>
    </div>
  `,
  methods: {

  }
})

const app = new Vue({
  el: '#app',
  data () {
    this.hello()
    const obj = {
      message: '共点击了0次',
      count: 0,
      test: 'test',
      list: [
        'a',
        'b',
        { c: 1 } // 数组的元素不监听
      ],
      obj: {
        a: 1,
        b: 2,
        c: { c: 1 }
      },
    }
    let val = {
      foo2: 'foo2'
    }
    Object.defineProperty(obj, 'foo1', {
      get () {
        console.log('get')
        return val
      },
      enumerable: true,
      configurable: true,
      // set (newVal) {
      //   console.log('set')
      //   val = newVal
      // }
    })
    return obj
  },
  computed: {
    message1: {
      get: function (vm) {
        console.log('vm', vm)
        return this.message + ',' + this.count
      }
    }
  },
  created() {
    this.obj2 = this.obj
    this.list.push(1)
  },
  mounted () {
    this.list[0] = 'b'
    this.list.push(1)
    setTimeout(() => {
      // 只会通知obj.c的watch
      // this.$set(this.obj.c, 'd', 1)
      this.list[2].c = 'b'
      // this.list.push(2)
    }, 1000)
    this.$watch('test', function (newVal, oldVal) {
      console.log(newVal, oldVal)
    }, {
      sync: true
    })
    // setTimeout(() => {
    //   this.test = 'test has been changed'
    // }, 1000)
  },
  watch: {
    message (oldVal, newVal) {
      console.log('侦测到点击！！')
      console.log(oldVal, newVal)
      console.log(this.message)
    },
    obj: {
      handler () {
        console.log('obj')
      }
    },
    foo1 () {
      console.log('foo')
    },
    'obj.c' () {
      console.log('obj.c')
    }
  },
  provide: function () {
    return {
      change: this.change,
      foo: { foo: 'foo'},
      bar: this.obj
    }
  },
  methods: {
    change () {
      // 这里调用的是this.count的proxygetter方法
      // 然后再调用reactiveGetter
      // 然后调用count的setter设置为1
      // 触发reactiveSetter
      this.message = `共点击了${++this.count}次`
      this.test = this.count
      // this.message = `共点击了${++this.count}次`\
    },
    hello () {
      console.log('Hello Ned')
    }
  }
})
// const obj = {}
// const watcher = { update () { /* some code */ } }
// const Dep = { 
//   watchers: [], 
//   notify () {
//     watcher.forEach(watch => {
//       watch.update()
//     })
//   } 
// }
// let currentWatcher = null // 正在访问属性的watcher
// let value = ''
// Object.defineProtoperty(obj, 'message', {
//   enumerable: true,
//   configurable: true,
//   get: function () {
//     Dep.watchers.push(currentWatcher)
//     console.log('某个地方访问了message属性')
//     return value
//   },
//   set: function (newVal) {
//     console.log('重新设定了访问message属性时返回的值')
//     value = newVal
//     Dep.notify()
//   }
// })
// currentWatcher = watcher
// const message = obj.message // 打印”某个地方访问了message属性“
// currentWatcher = null
// obj.message = 'Hello World' // 打印“重新设定了访问message属性时返回的值”

// new Vue({
//   data () {
//     return {
//       message: ''
//     }
//   }
//   /* some code */
// })