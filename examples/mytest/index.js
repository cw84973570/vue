
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
    message1 () {
      return this.message + ',' + this.count
    }
  },
  created() {
    this.obj2 = this.obj
    this.list.push(1)
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
      // this.message = `共点击了${++this.count}次`\
    },
    hello () {
      console.log('Hello Ned')
    }
  }
})
