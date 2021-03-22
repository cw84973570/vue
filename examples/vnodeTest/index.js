
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
    return {
      show: true,
      list: [ { name: 'dom1 ' } ]
    }
  },
  computed: {
  },
  created() {
  },
  mounted () {
  },
  watch: {
  },
  provide: function () {
    return {
      change: this.change,
      foo: { foo: 'foo'},
      bar: this.obj
    }
  },
  methods: {
    add () {
      let name = `dom${this.list.length + 1}`
      this.list.push({ name })
    },
    remove () {
      this.list.pop()
    }
  }
})