
Vue.component('child', {
  // 这里实际的方法是getter，祖先类的方法是间接调用的
  inject: ['change', 'foo', 'bar'], // 依赖注入，将方法的this绑定到了父元素上，不知道是怎么实现的
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
    return {
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
        b: 2
      },
      obj2: {}
    }
  },
  created() {
    this.obj2 = this.obj
  },
  watch: {
    message () {
      console.log('侦测到点击！！')
    },
    list () {
      console.log('list')
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
